import React, { Component } from 'react';
import logo from '../styles/logo.svg';
import '../styles/App.css';
import { twitterLogin } from '../actions/action-user';
import { connect } from 'react-redux';

class TwitterCallback extends Component {
  // When callback mounts, search query string
  // If query string is valid, proceed to twitterLogin post request.
  // Else, the query is invalid, return to main page without doing any server requests
  componentDidMount() {
    const searchQuery = this.props.location.search;
    if (!searchQuery.includes('?denied')){
      this.props.twitterLogin(this.props.location.search)
      .then(res => {
        if(res.success){
          this.props.history.replace('/');
        }
      });
    } else {
      this.props.history.replace('/');
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Loading...</h1>
          <img src={logo} className="App-logo" alt="logo" />
        </header>
      </div>
    );
  }
}

export default connect(null, { twitterLogin })(TwitterCallback);
