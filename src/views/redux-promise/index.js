import React from "react";
import { connect } from 'react-redux'

import { reduxPromiseGetData } from '@/store/actions'
import {Button} from "antd";

class ReduxPromiseComponent extends React.Component {
  handleClick = () => {
    this.props.getData()
  };

  render() {
    return <div>
      <span style={{ marginRight: '30px' }}>redux-promise</span>
      <Button type="primary" onClick={this.handleClick}>获取数据</Button>
      <ul>
        {
          this.props.list.map(item => <li key={item}>{ item }</li>)
        }
      </ul>
    </div>
  }
}

export default connect(state => {
  return {
    list: state.reduxAsyncReducer
  }
}, dispatch => {
  return {
    getData() {
      // 参数是一个Promise对象
      dispatch(reduxPromiseGetData)
    }
  }
})(ReduxPromiseComponent)
