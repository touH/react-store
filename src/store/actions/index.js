export const reduxThunkGetData = params => (dispatch, getState) => {
  setTimeout(() => {
    console.log(params, getState());
    dispatch({
      type: 'GET_DATA',
      payload: {
        data: ['a', 'b', '通过redux-thunk方式处理数据']
      }
    })
  }, 3000)
};

export const reduxPromiseGetData = new Promise(resolve => {
  // 模拟异步
  setTimeout(() => {
    resolve({
      type: 'GET_DATA',
      payload: {
        data: [1, 2, '通过redux-promise方式处理数据']
      }
    })
  }, 3000)
});
