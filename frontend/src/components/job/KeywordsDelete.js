import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Modal from '../layout/Modal';
import history from '../../history';
import { getKeyword, deleteKeyword } from '../../actions/keywords';

class KeywordsDelete extends Component {
  componentDidMount() {
    this.props.getKeyword(this.props.match.params.id);
  }

  renderContent() {
    if (!this.props.keyword) {
      return 'Are you sure you want to delete this keyword?';
    }
    return `Are you sure you want to delete the keyword: ${this.props.keyword.word}`;
  }

  renderActions() {
    const { id } = this.props.match.params;
    return (
      <Fragment>
        <button
          onClick={() => this.props.deleteKeyword(id)}
          className='ui negative button'
        >
          Delete
        </button>
        <Link to='/' className='ui button'>
          Cancel
        </Link>
      </Fragment>
    );
  }

  render() {
    return (
      <Modal
        title='Delete Keyword'
        content={this.renderContent()}
        actions={this.renderActions()}
        onDismiss={() => history.push('/')}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  keyword: state.keywords[ownProps.match.params.id]
});

export default connect(
  mapStateToProps,
  { getKeyword, deleteKeyword }
)(KeywordsDelete);