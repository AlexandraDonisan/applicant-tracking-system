import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCandidates, getCandidate, deleteCandidate } from "../../actions/candidates";
import axios from 'axios';

class CandidateList extends Component{
    componentDidMount() {
        this.props.getCandidates();
    }

    seeCVHandler = param => e => {
        console.log('tapped ' +  param.toString());
        window.open(param, '_blank');
        // window.location.href=param;
    };

    render() {
    return (
      <div className='ui relaxed divided list' style={{ marginTop: '2rem' }}>
        {this.props.candidates.sort((a,b) => b.score - a.score).map(candidate => (
          <div className='item' key={candidate.id}>
                <div className='right floated content'>
                  <Link to={`/delete/${candidate.id}`} className='small ui  pink button'>Delete</Link>
                </div>
                <div className='right floated content'>
                  <Link to={`/edit/${candidate.id}/`} className='small ui orange button'>Edit</Link>
                </div>
              <div className='right floated content'>
                  <Link to={`/skills/${candidate.id}/`} className='small ui yellow button'>Get Skills</Link>
                </div>
              <div className='right floated content'>
                  <Link to={`/schedule/${candidate.id}/`} className='small ui olive button'>Send Response</Link>
                </div>
            <i className='large file alternate middle aligned icon' onClick={this.seeCVHandler(candidate.cv)}/>
            <div className='content'>
                <Link to={`/details/${candidate.id}/`} className='header'>{candidate.name}</Link>
                <div className='description'>{candidate.email}</div>
                <div className='description'>{candidate.hello_message}</div>
                <div className='description'>{candidate.application_date}</div>
                <div className='description'>{candidate.score}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
    candidates: Object.values(state.candidates)
});

//The connect() function connects this component to the store. It accepts mapStateToProps as the first argument,
// Action Creators as the second argument. We will be able to use the store state as Props by specifying mapStateToProps.

export default connect(
    mapStateToProps,
    { getCandidates, getCandidate, deleteCandidate },
)(CandidateList);

