import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import {
  BrowserRouter as Router,
} from 'react-router-dom'

// redux周边
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import promise from 'redux-promise'

// reducers
import reducers from './store/reducers'

// 注册store
const store = createStore(reducers, applyMiddleware(thunk, promise));

ReactDOM.render(
  <Provider store={store}>
    <Router basename='/'>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
