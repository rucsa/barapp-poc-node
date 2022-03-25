"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _koa = _interopRequireDefault(require("koa"));

var _cors = _interopRequireDefault(require("@koa/cors"));

var _koaJson = _interopRequireDefault(require("koa-json"));

var _koaJwt = _interopRequireDefault(require("koa-jwt"));

var _koaBodyparser = _interopRequireDefault(require("koa-bodyparser"));

var _path = _interopRequireDefault(require("path"));

var _dotenv = require("dotenv");

var _koaRouter = _interopRequireDefault(require("koa-router"));

var _userController = require("./controller/user.controller.js");

var _productController = require("./controller/product.controller.js");

var _storageController = require("./controller/storage.controller.js");

var _sessionController = require("./controller/session.controller.js");

var _authController = require("./controller/auth.controller.js");

var _connect = _interopRequireDefault(require("./db/connect.js"));

(0, _connect["default"])();
(0, _dotenv.config)({
  path: _path["default"].resolve(".env")
});
var app = new _koa["default"]();
var router = new _koaRouter["default"]();
app.use( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(ctx, next) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return next();

          case 3:
            _context.next = 10;
            break;

          case 5:
            _context.prev = 5;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            ctx.status = _context.t0.status || 500;
            ctx.body = _context.t0.message;

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 5]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
app.use((0, _koaJson["default"])());
app.use((0, _koaBodyparser["default"])());
app.use((0, _cors["default"])()); // auth middleware

