import React, { Component } from 'react';
import KeywordsList from "./KeywordsList";
import KeywordsCreate from "./KeywordsCreate";

class JobDashboard extends Component {
  render() {
    return (
      <div className='ui container'>
        <h1>Keywords Create Form</h1>
          <KeywordsCreate/>
            <KeywordsList />
      </div>
    );
  }
}

export default JobDashboard;