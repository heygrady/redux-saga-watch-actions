import { watchNextAction } from '../src/index'

describe('Redux Saga Watch Actions', () => {
  describe('createWatcher', () => {
    it('should return a function (empty args', () => {
      const result = watchNextAction()
      expect(typeof result).toBe('function')
    })

    it('should return a generator function (that returns a take effect)', () => {
      const actionType = 'ACTION'
      const watcher = watchNextAction(actionType)
      const gen = watcher()
      const effect = gen.next().value
      const result = effect.payload.pattern
      expect(result).toBe(actionType)
    })

    it('should ignore bad sagas', () => {
      const actionType = 'ACTION'
      const saga = 'func'
      const watcher = watchNextAction(actionType, saga)
      const gen = watcher()
      gen.next()
      const result = gen.next().done
      expect(result).toBe(true)
    })

    it('should fork saga', () => {
      const actionType = 'ACTION'
      const saga = jest.fn()
      const watcher = watchNextAction(actionType, saga)
      const gen = watcher()
      gen.next()
      const effect = gen.next().value
      const result = effect.payload.fn
      expect(result).toBe(saga)
    })
  })
})