app.use((0, _koaJwt["default"])({
  secret: process.env.JWT_SECRET
}).unless({
  path: ["/auth/login"]
}));
router.post("/register", /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(ctx) {
    var _registerUser;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;

            if (!(ctx.$user.accessLevel === "ADMIN")) {
              _context2.next = 9;
              break;
            }

            _context2.next = 4;
            return (0, _authController.register)(ctx.request.body.newUser, ctx.$user.username);

          case 4:
            _registerUser = _context2.sent;
            ctx.status = 200;
            ctx.body = {
              userId: _registerUser
            };
            _context2.next = 10;
            break;

          case 9:
            ctx.status = 401;

          case 10:
            _context2.next = 16;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](0);
            ctx.status = 500;
            ctx.body = _context2.t0;

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 12]]);
  }));

  return function (_x3) {
    return _ref2.apply(this, arguments);
  };
}()), router.post("/register-simple", /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(ctx) {
    var _registerUser2;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;

            if (!(ctx.$user.accessLevel === "ADMIN" || ctx.$user.accessLevel === "STAFF")) {
              _context3.next = 9;
              break;
            }

            _context3.next = 4;
            return (0, _authController.registerSimple)(ctx.request.body.newUser, ctx.$user.username);

          case 4:
            _registerUser2 = _context3.sent;
            ctx.status = 200;
            ctx.body = {
              userId: _registerUser2
            };
            _context3.next = 10;
            break;

          case 9:
            ctx.status = 401;

          case 10:
            _context3.next = 16;
            break;

          case 12:
            _context3.prev = 12;
            _context3.t0 = _context3["catch"](0);
            ctx.body = _context3.t0;
            ctx.status = 500;

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 12]]);
  }));

  return function (_x4) {
    return _ref3.apply(this, arguments);
  };
}()), router.post("/auth/login", /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(ctx) {
    var userLoging;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return (0, _authController.login)(ctx.request.body.username, ctx.request.body.password);

          case 3:
            userLoging = _context4.sent;
            ctx.status = 200;
            ctx.body = userLoging;
            _context4.next = 12;
            break;

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4["catch"](0);
            ctx.body = _context4.t0;
            ctx.status = 500;

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 8]]);
  }));

  return function (_x5) {
    return _ref4.apply(this, arguments);
  };
}()), router.get("/auth/user", /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(ctx) {
    var user;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            try {
              user = ctx.$user;
              delete user.password;
              ctx.status = 200;
              ctx.body = user;
            } catch (error) {
              ctx.body = error;
              ctx.status = 500;
            }

          case 1:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x6) {
    return _ref5.apply(this, arguments);
  };
}()), router.get("/session/status", /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(ctx) {
    var session;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return (0, _sessionController.sessionExists)();

          case 3:
            session = _context6.sent;
            ctx.status = 200;
            ctx.body = {
              status: session
            };
            _context6.next = 12;
            break;

          case 8:
            _context6.prev = 8;
            _context6.t0 = _context6["catch"](0);
            ctx.body = _context6.t0;
            ctx.status = 500;

          case 12:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 8]]);
  }));

  return function (_x7) {
    return _ref6.apply(this, arguments);
  };
}());
router.get("/session/get-active", /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(ctx) {
    var session;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            _context7.next = 3;
            return (0, _sessionController.getActiveSession)();

          case 3:
            session = _context7.sent;
            ctx.status = 200;
            ctx.body = {
              session: session
            };
            _context7.next = 12;
            break;

          case 8:
            _context7.prev = 8;
            _context7.t0 = _context7["catch"](0);
            ctx.body = _context7.t0;
            ctx.status = 500;

          case 12:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 8]]);
  }));

  return function (_x8) {
    return _ref7.apply(this, arguments);
  };
}());
router.post("/session/new", /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(ctx) {
    var session;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return (0, _sessionController.activateNewSession)(ctx.request.body.sessionData);

          case 3:
            session = _context8.sent;
            ctx.status = 200;
            ctx.body = session;
            _context8.next = 12;
            break;

          case 8:
            _context8.prev = 8;
            _context8.t0 = _context8["catch"](0);
            ctx.body = _context8.t0;
            ctx.status = 500;

          case 12:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 8]]);
  }));

  return function (_x9) {
    return _ref8.apply(this, arguments);
  };
}());
router.post("/session/update", /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(ctx) {
    var session;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            _context9.next = 3;
            return (0, _sessionController.updateActiveSession)(ctx.request.body.sessionData);

          case 3:
            session = _context9.sent;
            ctx.status = 200;
            ctx.body = session;
            _context9.next = 12;
            break;

          case 8:
            _context9.prev = 8;
            _context9.t0 = _context9["catch"](0);
            ctx.body = _context9.t0;
            ctx.status = 500;

          case 12:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[0, 8]]);
  }));

  return function (_x10) {
    return _ref9.apply(this, arguments);
  };
}());
router.get("/users", /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(ctx) {
    var users;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.prev = 0;
            _context10.next = 3;
            return (0, _userController.fetchAllUsers)();

          case 3:
            users = _context10.sent;
            ctx.status = 200;
            ctx.body = users;
            _context10.next = 12;
            break;

          case 8:
            _context10.prev = 8;
            _context10.t0 = _context10["catch"](0);
            ctx.body = _context10.t0;
            ctx.status = 500;

          case 12:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[0, 8]]);
  }));

  return function (_x11) {
    return _ref10.apply(this, arguments);
  };
}());
router.get("/products", /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(ctx) {
    var products;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.prev = 0;
            _context11.next = 3;
            return (0, _productController.fetchAllProducts)();

          case 3:
            products = _context11.sent;
            ctx.status = 200;
            ctx.body = products;
            _context11.next = 12;
            break;

          case 8:
            _context11.prev = 8;
            _context11.t0 = _context11["catch"](0);
            ctx.body = _context11.t0;
            ctx.status = 500;

          case 12:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[0, 8]]);
  }));

  return function (_x12) {
    return _ref11.apply(this, arguments);
  };
}());
router.get("/product/get/:id", /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(ctx) {
    var item;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.prev = 0;
            _context12.next = 3;
            return (0, _productController.getProductById)(ctx.params.id);

          case 3:
            item = _context12.sent;
            ctx.status = 200;
            ctx.body = item;
            _context12.next = 12;
            break;

          case 8:
            _context12.prev = 8;
            _context12.t0 = _context12["catch"](0);
            ctx.body = _context12.t0;
            ctx.status = 500;

          case 12:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[0, 8]]);
  }));

  return function (_x13) {
    return _ref12.apply(this, arguments);
  };
}());
router.get("/storage/all", /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(ctx) {
    var items;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.prev = 0;
            _context13.next = 3;
            return (0, _storageController.fetchFullStorage)();

          case 3:
            items = _context13.sent;
            ctx.status = 200;
            ctx.body = items;
            _context13.next = 12;
            break;

          case 8:
            _context13.prev = 8;
            _context13.t0 = _context13["catch"](0);
            ctx.body = _context13.t0;
            ctx.status = 500;

          case 12:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[0, 8]]);
  }));

  return function (_x14) {
    return _ref13.apply(this, arguments);
  };
}());
router.get("/storage/get/item/:id", /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(ctx) {
    var item;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.prev = 0;
            _context14.next = 3;
            return (0, _storageController.getStorageItemById)(ctx.params.id);

          case 3:
            item = _context14.sent;
            ctx.status = 200;
            ctx.body = item;
            _context14.next = 12;
            break;

          case 8:
            _context14.prev = 8;
            _context14.t0 = _context14["catch"](0);
            ctx.body = _context14.t0;
            ctx.status = 500;

          case 12:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[0, 8]]);
  }));

  return function (_x15) {
    return _ref14.apply(this, arguments);
  };
}());
router.post("/new-user", /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(ctx) {
    var newUserRegistration;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.prev = 0;
            _context15.next = 3;
            return (0, _userController.registerUser)(ctx.request.body.newUserData);

          case 3:
            newUserRegistration = _context15.sent;
            ctx.status = 200;
            ctx.body = newUserRegistration;
            _context15.next = 12;
            break;

          case 8:
            _context15.prev = 8;
            _context15.t0 = _context15["catch"](0);
            ctx.body = _context15.t0;
            ctx.status = 500;

          case 12:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, null, [[0, 8]]);
  }));

  return function (_x16) {
    return _ref15.apply(this, arguments);
  };
}());
router.get("/profile/:id", /*#__PURE__*/function () {
  var _ref16 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(ctx) {
    var user;
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.prev = 0;
            _context16.next = 3;
            return (0, _userController.getUserById)(ctx.params.id);

          case 3:
            user = _context16.sent;
            ctx.status = 200;
            ctx.body = user;
            _context16.next = 12;
            break;

          case 8:
            _context16.prev = 8;
            _context16.t0 = _context16["catch"](0);
            ctx.body = _context16.t0;
            ctx.status = 500;

          case 12:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, null, [[0, 8]]);
  }));

  return function (_x17) {
    return _ref16.apply(this, arguments);
  };
}());
router.get("/user/:id/pay-ticket", /*#__PURE__*/function () {
  var _ref17 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17(ctx) {
    var newClovers;
    return _regenerator["default"].wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.prev = 0;
            _context17.next = 3;
            return (0, _userController.userTicketPayment)(ctx.params.id);

          case 3:
            newClovers = _context17.sent;
            ctx.status = 200;
            ctx.body = {
              availableClovers: newClovers
            };
            _context17.next = 12;
            break;

          case 8:
            _context17.prev = 8;
            _context17.t0 = _context17["catch"](0);
            ctx.body = _context17.t0;
            ctx.status = 500;

          case 12:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17, null, [[0, 8]]);
  }));

  return function (_x18) {
    return _ref17.apply(this, arguments);
  };
}());
router.post("/user/:id/refill", /*#__PURE__*/function () {
  var _ref18 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18(ctx) {
    var newClovers;
    return _regenerator["default"].wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.prev = 0;
            _context18.next = 3;
            return (0, _userController.refillUser)(ctx.params.id, ctx.request.body.newClovers);

          case 3:
            newClovers = _context18.sent;
            ctx.status = 200;
            ctx.body = {
              availableClovers: newClovers
            };
            _context18.next = 12;
            break;

          case 8:
            _context18.prev = 8;
            _context18.t0 = _context18["catch"](0);
            ctx.body = _context18.t0;
            ctx.status = 500;

          case 12:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18, null, [[0, 8]]);
  }));

  return function (_x19) {
    return _ref18.apply(this, arguments);
  };
}());
router.post("/user/:id/new-order", /*#__PURE__*/function () {
  var _ref19 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19(ctx) {
    var newClovers;
    return _regenerator["default"].wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            _context19.prev = 0;
            _context19.next = 3;
            return (0, _userController.registerNewOrder)(ctx.params.id, ctx.request.body.grandTotal);

          case 3:
            newClovers = _context19.sent;
            ctx.status = 200;
            ctx.body = {
              availableClovers: newClovers
            };
            _context19.next = 12;
            break;

          case 8:
            _context19.prev = 8;
            _context19.t0 = _context19["catch"](0);
            ctx.body = _context19.t0;
            ctx.status = 500;

          case 12:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19, null, [[0, 8]]);
  }));

  return function (_x20) {
    return _ref19.apply(this, arguments);
  };
}());

