import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {getCandidates, getCandidate, deleteCandidate, getScore} from "../../actions/candidates";

class CandidateScore extends Component{
    componentDidMount() {
        this.props.getCandidate();
    }

    render() {
    return (
      <div className='ui relaxed divided list' style={{ marginTop: '2rem' }}>
        {this.props.score}
      </div>
    );
  }
}

const mapStateToProps = state => ({
    score: Object.values(state.score)
});

//The connect() function connects this component to the store. It accepts mapStateToProps as the first argument,
// Action Creators as the second argument. We will be able to use the store state as Props by specifying mapStateToProps.

export default connect(
    mapStateToProps,
    { getScore, getCandidate},
)(CandidateScore);
