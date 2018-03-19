import { 
  FETCH_PINS, FETCH_USER_PINS, ROOT_URL, 
  LOADING_PIN, ADD_PIN, SAVE_PIN, LOGOUT_USER
} from './action-types';
import Request from 'superagent';

export function fetchPins(pins) {
  return {
    type: FETCH_PINS,
    payload: pins
  };
}

export function userPins(pins) {
  return {
    type: FETCH_USER_PINS,
    payload: pins
  };
}

export function loadingPin(loading) {
  return {
    type: LOADING_PIN,
    payload: loading
  }
}

const addPin = (pin) => {
  return {
    type: ADD_PIN,
    payload: pin
  };
}

const savePin = (pin) => {
  return {
    type: SAVE_PIN,
    payload: pin
  }
}

export const logout = () => {
  localStorage.removeItem('pinCloneToken');
  return {
    type: LOGOUT_USER,
  }
}

export const fetchAllPins = (loading) => dispatch => {

  dispatch(loadingPin(loading));
  Request.get(`${ROOT_URL}/api/fetchPins`)
    .ok(res => res.status < 500)
    .then(res => {
      if (res.status === 200) {
        dispatch(loadingPin(false));
        dispatch(fetchPins(res.body));
      } else {
        throw (new Error('something went horrible wrong'));
      }
    });
}

export const fetchUserPins = (id) => dispatch => {
  return Request.get(`${ROOT_URL}/api/fetchUserPins`)
    .query({ user: id })
    .ok(res => res.status < 500)
    .then(res => {
      if (res.status === 200) {
        //console.log(res);
        dispatch(userPins(res.body));
        return { success: true };
      } else {
        return { success: false };
      }
    });
}


export const addNewPin = (url, user) => dispatch => {
  return Request.post(`${ROOT_URL}/api/addPin`)
    .set('Authorization', localStorage.getItem('pinCloneToken'))
    .ok(res => res.status < 500)
    .send({ image: url, user: user })
    .then(res => {
      if (res.status === 200) {
        dispatch(addPin(res.body));
        return({success: true })
      } else if (res.status === 401) {
        dispatch(logout());
      } else {
        throw (new Error('something went horrible wrong'));
      }
    });
}

export const saveNewPin = (pin) => dispatch => {
  console.log(pin);
  Request.post(`${ROOT_URL}/api/savePin`)
    .set('Authorization', localStorage.getItem('pinCloneToken'))
    .send({ pin })
    .then(res => {
      if (res.status === 200) {
        dispatch(savePin(pin));
      } else if(res.status === 204){
        
        return;
      }
    });
}