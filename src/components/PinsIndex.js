import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchPins, addNewPin, saveNewPin } from '../actions/action-pins';
import Masonry from 'react-masonry-component';
import { Link } from 'react-router-dom';
import { Card, Image, Button, Icon } from 'semantic-ui-react';
import Loading from './Loading';
import '../styles/PinsIndex.css';

class PinsIndex extends Component {
  // Each pin grabbed from the database is rendered accodingly
  renderPins = () => {
    const pins = this.props.pins.allPins;
    const user = this.props.user;
    // Mapping the pins within a div, a card will be shown
    const imagePins = Object.keys(pins)
    .map(key => 
      <div className='cardButton' key={key}>
        <Card key={key}>
          <Image as={Link} src={pins[key].url}
            to={`/pin/${key}`}
          /> 
        </Card>
        { user.loggedIn && this.props.match.path === '/' ?
          <Button color='red' 
            
            onClick={() => this.props.saveNewPin(pins[key])}
          >
            <Icon name='pin'/>Save
          </Button> 
          : 
          null
        }
        <div className='link'>By {pins[key].user}</div>
      </div>
    );

    return imagePins;
  };

  render() {
    if (this.props.pins.loading) {
      return <Loading />
    }

    return (
      <Masonry
        className='masonryCss'
        options={{ transitionDuration: 1, isFitWidth: true }}
      >
        {this.renderPins()}
      </Masonry>
    );
  }
}

const mapStateToProps = (state) => {
  return { 
    pins: state.pins,
    user: state.user 
  };
};

const mapDispatchToProps = {
  fetchPins, addNewPin, saveNewPin
};

export default connect(mapStateToProps, mapDispatchToProps)(PinsIndex);