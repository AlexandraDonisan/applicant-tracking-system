import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getJobs} from "../../actions/keywords";
import axios from "axios";

class JobList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false, // will be true when ajax request is running
        }
    }

    componentDidMount() {
        this.fetchJobs()
    }

    fetchJobs(){
        this.setState({ loading: true }, () => {
            axios.get('http://127.0.0.1:8000/api/application/job/')
                .then(result => {
                    console.log("Response: " + JSON.stringify(result.data));
                    this.setState({data: result.data, loading: false, })})
                .catch((res) => {
                    console.log(res);
                })
        })
    }

    seeJobDescriptionHandler = param => e => {
        window.open(param, '_blank');
    };

    render() {
        const { data, loading } = this.state;
        return (
            <div className='ui relaxed divided list' style={{ marginTop: '2rem' }}>
                <h1>Jobs</h1>
                {data.map(job => (
                    <div className='item' key={job.id}>
                        <i className='large calendar outline middle aligned icon'
                           onClick={this.seeJobDescriptionHandler(job.job_description)}/>
                        <div className='content'>
                            <a className='header'>{job.name}</a>
                            <div className='description'>Default score for skills: {job.default_score}</div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

export default JobList