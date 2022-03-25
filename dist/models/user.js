"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var UserSchema = new Schema({
  _id: _mongoose["default"].Types.ObjectId,
  username: String,
  password: String,
  firstname: String,
  lastname: String,
  availableClovers: Number,
  guestOf: String,
  createdAt: Date,
  createdBy: String,
  lastUpdatedAt: Date,
  payedTicketThisSession: Boolean,
  accessLevel: String
});

var _default = _mongoose["default"].model('User', UserSchema);

exports["default"] = _default;