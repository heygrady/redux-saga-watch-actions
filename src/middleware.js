import invariant from 'tiny-invariant'

export const createCancelTask = (tasks) => (key) => {
  if (!tasks[key]) {
    return
  }
  const { task } = tasks[key]
  if (!task) {
    return
  }

  const result = task.cancel()
  delete tasks[key]
  return result
}

export const createCancelAllTasks = (tasks, cancelTask) => () =>
  Object.keys(tasks).map((key) => cancelTask(key))

export const createInjectSaga = (tasks, cancelTask, runSaga) => ({
  key,
  saga,
  args,
} = {}) => {
  invariant(key, 'injectSaga expects a key option to identify this saga')
  invariant(
    saga,
    'injectSaga expects a saga option to specify which saga to run'
  )
  invariant(
    args === undefined || Array.isArray(args),
    'injectSaga expects args option to be undefined or an array of args'
  )

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

  const alreadyRunning =
    task && typeof task.isRunning === 'function' ? task.isRunning() : false

  if (task === undefined || !alreadyRunning) {
    task = args ? runSaga(saga, args) : runSaga(saga)
    tasks[key] = {
      task,
      prevSaga: saga,
    }
  }
  return task
}

const createSagaMiddlewareHelpers = (sagaMiddleware, tasks = {}) => {
  invariant(
    sagaMiddleware && typeof sagaMiddleware.run === 'function',
    'createSagaMiddlewareHelpers expects a sagaMiddleware to include a run method'
  )
  const runSaga = (...args) => sagaMiddleware.run(...args)
  const cancelTask = createCancelTask(tasks)
  const cancelAllTasks = createCancelAllTasks(tasks, cancelTask)
  const injectSaga = createInjectSaga(tasks, cancelTask, runSaga)

  return { cancelAllTasks, cancelTask, injectSaga, runSaga }
}

export default createSagaMiddlewareHelpers
