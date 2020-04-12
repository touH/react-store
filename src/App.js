import React from 'react';
import {
  Switch,
  Route,
  Link
} from 'react-router-dom'
import { withRouter } from "react-router";

import './App.css'
import { Menu } from 'antd';

// 组件
import Home from './views/Home'
import ReduxComponent from "./views/Redux";
import ReduxThunkComponent from './views/redux-thunk'
import ReduxPromiseComponent from './views/redux-promise'
import ReduxActionsComponent from './views/redux-actions'
import ReduxSagaComponent from './views/redux-saga'

// withRouter 函数用于使 App 组件也可以获取 props 中的路由信息
// 如果不想使用 withRouter， 而<App /> 组件中又想拿到 路由数据，则使用 <Route path="/" component={ App }> 这种方式包裹，要在Route组件内部才能获取路由信息
@withRouter
class App extends React.Component {

  state = {
    current: '',
  };

  componentDidMount() {
    const { location } = this.props;
    this.setState({
      current: location.pathname
    })
  }

  handleClick = e => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  };

  render() {
    return (
      <div className="App">
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
          <Menu.Item key="/redux-thunk">
            <Link to="/redux-thunk">redux-thunk</Link>
          </Menu.Item>
          <Menu.Item key="/redux-promise">
            <Link to="/redux-promise">redux-promise</Link>
          </Menu.Item>
          <Menu.Item key="/redux-actions">
            <Link to="/redux-actions">redux-actions</Link>
          </Menu.Item>
          <Menu.Item key="/redux-saga">
            <Link to="/redux-saga">redux-saga</Link>
          </Menu.Item>
        </Menu>
        <div className="main">
          <Switch>
            <Route exact path="/" component={ Home } />
            <Route path="/redux" component={ ReduxComponent } />
            <Route path="/redux-thunk" component={ ReduxThunkComponent } />
            <Route path="/redux-promise" component={ ReduxPromiseComponent } />
            <Route path="/redux-actions" component={ ReduxActionsComponent } />
            <Route path="/redux-saga" component={ ReduxSagaComponent } />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
