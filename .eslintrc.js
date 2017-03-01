const Neutrino = require('neutrino');
// const pkg = require('./package.json');
// const api = new Neutrino(pkg.config.presets);
const api = new Neutrino(['neutrino-preset-standard', 'neutrino-preset-node']);

module.exports = api.custom.eslintrc();
