import createSagaMiddlewareHelpers from '../../src/middleware'

describe('Redux Saga Watch Actions', () => {
  describe('createSagaMiddlewareHelpers', () => {
    let sagaMiddleware
    beforeEach(() => {
      sagaMiddleware = {
        run: jest.fn()
      }
    })

    it('should return an object', () => {
      const result = createSagaMiddlewareHelpers(sagaMiddleware)
      expect(typeof result).toBe('object')
    })

    it('should contain cancelTask', () => {
      const { cancelTask } = createSagaMiddlewareHelpers(sagaMiddleware)
      expect(typeof cancelTask).toBe('function')
    })

    it('should contain injectSaga', () => {
      const { injectSaga } = createSagaMiddlewareHelpers(sagaMiddleware)
      expect(typeof injectSaga).toBe('function')
    })

    it('should contain runSaga', () => {
      const { runSaga } = createSagaMiddlewareHelpers(sagaMiddleware)
      expect(typeof runSaga).toBe('function')
    })

    it('should bind runSaga to sagaMiddleware', () => {
      const { runSaga } = createSagaMiddlewareHelpers(sagaMiddleware)
      runSaga()
      expect(sagaMiddleware.run).toBeCalled()
    })
  })
})
