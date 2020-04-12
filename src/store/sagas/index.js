import { takeEvery, takeLatest, put, take, fork, call, delay, cancel, cancelled, all, race } from 'redux-saga/effects'

export function* getSagaData(action) {
  try {
    console.log('action:', action);   // views中发送的action对象
    yield delay(2000);
    yield put({
      type: 'GET_SAGA_DATA',
      payload: {
        data: [1, 2, 8888]
      }
    });
    yield put({
      type: 'ADD_SAGA_ITEM'
    })
  } catch (e) {
    console.log(e)
  }
}

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
  yield cancel(forkTask);
  console.log('已取消')
}

export default function* watchActionSagaReducer() {
  // 直接获取数据, 点击多少次就触发多少次
  yield takeEvery('TAKEEVERY_DATA', getSagaData);

  // 在一定时间里重复点击很多次，只要还没返回，则后一次的action会覆盖前一次，导致前一次中断。所以只会执行最后一次action
  yield takeLatest('TAKELATEST_DATA', getSagaData);

  // 延时获取数据，在获取数据的中间，可以使用cancel(task)来中断请求
  yield takeEvery('DELAY_GET_DATA', getDelayData);

  // num++， 加了一个延迟， 点击多少次，就会执行多少次，任务存在队列中
  yield takeEvery('ADD_SAGA_NUM', function* (action) {
    yield delay(2000);
    console.log(action);
    yield put({
      type: 'ADD_SAGA_ITEM'
    })
  });
  // num--
  yield takeEvery('REDUCE_SAGA_NUM', function* (action) {
    yield put({
      type: 'REDUCE_SAGA_ITEM'
    })
  });

  // all、race 方法
  yield takeEvery('SAGA_ALL', function* () {
    /*
      all函数，效果类似于Promise.all函数。
      all方法的参数可以是 数组写法、也可以是对象写法
     */
    // 最后内部全执行完，需要3s
    const allPromise = yield all([
      // 等待1s
      call(function () {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(111)
          }, 1000)
        })
      }),
      // 等待3s
      call(function () {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(222)
          }, 3000)
        })
      })
    ]);
    console.log('redux-saga的all函数，3s后输出：', allPromise)
  });

  yield takeEvery('SAGA_RACE', function* () {
    /*
      race函数，效果类似于Promise.race函数。
     */
    // 最后内部谁先执行好，就输处哪个
    const racePromise = yield race([
      // 等待1s
      new Promise(resolve => {
        setTimeout(() => {
          resolve(111)
        }, 1000)
      }),
      // 等待3s
      new Promise(resolve => {
        setTimeout(() => {
          resolve(222)
        }, 3000)
      })
    ]);
    console.log('redux-saga的race函数，先执行好的输出：', racePromise)
  });

  /*
    take        阻塞
    fork函数    非阻塞
    call函数     阻塞
   */
  // 如果直接写内部内容就一直循环 相当于阻塞了下面的代码执行，所以这里使用fork函数包裹
  yield fork(function* () {
    // take加上while循环就是takeEvery， takeEvery就是语法糖
    while (true) {
      const v = yield take('ADD_WHILE_TAKE_NUM');
      console.log('take执行后返回的就是一个action对象', v);

      // fork函数 非阻塞，所以不会等内部的代码执行完，就直接执行下面的代码了
      const forkTake = yield fork(function (params) {
        return new Promise(resolve => {
          setTimeout(_ => {
            resolve({ msg: '查看fork方法是否是阻塞的', params})
          }, 3000)
        })
      }, '111参数');
      console.log('直接打印forkTake, fork函数非阻塞', forkTake);    // fork 非阻塞的，返回的是fork对象信息，函数内部的return出来的值，不能获取到
      yield put({
        type: 'ADD_SAGA_ITEM'
      });

      const callTake = yield call(function (params) {
        return new Promise(resolve => {
          setTimeout(_ => {
            resolve({ msg: '查看call方法是否是阻塞的', params})
          }, 3000)
        })
      }, '222参数');
      console.log('直接打印callTake,  call函数阻塞', callTake);    // call 是阻塞的，函数内部返回的return值、或resolve值能被外部callTale接收，我们能够获取
      yield put({
        type: 'ADD_SAGA_ITEM'
      })
    }
  });

  // 同理 take 是阻塞函数， 所以使用fork包裹
  yield fork(function* () {
    yield take('ADD_TAKE_NUM');       //阻塞
    console.log('take阻塞的，只会执行一次');
    yield put({
      type: 'ADD_SAGA_ITEM'
    });
  })
}
