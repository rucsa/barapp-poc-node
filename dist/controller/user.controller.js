"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userTicketPayment = exports.registerUser = exports.registerNewOrder = exports.refillUser = exports.getUserById = exports.fetchAllUsers = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _userService = require("../services/user.service.js");

var getUserById = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(id) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _userService.getUserByIdFromDb)(id);

          case 2:
            return _context.abrupt("return", _context.sent);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getUserById(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.getUserById = getUserById;

var fetchAllUsers = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _userService.getAllUsersFromDB)();

          case 2:
            return _context2.abrupt("return", _context2.sent);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function fetchAllUsers() {
    return _ref2.apply(this, arguments);
  };
}();

exports.fetchAllUsers = fetchAllUsers;

var userTicketPayment = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(id) {
    var user, newAvailableClovers, updatedClovers;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return (0, _userService.getUserByIdFromDb)(id);

          case 2:
            user = _context3.sent;
            newAvailableClovers = Number(user.availableClovers) - 30;
            _context3.next = 6;
            return (0, _userService.payUserEntrance)(id, newAvailableClovers);

          case 6:
            updatedClovers = _context3.sent;
            return _context3.abrupt("return", updatedClovers);

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function userTicketPayment(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

exports.userTicketPayment = userTicketPayment;

var refillUser = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(id, newClovers) {
    var user, newAvailableClovers, updatedClovers;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return (0, _userService.getUserByIdFromDb)(id);

          case 2:
            user = _context4.sent;
            newAvailableClovers = Number(user.availableClovers) + Number(newClovers);
            _context4.next = 6;
            return (0, _userService.updateUserBalance)(id, newAvailableClovers);

          case 6:
            updatedClovers = _context4.sent;
            return _context4.abrupt("return", updatedClovers);

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function refillUser(_x3, _x4) {
    return _ref4.apply(this, arguments);
  };
}();

exports.refillUser = refillUser;

var registerNewOrder = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(id, total) {
    var user, newAvailableClovers, updatedClovers;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return (0, _userService.getUserByIdFromDb)(id);

          case 2:
            user = _context5.sent;
            newAvailableClovers = Number(user.availableClovers) - Number(total);
            _context5.next = 6;
            return (0, _userService.updateUserBalance)(id, newAvailableClovers);

          case 6:
            updatedClovers = _context5.sent;
            return _context5.abrupt("return", updatedClovers);

          case 8:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function registerNewOrder(_x5, _x6) {
    return _ref5.apply(this, arguments);
  };
}();

exports.registerNewOrder = registerNewOrder;

var registerUser = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(newUserData) {
    var user;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return (0, _userService.createUserInDb)(newUserData);

          case 2:
            user = _context6.sent;
            return _context6.abrupt("return", user);

          case 4:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function registerUser(_x7) {
    return _ref6.apply(this, arguments);
  };
}();

exports.registerUser = registerUser;