import invariant from 'invariant'

export const createCancelTask = tasks => key => {
  if (!tasks[key]) { return }
  const { task } = tasks[key]
  if (task) { task.cancel() }
  delete tasks[key]
}

export const createInjectSaga = (runSaga, cancelTask, tasks) => ({ key, saga, args } = {}) => {
  invariant(key, 'a key required')
  invariant(saga, 'a saga required')
  invariant(args === undefined || Array.isArray(args), 'args should be undefined or an array of args')

  let task
  let prevSaga

  if (tasks[key]) {
    task = tasks[key].task
    prevSaga = tasks[key].prevSaga
  }

  if (task && prevSaga !== saga) {
    cancelTask(key)
    task = undefined
  }

  if (!task || !task.isRunning()) {
    task = runSaga(saga, ...args)
    tasks[key] = {
      task,
      prevSaga: saga
    }
  }
  return task
}

const createSagaMiddlewareHelpers = (runSaga, tasks = {}) => {
  const cancelTask = createCancelTask(tasks)
  const injectSaga = createInjectSaga(runSaga, cancelTask, tasks)
  return { injectSaga, cancelTask }
}

export default createSagaMiddlewareHelpers
