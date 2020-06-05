import {
    GET_JOBS,
    ADD_JOB,
    GET_KEYWORD,
    GET_KEYWORDS,
    ADD_KEYWORD,
    DELETE_KEYWORD,
    EDIT_KEYWORD
} from "../actions/types";
import _ from "lodash";


export default (state = {}, action) => {
  switch (action.type) {
      case GET_KEYWORDS:
          return {
            ...state,
            ..._.mapKeys(action.payload, 'id')
          };
      case GET_KEYWORD:
      case GET_JOBS:
      case ADD_JOB:
      case ADD_KEYWORD:
          return {
            ...state,
            [action.payload.id]: action.payload
          };
      case DELETE_KEYWORD:
          return _.omit(state, action.payload);
      default:
        return state;
      case EDIT_KEYWORD:
          return {
          ...state,
          [action.payload.id]: action.payload
        };
  }
};