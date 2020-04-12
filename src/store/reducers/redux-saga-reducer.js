let initState = {
  list: [],
  num: 0
};
export default (state=initState, action) => {
  let newState = {};
  switch (action.type) {
    case 'GET_SAGA_DATA':
      newState = Object.assign({}, state);
      newState.list = action.payload.data;
      return newState;
    case 'ADD_SAGA_ITEM':
      newState = Object.assign({}, state);
      newState.num = state.num + 1;
      return newState;
    case 'REDUCE_SAGA_ITEM':
      newState = Object.assign({}, state);
      newState.num = state.num - 1;
      return newState;
    default: return state
  }
}
