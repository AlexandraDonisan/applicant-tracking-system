import React, { Component } from 'react';
import axios from 'axios';
import {Field} from "redux-form";
import {addCandidate} from "../../actions/candidates";

class CandidateCreate extends Component {
  fileUploadHandler = () => {
    const fd = new FormData();
    fd.append('cv', this.state.selectedFile, this.state.selectedFile.name);
    fd.append('email', this.state.email);
    fd.append('name', this.state.name);
    axios.post('http://127.0.0.1:8000/api/candidates/', fd)
    .catch((res) => {
        console.log(res);
    })
  };

  render() {
    return (
      <div className="App">
        <input type="file" onChange={event => {this.setState({selectedFile: event.target.files[0]})}} />

        <label>Email:</label>
        <input type="text" name="email" onChange={event => {this.setState({email: event.target.value})}} />

        <label>Name:</label>
        <input type="text" name="name" onChange={event => {this.setState({name: event.target.value})}} />
        <button onClick={this.fileUploadHandler}>marele kkt</button>
      </div>
    );
  }

}

export default CandidateCreate