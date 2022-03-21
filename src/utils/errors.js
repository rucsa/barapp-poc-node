import _ from 'lodash';

/**
 * A detailed error class that can be used across the entire application.
 * Inspire by the structure of errors in Java.
 * @param {String} code - Unique code
 * @param {String} message
 * @param {String} emitter - Unique id of the emitter
 * @param {Object} [args]
 * @param {Error} [causedBy]
 * @returns {Error}
 * @constructor
 */
export default function DetailedError({
  code, message, emitter, args = null, causedBy = null,
}) {
  const instance = new Error(message);

  instance.name = 'DetailedError';
  instance.code = code;
  instance.emitter = emitter;
  // TODO: Should the args be deep cloned?
  instance.args = args == null ? null : _.cloneDeep(args);

  const stack = (instance.stack || '')
    .replace(`${instance.name}: ${instance.message}`, '');

  // returns the stack with the error's code, emitter and args included
  instance.fullStack = `${instance.name}(code=${code}): ${message}
    emitter: ${emitter}
    args: ${JSON.stringify(args, null, 2)}
    ${stack}
    causedBy: ${causedBy == null ? '' : (causedBy.fullStack || causedBy.stack || causedBy.message)}`;

  Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
  if (Error.captureStackTrace) {
    Error.captureStackTrace(instance, DetailedError);
  }
  return instance;
}

DetailedError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true,
  },
});

Object.setPrototypeOf(DetailedError, Error);
