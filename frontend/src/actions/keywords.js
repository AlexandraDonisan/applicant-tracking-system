import axios from 'axios';
import { reset } from 'redux-form';
import {
    GET_JOBS,
    ADD_JOB,
    GET_KEYWORD,
    GET_KEYWORDS,
    ADD_KEYWORD,
    DELETE_KEYWORD,
    EDIT_KEYWORD
} from "./types";
import history from '../history'
import { tokenConfig } from './auth';

// Get Keywords
export const getKeywords = () => async (dispatch, getState) => {
    const res = await axios.get('/api/application/keywords/', tokenConfig(getState));
    dispatch({
        type: GET_KEYWORDS,
        payload: res.data
    });
};

// Get Keyword
export const getKeyword = id => async (dispatch, getState) => {
    const res = await axios.get(`/api/application/keywords/${id}/`, tokenConfig(getState));
    dispatch({
       type: GET_KEYWORD,
       payload: res.data
    });
};

export const getJobs = () => async (dispatch, getState) => {
    const res = await axios.get('/api/application/jobs/', tokenConfig(getState));
    dispatch({
        type: GET_JOBS,
        payload: res.data
    });
};

export const addKeyword = formValues => async (dispatch, getState) => {

    const res = await axios.post('/api/application/keywords/', { ...formValues }, tokenConfig(getState));
    dispatch({
      type: ADD_KEYWORD,
      payload: res.data
    });
    dispatch(reset('keywordsForm')); // Dispatching reset('formName') clears our form after we submission succeeds.
};

// Delete Keyword
export const deleteKeyword = id => async (dispatch, getState) => {
    await axios.delete(`/api/application/keywords/${id}/`, tokenConfig(getState));
    dispatch({
        type: DELETE_KEYWORD,
        payload: id
    });
    history.push('/job/'); // Automatically takes us from the modal window to the index page after removing an object
};

// Edit Keyword
export const editKeyword = (id, formValues) => async (dispatch, getState) => {
    console.log("Name in edit is:" +  JSON.stringify(formValues));
    const res = await axios.patch(`/api/application/keywords/${id}/`, formValues, tokenConfig(getState));
    dispatch({
        type: EDIT_KEYWORD,
        payload: res.data
    });
    history.push('/job/');
};