[toc]



一个React数据流的自我学习小项目

主要是`Redux`、`Mobx`

## 依赖

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

在`package.json`文件中增加配置

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



## Redux

将要学习的点：

- `redux`
- `react-redux`
- `redux-thunk`
- `redux-promise`
- `redux-actions`
- `redux-saga`





### Redux/Redux中间件

- Redux是的诞生是为了给 React 应用提供「可预测化的状态管理」机制。

- Redux会将整个应用状态(其实也就是数据)存储到到一个地方，称为`store`，这个`store`里面保存一棵状态树(state tree)

- 组件改变 `state` 的唯一方法是通过调用`store.dispatch`方法，触发一个`action`，这个`action`被对应的`reducer`处理，于是`state`完成更新

- 组件可以派发(`dispatch`)行为(`action`)给`store`,而不是直接通知其它组件

- 其它组件可以通过订阅`store`中的状态(`state`)来刷新自己的视图



首先Redux的流程图如下：

![Redux流程图](./images/redux流程图.png)

**三大原则**：

- 单一数据源：整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 `store` 中。
- `State`是只读的：唯一改变 `state` 的方法就是触发 `action`，`action` 是一个用于描述已发生事件的普通对象。
- 使用纯函数来执行修改：为了描述 `action` 如何改变 state tree ，你需要编写 `reducers`。

#### Reducer

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

#### Action

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

#### Store

前面我们使用 `action` 来描述“发生了什么”，和使用 `reducers` 来根据 `action` 更新 `state` 的用法。

**Store** 就是把它们联系到一起的对象。`Store` 有以下职责：

- 维持应用的 `state`；
- 提供 [getState()](http://cn.redux.js.org/docs/api/Store.html#getState) 方法获取 state；
- 提供 [dispatch(action)](http://cn.redux.js.org/docs/api/Store.html#dispatch) 方法更新 state；
- 通过 [subscribe(listener)](http://cn.redux.js.org/docs/api/Store.html#subscribe) 注册监听器;
- 通过 [subscribe(listener)](http://cn.redux.js.org/docs/api/Store.html#subscribe) 返回的函数注销监听器。

再次强调一下 Redux 应用只有一个单一的 store。当需要拆分数据处理逻辑时，应该使用[combineReducers()](http://cn.redux.js.org/docs/api/combineReducers.html)函数来进行reducer 组合而不是创建多个 `store`。

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

2. 通过`<Provider>` 标签将`store`传入组件，在`props`中可以取得传入的值

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

#### Component/views

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



### 中间件

但是，一个关键问题没有解决：异步操作怎么办？`Action` 发出以后，`Reducer` 立即算出 `State`，这叫做同步；`Action` 发出以后，过一段时间再执行 `Reducer`，这就是异步。

怎么才能 Reducer 在异步操作结束后自动执行呢？这就要用到新的工具：中间件（`middleware`）。

#### 一、中间件的概念

为了理解中间件，让我们站在框架作者的角度思考问题：如果要添加功能，你会在哪个环节添加？

1. `Reducer`：纯函数，只承担计算 State 的功能，不合适承担其他功能，也承担不了，因为理论上，纯函数不能进行读写操作。
2. `View`：与 State 一一对应，可以看作 State 的视觉层，也不合适承担其他功能。
3. `Action`：存放数据的对象，即消息的载体，只能被别人操作，自己不能进行任何操作。

想来想去，只有发送 Action 的这个步骤，即`store.dispatch()`方法，可以添加功能。举例来说，要添加日志功能，把 Action 和 State 打印出来，可以对`store.dispatch`进行如下改造。

```js
let next = store.dispatch;
store.dispatch = function dispatchAndLog(action) {
  console.log('dispatching', action);
  next(action);
  console.log('next state', store.getState());
}
```

上面代码中，对`store.dispatch`进行了重定义，在发送 Action 前后添加了打印功能。这就是中间件的雏形。

redux默认的设定是 `dispatch` 只能接受一个对象参数，函数和promise都是不允许的，通过中间件，就可以满足传入这些参数了。

**中间件就是一个函数，对`store.dispatch`方法进行了改造，在发出 Action 和执行 Reducer 这两步之间，添加了其他功能。**

#### 二、中间件的用法

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

#### 三、applyMiddlewares

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

上面代码中，所有中间件被放进了一个数组`chain`，然后嵌套执行，最后执行`store.dispatch`。可以看到，中间件内部（`middlewareAPI`）可以拿到`getState`和`dispatch`这两个方法。



### redux-thunk

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



### redux-promise

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



### redux-actions

`redux-actions`的第一大杀器就是**`createAction`**， 他会帮助我们生成规范的`action`:

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

使用第二杀器，**`handleActions`**，这个函数就是帮助优化代码，我们的`reducer`里面显示是通过`switch case`语句去处理的，使用**`handleActions`**函数我们可以优化写法。

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



### redux-saga









实际上 redux-saga 所有的任务都通用 yield Effects 来完成。它为各项任务提供了各种 Effect 创建器，可以是：

- 调用一个异步函数；
- 发起一个 action 到 Store；
- 启动一个后台任务或者等待一个满足某些条件的未来的 action。





### 总结

- redux是一个可预测的状态容器，
- react-redux是将store和react结合起来，使得数据展示和修改对于react项目而言更简单
- redux中间件就是在dispatch action前对action做一些处理
- redux-thunk用于对异步做操作
- redux-actions用于简化redux操作
- redux-promise可以配合redux-actions用来处理Promise对象，使得异步操作更简单
- redux-saga可以起到一个控制器的作用，集中处理边际效用，并使得异步操作的写法更优雅。

## Mobx

- `react-mobx`
