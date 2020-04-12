import React from "react";
import { connect } from 'react-redux'
import { Button } from "antd";
import reduxSagaReducer from "../../store/reducers/redux-saga-reducer";

class ReduxSagaComponent extends React.Component {

  handleTakeEveryClick = () => this.props.takeEveryData();
  handleTakeLatestClick = () => this.props.takeLatestData();

  handleAdd = () => this.props.add();

  handleReduce = () => this.props.reduce();

  handleTakeAdd = () => this.props.takeAdd();
  handleWhileTakeAdd = () => this.props.takeWhileAdd();

  handleDelayGetData = () => this.props.delayGetData();

  handleCancelGetData = () => this.props.cancelGetData();

  handleSagaAll = () => this.props.sagaAll();
  handleSagaRace= () => this.props.sagaRace();

  render() {
    return <div>
      <div style={{ marginBottom: '10px' }}>
        <Button style={{ marginRight: '20px' }} type="primary" onClick={this.handleTakeEveryClick}>获取数据 takeEvery, 点击多少次，就触发多少次</Button>
        <Button style={{ marginRight: '20px' }} type="primary" onClick={this.handleTakeLatestClick}>获取数据 takeLatest, 点击多次，最后只取最后一次触发，前面的几次都被中断</Button>
      </div>
      <div style={{ marginBottom: '10px' }}>
       <Button style={{ marginRight: '20px' }} type="primary" onClick={this.handleDelayGetData}>获取数据，但是可以被旁边的按钮中断获取数据（即发送请求，还没响应前，中断）</Button>
       <Button style={{ marginRight: '20px' }} type="primary" onClick={this.handleCancelGetData}>中断延时获取数据</Button>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <Button style={{ marginRight: '20px' }} type="primary" onClick={this.handleAdd}>takeEvery：num增加</Button>
        <Button style={{ marginRight: '20px' }} type="primary" onClick={this.handleReduce}>takeEvery 减少</Button>
        <Button style={{ marginRight: '20px' }} type="primary" onClick={this.handleTakeAdd}>take 增加，只会执行一次</Button>
        <Button style={{ marginRight: '20px' }} type="primary" onClick={this.handleWhileTakeAdd}>take 增加(task、fork、call) -- while/take</Button>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <Button style={{ marginRight: '20px' }} type="primary" onClick={this.handleSagaAll}>redux-saga：all方法</Button>
        <Button style={{ marginRight: '20px' }} type="primary" onClick={this.handleSagaRace}>redux-saga：race方法</Button>
      </div>

      <div>num: { this.props.num }</div>
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
    list: state.reduxSagaReducer.list,
    num: state.reduxSagaReducer.num,
  }
}, dispatch => {
  return {
    takeEveryData() {
      dispatch({
        type: 'TAKEEVERY_DATA',
        payload: {
          kk: 2
        }
      })
    },
    takeLatestData() {
      dispatch({
        type: 'TAKELATEST_DATA',
        payload: {
          kk: 2
        }
      })
    },
    add() {
      dispatch({
        type: 'ADD_SAGA_NUM',
        payload: {
          v: '增加'
        }
      })
    },
    reduce() {
      dispatch({
        type: 'REDUCE_SAGA_NUM',
      })
    },
    takeAdd() {
      dispatch({
        type: 'ADD_TAKE_NUM'
      })
    },
    takeWhileAdd() {
      dispatch({
        type: 'ADD_WHILE_TAKE_NUM',
        payload: {
          a: 1
        }
      })
    },
    delayGetData() {
      dispatch({
        type: 'DELAY_GET_DATA'
      })
    },
    cancelGetData() {
      dispatch({
        type: 'CANCEL_DELAY_GET_DATA'
      })
    },
    sagaAll() {
      dispatch({
        type: 'SAGA_ALL'
      })
    },
    sagaRace() {
      dispatch({
        type: 'SAGA_RACE'
      })
    }
  }
})(ReduxSagaComponent)

