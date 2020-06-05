import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getKeyword, editKeyword } from '../../actions/keywords';
import KeywordsForm from './KeywordsForm';

class KeywordsEdit extends Component {
  componentDidMount() {
    this.props.getKeyword(this.props.match.params.id);
  }

  onSubmit = formValues => {
    this.props.editKeyword(this.props.match.params.id, formValues);
  };

  render() {
    return (
      <div className='ui container'>
        <h2 style={{ marginTop: '2rem' }}>Edit Keywords</h2>
        <KeywordsForm
          initialValues={_.pick(this.props.keyword, 'word', 'weight', 'job')}
          enableReinitialize={true}
          onSubmit={this.onSubmit}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  keyword: state.keywords[ownProps.match.params.id]
});

export default connect(
  mapStateToProps,
  { getKeyword, editKeyword }
)(KeywordsEdit);