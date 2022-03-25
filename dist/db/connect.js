"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var initDB = function initDB() {
  _mongoose["default"].connect('mongodb://127.0.0.1:27017/tc-admin');

  _mongoose["default"].connection.once('open', function () {
    console.log('connected to database');
  });

  _mongoose["default"].connection.on('error', console.error);
};

var _default = initDB;
exports["default"] = _default;