import {
  FETCH_PLACES_COMPLETE,
  FETCH_PLACES_START, PLACE_CATEGORY
} from '../actions/types';

const INITIAL_STATE = {
  places: null,
  loading: false
}
export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_PLACES_START:
      return { loading: true };
    case FETCH_PLACES_COMPLETE:
      return { data: action.payload, loading: false };
    case PLACE_CATEGORY:
      console.log('PLACE CATEGORY', action.payload);
      return { ...state, category: action.payload }
    default:
      return state;
  }
}