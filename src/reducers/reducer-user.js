import { 
  AUTH_USER, LOGIN_USER, 
  REG_SUCCESS, LOGOUT_USER, LOADING_USER
} from '../actions/action-types';

const initialState = {
  username: null,
  loggedIn: false,
  loginPage: false,
  image: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_USER: 
      return {...state, loading: action.payload }
    case LOGIN_USER:
      const { payload } = action;
      return {...state, 
        username: payload.username, image: payload.image, 
        loggedIn: payload.loggedIn, loginPage: payload.loginPage 
      };
    case AUTH_USER:
      return {...state, username: action.payload.username};
    case REG_SUCCESS:
      return {...state, username: action.payload};
    case LOGOUT_USER:
      return initialState;
    default: 
      return state;
  }
}