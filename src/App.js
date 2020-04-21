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
import MobxTest1 from './views/MobxTest1'

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
          <Menu.Item key="/mobx-test1">
            <Link to="/mobx-test1">Mobx入门实例</Link>
          </Menu.Item>
        </Menu>
        <div className="main">
          <Switch>
            <Route exact path="/" component={ Home } />
          </Switch>
          <Switch>
            <Route path="/mobx-test1" component={ MobxTest1 } />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
