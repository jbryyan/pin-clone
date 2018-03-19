import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, Button, Image } from 'semantic-ui-react';
import { saveNewPin } from '../actions/action-pins';
import '../styles/PinsShow.css';

class PinsShow extends Component {

  render() {
    const { pin, user } = this.props;

    if (!pin) return <div>Loading...</div>
    
    return (
      <div className='single-pins'> 
      {/*div to show individual pin selected by user*/}
        <div className='back'>
          <Button as={Link} color='grey' to='/'>Back to feed</Button>
        </div>
        {/* Place card inside a div*/}
        <div className='card'>
          <Card fluid centered>
            <Card.Content>
              <div className='card-header'>
              <Link to={`/${pin.user}`}> By {pin.user}</Link>
              { user && user.loggedIn ? 
                <Button color='red' onClick={() => this.props.saveNewPin(pin)}>Save</Button> : null
              }
              </div>
            </Card.Content>
            <Card.Content>
            <Image as='a' centered size='large' href={pin.url} target='_blank' src={pin.url} />
            </Card.Content>
          </Card>
        </div> {/*--Card End--*/}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return { 
    pin: state.pins.allPins[ownProps.match.params.id],
    user: state.user 
  };
};

export default connect(mapStateToProps, { saveNewPin }) (PinsShow);