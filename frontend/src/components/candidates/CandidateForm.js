import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import FieldComponent from "./FieldComponent";
import FileInput from "./FileComponent";

class CandidateForm extends Component{
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
        console.log('Form values ... ' + JSON.stringify(formValues['cv']));
        console.log('Form values ... ' + JSON.stringify(formValues['name']));
        console.log('Form values ... ' + JSON.stringify(formValues['email']));
        this.props.onSubmit(formValues);
    };

    render(){
        const btnText = `${this.props.initialValues ? 'Update' : 'Add'}`;
        return (
          <div className='ui segment'>
            <form encType="multipart/form-data"
              onSubmit={this.props.handleSubmit(this.onSubmit)}
              className='ui form error'>
                  <Field name='name' component={this.renderField} label='Name' />
                  <Field name='email' component={this.renderField} label='E-mail' />
                  {/*<Field name='hello_message' component={this.renderField} label='Hello' />*/}
                  <Field name='cv' type='file' component={FileInput} label='CV' />
                  {/*  <input type='file' name='cv'/>*/}
                  <button className='ui primary button'>{btnText}</button>
            </form>
          </div>
        );
    }
}

const validate = formValues => {
    const errors = {};
    if( !formValues.name ){
        errors.name = 'Please enter at least 1 character';
    }
    if ( !formValues.email ){
        errors.email = 'Enter a valid E-mail!'
    }

    return errors;
};

export default reduxForm({
    form: 'candidateForm', // name of this form
    touchOnBlur: false,
    validate
})(CandidateForm);