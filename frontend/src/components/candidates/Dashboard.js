import React, { Component } from 'react';
import CandidateList from "./CandidateList";
import CandidateCreate from "./CandidateCreate";

class Dashboard extends Component {
  render() {
    return (
      <div className='ui container'>
            <CandidateList />
      </div>
    );
  }
}

export default Dashboard;