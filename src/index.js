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
import thunkMiddleware from 'redux-thunk'
import promiseMiddleware from 'redux-promise'

// redux-saga
import createSagaMiddleware from 'redux-saga'
import mySaga from './store/sagas'

// reducers
import reducers from './store/reducers'

// create saga middleware
const sagaMiddleware = createSagaMiddleware();

// 注册store
const store = createStore(reducers, applyMiddleware(thunkMiddleware, promiseMiddleware, sagaMiddleware));

sagaMiddleware.run(mySaga);

ReactDOM.render(
  <Provider store={store}>
    <Router basename='/'>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
