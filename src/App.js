import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'
import './App.css'
import { Menu } from 'antd';

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

import reducers from './store/reducers'

import Home from './views/Home'
import ReduxComponent from "./views/Redux";

const store = createStore(reducers);

class App extends React.Component {

  state = {
    current: 'mail',
  };

  handleClick = e => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  };

  render() {
    return (
      <div className="App">
        <Router>
          <Menu
            mode="horizontal"
            theme="dark"
            selectedKeys={[this.state.current]}
            onClick={this.handleClick}
          >
            <Menu.Item key="/">
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="/redux">
              <Link to="/redux">redux</Link>
            </Menu.Item>
          </Menu>
          <div className="main">
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/redux">
                <Provider store={store}>
                  <ReduxComponent />
                </Provider>
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
