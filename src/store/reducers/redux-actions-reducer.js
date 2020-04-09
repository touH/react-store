import { handleActions } from 'redux-actions'

let initState = [];

// 使用 handleActions 函数来做处理，不用像平时 reducer 中的写法，这里直接可以使用 对象+函数的写法
export default handleActions({
  GET_ACTIONS_DATA(state, action) {
    console.log('redux-action:', action);
    return action.payload.data
  }
}, initState)
