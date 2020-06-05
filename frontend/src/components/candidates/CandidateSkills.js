import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {getCandidates, getCandidate, deleteCandidate, getScore} from "../../actions/candidates";
import axios from "axios";

class CandidateSkills extends Component{
    constructor(props) {
        super(props);
        this.state = {
            matchingSkills: [],
            missingSkills: [],
            loading: false, // will be true when ajax request is running
        }
    }
    componentDidMount(){
        this.getMissingSkills();
        this.getMatchingSkills()
    }

    getMissingSkills(){
        this.setState({ loading: true }, () => {
            axios.get(`http://127.0.0.1:8000/api/candidate/matching_skills/${this.props.match.params.id}/`)
                .then(result => {
                    console.log("Response: " + JSON.stringify(result.data));
                    this.setState({missingSkills: result.data, loading: false, })})
                .catch((res) => {
                    console.log(res);
                })
        })
    }

    getMatchingSkills(){
        this.setState({ loading: true }, () => {
            axios.get(`http://127.0.0.1:8000/api/candidate/missing_skills/${this.props.match.params.id}/`)
                .then(result => {
                    // console.log("Response: " + JSON.stringify(result.data));
                    this.setState({matchingSkills: result.data, loading: false, })})
                .catch((res) => {
                    console.log(res);
                })
        })
    }

    render() {
        const { matchingSkills, missingSkills, loading } = this.state;


        return (
            <div className="two column stackable ui grid">
                <div className="column" style={{ maxWidth: 600 }}>
                    <div className="ui inverted segment" style={{ marginLeft: '4rem'}}>
                        <h2 className="ui olive header">Matching Skills</h2>
                        {
                            matchingSkills['skills'] ? matchingSkills['skills'].map(skill =>
                                <div className="item">
                                    {skill}
                                </div>) : null
                        }
                    </div>
                </div>
                <div className="column" style={{ maxWidth: 600 }}>
                    <div className="ui inverted segment" style={{ marginLeft: '4rem'}}>
                        <h2 className="ui red header">Missing Skills</h2>
                        {
                            missingSkills['skills'] ? missingSkills['skills'].map(skill =>
                                <div className="item">
                                    {skill}
                                </div>) : null
                        }
                    </div>
                </div>
            </div>

        );
    }
}

export default CandidateSkills
