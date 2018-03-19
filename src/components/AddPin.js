import React, { Component } from 'react';
import { 
  Modal, Button, Header, 
  Icon, Card, Image, Form, 
  Divider, Message 
} from 'semantic-ui-react';

import '../styles/AddPin.css';
import { addNewPin } from '../actions/action-pins';
import { connect } from 'react-redux';
import defaultImg from '../data/1.png';

class AddPin extends Component {

  state = {
    modalOpen: false, loading: false,
    validImage: false,
    image: '', upload: ''
  };

  // Opens the modal to add a new pin
  handleOpen = () => {
    this.setState({ modalOpen: true });
  }

  // Closes modal and resets back to initial state
  handleClose = () => {
    this.setState({ modalOpen: false, validImage: false, image: '' });
  }

  // On invalid image, the placeholder will show a default image
  errorImage = () => {
    this.setState({ validImage: false });
  }

  // Whenever user enters a new link into the submit bar, handle change will
  // check/match whether the image has ended with the proper extensions 
  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value, image: value }, () => {
      if(this.state.image.match(/\.(jpeg|jpg|gif|png)$/) != null){
        this.setState({ validImage: true })
      }else if(this.state.validImage){
        this.setState({ validImage: false });
      }
    });
  }

  // After user has added a new image/pin, the addNewPin thunk will be called
  // Only after the call has finished, a success message will be set.
  onSubmit = (e) => {
    const { image } = this.state;
    this.setState({ loading: true });
    this.props.addNewPin(image, null)
    .then(res => {
      if(res.success){
        this.setState({ 
          upload: 'Successful upload', loading: false, 
          validImage: false, image: '' 
        });
      }else {
        this.setState({ 
          upload: 'Unsuccessful upload', loading: false,
          validImage: false, image: ''
        })
      }
    });
  }

  render() {
    const { image, validImage } = this.state;
    return (
      
      <div className='add-card'>
        {/* The modal will be set inside a card. Only when the user has pressed the card will the modal appear. */}
        <Card centered>
          {/* The modal is customizable. The trigger is that of an icon inside the parent card. */}
          <Modal size='large' 
            className='addpin-modal'
            trigger={<Icon size='massive' color='red' name='add circle' onClick={this.handleOpen}/>}
            open={this.state.modalOpen}  
            onClose={this.handleClose}
          >
            {/* The content of the modal resides here. The state of the form is managed by the onChange method */ }
            <Modal.Header>Create Pin</Modal.Header>
            <Modal.Content image>
              <Image wrapped size='medium' onError={this.errorImage} src={validImage ? image : defaultImg }/>
              <Modal.Description className='modal-description'>
                <Header>Image Link</Header>
                {/* The onSubmit method will call a thunk which will proceed to call a nodejs server to upload the new pin */}
                <Form className='login-form' 
                  onSubmit={this.onSubmit}
                >
                  <Form.Field>
                  <Form.Input className='SignUpForm-input' 
                    placeholder='Enter image url' name='image'
                    value={this.state.image} 
                    onChange={this.handleChange}
                  />
                  </Form.Field>
                  <Message>{this.state.upload}</Message>
                  <Divider/>
                  {/* If the image is invalid, the button to submit will be disabled */}
                  <div className='login-buttons'>
                    <Button color='red' fluid type='submit' 
                      disabled={!this.state.validImage} loading={this.state.loading}
                    >
                      Save
                    </Button>
                  </div>
                </Form> {/*--End Form--*/}
              </Modal.Description> 
            </Modal.Content> {/*--End Modal Content--*/}
            <Modal.Actions>
              <Button positive icon='checkmark' labelPosition='right' content='Done' onClick={this.handleClose} />
            </Modal.Actions>
          </Modal> {/*--End Modal--*/}
        </Card> {/*--End Card--*/}
        <p>Add pin</p>
      </div>
    );
  }
}

export default connect(null, { addNewPin })(AddPin)
