import React, { Component } from 'react';
import { loginUser } from '../actions/action-user';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { Button, Icon, Card, Image, Form, Divider } from 'semantic-ui-react';
import badge from '../data/2.png';
import '../styles/Login.css';

class Login extends Component {
  state = { loading: false }

  // Method used to render redux-form to log in
  renderField = (field) => {
    // If redux meta error and was touched
    const error = field.meta.touched && field.meta.error ? true : false;
    return(
      <div>
        <Form.Input {...field} error={error}/>
        {
          error ? 
          <strong>{field.meta.error}</strong> : ''
        }
      </div>
    )
  };

  // OnSubmit, dispatch redux thunk loginUser. On success, redirect to main page.
  // Else, show error message
  onSubmit = (value) => {
    this.setState({ loading: true });
    return this.props.loginUser(value)
    .then(res => {
      this.setState({ loading: false });
      if(res.success) {
        this.props.history.push('/')
      }
      else{
        throw new SubmissionError(res.message); 
      }
    });
  }

  render() {

    const { handleSubmit, error } = this.props;

    return (
      <div className='login-container'>
        {/* Log in form contained within a card */}
        <Card>
          <Card.Content textAlign='center'>
            <Image width='50' className='login-cardImg' src={badge} />
            <Card.Header className='login-cardHeader'>Login</Card.Header>
            <Card.Description>
            {/* Redux log in form contains 2 fields, username and password */}
            <Form className='login-form' onSubmit={handleSubmit(this.onSubmit)}>
              <Field 
                label='Username'
                name='username'
                placeholder='Enter your username'
                component={this.renderField}
              />
              <Field
                label='Password'
                name='password'
                placeholder='Enter your password'
                component={this.renderField}
              />
              { error && <strong>{error}</strong>}
              <Divider/>
              {/* Redux form contains two submits. The continue is used for local log in. Twitter for twitter log in */}
              <div className='login-buttons'>
                <Button color='red' fluid type='submit' loading={this.state.loading}>Continue</Button>
                <p>OR</p>
                <Button fluid type='submit' color='twitter' onClick={this.loginTwitter}>
                  <Icon name='twitter' />Continue with Twitter
                </Button>
              </div>
            </Form> {/*--End Form--*/}
            </Card.Description>
            <Card.Content extra>
              <h6>By continuing, you agree to the Terms of Service and Privacy Policy</h6>
            </Card.Content>
          </Card.Content>
        </Card>{/*--End Card--*/}
      </div>
    );
  }
}

// Validate function used to validate user inputs before submitting to server.
const validate = (values) => {
  const errors = {};

  //Validate the inputs, check min length of inputs
  if (!values.username || values.username.length < 3){
    errors.username = 'Enter a username that is at least 3 characters';
  }
  if (!values.password || values.password.length < 3){
    errors.password = 'Enter a password that is at least 3 characters.';
  }

  return errors;
};


export default reduxForm({ 
  validate,
  form: 'LoginForm',
})(
  connect(null, { loginUser })(Login)
);

