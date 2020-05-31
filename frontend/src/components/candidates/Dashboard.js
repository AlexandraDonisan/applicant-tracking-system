import React, { Component } from 'react';
import CandidateList from "./CandidateList";
import axios from 'axios';
import CandidateCreate from "./CandidateCreate";
import {Link} from "react-router-dom";

class Dashboard extends Component {

    computeScoreHandler = () => {
        axios.get('http://127.0.0.1:8000/api/candidate/compute_score/')
            .catch((res) => {
                console.log(res);
            })
    };
    btnTapped() {
        console.log('tapped');
    }

    render() {
        return (
            <div className='ui container'>
                <button className="ui olive labeled icon button" onClick={this.computeScoreHandler}>
                    <i className="tasks icon"></i>
                    Compute CV Scores
                </button>
                <button className="ui olive right labeled icon button" onClick={this.btnTapped}>
                    <i className="chart bar icon" ></i>
                    Check most Similar CVs
                </button>
                <CandidateList />
            </div>
        );
    }
}

export default Dashboard;