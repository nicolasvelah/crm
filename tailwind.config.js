module.exports = {
  important: true,
  purge: [
    './src/**/*.html',
    './src/**/*.vue',
    './src/**/*.jsx',
    './src/**/*.tsx',
  ],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
  corePlugins: {
    backgroundAttachment: false,
    skew: false,
    // opacity: false,
    borderCollapse: false,
    borderRadius: false,
    borderWidth: false,
    // borderColor: false,
    // borderOpacity: false,
    // borderStyle: false,
    // divideWidth: false,
    divideColor: false,
    // divideOpacity: false,
    divideStyle: false,
    backgroundImage: false,
    gradientColorStops: false,
    backgroundSize: false,
    backgroundRepeat: false,
    backgroundPosition: false,
    backgroundColor: false,
    backgroundClip: false,
    lineHeight: false,
    fontFamily: false,
  }
};
