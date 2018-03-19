import React from 'react';
import ReactDOM from 'react-dom';
import {
  PinsIndex, PinsShow, PinsUser,
  Navbar, Login, Register, Page404,
  AddPin, TwitterCallback
} from './components/_index';
import 'semantic-ui-css/semantic.min.css';
import registerServiceWorker from './registerServiceWorker';
import reducers from './reducers';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reduxBrowser = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers, reduxBrowser)}>
    <BrowserRouter basename='/redux-pin'>
      <div>
        <Navbar/>
          <Switch>
            <Route exact path='/' component={PinsIndex} />
            <Route exact path='/pin/:id' component={PinsShow} />
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
            <Route path='/404' component={Page404} />
            <Route path='/modal' component={AddPin} />
            <Route path='/callback' component={TwitterCallback} />
            <Route path='/:user' component={PinsUser} />
          </Switch>
      </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'));
registerServiceWorker();
