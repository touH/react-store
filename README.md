[TOC]



一个React数据流的自我学习小项目

主要是**Redux**、**Mobx**



# 依赖

首先安装相关依赖

```npm
npm i react-router react-router-dom redux react-redux redux-thunk redux-promise redux-actions mobx mobx-react @babel/plugin-proposal-decorators -S
```

如果要在项目中使用装饰器（`decorators`）的写法，用于mobx，则需要安装和配置：

```
npm run ejet      # 将项目中隐藏的配置文件显示
```

安装装饰器依赖

```npm
npm i @babel/plugin-proposal-decorators -S
```

在package.json文件中增加配置

```json
"babel": {
    "presets": [
      "react-app"
    ],
    "plugins": [
      [
        "@babel/plugin-proposal-decorators",
        {
          "legacy": true
        }
      ]
    ]
  }
```



# Redux

将要学习的点：

- `redux`
- `react-redux`
- `redux-thunk`
- `redux-promise`
- `redux-actions`
- `redux-saga`

## Redux/Redux中间件

- Redux是的诞生是为了给 React 应用提供「可预测化的状态管理」机制。

- Redux会将整个应用状态(其实也就是数据)存储到到一个地方，称为`store`，这个`store`里面保存一棵状态树(state tree)

- 组件改变 `state` 的唯一方法是通过调用`store.dispatch`方法，触发一个`action`，这个`action`被对应的`reducer`处理，于是`state`完成更新

- 组件可以派发(`dispatch`)行为(`action`)给`store`,而不是直接通知其它组件

- 其它组件可以通过订阅`store`中的状态(`state`)来刷新自己的视图

- 单一数据源，使用纯函数修改状态

首先Redux的流程图如下：

