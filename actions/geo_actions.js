import {
  SET_POSITION
} from './types';

export const setPosition = ({ latitude, longitude}) => {
  return {
    type: SET_POSITION,
    payload: {latitude, longitude}
  }
};
