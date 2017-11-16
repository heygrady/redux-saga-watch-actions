# redux-saga-watch-actions
Helper methods for managing sagas that respond to actions. Similar in style to [`redux-actions`](https://github.com/acdlite/redux-actions). An alternate take on [redux-loop](https://github.com/redux-loop/redux-loop).

Whereas `handleActions` maps actions to reducer functions, `watchActions` maps actions to sagas.

## Installation

```bash
yarn add redux-saga redux-saga-watch-actions
```

**NOTE:** [`redux-saga`](https://github.com/redux-saga/redux-saga) must be installed as a peer dependency.

## Docs

- https://heygrady.github.io/redux-saga-watch-actions/

## Example

Below is a simple example of using `watchActions`. You can see that it is used to create a `rootSaga` that uses [`takeEvery`](https://redux-saga.js.org/docs/api/#takeeverypattern-saga-args) to call a saga every time a specific action is dispatched.

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

## Comparison to `handleActions`

Below you can see a *reducer* being created with [`handleActions`](https://redux-actions.js.org/docs/api/handleAction.html#handleactions). Reducers and saga do very different things, however, they are similar in that a reducer function expects to be called whenever a specific action is dispatched.

```js
import { handleActions } from 'redux-actions'
import { INCREMENT, DECREMENT } from './constants'
import { increment, decrement } from './reducers'

const reducer = handleActions({
  [INCREMENT]: increment,
  [DECREMENT]: decrement
})
export default reducer
```

## Rewritten example from redux-saga

The example below closely matches the `fetchUser` [example in the redux-saga readme](https://github.com/redux-saga/redux-saga#sagasjs). We've used `watchActions` to create the `takeEvery` rootSaga

```js
import { watchActions } from 'redux-saga-watch-actions'
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

const mySaga = watchActions({
  ["USER_FETCH_REQUESTED"]: fetchUser
})

export default mySaga
```

### What does `watchActions` do?
It's a convenience method that removes the boilerplate of having to use [`takeEvery`](https://redux-saga.github.io/redux-saga/docs/api/index.html#takeeverypattern-saga-args) to hook your saga up to actions.

## Example: without `watchActions`

It's illuminating to see an example without using `watchActions`. Below you can see the basics of what `watchActions` does using vanilla redux-saga boilerplate. We are creating a `rootSaga` that will capture certain dispatched actions and feed them into a generator function. If you've used redux-saga, you've probably done something similar before.

```js
import { all, takeEvery } from 'redux-saga/effects'

import { runSaga } from './store/sagas'

// grab action constants and sagas from your app
import { INCREMENT, DECREMENT } from './constants'
import { increment, decrement } from './sagas'

// without watch actions
const rootSaga = function * () {
  yield all([
    takeEvery(INCREMENT, increment),
    takeEvery(DECREMENT, decrement)
  ])
}

runSaga(rootSaga)
```

## Example: with `watchActions`

How does `watchActions` make things easier? It doesn't, really. The `watchActions` function is a convenience method. It allows you to quickly create a root saga that marries actions to sagas, similar to how redux marries actions to reducers. The benefit is conceptual parity with [`handleActions`](https://redux-actions.js.org/docs/api/handleAction.html#handleactions) from redux-actions. Whereas `handleActions` maps actions to reducer functions, `watchActions` maps actions to sagas.

```js
import { watchActions } from 'redux-saga-watch-actions'

import { runSaga } from './store/sagas'

// grab action constants and sagas from your app
import { INCREMENT, DECREMENT } from './constants'
import { increment, decrement } from './sagas'

// with watch actions
const rootSaga = watchActions({
  [INCREMENT]: increment,
  [DECREMENT]: decrement
})

runSaga(rootSaga)
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
You might want to read about the included [middleware](./docs/middleware/README.md).
