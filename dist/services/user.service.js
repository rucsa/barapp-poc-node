"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUserBalance = exports.payUserEntrance = exports.getUserByUsernameFromDb = exports.getUserByIdFromDb = exports.getAllUsersFromDB = exports.createUserInDb = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _user = _interopRequireDefault(require("../models/user.js"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var ObjectId = _mongoose["default"].Types.ObjectId;

var getAllUsersFromDB = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _user["default"].find({});

          case 2:
            return _context.abrupt("return", _context.sent);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getAllUsersFromDB() {
    return _ref.apply(this, arguments);
  };
}();

exports.getAllUsersFromDB = getAllUsersFromDB;

var getUserByIdFromDb = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(id) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _user["default"].findOne({
              _id: id
            });

          case 2:
            return _context2.abrupt("return", _context2.sent);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getUserByIdFromDb(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getUserByIdFromDb = getUserByIdFromDb;

var getUserByUsernameFromDb = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(username) {
    var user;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _user["default"].findOne({
              username: username
            });

          case 2:
            user = _context3.sent;
            return _context3.abrupt("return", user);

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function getUserByUsernameFromDb(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getUserByUsernameFromDb = getUserByUsernameFromDb;

var updateUserBalance = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(id, newCLovers) {
    var refillStatus;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _user["default"].findOneAndUpdate({
              _id: id
            }, {
              availableClovers: newCLovers
            }, {
              "new": true
            });

          case 2:
            refillStatus = _context4.sent;
            return _context4.abrupt("return", refillStatus.availableClovers);

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function updateUserBalance(_x3, _x4) {
    return _ref4.apply(this, arguments);
  };
}();

exports.updateUserBalance = updateUserBalance;

var payUserEntrance = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(id, newCLovers) {
    var refillStatus;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _user["default"].findOneAndUpdate({
              _id: id
            }, {
              availableClovers: newCLovers,
              payedTicketThisSession: true
            }, {
              "new": true
            });

          case 2:
            refillStatus = _context5.sent;
            return _context5.abrupt("return", refillStatus.availableClovers);

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function payUserEntrance(_x5, _x6) {
    return _ref5.apply(this, arguments);
  };
}();

exports.payUserEntrance = payUserEntrance;

var createUserInDb = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(user) {
    var newUser, userId, userSaved;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            newUser = new _user["default"](user);
            userId = ObjectId();
            newUser.createdAt = Date.now();
            newUser.payedTicketThisSession = false;
            newUser._id = userId;
            _context6.next = 7;
            return newUser.save().then(null, function (err) {
              throw new Error(err);
            });

          case 7:
            userSaved = _context6.sent;
            return _context6.abrupt("return", userSaved._id);

          case 9:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function createUserInDb(_x7) {
    return _ref6.apply(this, arguments);
  };
}();

exports.createUserInDb = createUserInDb;