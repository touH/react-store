import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
} from 'react-router-dom'
import { Provider } from 'mobx-react'

import './index.css';
import App from './App';

//注册store
import store from './store'

ReactDOM.render(
  <Provider store={ store }>
    <Router basename='/'>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
