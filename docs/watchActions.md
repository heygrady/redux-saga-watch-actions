# API : watchActions

### `watchActions(sagaMap)`

This creates a `rootSaga` from the `sagaMap` which will use [`takeEvery`](https://redux-saga.github.io/redux-saga/docs/api/index.html#takeeverypattern-saga-args) to map actions to sagas. Internally, this calls `createWatcher()` to create a saga for each action type.

## Importing

```js
import { watchActions } from 'redux-saga-watch-actions'
```

## Example

```js
import { watchActions } from 'redux-saga-watch-actions'
import { INCREMENT, DECREMENT } from './constants'
import { increment, decrement } from './sagas'

const rootSaga = watchActions({
  [INCREMENT]: increment,
  [DECREMENT]: decrement,
})
export default rootSaga
```

#### Example sagas.js

```js
export const increment = function*(action) {
  // ... whatever you want
}

export const decrement = function*(action) {
  // ... whatever you want
}
```
