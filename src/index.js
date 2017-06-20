import { all, takeEvery } from 'redux-saga/effects'

export const createWatcher = (actionType, saga) => {
  return function * () {
    yield takeEvery(actionType, saga)
  }
}

export const createWatchers = (sagas = {}) => Object.keys(sagas)
  .map(actionType =>
    createWatcher(actionType, sagas[actionType])()
  )

export const watchActions = (sagas) => {
  const watchers = createWatchers(sagas)
  return function * rootSaga () {
    yield all(watchers)
  }
}

export default watchActions
