import { 
  FETCH_PINS, FETCH_PIN, ADD_PIN, 
  FETCH_USER_PINS, SAVE_PIN, LOADING_PIN
} from '../actions/action-types';

function formatPayload(payload){
  let oldObj = {...payload};
  let newObj = {};
  for(let i=0; i < payload.length; i++){
    let id = oldObj[i]._id;
    newObj[id] = oldObj[i];
  }
  return newObj;
}

const initialState = {
  allPins: {},
  userPins: null,
  loading: false
}

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_PIN:
      return {...state, loading: action.payload };
    case FETCH_PINS:
      return {...state, allPins: formatPayload(action.payload)};
    case FETCH_USER_PINS:
      return {...state, userPins: formatPayload(action.payload)};
    case FETCH_PIN:
      return {...state, [action.payload._id]: action.payload };
    case ADD_PIN:
      return( 
        {...state, 
          allPins: { ...state.allPins, [action.payload._id]: action.payload },
          userPins: { ...state.userPins, [action.payload._id]: action.payload }
        }
      );
    case SAVE_PIN:
      return(
        {...state, 
          userPins: {...state.userPins, [action.payload._id]: action.payload },
          loading: action.payload
        }
      );
    default: 
      return state;
  }
}