// Reducers specify how the application’s state changes in response to actions sent to the store.

import _ from 'lodash';
import {
    GET_CANDIDATES,
    GET_CANDIDATE,
    ADD_CANDIDATE,
    DELETE_CANDIDATE,
    EDIT_CANDIDATE,
    GET_CANDIDATE_SCORE,
} from "../actions/types";

export default (state = {}, action) => {
  switch (action.type) {
      case GET_CANDIDATES:
          return {
            ...state,
            ..._.mapKeys(action.payload, 'id')
          };
      case GET_CANDIDATE_SCORE:
      case GET_CANDIDATE: //The GET_CANDIDATE action is the same as the ADD_CANDIDATE action, so we only need to set the case
      case ADD_CANDIDATE:
          return {
            ...state,
            [action.payload.id]: action.payload
          };
      case DELETE_CANDIDATE:
          return _.omit(state, action.payload);
      default:
        return state;
      case EDIT_CANDIDATE:
          return {
          ...state,
          [action.payload.id]: action.payload
        };
  }
};