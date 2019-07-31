import { createInjectSaga } from '../../src/middleware'

describe('Redux Saga Watch Actions', () => {
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
        isRunning: jest.fn().mockImplementation(() => true),
      }
      cancelTask = jest.fn()
      runSaga = jest.fn().mockImplementation((saga) => task)
    })

    it('should throw (no nothing)', () => {
      injectSaga = createInjectSaga(tasks, cancelTask, runSaga)
      expect(injectSaga).toThrow()
    })

    it('should throw (no key)', () => {
      injectSaga = createInjectSaga(tasks, cancelTask, runSaga)
      expect(() => injectSaga({ saga })).toThrow(/key/)
    })

    it('should throw (no saga)', () => {
      injectSaga = createInjectSaga(tasks, cancelTask, runSaga)
      expect(() => injectSaga({ key })).toThrow(/saga/)
    })

    it('should throw (bad args)', () => {
      injectSaga = createInjectSaga(tasks, cancelTask, runSaga)
      expect(() => injectSaga({ key, saga, args: true })).toThrow(/args/)
    })

    it('should return a task', () => {
      injectSaga = createInjectSaga(tasks, cancelTask, runSaga)
      const result = injectSaga({ key, saga })
      expect(result).toBe(task)
    })

    it('should allow args', () => {
      tasks = { [key]: { task, prevSaga: saga } }
      injectSaga = createInjectSaga(tasks, cancelTask, runSaga)
      injectSaga({ key, saga, args: [] })
      expect(cancelTask).not.toBeCalled()
    })

    it('should not cancel a task', () => {
      tasks = { [key]: { task, prevSaga: saga } }
      injectSaga = createInjectSaga(tasks, cancelTask, runSaga)
      injectSaga({ key, saga })
      expect(cancelTask).not.toBeCalled()
    })

    it('should cancel a task', () => {
      tasks = { [key]: { task, prevSaga: saga } }
      injectSaga = createInjectSaga(tasks, cancelTask, runSaga)
      const newSaga = () => {}
      injectSaga({ key, saga: newSaga })
      expect(cancelTask).toBeCalled()
    })

    it('should not update the task', () => {
      tasks = { [key]: { task, prevSaga: saga } }
      injectSaga = createInjectSaga(tasks, cancelTask, runSaga)
      injectSaga({ key, saga })
      expect(tasks[key].prevSaga).toBe(saga)
    })

    it('should update the task', () => {
      tasks = { [key]: { task, prevSaga: saga } }
      injectSaga = createInjectSaga(tasks, cancelTask, runSaga)
      const newSaga = () => {}
      injectSaga({ key, saga: newSaga })
      expect(tasks[key].prevSaga).toBe(newSaga)
    })

    it('should not rerun the saga', () => {
      tasks = { [key]: { task, prevSaga: saga } }
      injectSaga = createInjectSaga(tasks, cancelTask, runSaga)
      injectSaga({ key, saga })
      expect(runSaga).not.toBeCalled()
    })

    it('should rerun the saga', () => {
      task = {
        cancel: jest.fn(),
        isRunning: jest.fn().mockImplementation(() => false),
      }
      tasks = { [key]: { task, prevSaga: saga } }
      injectSaga = createInjectSaga(tasks, cancelTask, runSaga)
      injectSaga({ key, saga })
      expect(runSaga).toBeCalled()
    })
  })
})
