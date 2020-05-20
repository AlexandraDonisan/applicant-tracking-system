import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {editCandidate, getCandidate} from "../../actions/candidates";
import CandidateForm from "./CandidateForm";

class CandidateDetails extends Component {
    componentDidMount() {
        this.props.getCandidate(this.props.match.params.id);
    }

    render() {
        return (
            <div className='ui container'>
                <h2 style={{ marginTop: '2rem' }}>Candidate</h2>
                <div className="ui inverted segment" >
                    <div role="list" className="ui divided inverted relaxed list">
                        <div role="listitem" className="item">
                            <div className="content">
                                <div className="header">Name</div>
                                {this.props.candidate.name}
                            </div>
                        </div>
                        <div role="listitem" className="item">
                            <div className="content">
                                <div className="header">Email</div>
                                {this.props.candidate.email}
                            </div>
                        </div>
                        <div role="listitem" className="item">
                            <div className="content">
                                <div className="header">Hello Message</div>
                                {this.props.candidate.hello_message}
                            </div>
                        </div>
                        <div role="listitem" className="item">
                            <div className="content">
                                <div className="header">CV</div>
                                {this.props.candidate.cv}
                            </div>
                        </div>
                        <div role="listitem" className="item">
                            <div className="content">
                                <div className="header">Score</div>
                                {
                                    this.props.candidate.score
                                }
                            </div>
                        </div>
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
)(CandidateDetails);