try {
  app.use( /*#__PURE__*/function () {
    var _ref20 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee20(ctx, next) {
      var _ctx$state, _ctx$state$user;

      var jwtUser;
      return _regenerator["default"].wrap(function _callee20$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              jwtUser = (_ctx$state = ctx.state) === null || _ctx$state === void 0 ? void 0 : (_ctx$state$user = _ctx$state.user) === null || _ctx$state$user === void 0 ? void 0 : _ctx$state$user.data;

              if (!(jwtUser != null && jwtUser.username)) {
                _context20.next = 15;
                break;
              }

              _context20.prev = 2;
              _context20.next = 5;
              return (0, _authController.findUserByUsername)(jwtUser.username);

            case 5:
              ctx.$user = _context20.sent;

              if (!(ctx.$user == null)) {
                _context20.next = 8;
                break;
              }

              throw new Error();

            case 8:
              _context20.next = 15;
              break;

            case 10:
              _context20.prev = 10;
              _context20.t0 = _context20["catch"](2);
              console.log(_context20.t0);
              ctx.status = 401;
              return _context20.abrupt("return");

            case 15:
              _context20.next = 17;
              return next();

            case 17:
            case "end":
              return _context20.stop();
          }
        }
      }, _callee20, null, [[2, 10]]);
    }));

    return function (_x21, _x22) {
      return _ref20.apply(this, arguments);
    };
  }()); // Configure routes
  //app.use(configureRouter().routes());

  app.use(router.routes()).use(router.allowedMethods());
  app.listen(8080, function () {
    return console.log("Listening on port 8080...");
  });
} catch (ex) {
  console.log("Startup error:", "error");
  console.log(ex);
}