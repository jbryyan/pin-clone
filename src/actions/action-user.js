import { 
  LOGIN_USER, LOGOUT_USER, 
  ROOT_URL, LOADING_USER
} from './action-types';

import { userPins } from './action-pins';
import Request from 'superagent';

const login = (username) => {
  return {
    type: LOGIN_USER,
    payload: username
  };
}

export const logout = () => {
  localStorage.removeItem('pinCloneToken');
  return {
    type: LOGOUT_USER,
  }
}

export function loadingUser(loading) {
  return {
    type: LOADING_USER,
    payload: loading
  }
}

//----------------------
//Thunk functions
export const registerUser = (user) => (dispatch) => {
  dispatch(loadingUser(true));
  return Request.post(`${ROOT_URL}/api/registerUser`)
    .set('Authorization', '')
    .send(user)
    .then((res) => {
      localStorage.setItem('pinCloneToken', res.body.token);
      dispatch(loadingUser(false));
      dispatch(login({ username: res.body.username, loggedIn: true, loginPage: true }));
      return ({ success: true })
    })
    .catch(error => {
      dispatch(loadingUser(false));
      const formKey = Object.keys(error.response.body.error)[0];
      const formError = error.response.body.error[formKey];
      return ({ success: false, message: {[formKey]: formError, _error: 'Registration failed' }})
    });
}

export const loginUser = (user) => (dispatch) => {
  dispatch(loadingUser(true));
  return Request.post(`${ROOT_URL}/api/authenticate`)
    .send(user)
    .then((res) => {
      console.log(res.body);
      dispatch(loadingUser(false));
      dispatch(login({ username: res.body.username, loggedIn: true, loginPage: true }));
      localStorage.setItem('pinCloneToken', res.body.token);
      return ({ success: true });
    })
    .catch(error => {
      dispatch(loadingUser(false));
      const loginError = error.response.body.error
      return ({ success: false, message: { _error:  loginError } });
    })
}

export const authToken = () => dispatch => {
  
  //return Request.get(`${ROOT_URL}/tokenAuth`)
  return Request.get(`${ROOT_URL}/api/auth/me`)
    .set('Authorization', localStorage.getItem('pinCloneToken'))
    .ok(res => res.status < 500)
    .then(res => {
      if (res.status === 200) {
        console.log(res.body);
        const username = res.body.user.username;
        const image = res.body.user.image;
        dispatch(login( { username: username, image: image, loggedIn: true, loginPage: true }));
      } else if (res.status === 401) {
        dispatch(logout());
      }
      else {
        throw (new Error('Something went horibly wrong!'));
      }
    })
    .catch(error => {
      console.log(error);
    });
}

export const deleteMyImage = (id) => dispatch => {
  console.log(id);
  Request.delete(`${ROOT_URL}/api/deletePin`)
  .set('Authorization', localStorage.getItem('pinCloneToken'))
  .send({ id })
  .then(res => {
    if (res.status === 200) {
      dispatch(userPins(res.body));
    } else if(res.status === 204){
      return;
    }
  });
}  

export const twitterReq = () => dispatch => {
  Request.get(`${ROOT_URL}/auth/twitter/reverse`)
  //Request.get('http://192.168.223.128:9000/auth/twitter/reverse')
  .then(res => {
    if(res.status === 200){
      console.log(res.body);
      window.location = res.body.twitterAuth;
      //return { success: true, twitterAuth: res.body.twitterAuth };
    } 
  });
}

export const twitterLogin = (auth) => dispatch => {
  return Request.post(`${ROOT_URL}/auth/twitter`)
  //return Request.post('http://192.168.223.128:9000/auth/twitter')
  .query({ auth: auth })
  .then(res => {
    if(res.status === 200){
      console.log(res.header['x-auth-token']);
      console.log(res);
      const { username } = res.body.user;
      const { image } = res.body.user.twitter;
      dispatch(login({ username: username, userImage: image, loggedIn: true, loginPage: true }));
      localStorage.setItem('pinCloneToken', res.header['x-auth-token']);
      return { success: true };
    } else {
      console.log('error');
    }
  })
  .catch(err => {
    throw new Error(err);
  })
}