import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

class KeywordsForm extends Component {
  renderField = ({ input, label, meta: { touched, error } }) => {
    return (
      <div className={`field ${touched && error ? 'error' : ''}`}>
        <label>{label}</label>
        <input {...input} autoComplete='off' />
        {touched && error && (
          <span className='ui pointing red basic label'>{error}</span>
        )}
      </div>
    );
  };

  onSubmit = formValues => {
    this.props.onSubmit(formValues);
  };

  render() {
    const btnText = `${this.props.initialValues ? 'Update' : 'Add'}`;
    return (
      <div className='ui segment'>
        <form onSubmit={this.props.handleSubmit(this.onSubmit)} className='ui form error'>
          <Field name='word'  component={this.renderField} label='Word' placeholder="Word"/>
          <Field name='weight' component={this.renderField} label='Weight' placeholder="Weight"/>
          <Field name='job' component={this.renderField} label='Job Id' placeholder="Job Id" />
          <button className='ui olive button'>{btnText}</button>
        </form>
      </div>
    );
  }
}

const validate = formValues => {
  const errors = {};

  if (!formValues.task) {
    errors.task = 'Please enter at least 1 character';
  }

  return errors;
};

export default reduxForm({
  form: 'keywordsForm',
  touchOnBlur: false,
  validate
})(KeywordsForm);