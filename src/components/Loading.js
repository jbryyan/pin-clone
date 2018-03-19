import React, { Component } from 'react';
import '../styles/App.css';
import { Grid, Loader, Dimmer } from 'semantic-ui-react';

class Loading extends Component {
  render() {
    return (
      <Grid verticalAlign='middle' style={{ height: '100vh', paddingTop: '85px' }}>
        <Grid.Row>
            <Dimmer inverted active>
              <Loader active size='massive' content='Loading...' />
            </Dimmer>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Loading;
