import _ from 'lodash';

/**
 * A detailed error class that can be used across the entire application.
 * Inspire by the structure of errors in Java.
 * @param {String} code - Unique code
 * @param {String} message
 * @param {Number} status
 * @param {String} inFile - Unique id of the inFile
 * @param {Object} [args]
 * @param {Error} [causedBy]
 * @returns {Error}
 * @constructor
 */
export default function PrettyError({
  code, message, status, inFile, args = null, causedBy = null,
}) {
  const instance = new Error(message);

  instance.name = 'PrettyError';
  instance.code = code;
  instance.inFile = inFile;
  instance.status = status;
  instance.args = args == null ? null : _.cloneDeep(args);

  const stack = (instance.stack || '')
    .replace(`${instance.name}: ${instance.message}`, '');

  // returns the stack with the error's code, inFile and args included
  instance.fullStack = `${instance.name}(code=${code}): ${message}
    status: ${status}
    inFile: ${inFile}
    args: ${JSON.stringify(args, null, 2)}
    ${stack}
    causedBy: ${causedBy == null ? '' : (causedBy.fullStack || causedBy.stack || causedBy.message)}`;

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
    configurable: true,
  },
});

Object.setPrototypeOf(PrettyError, Error);