![Redux流程图](http://q94j7s0e9.bkt.clouddn.com/redux%E6%B5%81%E7%A8%8B%E5%9B%BE.png?e=1587452691&token=BuOchmXNpNDje7H9LvOL_4Xx2zH8ril3ojj1XL8v:wQYxpFSfC9Y9vt9NJlJsxGiM5Gc=&attname=)

**三大原则**：

- 单一数据源：整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 `store` 中。
- State是只读的：唯一改变 `state` 的方法就是触发 `action`，`action` 是一个用于描述已发生事件的普通对象。
- 使用纯函数来执行修改：为了描述 `action` 如何改变 state tree ，你需要编写 `reducers`。

### Reducer

`Reducers` 指定了应用状态的变化如何响应 `actions` 并发送到 `store` 的，记住 `actions` 只是描述了有事情发生了这一事实，并没有描述应用如何更新 `state`。

```js
/*
    reducers.js
    注意 
    1. 函数返回的值 必须是一个新的副本，不要直接返回state，要返回一个副本
    2. 纯函数，不要在内部做业务代码，主要用于返回数据
*/

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
```

### Action

`Action` 是把数据从应用传到 `store` 的有效载荷。它是 `store` 数据的唯一来源。一般来说你会通过 `store.dispatch()` 将 `action` 传到 `store`。

```js
// actions
export const action1 = {
  type: 'GET_ALL_DATA',
  params: '可以传些参数'
}

/* 
    也可以是一个函数，不过在外部调用这个函数必须执行，确保原生的store.dispatch({type: 'xx'})中的参数是一个对象,
    并且该对象必须规定其中有 type 属性
*/
export const action2 = params => ({
  type: 'GET_ALL_DATA',
  params
})

// 在函数中可以做些什么...
export const action2 = params => {
  // do something
  return {
    type: 'GET_ALL_DATA',
    params
  }
}
```

### Store

前面我们使用 `action` 来描述“发生了什么”，和使用 `reducers` 来根据 `action` 更新 `state` 的用法。

**Store** 就是把它们联系到一起的对象。Store 有以下职责：

- 维持应用的 state；
- 提供 [getState()](http://cn.redux.js.org/docs/api/Store.html#getState) 方法获取 state；
- 提供 [dispatch(action)](http://cn.redux.js.org/docs/api/Store.html#dispatch) 方法更新 state；
- 通过 [subscribe(listener)](http://cn.redux.js.org/docs/api/Store.html#subscribe) 注册监听器;
- 通过执行 [subscribe(listener)](http://cn.redux.js.org/docs/api/Store.html#subscribe) 返回的函数注销监听器。

再次强调一下 Redux 应用只有一个单一的 `store`。当需要拆分数据处理逻辑时，应该使用[combineReducers()](http://cn.redux.js.org/docs/api/combineReducers.html)函数来进行`reducer` 组合而不是创建多个 `store`。

```js
//store/reducers/index.js
import { combineReducers } from 'redux'
import reduxReducer from './redux-reducer'
import reduxThunkReducer from './redux-thunk-reducer'

export default combineReducers({
  reduxReducer,
  reduxThunkReducer
})
```

1. 组件中通过`store.dispatch(action)`传入`store`中，`store`会自动执行`reducers`函数处理，在`Store`中自动执行处理，最后得到想要的`state`值。

2. 通过`<Provider>` 标签将store传入组件，在`props`中可以取得传入的值

```jsx
// index.js
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducers from './store/reducers'   //引入通过combineReducers函数合并过的reducers

const store = createStore(reducers);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

### Component/views

在组件中获取传入的`store`值。

- `connect`：该函数可以将 `store` 中的数据作为 `props` 绑定到组件上，接收两个参数（都是函数，并且函数有两个餐参数），第一个返回`state`，第2个用于`dispatch`发送`action`。返回的函数接受当前组件。

```js
function mapStateToProps(state, ownProps) {
    // state 就是 store 自动执行，通过reducers得到新的。ownProps就是当前组件自己的props属性
  return {
    list: state
  }
}
function mapDispatchToProps(dispatch, ownProps) {
  //dispatch参数就是stroe.dispatch函数，可以用于发送action
  return {
    getData() {
      dispatch({
        type: 'GET_DATA'
      })
    }
  }
}
// 接收两个函数作为参数，一个是state的映射，一个用于dispatch
connect(mapStateToProps, mapDispatchToProps)
```

- **mapStateToProps**：这个单词翻译过来就是把`state`映射到`props`中去 ,其实也就是把Redux中的数据映射到React中的`props`中去。
- **mapDispatchToProps**：这个单词翻译过来就是就是把各种`dispatch`也变成了`props`让你可以直接使用

```jsx
// views.jsx
import React from 'react'
import { connect } from 'react-redux'

class myComponent extends React.Component {
  
  componentDidMount() {
    const { getData, list } = this.props;		//从props中获取到connect方法参数中函数返回的结果
    getData('可以传入参数')
  }
  
  render() {
    return <div></div>
  }
}

//通过connect这个函数允许我们将 store 中的数据作为 props 绑定到组件上。
export default connect((state, ownProps) => {
  return {
    list: state.reduxReducer
  }
}, (dispatch, ownProps) => {
  return {
    getData(params) {
      dispatch({
        type: 'GET_DATA',
        params
      })
    }
  }
})(myComponent)
```



## 中间件

但是，一个关键问题没有解决：异步操作怎么办？`Action` 发出以后，`Reducer` 立即算出 `State`，这叫做同步；`Action` 发出以后，过一段时间再执行 `Reducer`，这就是异步。

怎么才能 `Reducer` 在异步操作结束后自动执行呢？这就要用到新的工具：中间件（`middleware`）。

### 一、中间件的概念

为了理解中间件，让我们站在框架作者的角度思考问题：如果要添加功能，你会在哪个环节添加？

1. `Reducer`：纯函数，只承担计算 `State` 的功能，不合适承担其他功能，也承担不了，因为理论上，纯函数不能进行读写操作。
2. `View`：与 `State` 一一对应，可以看作 `State` 的视觉层，也不合适承担其他功能。
3. `Action`：存放数据的对象，即消息的载体，只能被别人操作，自己不能进行任何操作。

想来想去，只有发送 Action 的这个步骤，即`store.dispatch()`方法，可以添加功能。举例来说，要添加日志功能，把 `Action` 和 State `打印`出来，可以对`store.dispatch`进行如下改造。

```js
let next = store.dispatch;
store.dispatch = function dispatchAndLog(action) {
  console.log('dispatching', action);
  next(action);
  console.log('next state', store.getState());
}
```

上面代码中，对`store.dispatch`进行了重定义，在发送 `Action` 前后添加了打印功能。这就是中间件的雏形。

redux默认的设定是 `dispatch` 只能接受一个对象参数，函数和`promise`都是不允许的，通过中间件，就可以满足传入这些参数了。

**中间件就是一个函数，对`store.dispatch`方法进行了改造，在发出 Action 和执行 Reducer 这两步之间，添加了其他功能。**

### 二、中间件的用法

```js
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import logger from 'redux-logger';
const logger = createLogger();

// 将它们放在applyMiddleware方法之中，传入createStore方法，就完成了store.dispatch()的功能增强。
const store = createStore(
  reducer,
  initial_state,
  applyMiddleware(thunk, promise, logger)
);
```

### 三、applyMiddlewares

看到这里，你可能会问，`applyMiddlewares`这个方法到底是干什么的？

它是 Redux 的原生方法，作用是将所有中间件组成一个数组，依次执行。下面是它的源码。

```js
export default function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, preloadedState, enhancer) => {
    var store = createStore(reducer, preloadedState, enhancer);
    var dispatch = store.dispatch;
    var chain = [];

    var middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    };
    chain = middlewares.map(middleware => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);

    return {...store, dispatch}
  }
}
```

上面代码中，所有中间件被放进了一个数组chain，然后嵌套执行，最后执行`store.dispatch`。可以看到，中间件内部（middlewareAPI）可以拿到`getState`和`dispatch`这两个方法。



## redux-thunk

`redux-thunk`中间件，改造`store.dispatch`，使得后者可以接受函数作为参数。然后我们就可以在函数中进行异步操作了。

含义就是将 `dispatch(action: object): any` 签名替换成 `dispatch(action: object | function): any`，action creator中 `dispatch`, `getState` 等方法可以反复调用

```js
const store = createStore(
  reducer,
  initial_state,
  applyMiddleware(thunk)
);
```

```js
// 旧，参数必须是一个action，即为一个对象
dispatch({
  type: 'GET_DATA',
  params
})
const fn = (params) => ({
  type: 'GET_DATA',
  params
})
dispatch(fn(params))

//通过redux-thunk改造后的dispatch, 参数可以使一个函数,它的返回值也是一个函数，并且接受dispatch, getState，extraArgument参数
function thunkFn(params) {
  // 此处的 dispatch 为store.dispatch函数，用于发送action
  return (dispatch, getState, extraArgument) => {
    // do something async ... or do something
    setTimeout(() => {
      dispatch({
        type: 'GET_DATA',
        params
      })
    }, 3000)
  }
}
dispatch(thunkFn('可以传入参数'))

// 部分代码，这里的 dispatch 就是经过中间件改造过的函数
connect(null, dispatch => {
  return {
    getData() {
      dispatch(thunkFn('可以传入参数'))
    }
  }
})(myComponent)
```



## redux-promise

`redux-promise`中间件可以使`store.dispatch`函数接收 `Promise对象`为参数。`resolve`函数用于发送`action`。

```js
const store = createStore(
  reducer,
  initial_state,
  applyMiddleware(promise)
);
```

```js
connect(null, dispatch => {
  return {
    getData() {
      dispatch(new Promise(resolve => {
        // do something async ... or do something
        resolve({
          type: 'GET_DATA',
          params: [1, 2, 3]
        })
      }))
    }
  }
})(myComponent)
```



## redux-actions

`redux-actions`的第一大杀器就是`createAction`， 他会帮助我们生成规范的`action`:

```js
{
  type: 'GET_ACTIONS_DATA',
  payload: Promise
}

dispatch(action)
```

```js
connect(state => {
  return {
    actionsList: state.reduxActionsAsyncReducer
  }
}, dispatch => {
  return {
    getActionsData() {
      // 使用 createAction 函数来规范。
      const activet = createAction('GET_ACTIONS_DATA', function() {
        return new Promise(resolve => {
          setTimeout(_ => {
            // 发送 action
            resolve({
              data: ['ccc', 'ddd', '通过 redux-actions的 handleActions函数来处理数据']
            })
          }, 3000)
        })
      });
      console.log(activet())   // { type: 'GET_ACTIONS_DATA', payload: Promise }
      dispatch(activet())
    }
  }
})(ReduxActionsComponent)
// 返回结果 { type: 'GET_ACTIONS_DATA', payload: { data: ['ccc', 'ddd', '通过 redux-actions的 handleActions函数来处理数据'] }}
```

```js
// reducers 写法一
export default (state=[], action) => {
  switch (action.type) {
    case 'GET_USUALLY_DATA':
      // 使用redux-actions， 在action.payload中获取数据
      return action.payload.data;
    default:
      return state
  }
}
```

使用第二杀器，`handleActions`，这个函数就是帮助优化代码，我们的`reducer`里面显示是通过`switch case`语句去处理的，使用`handleActions`函数我们可以优化写法。

```js
// reducers 写法二
import { handleActions } from 'redux-actions'

let initState = [];

export default handleActions({
  // 函数名即为type
  GET_ACTIONS_DATA(state, action) {
    console.log('redux-action:', action);
    return action.payload.data
  }
}, initState)

```



## redux-saga

`redux-saga`相当于在Redux原有数据流中多了一层，对`Action`进行监听，捕获到监听的`Action`后可以派生一个新的任务对`state`进行维护（当然也不是必须要改变`State`，可以根据项目的需求设计），通过更改的`state`驱动View的变更。

![redux-saga流程图](http://q94j7s0e9.bkt.clouddn.com/redux-saga.png?e=1587452691&token=BuOchmXNpNDje7H9LvOL_4Xx2zH8ril3ojj1XL8v:FPvUzYnRUMTJ9ok2Z_I5vWdFEXA=&attname=)

![redux-saga流程图2](http://q94j7s0e9.bkt.clouddn.com/redux-saga2.png?e=1587452691&token=BuOchmXNpNDje7H9LvOL_4Xx2zH8ril3ojj1XL8v:yNadZTsKolNEtGoTX4XmdjlsfR0=&attname=)

### Middleware API

#### createSagaMiddleware(options)

创建一个 `Redux middleware`，并将 `Sagas` 连接到 `Redux Store`。

- `options` : `Object` - 传递给 `middleware` 的选项列表。

#### middleware.run(saga, ...args)

动态执行 `saga`。用于 `applyMiddleware` 阶段之后执行 `Sagas`。这个方法返回一个`Task` 描述对象。

```jsx
import createSagaMiddleware from 'redux-saga'
import mySaga from './store/sagas'

const sagaMiddleware = createSagaMiddleware();

const store = createStore(reducers, applyMiddleware(thunkMiddleware, promiseMiddleware, sagaMiddleware));

sagaMiddleware.run(mySaga);

ReactDOM.render(
  <Provider store={store}>
    <Router basename='/'>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
```



### Saga 辅助函数

#### takeEvery

`takeEvery`：在发起（`dispatch`）到 `Store` 并且匹配 `pattern` 的每一个 `action` 上派生一个 `saga`。简单来说就是监听所有的匹配到的 `action`。

- 监听对应的 `action`；
- 每一次 `dispatch` 都会触发；例如：点击一个新增的按钮，2s 后触发新增动作，在2s内不断点击按钮，这时候，每一次点击，都是有效的。

#### takeLatest

`takeLatest`：在发起到 `Store` 并且匹配 `pattern` 的每一个 `action` 上派生一个 `saga`。并自动取消之前所有已经启动但仍在执行中的 `saga` 任务。（即取最后一次，前面的全部取消）

- 监听对应的 `action`；
- 只会触发最后一次 `dispatch`；例如：点击一个新增的按钮，2s 后触发新增动作，在2s内不断点击按钮，这时候，只有最后一次点击是有效的。

#### takeLeading

`takeLeading`：在发起到 `Store` 并且匹配 `pattern` 的每一个 `action` 上派生一个 `saga`。 它将在派生一次任务之后阻塞，直到派生的 `saga` 完成，然后又再次开始监听指定的 `pattern`。（即只取第一次，后面的全部取消，直到第一次完成，才能继续新的点击）

- 监听对应的 `action`；
- 最后一次有效

#### throttle

`throttle`：保留临近的一次，即会有两次

- 监听对应的 `action`；
- 保留邻近的一次

```js
import { takeEvery, takeLatest, takeLeading, delay, put, call } from 'redux-saga/effects'

// 接收一个参数action，为view层dispatch函数发送的action
function* getData(action) {
  try {
    yield delay(2000)			//延迟2s
    /*
     * @description： call 会阻塞程序，只有内部代码执行好，才能往后面执行， 可以当成js的 await+call函数
     * @params：第一个参数是一个函数或Generator函数，后面的参数是传给生成器函数的参数，类似js的call
     */
    let result = yield call(function* (params) {
      return axios.post(url, params)
    }, { id: 1 })
    // put 类似于 redux中的 dispatch方法，用于传递action
    yield put({
      type: 'GET_DATA',
      payload: {
        data: result.data
      }
    })
  } catch(e) {
    yield put({
      type: 'ERROR',
      payload: {
        msg: result.msg
      }
    })
  }
}


function* watchFetchData() {
  // 即view中多次点击触发dispatch，发送action，都会被takeEvery监听到，然后执行几次，这里就触发几次, 如点击9次就触发9次
  yield takeEvery("GET_SAGA_DATA", getData)
  // 和takeEvery基本一样，不过takeLatest只会触发最后一次，前面的次数saga任务会全部取消，即在一定时间里快速点击9次，只触发了一次，而且是最后的那次
  yield takeLatest("GET_SAGA_DATA", getData)
  // 同上，不过只取第一次，后面的次数都取消，第一次的完成了，再点击才有效
  yield takeLeading('GET_SAGA_DATA', getData)
}
```

**注意**：上面的 `takeEvery` 函数可以使用下面的写法替换

```js
function* watchFetchData() {
  // 使用while循环，不然take只会触发一次
   while(true){
     yield take('GET_SAGA_DATA');  // 阻塞， 每次循环到这里就停止了，要等待view发送type为GET_SAGA_DATA的action，才会继续往下面执行
     //fork函数 不会阻塞
     yield fork(getData);
   }
}
```



### Effect Creators

**effect**：

一个 `effect` 就是一个纯文本 `javascript` 对象，包含一些将被 `saga middleware` 执行的指令。

**task**：

一个 `task` 就像是一个在后台运行的进程。在基于 `redux-saga` 的应用程序中，可以同时运行多个 `task`。通过 `fork` 函数来创建 `task`

redux-saga框架提供了很多创建effect的函数，下面我们就来简单的介绍下开发中最常用的几种：

- `take(pattern)   `阻塞
- `put(action) ` 非阻塞
- `call(fn, ...args) ` 阻塞
- `fork(fn, ...args) ` 非阻塞
- `select(selector, ...args)`

阻塞调用的意思是，`Saga` 在 `yield Effect` 之后会等待其执行结果返回，结果返回后才会恢复执行 `Generator` 中的下一个指令。非阻塞调用的意思是，`Saga` 会在 `yield Effect` 之后立即恢复执行。



#### take(pattern)

`take`函数可以理解为监听未来的`action`，它创建了一个命令对象，告诉`middleware`等待一个特定的`action`， `Generator`会暂停，直到一个与pattern匹配的`action`被发起，才会继续执行下面的语句，也就是说，`take`是一个阻塞的 effect。

用法：

```js
function* watchFetchData() {
   while(true) {
     // 监听一个type为 'FETCH_REQUESTED' 的action的执行，直到等到这个Action被触发，才会接着执行下面的 		yield fork(fetchData)  语句
     yield take('FETCH_REQUESTED');
     yield fork(fetchData);
   }
}
```



#### put(action)

`put`函数是用来发送`action`的 effect，你可以简单的**把它理解成为redux框架中的dispatch函数**，当`put`一个`action`后，`reducer`中就会计算新的`state`并返回，**注意：** **put 也是阻塞 effect**

用法：

```js
export function* toggleItemFlow() {
    let list = []
    // 发送一个type为 'UPDATE_DATA' 的Action，用来更新数据，参数为 `data：list`
    yield put({
      type: actionTypes.UPDATE_DATA,
      data: list
    })
}
```



#### call(fn, ...args)

**call函数你可以把它简单的理解为就是可以调用其他函数的函数**，它命令 `middleware` 来调用fn 函数， args为函数的参数，**注意：**  **fn 函数可以是一个 Generator 函数，也可以是一个返回 Promise 的普通函数**，`call` 函数也是**阻塞 effect**

用法：

```js
export function* removeItem() {
  try {
    // 这里call 函数就调用了 delay 函数，delay 函数为一个返回promise 的函数
    return yield call(fetchData, {id: 1})
  } catch (err) {
    yield put({type: actionTypes.ERROR})
  }
}
```



#### fork(fn, ...args)

`fork` 函数和 `call` 函数很像，都是用来调用其他函数的，但是fork函数是非阻塞函数，也就是说，程序执行完 `yield fork(fn， args)` 这一行代码后，会立即接着执行下一行代码语句，而不会等待`fn`函数返回结果后，在执行下面的语句。

用法：

```js
import { fork } from 'redux-saga/effects'

export default function* rootSaga() {
  // 下面的四个 Generator 函数会一次执行，不会阻塞执行
  yield fork(addItemFlow)
  yield fork(removeItemFlow)
  yield fork(toggleItemFlow)
  yield fork(modifyItem)
}
```



#### select(selector, ...args)

`select` 函数是用来指示 `middleware`调用提供的选择器获取`Store`上的`state`数据，你也可以简单的把它理解为**redux框架中获取store上的 state数据一样的功能** ：`store.getState()`

用法：

```js
export function* toggleItemFlow() {
     // 通过 select effect 来获取 全局 state上的 `getTodoList` 中的 list
     let tempList = yield select(state => state.getTodoList.list)
     // 或者 直接获取 state
     yield select()
}
```



#### cancel和cancelled

- `cancel(task)`：创建一个 Effect描述信息，用来命令`middleware`取消之前的一个分叉任务。
- `cancelled()`：创建一个 `Effect`，用来命令 `middleware` 返回该 `generator` 是否已经被取消。通常你会在 `finally` 区块中使用这个 `Effect` 来运行取消时专用的代码。

```js
function* getDelayData(action) {
  
  // fork(fn, args) 不阻塞
  let forkTask = yield fork(function* () {
    try {
      yield delay(3000);
      yield put({
        type: 'GET_SAGA_DATA',
        payload: {
          data: [111, 222, 333]
        }
      });
    } catch (e) {
      console.log('失败')
    } finally {
      const cancelResult = yield cancelled();   // cancelled函数 可以判断是否是取消了，取消了返回true， 否则返回false
      console.log('是否中断forkTask, true为中断', cancelResult)
    }
  });
  
  // 监听 CANCEL_DELAY_GET_DATA action
  yield take('CANCEL_DELAY_GET_DATA');    // 此处阻塞了， 当触发了这个action时，下面的代码才能执行，即点击了取消获取数据按钮。下面的cancel函数才能执行
  yield cancel(forkTask);  // 取消forkTask
  console.log('已取消')
  
}
```



#### all(effects)

创建一个 `Effect` 描述信息，用来命令 `middleware` 并行地运行多个 `Effect`，并等待它们全部完成。这是与标准的 `Promise.all` 相当对应的 `API`。

```js
import { fetchCustomers, fetchProducts } from './path/to/api'
import { all, call } from `redux-saga/effects`

function* mySaga() {
  // 对象写法
  const { customers, products } = yield all({
    customers: call(fetchCustomers),
    products: call(fetchProducts)
  })
  // 数组写法
  const arr = yield all({
    call(fetchCustomers),
    call(fetchProducts)
  })
}
```



#### race(effects)

创建一个 `Effect` 描述信息，用来命令 `middleware` 在多个 `Effect` 间运行 竞赛（`Race`）（与 `Promise.race([...])` 的行为类似）。

```js
import { take, call, race } from `redux-saga/effects`
import fetchUsers from './path/to/fetchUsers'

function* fetchUsersSaga {
  // 对象写法
  const { response, cancel } = yield race({
    response: call(fetchUsers),
    cancel: take(CANCEL_FETCH)
  })
  // 数组写法
  const arr = yield all({
    call(fetchUsers),
    take(CANCEL_FETCH)
  })
}
```

实际上 `redux-saga` 所有的任务都通用 yield Effects 来完成。它为各项任务提供了各种 Effect 创建器，可以是：

- 调用一个异步函数；
- 发起一个 `action` 到 `Store`；
- 启动一个后台任务或者等待一个满足某些条件的未来的 `action`。



很好的一篇文章：[Redux-Saga 实用指北](https://juejin.im/post/5ad83a70f265da503825b2b4)

Redux-saga官网：[英文文档](https://redux-saga.js.org/)、[繁体](https://neighborhood999.github.io/redux-saga/)



## 总结

- redux 是一个可预测的状态容器，
- react-redux 是将store和react结合起来，使得数据展示和修改对于react项目而言更简单
- redux中间件就是在dispatch action前对action做一些处理
- redux-thunk 用于对异步做操作
- redux-actions 用于简化redux操作
- redux-promise 可以配合 redux-actions 用来处理Promise对象，使得异步操作更简单
- redux-saga 可以起到一个控制器的作用，集中处理边际效用，并使得异步操作的写法更优雅。



# Mobx

配置，因为Mobx使用了装饰器，在react中，通过`.babelrc`即可配置es7的装饰器语法：

```.babelrc
{
  "presets": [
    "es2015",
    "stage-1",
    "react"
  ],
  "plugins": ["transform-decorators-legacy"]
}
```

```
npm i babel-preset-{es2015,stage-1,react} babel-plugin-transform-decorators-legacy
```

对于decorators，如果你使用`create-react-app`创建项目， 需要:

```
npm run ejet     # 显示 create-react-app 的配置文件
```

```
npm i @babel/plugin-proposal-decorators
```

在`pakage.json`文件中添加

```json
"babel": {
  "presets": [
    "react-app"
  ],
  "plugins": [
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      }
    ]
  ]
}
```

## Mobx

MobX 是一个非常优雅的状态管理库，它的理念是通过观察者模式对数据做出追踪处理，在对可观察属性的作出变更或者引用的时候，触发其依赖的监听函数。这一点和Vue通过`Object.defineProperty` ，在对状态进行读写操作的时候会触发其 getter 和 setter 函数以进行响应的原理其实是非常类似的。

MobX背后的哲学很简单：**任何源自应用状态的东西都应该自动地获得。**译成人话就是状态只要一变，其他用到状态的地方就都跟着自动变。

主要概念：

- `actions`：一些改变状态值（state）的动作。
- `state`：可观察的状态值
- `computed value`：根据`state`，用pure function计算出来的值
- `reactions`：因`state`或`computed value`变化而引起的反应，主要指视图UI重新渲染

![mobx流程图](http://q94j7s0e9.bkt.clouddn.com/mobx%E6%B5%81%E7%A8%8B%E5%9B%BE.png?e=1587452691&token=BuOchmXNpNDje7H9LvOL_4Xx2zH8ril3ojj1XL8v:VUtRPw3fwQEahD_b8Ok7TQ_CWPg=&attname=)

![mobx流程图2](http://q94j7s0e9.bkt.clouddn.com/mobx流程图2.png?e=1587452691&token=BuOchmXNpNDje7H9LvOL_4Xx2zH8ril3ojj1XL8v:xjCjQy7HC-aloVyN7fMeQBLes-E=&attname=)

在整个数据流中，通过事件驱动（UI 事件、网络请求…）触发 Actions，在 Actions 中修改了 State 中的值，这里的 State 即应用中的 store 树（存储数据），然后根据新的 State 中的数据计算出所需要的计算属性（computed values）值，最后响应（react）到 UI 视图层。

```js
const { observable, action, autorun } = require('mobx');

class Store {
    count = 0;
    @action add () {
        this.count = ++this.count;
    }
}
const mstore = new Store();
setInterval(() => {
    mstore.add();
}, 800);
autorun(() => {
    console.log(mstore.count);
});

//使用 autorun 的时候调用了一次其传入的函数，之后 mstore.count 的值即使改变也并没有触发观察，这是因为 mstore.count 并不是可观察的
@observable count = 0;   //改变时就会自动执行autorun函数了，因为内部有count这个被观测者
```

常用API：

- `observable`：`@observable` 将一个变量变得可观察
- `autorun`：`@autorun` 常用于组件类或`store`类的`constructor`里，用来创建实例时，可监视其函数参数里使用的可观察变量，从而作出相应`reactions`，一般是将函数再执行一遍。
- `when`：`@when` 有条件的`@autorun`
- `computed`：`@computed `通过可观察变量经过纯函数计算得来的值，使用时才会计算，没有使用时不会去计算
- `action`：`@action` 能改变可观察变量值的操作（一般是函数方法）



### observable

`observable` 的属性值在其变化的时候 ，mobx 会自动追踪并作出响应。其语法为：

```js
import {observable} from "mobx";
import { observer } from "mobx-react";
@observable  classProperty = value
```

其核心原理是 `Object.defineProperty` ，给被包装的属性套上 getter 和 setter 的钩子，在 get 中响应依赖收集，在 set 中触发监听函数。



### computed

```
语法形式: @computed get computesValue [function]；
```

```js
class TodoList {
  @observable todos = [];
	// unfinishedTodoCount 受 todos 影响
  @computed get unfinishedTodoCount() {
    return this.todos.filter(todo => !todo.finished).length;
  }
}
```



### action

`@action`是mobx提供的，其规定对于 store 对象中所有可观察状态属性的改变都应该在 `@action` 中完成，凡是涉及到对应用状态变量修改的函数，都应该使用`@action`修饰符。从上图也可以看出，action会触发状态的改变：

```
语法形式：@action actionFuncName[function]
```

```js
const { observable, action, computed, autorun } = require('mobx');

class Store {
    @observable list = []
    @computed get total() {
        return this.list.length;
    }
   @action change (i) {
        this.list.push(i++);
    }
}
const mstore = new Store();
autorun(() => {
    console.log(mstore.total);
});
mstore.change(1)
```



### autorun

`autorun`用来包装一个方法为 观察者。

在上面的例子中，当触发了可观察状态属性的改变后，其变化的监听则是在传入 autorun 函数中作出响应。

`autorun`传入一个函数，当该函数中依赖的可观察状态属性（或者计算属性）发生变化的时候，该函数会被调用。这个函数只会观察自己依赖到的设为 `observable` 的值。

例子在上方。



## mobx-react

### observer

`@observer` 是`mobx-react`提供的，通过使用`@observer`，将react组件转换成一个监听者，这样在被监听的应用状态变量(Observable)有更新时，react组件就会重新渲染。当 render 中的 state发生改变时， `mobx-react` 会重新调用 render 方法，重新渲染这个组件。

`observer`通过es7的装饰器模式，将一个React组件作为参数，并将其转为响应式（Reactive）组件。

```js
import {observable} from "mobx";
import { observer } from "mobx-react";

class Store {
    id
    @observable title;
    @observable completed;
    ......
}

@observer
class App extends React.Component {
    .....
    render() {
      	const { title, completed } = this.props;
        return (
            ....
        );
    }
}
```



### Provider组件

在react中，`mobx-react`提供了 Provider 组件用来包裹最外层组件节点，并且传入 store（通过）context 传递给后代组件：

```js
import { Provider } from 'mobx-react';
const stores = {
  ...
};
ReactDOM.render((
  <Provider {...stores}>    // <Provider store={stores}>
    <App />
  </Provider>
), document.getElementById('root'));
```



### Inject

`@inject` 是为了向当前被装饰的组件 注入 `store` 这个`props`。当然 store 这个 prop 其实是由 Provider 提供的。用于在任何组件中可以直接在`props`中获取内容

```js
@inject('store')
@observer
class MobxTest extends Component {
  static propTypes = {
    store: PropTypes.shape({
      todos: mobxPropTypes.observableArrayOf(PropTypes.string)
    }).isRequired
  };
  state = {
    ...
  };
  render() {
    let { store } = this.props;
    return <div>
      ...
    </div>
  }
}
```





[回到顶部](#依赖)

# 参考链接

一篇很好的文章 [Vuex、Flux、Redux、Redux-saga、Dva、MobX](https://juejin.im/post/5c18de8ef265da616413f332)

