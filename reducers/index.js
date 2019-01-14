import { combineReducers } from 'redux';
import places from './places_reducer';
import geo from './geo_reducer';
import likedPlaces from './likes_reducer';

export default combineReducers({
  places,
  likedPlaces,
  geo
});
