"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateSessionInDB = exports.isActiveSession = exports.getActiveSessionFromDB = exports.createNewSessionInDB = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _session = _interopRequireDefault(require("../models/session.js"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var ObjectId = _mongoose["default"].Types.ObjectId;

var isActiveSession = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var activeSessions;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _session["default"].find({
              active: true
            }).exec();

          case 2:
            activeSessions = _context.sent;

            if (!(activeSessions.length === 0)) {
              _context.next = 5;
              break;
            }

            return _context.abrupt("return", false);

          case 5:
            if (!(activeSessions.length > 1)) {
              _context.next = 9;
              break;
            }

            return _context.abrupt("return", 'error');

          case 9:
            return _context.abrupt("return", true);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function isActiveSession() {
    return _ref.apply(this, arguments);
  };
}();

exports.isActiveSession = isActiveSession;

var getActiveSessionFromDB = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var activeSessions;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _session["default"].find({
              active: true
            }).sort({
              createdAt: -1
            }).exec();

          case 2:
            activeSessions = _context2.sent;

            if (!(activeSessions.length === 0)) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt("return", null);

          case 7:
            return _context2.abrupt("return", activeSessions[0]);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getActiveSessionFromDB() {
    return _ref2.apply(this, arguments);
  };
}();

exports.getActiveSessionFromDB = getActiveSessionFromDB;

var createNewSessionInDB = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(sessionData) {
    var newSession, sessionId, expirationDate, sessionCreated;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            newSession = new _session["default"](sessionData);
            sessionId = ObjectId();
            newSession._id = sessionId;
            newSession.createdAt = Date.now();
            expirationDate = new Date();
            expirationDate.setTime(Date.now() + 30 * 60 * 60 * 1000);
            newSession.expiresAt = expirationDate;
            newSession.active = true;
            _context3.next = 10;
            return newSession.save().then(null, function (err) {
              throw new Error(err);
            });

          case 10:
            sessionCreated = _context3.sent;
            return _context3.abrupt("return", newSession);

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function createNewSessionInDB(_x) {
    return _ref3.apply(this, arguments);
  };
}();

exports.createNewSessionInDB = createNewSessionInDB;

var updateSessionInDB = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(sessionData) {
    var updateStatus;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _session["default"].findOneAndUpdate({
              active: true
            }, sessionData, {
              "new": true
            });

          case 2:
            updateStatus = _context4.sent;
            return _context4.abrupt("return", sessionData);

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function updateSessionInDB(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

exports.updateSessionInDB = updateSessionInDB;