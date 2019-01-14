import {
  SET_POSITION
} from '../actions/types';

const INITIAL_STATE = {
  latitude: 0,
  longitude: 0,
};

export default function(state = INITIAL_STATE, action)  {
  switch (action.type) {
    case SET_POSITION:
      return { ...state, latitude: action.payload.latitude, longitude: action.payload.longitude }
    default:
      return state;
  }
}