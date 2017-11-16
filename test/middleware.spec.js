import createSagaMiddlewareHelpers, { createCancelTask, createInjectSaga } from '../src/middleware'

describe('Redux Saga Watch Actions', () => {
  describe('createCancelTask', () => {
    it('should return a function', () => {
      const result = createCancelTask()
      expect(typeof result).toBe('function')
    })
  })

  describe('cancelTask', () => {
    let tasks
    let task
    let cancelTask
    const key = 'test'
    const prevSaga = () => {}

    beforeEach(() => {
      tasks = {}
      task = {
        cancel: jest.fn()
      }
      cancelTask = createCancelTask(tasks)
    })

    it('should return undefined (no key)', () => {
      const result = cancelTask()
      expect(result).toBeUndefined()
    })

    it('should return undefined (missing key)', () => {
      const result = cancelTask(key)
      expect(result).toBeUndefined()
    })

    it('should not call task.cancel', () => {
      tasks[key] = { task: undefined, prevSaga }
      cancelTask(key)
      expect(task.cancel).not.toBeCalled()
    })

    it('should call task.cancel', () => {
      tasks[key] = { task, prevSaga }
      cancelTask(key)
      expect(task.cancel).toBeCalled()
    })

    it('should delete task', () => {
      tasks[key] = { task, prevSaga }
      cancelTask(key)
      expect(tasks[key]).toBeUndefined()
    })
  })

  describe('createInjectSaga', () => {
    it('should return a function', () => {
      const result = createInjectSaga()
      expect(typeof result).toBe('function')
    })
  })

  describe('injectSaga', () => {
    let cancelTask
    let injectSaga
    let runSaga
    let tasks
    let task
    const key = 'test'
    const saga = () => {}

    beforeEach(() => {
      tasks = {}
      task = {
        cancel: jest.fn(),
        isRunning: jest.fn().mockImplementation(() => true)
      }
      cancelTask = jest.fn()
      runSaga = jest.fn().mockImplementation(saga => task)
    })

    it('should throw (no nothing)', () => {
      injectSaga = createInjectSaga(runSaga, cancelTask, tasks)
      expect(injectSaga).toThrow()
    })

    it('should throw (no key)', () => {
      injectSaga = createInjectSaga(runSaga, cancelTask, tasks)
      expect(() => injectSaga({ saga })).toThrow(/key/)
    })

    it('should throw (no saga)', () => {
      injectSaga = createInjectSaga(runSaga, cancelTask, tasks)
      expect(() => injectSaga({ key })).toThrow(/saga/)
    })

    it('should throw (bad args)', () => {
      injectSaga = createInjectSaga(runSaga, cancelTask, tasks)
      expect(() => injectSaga({ key, saga, args: true })).toThrow(/args/)
    })

    it('should return a task', () => {
      injectSaga = createInjectSaga(runSaga, cancelTask, tasks)
      const result = injectSaga({ key, saga })
      expect(result).toBe(task)
    })

    it('should allow args', () => {
      tasks = { [key]: { task, prevSaga: saga } }
      injectSaga = createInjectSaga(runSaga, cancelTask, tasks)
      injectSaga({ key, saga, args: [] })
      expect(cancelTask).not.toBeCalled()
    })

    it('should not cancel a task', () => {
      tasks = { [key]: { task, prevSaga: saga } }
      injectSaga = createInjectSaga(runSaga, cancelTask, tasks)
      injectSaga({ key, saga })
      expect(cancelTask).not.toBeCalled()
    })

    it('should cancel a task', () => {
      tasks = { [key]: { task, prevSaga: saga } }
      injectSaga = createInjectSaga(runSaga, cancelTask, tasks)
      const newSaga = () => {}
      injectSaga({ key, saga: newSaga })
      expect(cancelTask).toBeCalled()
    })

    it('should not update the task', () => {
      tasks = { [key]: { task, prevSaga: saga } }
      injectSaga = createInjectSaga(runSaga, cancelTask, tasks)
      injectSaga({ key, saga })
      expect(tasks[key].prevSaga).toBe(saga)
    })

    it('should update the task', () => {
      tasks = { [key]: { task, prevSaga: saga } }
      injectSaga = createInjectSaga(runSaga, cancelTask, tasks)
      const newSaga = () => {}
      injectSaga({ key, saga: newSaga })
      expect(tasks[key].prevSaga).toBe(newSaga)
    })

    it('should not rerun the saga', () => {
      tasks = { [key]: { task, prevSaga: saga } }
      injectSaga = createInjectSaga(runSaga, cancelTask, tasks)
      injectSaga({ key, saga })
      expect(runSaga).not.toBeCalled()
    })

    it('should rerun the saga', () => {
      task = {
        cancel: jest.fn(),
        isRunning: jest.fn().mockImplementation(() => false)
      }
      tasks = { [key]: { task, prevSaga: saga } }
      injectSaga = createInjectSaga(runSaga, cancelTask, tasks)
      injectSaga({ key, saga })
      expect(runSaga).toBeCalled()
    })
  })

  describe('createSagaMiddlewareHelpers', () => {
    it('should return an object', () => {
      const result = createSagaMiddlewareHelpers()
      expect(typeof result).toBe('object')
    })

    it('should contain cancelTask', () => {
      const { cancelTask } = createSagaMiddlewareHelpers()
      expect(typeof cancelTask).toBe('function')
    })

    it('should contain injectSaga', () => {
      const { injectSaga } = createSagaMiddlewareHelpers()
      expect(typeof injectSaga).toBe('function')
    })
  })
})
