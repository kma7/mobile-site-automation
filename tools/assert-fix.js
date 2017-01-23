const AssertTryCatch = function () {
  return new Proxy( this, {
    get: function (rcvr, p) {
      return function (...args) {
        return rcvr.__noSuchMethod__.call(rcvr, p, args);
      }
    }
  });
}

AssertTryCatch.prototype.__noSuchMethod__ = function (method, options) {
  const internalAssert = require("chai").assert
  let output
  try {
    output = internalAssert[method].apply(this, options)
  } catch (e) {
    output = new Error(e.message)
  }
  return output
}

module.exports = new AssertTryCatch();