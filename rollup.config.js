import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'

var env = process.env.NODE_ENV
var config = {
  format: 'umd',
  moduleName: 'ReduxSagaWatchActions',
  exports: 'named',
  plugins: [
    nodeResolve({
      jsnext: true
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ],
  external: 'redux-saga',
  globals: {
    'redux-saga/effects': 'ReduxSaga.effects'
  }
}

if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    }, minify)
  )
}

export default config
