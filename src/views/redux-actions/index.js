import React from "react";
import { connect } from 'react-redux'

import { createAction } from 'redux-actions'
import {Button} from "antd";

class ReduxActionsComponent extends React.Component {

  handleUsuallyClick = () => {
    this.props.getUsuallyData()
  };

  handleActionsClick = () => {
    this.props.getActionsData()
  };

  render() {
    return <div>
      <span style={{ marginRight: '30px' }}>redux-actions</span>
      <Button type="primary" style={{ marginRight: '30px' }} onClick={this.handleUsuallyClick}>正常 reducer 处理数据</Button>
      <Button type="primary" onClick={this.handleActionsClick}>引入 redux-actions 的 handleActions 方式的reducer 处理数据</Button>
      <ul>
        {
          this.props.usuallyList.map(item => <li key={item}>{ item }</li>)
        }
      </ul>
      <ul>
        {
          this.props.actionsList.map(item => <li key={item}>{ item }</li>)
        }
      </ul>
    </div>
  }
}

export default connect(state => {
  return {
    usuallyList: state.reduxAsyncReducer,
    actionsList: state.reduxActionsAsyncReducer
  }
}, dispatch => {
  return {
    getUsuallyData() {
      const activet = createAction('GET_USUALLY_DATA', function() {
        return new Promise(resolve => {
          setTimeout(_ => {
            resolve({
              data: ['aaa', 'bbb', '通过 redux-actions的普通方式处理数据']
            })
          }, 3000)
        })
      });
      dispatch(activet())
    },
    getActionsData() {
      const activet = createAction('GET_ACTIONS_DATA', function() {
        return new Promise(resolve => {
          setTimeout(_ => {
            resolve({
              data: ['ccc', 'ddd', '通过 redux-actions的 handleActions函数来处理数据']
            })
          }, 3000)
        })
      });
      dispatch(activet())
    }
  }
})(ReduxActionsComponent)
