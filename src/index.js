import { takeEvery } from 'redux-saga/effects'

export const createWatcher = (actionType, saga) => {
  return function * () {
    yield takeEvery(actionType, saga)
  }
}

export const watchActions = (sagas) => {
  const watchers = Object.keys(sagas)
    .map(actionType => createWatcher(actionType, sagas[actionType])())
  return function * rootSaga () {
    yield watchers
  }
}
