import React, { Component } from 'react';
import CandidateList from "./CandidateList";
import axios from 'axios';
import {Link} from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import {Button} from "semantic-ui-react";

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

    SummarizeCVsHandler = () => {
        this.setState({ loading: true }, () => {
            axios.get('http://127.0.0.1:8000/api/candidate/summarize_cvs/')
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
                    Compute Score for all CVs
                </button>
                <button className="ui yellow labeled icon button" onClick={this.SummarizeCVsHandler}>
                    <i className="tasks icon"></i>
                    Summarize all CVs
                </button>
                    {loading ? <LoadingSpinner /> : <CandidateList />}
            </div>
        );
    }
}

export default Dashboard;