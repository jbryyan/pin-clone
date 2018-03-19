import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { authToken, logout, twitterReq, twitterLogin } from '../actions/action-user';
import { fetchAllPins, fetchUserPins } from '../actions/action-pins';
import { withRouter } from "react-router-dom";
import { 
  Menu, Image, Container, Dropdown, 
  Message, Transition, Responsive 
} from 'semantic-ui-react';
import badge from '../data/2.png';
import '../styles/Navbar.css';

class Navbar extends Component {
  // Local state is used to render successful login status
  state = { hide: 5000, visible: true }

  componentDidMount() {
    const token = localStorage.getItem('pinCloneToken');
    
    // After component mounts, fetch all pins from the server
    this.props.fetchAllPins(true);

    // If there is a token present authenticate the token
    // If valid, will sign in user, else it will logout the user
    if (token) this.props.authToken();
  }

  componentWillReceiveProps(nextProps) {
    // On logout, success message returned to initial state
    if (nextProps.user.loggedIn === false) this.setState({ visible: true });
    
    // If the user pins changed, will fetch all the pins available again
    if (this.props.userPins !== nextProps.userPins) this.props.fetchAllPins(false);
  }

  componentDidUpdate(prevProps, prevState){
    // If user had a successful login, success message will appear.
    // It will transition to hidden when setting visible state to false.
    if(!prevProps.user.loggedIn && this.props.user.loggedIn){
      this.setState({ visible: false });
    }
  }

  // Twitter method used to authenticate and log in user with their twitter credentials
  twitterReq = () => {
    if(!localStorage.getItem('pinCloneToken')){
      this.props.twitterReq();
    }
  }

  render() {
    const { logout } = this.props;  // Logout action
    const activeItem = this.props.location.pathname;  // Used to highlight active item on navbar
    const user = this.props.user ? this.props.user : null;  // Check if user is logged in


    return (
      <Menu color='red' fixed='top' borderless className='navbar-custom'>
        {/* Container used to reduce menu items width */}
        <Container>
          <Menu.Item as={Link} active={activeItem === '/'} to='/'>
            <Image size='mini' src={badge} />
          </Menu.Item>
          {user && user.loginPage ?
            <Transition duration={this.state.hide} visible={this.state.visible}>
              <Message size='tiny' positive className='success-message'>Successful login</Message>
            </Transition> : null
          }

          {user.loggedIn ?
            
            <Menu.Menu position='right'>
              <Responsive as={Menu.Item} minWidth={Responsive.onlyTablet.minWidth}>
                <Menu.Item icon='user' name={`Hello ${user.username}`} />
                <Menu.Item as={Link} active={activeItem === `/${user.username}`} 
                  to={`/${user.username}`} name='My Page'
                />
                <Menu.Item as={Link} to='/' onClick={logout} name='Logout'/>
              </Responsive>
              <Responsive as={Menu.Item} maxWidth={Responsive.onlyTablet.minWidth}>
                <Dropdown text='Menu'>
                  <Dropdown.Menu>
                    <Dropdown.Item text={`Hello ${user.username}`} />
                    <Dropdown.Item as={Link} to={user.username} text='My Page'/>
                    <Dropdown.Item as={Link} to='/' onClick={logout} text='Logout'/>
                  </Dropdown.Menu>
                </Dropdown>
              </Responsive>
            </Menu.Menu>
            :
            <Menu.Menu position='right'>
              <Responsive as={Menu.Item} minWidth={Responsive.onlyTablet.minWidth}>
                <Menu.Item onClick={() => this.twitterReq()}
                  icon='twitter' name='Login with Twitter'
                />                
                <Menu.Item as={Link} active={activeItem === '/login'} to='/login' name='Login'/>
                <Menu.Item as={Link} active={activeItem === '/register'} to='/register' name='Register'/>
              </Responsive>
              <Responsive as={Menu.Item} maxWidth={Responsive.onlyTablet.minWidth}>
                <Dropdown text='Menu'>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => this.twitterReq()}
                      icon='twitter' text='Login with Twitter'
                    />                
                    <Dropdown.Item as={Link} active={activeItem === '/login'} to='/login' text='Login'/>
                    <Dropdown.Item as={Link} active={activeItem === '/register'} to='/register' text='Register'/>
                  </Dropdown.Menu>
                </Dropdown>
              </Responsive>
            </Menu.Menu> /*--End Navbar--*/
          }
        </Container> {/*--End Container--*/}
      </Menu>
    );
  }
}

// Map redux-state to component props
const mapStateToProps = (state) => {
  return {
    user: state.user,
    userPins: state.pins.userPins
  };
};

// Map redux actions to component props
const mapDispatchToProps = {
  twitterReq, twitterLogin, fetchAllPins,
  authToken, logout, fetchUserPins
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar));