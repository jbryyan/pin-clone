import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import PinsReducer from './reducer-pins';
import UserReducer from './reducer-user';

const rootReducer = combineReducers({
  pins: PinsReducer,
  user: UserReducer,
  form: formReducer
});

export default rootReducer;