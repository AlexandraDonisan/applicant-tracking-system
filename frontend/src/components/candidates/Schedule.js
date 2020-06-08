import React, { Component } from 'react';
import axios from "axios";
import {getCandidate} from "../../actions/candidates";
import {connect} from "react-redux";

class Schedule extends Component{
    constructor(props) {
        super(props);
        this.state = {
            candidateName: this.props.candidate.name,
            textareaDefaultValue: `Hi ${this.props.candidate.name},

Thanks for your application to our company. We were impressed by your background and would like to 
invite you to interview at our office to tell you a little more about the position and get to know you better.
Please let me know which of the following times work for you, and I can send over a confirmation and details:
-[Day, Time 1]
-[Day, Time 2]
-[Day, Time 3]
Looking forward to meeting you ^-^`
        }
    }
    componentDidMount() {
        this.props.getCandidate(this.props.match.params.id);
    }

    sendResponse = () => {
            const formData = new FormData();
            if (typeof (this.state.responseMessage) !== 'undefined' || this.state.responseMessage != null)
                formData.append('response_message', this.state.responseMessage);
            else
                formData.append('response_message', this.state.textareaDefaultValue);
            axios.patch(`/api/candidates/${this.props.candidate.id}/`, formData)
                .then(result => {
                    console.log("Response: " + JSON.stringify(result.data));
                    this.setState({loading: false,})
                })
                .catch((res) => {
                    console.log(res);
                })
    };

    render() {

        const divStyleContainer = {
            marginTop: '2rem',
            maxWidth: 900
        };

        return (
                    <div className="ui vertical segment" >
                        <div className='ui container' style={divStyleContainer}>
                            <div className="ui middle aligned center aligned grid">
                                <div className="column" style={{ maxWidth: 900}}>
                                    <h2 className="ui purple header" style={{ marginTop: '2rem' }}>
                                        {
                                            typeof (this.state.candidateName) !== 'undefined' ?
                                                this.state.candidateName : null}</h2>
                                    <div className="ui segment" >
                                        <div className="ui form" >
                                            <div className="field">
                                                <label>Enter Response Message:</label>
                                                <textarea defaultValue={this.state.textareaDefaultValue}
                                                          onChange={event => {this.setState({responseMessage: event.target.value})}}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="ui middle aligned center aligned grid">
                                <button className="fluid ui olive button" style={{ maxWidth: 900}}
                                        onClick={this.sendResponse}>Send Response</button>
                            </div>
                        </div>
                    </div>
        );
    }

}

const mapStateToProps = (state, ownProps) => ({
    candidate: state.candidates[ownProps.match.params.id]
});

export default connect(
    mapStateToProps,
    { getCandidate}
)(Schedule);