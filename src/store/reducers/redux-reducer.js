let initState = [];
export default function (state=initState, action) {
  switch (action.type) {
    case 'GET_ALL_DATA':
      return [...state];
    case 'ADD_DATA':
      return state.concat({id: action.params.id, value: action.params.value });
    case 'EDIT_DATA':
      return state.map(item => item.id === action.params.id ? action.params : item);
    case 'DELETE_DATA':
      return state.filter(item => item.id !== action.id);
    default:
      return state;
  }
}
