import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCandidate, editCandidate } from "../../actions/candidates";
import CandidateForm from "./CandidateForm";

class CandidateEdit extends Component{
    componentDidMount() {
        this.props.getCandidate(this.props.match.params.id);
    }

    onSubmit = formValues => {
        this.props.editCandidate(this.props.match.params.id, formValues);
    };

    render() {
        return (
          <div className='ui container'>
                <h2 style={{ marginTop: '2rem' }}>Edit Candidate</h2>
                <CandidateForm initialValues={ _.pick(this.props.candidate, ['name', 'email']) }
                               enableReinitialize={true} //set to true so that we can also get the value when the page is reloaded
                               onSubmit={this.onSubmit}/>
          </div>
        );
  }
}

const mapStateToProps = (state, ownProps) => ({
    candidate: state.candidates[ownProps.match.params.id]
});

export default connect(
    mapStateToProps,
    { getCandidate, editCandidate }
)(CandidateEdit);