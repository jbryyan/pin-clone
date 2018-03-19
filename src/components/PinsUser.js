import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUserPins, addNewPin } from '../actions/action-pins';
import { deleteMyImage } from '../actions/action-user';
import { Link } from 'react-router-dom';
import Masonry from 'react-masonry-component';
import { Card, Image, Grid, Button, Icon } from 'semantic-ui-react';
import AddPin from './AddPin';
import '../styles/PinsUser.css';
import userImg from '../data/1.png';

class PinsUser extends Component {

  //Fetch user pins
  componentDidMount() {
    const user = this.props.match.params.user;
    this.props.fetchUserPins(user)
    .then((res) => {
      if (!res.success) {
        this.props.history.push('/404');
      }
    })
    
  }

  //Renders pins belonging to specific user fetched from db
  renderPins = () => {
    const images = this.props.userPins;
    const user = this.props.user;
    const imagePins = Object.keys(images)
    .map(key => 
      <div className='cardButton' key={key}>
        <Card key={key}>
          <Image as={ Link} 
            to={`/pin/${key}`} 
            src={images[key].url}/> 
        </Card>
        { /* Will render delete button if user is in his user page. */
          this.props.match.params.user === this.props.user.username ?
          <Button color='black' onClick={() => this.props.deleteMyImage(key)}><Icon name='pin'/>Delete</Button> : null
        }
        { /* If the pin has a different username from that of the current user the pin was saved. */
          images[key].user !== user.username ? 
          <div className='link'>Saved from user {images[key].user}</div> 
          :
          <div className='link'>By {this.props.user.username}</div>
        }

      </div>
    );
    return imagePins;
  };
  
  render() {

    if (!this.props.userPins) {
      return <div>Loading</div>
    }

    return (
      <div className='user-container'>
        {/* Used to show username and image placeholder */}
        <Grid container columns={3} centered>
          <Grid.Row >
            <Grid.Column width={10}>
              <p className='user-name'>{this.props.match.params.user}</p>
            </Grid.Column>
            <Grid.Column width={4}>
              <Image src={this.props.user.image || userImg}/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {/* Masonry used to display user images */}
        <Masonry
          className='masonry-css'
          options={{ transitionDuration: 1, fitWidth: true }}
        >
          { /* Add new pin available is user is in his own page */ 
            this.props.user && this.props.user.username === this.props.match.params.user ? 
            <AddPin />  : null
          }
          {this.renderPins()}
        </Masonry>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  //console.log(state.pins.userPins);
  return { 
    userPins: state.pins.userPins, 
    user: state.user 
  };
};

const mapDispatchToProps = {
  fetchUserPins, addNewPin, deleteMyImage
};

export default connect(mapStateToProps, mapDispatchToProps)(PinsUser);