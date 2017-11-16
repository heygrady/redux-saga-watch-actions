# API : createWatcher

### `createWatcher(actionType, saga)`

You don't normally need to call `createWatcher` yourself. Used internally by `watchActions`. Returns a generator function that uses `takeEvery(actionType, saga)` to respond to dispatched actions. Compare to `mySaga` in the [redux-saga usage example](https://github.com/redux-saga/redux-saga#sagasjs).

## Importing
```js
import { createWatcher } from 'redux-saga-watch-actions'
```

## Example
```js
import { createWatcher } from 'redux-saga-watch-actions'
import { INCREMENT } from './constants'
import { increment } from './sagas'

const mySaga = createWatcher(INCREMENT, increment)
export default mySaga
```
