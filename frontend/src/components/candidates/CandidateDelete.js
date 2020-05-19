import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Modal from '../layout/Modal';
import history from '../../history';
import { getCandidate, deleteCandidate } from "../../actions/candidates";

class CandidateDelete extends Component{
    componentDidMount() {
        this.props.getCandidate(this.props.match.params.id);
    }

    renderContent(){
        if(!this.props.candidate){
            return 'Are you sure you want to delete this candidate?'
        }

        return `Are you sure you want to delete the candidate: ${this.props.candidate.name}`;
    }

    renderActions(){
        const { id } = this.props.match.params;
        return (
              <Fragment>
                    <button onClick={() => this.props.deleteCandidate(id)} className='ui negative button'>Delete</button>
                    <Link to='/' className='ui button'>Cancel</Link>
              </Fragment>
        );
    }

    render() {
        return (
              <Modal
                title='Delete Candidate'
                content={this.renderContent()}
                actions={this.renderActions()}
                onDismiss={() => history.push('/')}
              />
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
   candidate: state.candidates[ownProps.match.params.id]
    // We can retrieve the data from its own props by specifying ownProps as the second argument to mapStateToProps
});

export default connect(
    mapStateToProps,
    { getCandidate, deleteCandidate }
)(CandidateDelete)