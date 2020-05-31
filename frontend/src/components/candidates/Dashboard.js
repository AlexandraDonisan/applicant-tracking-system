import React, { Component } from 'react';
import CandidateList from "./CandidateList";
import CandidateCreate from "./CandidateCreate";
import {Link} from "react-router-dom";

class Dashboard extends Component {
    render() {
        return (
            <div className='ui container'>
                <button className="ui olive labeled icon button">
                    <i className="tasks icon"></i>
                    Compute CV Scores
                </button>
                <button className="ui olive right labeled icon button">
                    <i className="chart bar icon"></i>
                    Check most Similar CVs
                </button>
                <CandidateList />
            </div>
        );
    }
}

export default Dashboard;