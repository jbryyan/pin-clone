import React, { Component } from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { registerUser } from '../actions/action-user';
import { connect } from 'react-redux';
import { Button, Icon, Card, Image, Form, Divider } from 'semantic-ui-react';
import badge from '../data/2.png';
import '../styles/Register.css';

class Register extends Component {
  state ={ loading: false }

  // Renders Input field along with any errors for the register form
  renderField = (field) => {
    return(
      <div>
        <Form.Input {...field} error={field.meta.touched && field.meta.error}/>
        {field.meta.touched && field.meta.error ? 
          <strong>{field.meta.error}</strong> : ''}
      </div>
    )
  };
  // Handles submit, calls thunk and pushes to main page on successful registration
  onSubmit = (values) => {
    this.setState({ loading: true });
    return this.props.registerUser(values)
    .then(res => {
      this.setState({ loading: false });
      if(res.success) this.props.history.push('/');
      else throw new SubmissionError(res.message);
    });
  }

  render() {
    const { handleSubmit, error } = this.props;
 
    return (
      <div className='register-container'>
        {/* Redux form stored inside card */}
        <Card>
          <Card.Content textAlign='center'>
            <Image width='50' className='register-cardImg' src={badge} />
            <Card.Header className='register-cardHeader'>Register</Card.Header>
            <Card.Description>
              {/* Redux form has two fields. Username and password fields. */}
              <Form className='register-form' onSubmit={handleSubmit(this.onSubmit)}>
                <Field 
                  label='Enter a username'
                  placeholder='Enter a username'
                  name='username'
                  component={this.renderField}
                />
                <Field
                  label='Enter a password'
                  placeholder='Enter a password'
                  name='password'
                  component={this.renderField}
                />
                {error && 
                  <strong>{error}</strong>
                }
                <Divider/>
                <div className='register-buttons'>
                  <Button color='red' fluid type='submit' loading={this.state.loading}>Register</Button>
                  <p>OR</p>
                  <Button fluid type='submit' color='twitter' onClick={this.loginTwitter}><Icon name='twitter' />Continue with Twitter</Button>
                </div>
              </Form> {/*--End Form--*/}
            </Card.Description>
            <Card.Content extra>
              <h6>By continuing, you agree to the Terms of Service and Privacy Policy</h6>
            </Card.Content>
          </Card.Content>
        </Card> {/*--End Card--*/}
      </div>
    );
  }
}

// Validates redux form.
const validate = (values) => {
  const errors = {};

  //Validate the inputs
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
  form: 'RegisterForm'
})(connect(null, { registerUser })(Register));

