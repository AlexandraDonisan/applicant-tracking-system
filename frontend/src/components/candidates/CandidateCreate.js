import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addCandidate } from "../../actions/candidates";
import CandidateForm from "./CandidateForm";

class CandidateCreate extends Component{

    render() {
        return (
            <div className='ui container'>
                <div>Candidate Create Form</div>
                    <div style={{ marginTop: '2rem' }}>
                        <CandidateForm destroyOnUnmount={false} />
                    </div>
            </div>
        );
    }
    // By setting destroyOnUnmount to false, we can disable that the Redux Form automatically destroys a form
    // state in the Redux store when the component is unmounted. It is for displaying the form state in an editing form
}

export default connect(
    null,  // If we don’t need to specify a mapStateToProps function, set null into connect().
    {addCandidate}
)(CandidateCreate)