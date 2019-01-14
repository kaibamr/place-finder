import { REHYDRATE } from 'redux-persist/constants';
import _ from 'lodash';
import {
  LIKE_PLACE,
  CLEAR_LIKED_PLACES,
  REMOVE_PLACE
} from '../actions/types';

export default function(state = [], action) {
  switch (action.type) {
    case REHYDRATE:
      return action.payload.likedPlaces || [];
    case LIKE_PLACE:
      return _.uniqBy([
        action.payload, ...state
      ], 'id');
    case CLEAR_LIKED_PLACES:
      return [];
    case REMOVE_PLACE:
      return _.remove(state, (currentPlace) => { return currentPlace.id !== action.payload});
    default:
      return state;
  }
}

