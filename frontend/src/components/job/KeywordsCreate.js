import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addKeyword } from '../../actions/keywords';
import KeywordsForm from './KeywordsForm';

class KeywordsCreate extends Component {
  onSubmit = formValues => {
    this.props.addKeyword(formValues);
  };

  render() {
    return (
      <div style={{ marginTop: '2rem' }}>
        <KeywordsForm destroyOnUnmount={false} onSubmit={this.onSubmit} />
      </div>
    );
  }
}

export default connect(
  null,
  { addKeyword }
)(KeywordsCreate);