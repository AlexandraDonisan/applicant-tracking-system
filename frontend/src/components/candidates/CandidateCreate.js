import React, { Component } from 'react';
import axios from 'axios';
import {Field} from "redux-form";
import {addCandidate} from "../../actions/candidates";
import {tokenConfig} from "../../actions/auth";

class CandidateCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: {token: localStorage.getItem('token')}
    }}

    fileUploadHandler = () => {
        const fd = new FormData();
        fd.append('email', this.state.email);
        fd.append('name', this.state.name);
        fd.append('hello_message', this.state.hello_message);
        fd.append('cv', this.state.selectedFile, this.state.selectedFile.name);
        // fd.append('profile_image', this.state.profile_image);
        axios.post('http://127.0.0.1:8000/api/candidates/', fd, tokenConfig(() => this.state))
            .catch((res) => {
                console.log(res);
            })
    };

    render() {
        return (
            <div className="App">
                <div className='ui container'>
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
                                <label>Upload CV:</label>
                                <input type="file" onChange={event => {this.setState({selectedFile: event.target.files[0]})}} />
                            </div>
                            <button className='ui olive button' onClick={this.fileUploadHandler}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default CandidateCreate