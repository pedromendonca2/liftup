// Mock for React Native Image component
const React = require('react');

const Image = React.forwardRef((props, ref) => {
  return React.createElement('Image', { ...props, ref, testID: 'image' });
});

module.exports = Image;
module.exports.default = Image;
