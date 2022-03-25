"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSimple = exports.register = exports.login = exports.findUserByUsername = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _errors = _interopRequireDefault(require("../utils/errors.js"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _userService = require("./../services/user.service.js");

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var FILE = "src/controller/auth.controller.js"; // function isValidPassword(password) {
//   // (minimum: 1 upper char, 1 lower char, 1 special character, 1 digit)
//   return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(
//     password
//   );
// }

var findUserByUsername = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(username) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _userService.getUserByUsernameFromDb)(username);

          case 2:
            return _context.abrupt("return", _context.sent);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function findUserByUsername(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.findUserByUsername = findUserByUsername;

var register = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(newUserObj, creator) {
    var requestingUser, newUserId, plainPass;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _userService.getUserByUsernameFromDb)(newUserObj.username);

          case 2:
            requestingUser = _context2.sent;

            if (!(requestingUser != null)) {
              _context2.next = 5;
              break;
            }

            throw new _errors["default"]({
              code: "email-already-registered",
              message: "This username has already been registered!",
              inFile: FILE
            });

          case 5:
            _context2.prev = 5;

            if (newUserObj.acceessLevel == null) {
              newUserObj.acceessLevel = 'MEMBER';
            }

            plainPass = newUserObj.password;
            _context2.next = 10;
            return _bcryptjs["default"].hash(plainPass, 10);

          case 10:
            newUserObj.password = _context2.sent;
            newUserObj.createdBy = creator;
            _context2.next = 14;
            return (0, _userService.createUserInDb)(newUserObj);

          case 14:
            newUserId = _context2.sent;
            _context2.next = 20;
            break;

          case 17:
            _context2.prev = 17;
            _context2.t0 = _context2["catch"](5);
            throw new _errors["default"]({
              code: "auth.register.unknown",
              message: "Unknown error while register user for token ".concat(newUserObj.username, "!"),
              causedBy: _context2.t0,
              inFile: FILE
            });

          case 20:
            return _context2.abrupt("return", newUserId);

          case 21:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[5, 17]]);
  }));

  return function register(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

exports.register = register;

var registerSimple = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(newUserObj, creator) {
    var requestingUser, newUserId;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return (0, _userService.getUserByUsernameFromDb)(newUserObj.username);

          case 2:
            requestingUser = _context3.sent;

            if (!(requestingUser != null)) {
              _context3.next = 5;
              break;
            }

            throw new _errors["default"]({
              code: "username-already-registered",
              message: "This username has already been registered!",
              inFile: FILE
            });

          case 5:
            _context3.prev = 5;
            newUserObj.acceessLevel = 'MEMBER';
            newUserObj.createdBy = creator;
            _context3.next = 10;
            return (0, _userService.createUserInDb)(newUserObj);

          case 10:
            newUserId = _context3.sent;
            _context3.next = 16;
            break;

          case 13:
            _context3.prev = 13;
            _context3.t0 = _context3["catch"](5);
            throw new _errors["default"]({
              code: "auth.register.unknown",
              message: "Unknown error while register user for token ".concat(newUserObj.username, "!"),
              causedBy: _context3.t0,
              inFile: FILE
            });

          case 16:
            return _context3.abrupt("return", newUserId);

          case 17:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[5, 13]]);
  }));

  return function registerSimple(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

exports.registerSimple = registerSimple;

var login = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(username, password) {
    var user, match, expiresAt, expiresAtDate, token;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!(username == null || password == null)) {
              _context4.next = 2;
              break;
            }

            throw new _errors["default"]({
              code: "incomplete_credentials",
              message: "username or password missing from request.",
              inFile: FILE
            });

          case 2:
            _context4.next = 4;
            return (0, _userService.getUserByUsernameFromDb)(username);

          case 4:
            user = _context4.sent;

            if (!(user == null)) {
              _context4.next = 7;
              break;
            }

            throw new _errors["default"]({
              code: "user_not_found",
              message: "username ".concat(username, " was not found in db."),
              inFile: FILE
            });

          case 7:
            _context4.next = 9;
            return _bcryptjs["default"].compare(password, user.password);

          case 9:
            match = _context4.sent;

            if (match) {
              _context4.next = 12;
              break;
            }

            throw new _errors["default"]({
              code: "invalid_password",
              message: "invalid password for username ".concat(username),
              inFile: FILE
            });

          case 12:
            expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
            expiresAtDate = new Date(expiresAt * 1000).toISOString();
            token = _jsonwebtoken["default"].sign({
              data: {
                username: user.username,
                acceessLevel: user.acceessLevel != null ? user.acceessLevel : "MEMBER"
              },
              // 60 seconds * 60 minutes * 24 = 1 day
              expiresAt: expiresAt
            }, process.env.JWT_SECRET);
            return _context4.abrupt("return", {
              token: token,
              expiresAt: expiresAtDate
            });

          case 16:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function login(_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}(); // export const changePassword = async () => {
//   const user = await users.findByUsername(username);
//   if (user == null) {
//     throw new PrettyError({
//       code: "user_unknown",
//       message: "user not found in db.",
//       inFile: FILE,
//     });
//   }
//   if (user.password != null) {
//     const match = await bcrypt.compare(oldPass, user.password);
//     if (!match) {
//       throw new PrettyError({
//         code: "wrong_old_password",
//         message: "wrong old password",
//         inFile: FILE,
//       });
//     }
//   }
//   if (!isValidPassword(newPass)) {
//     throw new PrettyError({
//       code: "invalid_new_password",
//       message: "new password does not meet requirements",
//       inFile: FILE,
//     });
//   }
//   const encryptedPassword = await bcrypt.hash(newPass, 10);
//   try {
//     await database.update({
//       collection: "CEZY.USERS",
//       data: { PASSWORD: encryptedPassword },
//       match: {
//         username: user.username,
//       },
//     });
//   } catch (error) {
//     throw new PrettyError({
//       code: "update_error",
//       message: "error updating user in db",
//       causedBy: error,
//       inFile: FILE,
//     });
//   }
//   return user.userId;
//};


exports.login = login;