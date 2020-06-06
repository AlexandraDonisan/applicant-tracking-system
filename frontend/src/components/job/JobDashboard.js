import React, { Component } from 'react';
import KeywordsList from "./KeywordsList";
import KeywordsCreate from "./KeywordsCreate";
import axios from "axios";
import JobList from "./JobList";

class JobDashboard extends Component {

    fileUploadHandler = () => {
        const fd = new FormData();
        fd.append('name', this.state.name);
        fd.append('default_score', this.state.default_score);
        fd.append('job_description', this.state.selectedFile, this.state.selectedFile.name);
        axios.post('http://127.0.0.1:8000/api/application/job/', fd)
            .catch((res) => {
                console.log(res);
            })
    };

    render() {
        return (
            <div className='ui container'>
                <div className="two column stackable ui grid">
                    <div className="column" style={{ maxWidth: 600 }}>
                        <h2 style={{ marginTop: '2rem' }}>Job Position</h2>
                        <div style={{ marginTop: '2rem' }}>
                            <div className='ui segment'>
                                <div className='ui form error'>
                                    <div className='field'>
                                        <label>Name:</label>
                                        <input type="text" name="name" placeholder="Name"
                                               onChange={event => {this.setState({name: event.target.value})}} />
                                    </div>

                                    <div className='field'>
                                        <label>Default Score for Skills:</label>
                                        <input type="number" name="default_score" placeholder="Default Score"
                                               onChange={event => {this.setState({default_score: event.target.value})}} />
                                    </div>

                                    <div className='field'>
                                        <label>Upload Job Description File:</label>
                                        <input type="file" onChange={event => {this.setState({selectedFile: event.target.files[0]})}} />
                                    </div>
                                    <button className='ui olive button' onClick={this.fileUploadHandler}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="column" style={{ maxWidth: 600 }}>
                        <h2 style={{ marginTop: '2rem' }}>Keywords Create Form</h2>
                        <KeywordsCreate/>
                    </div>
                </div>
                <JobList/>
                <KeywordsList />
            </div>
        );
    }
}

export default JobDashboard;