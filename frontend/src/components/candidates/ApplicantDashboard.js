import React, { Component } from 'react';
import axios from "axios";
import {Link} from "react-router-dom";
import {Button} from "semantic-ui-react";

class ApplicantDashboard extends Component{

    applicationHandler = () => {
        const fd = new FormData();
        fd.append('name', this.state.name);
        fd.append('email', this.state.email);
        fd.append('hello_message', this.state.hello_message);
        fd.append('cv', this.state.selectedFile, this.state.selectedFile.name);
        // fd.append('profile_image', this.state.profile_image);
        axios.post('http://127.0.0.1:8000/api/candidates/', fd)
            .catch((res) => {
                console.log(res);
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

    render() {
        return (
            <div className="App">
                <div className='ui container'>
                    <Button as={Link} to="/similar/cvs" className="ui olive labeled icon button"
                            onClick={this.checkMostSimilarHandler}>
                        <i className="chart bar icon" ></i>
                        Check Most Similar CVs
                    </Button>
                    <h2 style={{ marginTop: '2rem' }}>Create Candidate</h2>
                    <div className='ui segment'>
                        <div className='ui form error'>
                            <div className='field'>
                                <label>Name:</label>
                                <input type="text" name="name" placeholder="Name"
                                       onChange={event => {this.setState({name: event.target.value})}} />
                            </div>

                            <div className="field">
                                <label>Email:</label>
                                <input type="text" name="email" placeholder="Email"
                                       onChange={event => {this.setState({email: event.target.value})}} />
                            </div>

                            <div className='field'>
                                <label>Short Hello Message:</label>
                                <input type="text" name="hello_message" placeholder="Hello Message"
                                       onChange={event => {this.setState({hello_message: event.target.value})}} />
                            </div>
                            <div className='field'>
                                <label>Upload CV:</label>
                                <input type="file" onChange={event => {this.setState({selectedFile: event.target.files[0]})}} />
                            </div>
                            {/*<label>Upload Photo(NOT MANDATORY):</label>*/}
                            {/*<input type="file" name="profile_image" accept="image/png, image/jpeg"*/}
                            {/*       onChange={event => {this.setState({profile_image: event.target.value[0]})}} />*/}

                            <button className='ui olive button' onClick={this.applicationHandler}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ApplicantDashboard