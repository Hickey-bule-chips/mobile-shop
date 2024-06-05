import webpack from "node-polyfill-webpack-plugin";

module.exports = {
  resolve: {
    fallback: {
      os: require.resolve("os-browserify/browser"),
    },
  },
};
