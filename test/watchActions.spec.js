import { watchActions } from '../src/index'

describe('Redux Saga Watch Actions', () => {
  describe('watchActions', () => {
    it('should return an empty rootSaga', () => {
      const result = watchActions()
      expect(typeof result).toBe('function')
    })

    it('should return a rootSaga', () => {
      const actionType = 'ACTION'
      const saga = 'func'
      const result = watchActions({
        [actionType]: saga
      })
      expect(typeof result).toBe('function')
    })

    it('should return a rootSaga', () => {
      const actionType = 'ACTION'
      const saga = 'func'
      const rootSaga = watchActions({
        [actionType]: saga
      })
      const result = rootSaga()
      expect(typeof result.next).toBe('function')
    })

    it('should yield an all', () => {
      const actionType = 'ACTION'
      const saga = 'func'
      const rootSaga = watchActions({
        [actionType]: saga
      })
      const result = rootSaga().next().value
      expect(Array.isArray(result.ALL)).toBe(true)
    })

    it('should return an empty array', () => {
      const rootSaga = watchActions()
      const result = rootSaga().next().value
      const watchers = result.ALL
      expect(Array.isArray(watchers)).toBe(true)
      expect(watchers.length).toBe(0)
    })

    it.skip('should return an array of generator instances', () => {
      const actionType = 'ACTION'
      const saga = 'func'
      const rootSaga = watchActions({
        [actionType]: saga
      })
      const result = rootSaga().next().value
      const watchers = result.ALL
      expect(typeof watchers[0].next).toBe('function')
    })
  })
})
