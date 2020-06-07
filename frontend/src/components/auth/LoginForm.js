import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { login } from '../../actions/auth';
import './login.css'
import './images/1.png'

class LoginForm extends Component{
    renderField = ({ input, label, type, meta: {touched, error}}) => {
        return (
            <div className={`field ${touched && error ? 'error' : ''}`}>
                <label>{label}</label>
                <input {...input} type={type} />
                {touched && error && (
                    <span className='ui pointing red basic label'>{error}</span>
                )}
            </div>
        );
    };

    hiddenField = ({ type, meta: { error } }) => {
        return (
            <div className='field'>
                <input type={type} />
                {error && <div className='ui red message'>{error}</div>}
            </div>
        );
    };

    onSubmit = formValues => {
        this.props.login(formValues);
    };

    render() {
        if (this.props.isAuthenticated) {
            console.log("After log in: " + this.props.is_super_user);
            if(this.props.is_super_user)
                return <Redirect to='/' />;
            else
                return <Redirect to='/apply'/>
        }
        return (
            // <div className="ui inverted vertical segment landpage-image">
            <div className="ui inverted vertical segment">
                <div className='ui container' style={{ marginTop: '4rem'}}>
                    <div className="ui middle aligned center aligned grid">
                        <div className="column" style={{ maxWidth: 450 }}>
                            <h2 className="ui olive center aligned header">
                                {/*<img className="image" src="./static/images/logo.png"/>*/}
                                Log-in to your account
                            </h2>
                            {/*<img className="ui medium circular image" src="2.png" alt={'This should be the background'}/>*/}
                            <form onSubmit={this.props.handleSubmit(this.onSubmit)} className="ui form">
                                <div className="ui stacked segment">
                                    <div className='field'>'
                                        <div className="ui left input">
                                            <i className="user icon"></i>
                                            <label>Username</label>
                                            {/*<input name="email" placeholder="E-mail address" type="text" />*/}
                                        </div>
                                        <Field name='username' type='text' component={this.renderField}/>
                                    </div>
                                    <div className="field">
                                        <div className="ui left input">
                                            <i className="lock icon"></i>
                                            <label>Password</label>
                                        </div>
                                        <Field name='password' type='password' component={this.renderField}/>
                                    </div>
                                    <Field name='non_field_errors' type='hidden' component={this.hiddenField}/>
                                    {/*If the username and password do not match the information in the database, Django returns */}
                                    {/*Non-field errors. To render this error, we need to have a field named 'non_field_errors'.*/}
                                    {/*<div className="ui fluid large teal submit button">Login</div>*/}
                                    <button className='ui fluid large olive submit button'>Login</button>
                                </div>
                                <div className="ui error message"></div>
                            </form>
                            <div className="ui message">New to us? <Link to='/register'>Register</Link></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    is_super_user: state.auth.is_super_user

});

LoginForm = connect(
    mapStateToProps,
    { login }
)(LoginForm);

export default reduxForm({
    form: 'loginForm'
})(LoginForm);