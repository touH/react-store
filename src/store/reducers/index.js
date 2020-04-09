import { combineReducers } from 'redux'
import reduxReducer from './redux-reducer'
import reduxAsyncReducer from './redux-async-reducer'
import reduxActionsAsyncReducer from './redux-actions-reducer'

export default combineReducers({
  reduxReducer,
  reduxAsyncReducer,
  reduxActionsAsyncReducer
})
