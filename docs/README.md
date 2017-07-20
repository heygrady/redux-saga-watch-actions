# redux-saga-watch-actions
Helper methods for managing sagas that respond to actions. Similar in style to [`redux-actions`](https://github.com/acdlite/redux-actions).

## Installation

```
yarn add redux-saga redux-saga-watch-actions
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

## API
- [`watchActions(sagaMap)`](./watchActions.md)
- [`createWatcher(actionType, saga)`](./createWatcher.md)


### Middleware
You might want to read about the included [middleware](./middleware/README.md).
