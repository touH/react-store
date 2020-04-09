export default (state=[], action) => {
  switch (action.type) {
    case 'GET_DATA':
      return action.payload.data;
    case 'GET_USUALLY_DATA':
      // 使用redux-actions， 在action.payload中获取数据
      return action.payload.data;
    default:
      return state
  }
}
