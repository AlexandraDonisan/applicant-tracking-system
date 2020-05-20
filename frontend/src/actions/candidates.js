import axios from 'axios';
import { reset } from 'redux-form';
import { GET_CANDIDATES, GET_CANDIDATE, GET_CANDIDATE_SCORE, ADD_CANDIDATE, DELETE_CANDIDATE, EDIT_CANDIDATE } from "./types";
import history from '../history'
import { tokenConfig } from './auth';

// Get Candidates
export const getCandidates = () => async (dispatch, getState) => {
    const res = await axios.get('/api/candidates/', tokenConfig(getState));
    dispatch({
        type: GET_CANDIDATES,
        payload: res.data
    });
};

// Get Candidate
export const getCandidate = id => async (dispatch, getState) => {
    const res = await axios.get(`/api/candidates/${id}/`, tokenConfig(getState));
    dispatch({
       type: GET_CANDIDATE,
       payload: res.data
    });
};

// Get Candidate Score
export const getScore = id => async (dispatch, getState) => {
    const res = await axios.get(`/api/candidates/${id}/`, tokenConfig(getState));
    dispatch({
       type: GET_CANDIDATE_SCORE,
       payload: res.data.score
    });
};

// Add Candidate
export const addCandidate = formValues => async (dispatch, getState) => {
    console.log('In axios formValues ' + JSON.stringify(formValues));

    const data = new FormData();

    data.append('name', formValues['name']);
    data.append('email', formValues['email']);
    data.append('file', new Blob([formValues['cv']], { type: 'pdf/doc' }));
    const res1 = await axios.post('/api/candidates/', data,  tokenConfig(getState));
    console.log("Response of axios" + JSON.stringify(res1.data));


    const res = await axios.post('/api/candidates/', { ...formValues }, tokenConfig(getState));
    console.log("Response of axios" + res.data);
    dispatch({
      type: ADD_CANDIDATE,
      payload: res.data
    });
    dispatch(reset('candidateForm')); // Dispatching reset('formName') clears our form after we submission succeeds.
};

// Delete Candidate
export const deleteCandidate = id => async (dispatch, getState) => {
    await axios.delete(`/api/candidates/${id}/`, tokenConfig(getState));
    dispatch({
        type: DELETE_CANDIDATE,
        payload: id
    });
    history.push('/'); // Automatically takes us from the modal window to the index page after removing an object
};

// Edit Candidate
export const editCandidate = (id, formValues) => async (dispatch, getState) => {
    console.log("Name in edit is:" +  JSON.stringify(formValues));
    const res = await axios.patch(`/api/candidates/${id}/`, formValues, tokenConfig(getState));
    dispatch({
        type: EDIT_CANDIDATE,
        payload: res.data
    });
    history.push('/');
};