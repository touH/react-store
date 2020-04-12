export const reduxThunkGetData = params => async (dispatch, getState) => {
  console.log(params, getState());
  dispatch({
    type: 'DO_SOMETHING'
  });
  // 模拟个异步
  await new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 3000)
  });
  dispatch({
    type: 'GET_DATA',
    payload: {
      data: ['a', 'b', '通过redux-thunk方式处理数据']
    }
  })
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
