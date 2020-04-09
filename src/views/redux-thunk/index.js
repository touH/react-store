import React from "react";
import { connect } from 'react-redux'
import { reduxThunkGetData } from '@/store/actions'

import { Button } from 'antd'

class ReduxThunkComponent extends React.Component {

  handleClick = () => {
    this.props.getData()
  };

  render() {
    return <div>
      <span style={{ marginRight: '30px' }}>redux-thunk</span>
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
      dispatch(reduxThunkGetData('redux-thunk 传入的参数'))
    }
  }
})(ReduxThunkComponent)
