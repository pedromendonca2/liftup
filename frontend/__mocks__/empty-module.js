// Empty module mock for problematic Expo imports
module.exports = {};

// Also support default export
module.exports.default = {};

// Mock any potential polyfill functions
if (typeof module.exports.polyfillGlobal === 'undefined') {
  module.exports.polyfillGlobal = () => {};
}
