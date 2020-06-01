import React, { Component } from 'react';
import CandidateList from "./CandidateList";
import axios from 'axios';
import CandidateCreate from "./CandidateCreate";
import {Link} from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false, // will be true when ajax request is running
        }
    }

    computeScoreHandler = () => {
        this.setState({ loading: true }, () => {
            axios.get('http://127.0.0.1:8000/api/candidate/compute_score/')
                .then(result => this.setState({
                    loading: false,
                }))
                .catch((res) => {
                    console.log(res);
                })
        })
    };

    checkMostSimilarHandler = () => {
        this.setState({ loading: true }, () => {
            axios.get('http://127.0.0.1:8000/api/candidate/get_similar_cvs/')
                .then(result => this.setState({
                    loading: false,
                }))
                .catch((res) => {
                    console.log(res);
                })
        })
    };

    btnTapped() {
        console.log('tapped');
    }

    render() {
        const { loading } = this.state;

        return (
            <div className='ui container'>
                <button className="ui olive labeled icon button" onClick={this.computeScoreHandler}>
                    <i className="tasks icon"></i>
                    Compute CV Scores
                </button>
                <button className="ui olive right labeled icon button" onClick={this.checkMostSimilarHandler}>
                    <i className="chart bar icon" ></i>
                    Check most Similar CVs
                </button>
                {loading ? <LoadingSpinner /> : <CandidateList />}
                {/*<CandidateList />*/}
            </div>
        );
    }
}

export default Dashboard;