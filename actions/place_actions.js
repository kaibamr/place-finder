import axios from 'axios';
import {
  FETCH_PLACES_COMPLETE,
  LIKE_PLACE,
  CLEAR_LIKED_PLACES, FETCH_PLACES_START,
  PLACE_CATEGORY,
  // REMOVE_PLACE
} from './types';

export const fetchPlaces = (lat, long, type) => async (dispatch) => {
  dispatch({ type: FETCH_PLACES_START });
  axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=2000&type=${type}&key=AIzaSyAQ4rg1Tlr75tHwOYZWHF0r4oiH7SxuVP8`)
    .then((response) => {
      dispatch({ type: FETCH_PLACES_COMPLETE, payload: response.data.results });
  });
};

export const placeCategory = (category) => {
  return {
    type: PLACE_CATEGORY,
    payload: category
  }
}

export const likePlace = (place) => {
  return {
    type: LIKE_PLACE,
    payload: place
  };
};

export const clearLikedPlaces = () => {
  return { type: CLEAR_LIKED_PLACES };
};

// zadanie trudne - dodaj X
// export const removeLikedPlace = (placeId) => {
//   return {
//     type: REMOVE_PLACE,
//     payload: placeId
//   };
// };