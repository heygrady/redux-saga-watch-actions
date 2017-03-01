module.exports = neutrino => {
  neutrino.config.module
    .rule('compile')
    .loader('babel', ({ options }) => {
      options.presets[0][1].targets.node = 4.2
      return { options }
    })
}
