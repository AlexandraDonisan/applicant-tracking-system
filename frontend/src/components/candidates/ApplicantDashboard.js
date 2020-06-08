import React, { Component } from 'react';
import axios from "axios";
import {Button} from "semantic-ui-react";
import LoadingSpinner from "../common/LoadingSpinner";
import {login, tokenConfig} from "../../actions/auth";
import {connect} from "react-redux";
import Popup from "../common/Popup";

class ApplicantDashboard extends Component{
    constructor(props) {
        super(props);
        this.state = {
            candidate: [],
            percentages: [],
            loading: false,
            showPopup: false,
            user: this.props.user,
            auth: {token: localStorage.getItem('token')}
        }}

    componentDidMount(){
        this.getApplicant()
    }

    togglePopup() {
        this.setState({
            showPopup: !this.state.showPopup
        });
    }

    applicationHandler = () => {
        this.setState({ loading: true }, () => {
            const fd = new FormData();
            fd.append('name', this.state.name);
            fd.append('email', this.state.email);
            fd.append('hello_message', this.state.hello_message);
            fd.append('cv', this.state.selectedFile, this.state.selectedFile.name);
            // fd.append('profile_image', this.state.profile_image);

            const config = tokenConfig(() => this.state);
            axios.post('http://127.0.0.1:8000/api/candidates/', fd, config)
                .then(result => {
                    console.log("Response: " + JSON.stringify(result.data));
                    this.setState({candidate: result.data, loading: false,})
                })
                .catch((res) => {
                    console.log(res);
                })
        });
        alert('Response has been sent!');
    };

    getApplicant = () => {
        this.setState({ loading: true }, () => {
            const config = tokenConfig(() => this.state);
            axios.get(`http://127.0.0.1:8000/api/candidate/get_by_owner/${this.state.user.id}/`, config)
                .then(result => {
                    // console.log("Response: " + JSON.stringify(result.data));
                    this.setState({candidate: result.data, loading: false,})
                })
                .catch((res) => {
                    console.log(res);
                })
        });
    };

    checkMostSimilarHandler = () => {
        this.setState({ loading: true }, () => {
            axios.get(`http://127.0.0.1:8000/api/candidate/get_similarities/${this.state.user.id}/`)
                .then(result => {console.log("Response: " + JSON.stringify(result.data));
                    this.setState({
                        percentages: result.data,
                        showPopup: !this.state.showPopup,
                        loading: false,
                    })})
                .catch((res) => {
                    console.log(res);
                })
        })
    };

    render() {
        const { candidate, percentages, loading } = this.state;
        if (percentages){
            var percentagesAsText = 'Top 3 similarity percentages between your CV and other applications:';
            percentagesAsText += '\n' + percentages[0] + '%, ' +  percentages[1] + '%, ' + percentages[2] + '%'
        }
        console.log(percentages[0]);
        return (
            <div className="App">
                {loading ? <LoadingSpinner/> :
                    <div className='ui container'>
                        <Button className="ui olive labeled icon button"
                                onClick={this.checkMostSimilarHandler}>
                            <i className="chart bar icon"></i>
                            Check Similarity with other CVs
                        </Button>
                        {this.state.showPopup ?
                            <Popup text={percentagesAsText} closePopup={this.togglePopup.bind(this)} /> : null
                        }
                        <h2 style={{marginTop: '2rem'}}>Create Candidate</h2>
                        <div className='ui segment'>
                            <div className='ui form error'>
                                <div className='field'>
                                    <label>Name:</label>
                                    <input type="text" name="name" placeholder="Name"
                                           onChange={event => {
                                               this.setState({name: event.target.value})
                                           }}/>
                                </div>

                                <div className="field">
                                    <label>Email:</label>
                                    <input type="text" name="email" placeholder="Email"
                                           onChange={event => {
                                               this.setState({email: event.target.value})
                                           }}/>
                                </div>

                                <div className='field'>
                                    <label>Short Hello Message:</label>
                                    <input type="text" name="hello_message" placeholder="Hello Message"
                                           onChange={event => {
                                               this.setState({hello_message: event.target.value})
                                           }}/>
                                </div>
                                <div className='field'>
                                    <label>Upload CV:</label>
                                    <input type="file" onChange={event => {
                                        this.setState({selectedFile: event.target.files[0]})
                                    }}/>
                                </div>
                                {/*<label>Upload Photo(NOT MANDATORY):</label>*/}
                                {/*<input type="file" name="profile_image" accept="image/png, image/jpeg"*/}
                                {/*       onChange={event => {this.setState({profile_image: event.target.value[0]})}} />*/}

                                <button className='ui olive button' onClick={this.applicationHandler}>Submit</button>
                            </div>
                        </div>
                        <div className="left floated right aligned six wide column">
                            <div className="ui segment">
                                <h4 className="ui olive header">Application Date:</h4>
                                {candidate ? candidate.application_date : <p>Time to apply..</p>}
                            </div>
                            <div className="ui segment">
                                <h4 className="ui olive header">Status of your application:</h4>
                                {candidate ? candidate.response_message :  <p>Here the status of your application will be shown </p>}
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.auth.user
});

export default connect(
    mapStateToProps,
    { login }
)(ApplicantDashboard);