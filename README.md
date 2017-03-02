# redux-saga-watch-actions
Helper methods for managing sagas that respond to actions. Similar in style to [`redux-actions`](https://github.com/acdlite/redux-actions).

## Installation

```
yarn add redux-saga redux-saga-watch-actions
```

*NOTE:* [`redux-saga`](https://github.com/redux-saga/redux-saga) must be installed as a peer dependency.

## Example Usage

Below is an example usage that matches closely to the `fetchUser` [example in the redux-saga readme](https://github.com/redux-saga/redux-saga#sagasjs).

```js
import { watchActions } from 'redux-saga-watch-actions'

// compare to the example from the redux-saga manual
// @see https://github.com/redux-saga/redux-saga#sagasjs
import { call, put } from 'redux-saga/effects'
import Api from '...'

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
const fetchUser = function * (action) {
   try {
      const user = yield call(Api.fetchUser, action.payload.userId);
      yield put({type: "USER_FETCH_SUCCEEDED", user: user});
   } catch (e) {
      yield put({type: "USER_FETCH_FAILED", message: e.message});
   }
}

/*
  Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
  Allows concurrent fetches of user.
*/
const mySaga = watchActions({
  ["USER_FETCH_REQUESTED"]: fetchUser
})

export default mySaga
```

### What does `watchActions` do?
It's a convenience method that removes the boilerplate of having to use [`takeEvery`](https://redux-saga.github.io/redux-saga/docs/api/index.html#takeeverypattern-saga-args) to hook your saga up to actions.

```js
import { takeEvery } from 'redux-saga/effects'
import { watchActions } from 'redux-saga-watch-actions'

// grab action constants and sagas from your app
import { INCREMENT, DECREMENT } from './constants'
import { increment, decrement } from './sagas'

// without watch actions
const rootSaga = function * () {
  yield [
    takeEvery(INCREMENT, increment),
    takeEvery(DECREMENT, decrement)
  ]
}

// with watch actions
// compare to handleActions
// @see https://github.com/acdlite/redux-actions#handleactionsreducermap-defaultstate
const rootSaga = watchActions({
  [INCREMENT]: increment,
  [DECREMENT]: decrement
})
```

## Usage
### `watchActions(sagaMap)`

```js
import { watchActions } from 'redux-saga-watch-actions'
```

This creates a `rootSaga` from the `sagaMap` which will use [`takeEvery`](https://redux-saga.github.io/redux-saga/docs/api/index.html#takeeverypattern-saga-args) to map actions to sagas. Internally, this calls `createWatcher()` to create a saga for each action type.

```js
import { watchActions } from 'redux-saga-watch-actions'
import { INCREMENT, DECREMENT } from './constants'
import { increment, decrement } from './sagas'

const rootSaga = watchActions({
  [INCREMENT]: increment,
  [DECREMENT]: decrement
})
export default rootSaga
```

### `createWatcher(actionType, saga)`

```js
import { createWatcher } from 'redux-saga-watch-actions'
```

You don't normally need to call `createWatcher` yourself. Used internally by `watchActions`. Returns a generator function that uses `takeEvery(actionType, saga)` to respond to dispatched actions. Compare to `mySaga` in the [redux-saga usage example](https://github.com/redux-saga/redux-saga#sagasjs).

```js
import { createWatcher } from 'redux-saga-watch-actions'
import { INCREMENT } from './constants'
import { increment } from './sagas'

const mySaga = createWatcher(INCREMENT, increment)
export default mySaga
```

### Middleware
You might want to read about the included [middleware](https://github.com/heygrady/redux-saga-watch-actions/blob/master/docs/middleware.md).
