// parent reducer to put together every child reducer

import { combineReducers } from "redux";
import { reducer as formReducer } from 'redux-form'
import candidates from './candidates';
import keywords from './keywords';
import jobs from './keywords'
import auth from './auth';
import { LOGOUT_SUCCESS } from '../actions/types';

// export default combineReducers({
//     form: formReducer, // In order to use redux-form, we need to include its reducer in the combineReducers function
//     candidates,
//     auth
// })

const appReducer = combineReducers({
  form: formReducer,
  candidates,
  keywords,
  jobs,
  auth
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT_SUCCESS) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;