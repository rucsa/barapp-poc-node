"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var SessionSchema = new Schema({
  _id: _mongoose["default"].Types.ObjectId,
  name: String,
  createdAt: Date,
  expiresAt: Date,
  createdBy: String,
  currentEntranceFee: Number,
  secretEntranceCode: String,
  active: Boolean
});

var _default = _mongoose["default"].model("Session", SessionSchema);

exports["default"] = _default;