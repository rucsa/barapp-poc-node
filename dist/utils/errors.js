"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = PrettyError;

var _lodash = _interopRequireDefault(require("lodash"));

/**
 * A detailed error class that can be used across the entire application.
 * Inspire by the structure of errors in Java.
 * @param {String} code - Unique code
 * @param {String} message
 * @param {String} inFile - Unique id of the inFile
 * @param {Object} [args]
 * @param {Error} [causedBy]
 * @returns {Error}
 * @constructor
 */
function PrettyError(_ref) {
  var code = _ref.code,
      message = _ref.message,
      inFile = _ref.inFile,
      _ref$args = _ref.args,
      args = _ref$args === void 0 ? null : _ref$args,
      _ref$causedBy = _ref.causedBy,
      causedBy = _ref$causedBy === void 0 ? null : _ref$causedBy;
  var instance = new Error(message);
  instance.name = 'PrettyError';
  instance.code = code;
  instance.inFile = inFile; // TODO: Should the args be deep cloned?

  instance.args = args == null ? null : _lodash["default"].cloneDeep(args);
  var stack = (instance.stack || '').replace("".concat(instance.name, ": ").concat(instance.message), ''); // returns the stack with the error's code, inFile and args included

  instance.fullStack = "".concat(instance.name, "(code=").concat(code, "): ").concat(message, "\n    inFile: ").concat(inFile, "\n    args: ").concat(JSON.stringify(args, null, 2), "\n    ").concat(stack, "\n    causedBy: ").concat(causedBy == null ? '' : causedBy.fullStack || causedBy.stack || causedBy.message);
  Object.setPrototypeOf(instance, Object.getPrototypeOf(this));

  if (Error.captureStackTrace) {
    Error.captureStackTrace(instance, PrettyError);
  }

  return instance;
}

PrettyError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
});
Object.setPrototypeOf(PrettyError, Error);