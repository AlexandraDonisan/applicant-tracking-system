import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {editCandidate, getCandidate} from "../../actions/candidates";
import {Link} from "react-router-dom";
import {Button} from "semantic-ui-react";

class CandidateDetails extends Component {
    componentDidMount() {
        this.props.getCandidate(this.props.match.params.id);
    }

    seeCVHandler = param => e => {
        console.log('tapped ' +  param.toString());
        window.open(param, '_blank');
    };


    render() {
        const path = `/similarities/${this.props.match.params.id}`;
        return (
            <div className='ui container'>
                <h2 style={{ marginTop: '2rem' }}>Candidate</h2>
                <Button as={Link} to={path} className="ui olive labeled icon button">
                        <i className="chart bar icon" ></i>
                        Check Most Similar CVs
                    </Button>
                <div className="ui inverted segment" >
                    <div role="list" className="ui divided inverted relaxed list">
                        <div role="listitem" className="item">
                            <div className="content">
                                <div className="ui olive header">Name</div>
                                {this.props.candidate.name}
                            </div>
                        </div>
                        <div role="listitem" className="item">
                            <div className="content">
                                <div className="ui olive header">Email</div>
                                {this.props.candidate.email}
                            </div>
                        </div>
                        <div role="listitem" className="item">
                            <div className="content">
                                <div className="ui olive header">Hello Message</div>
                                {this.props.candidate.hello_message}
                            </div>
                        </div>
                        <div role="listitem" className="item">
                            <div className="content">
                                <div className="ui olive header">CV</div>
                                <i className='large file alternate middle aligned icon'
                                   onClick={this.seeCVHandler(this.props.candidate.cv)}/>
                                {/*{this.props.candidate.cv.filename}*/}
                            </div>
                        </div>
                        <div role="listitem" className="item">
                            <div className="content">
                                <div className="ui olive header">Score</div>
                                {
                                    this.props.candidate.score
                                }
                            </div>
                        </div>
                        <div role="listitem" className="item">
                            <div className="content">
                                <div className="ui olive header">Summarized CV</div>
                                {
                                    this.props.candidate.summarized_cv ?
                                        this.props.candidate.summarized_cv.split('\n').map(function (item) {
                                            return (<span>{item}<br/></span> )
                                        }) : null
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