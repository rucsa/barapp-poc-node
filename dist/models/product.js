"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var ProductSchema = new Schema({
  _id: _mongoose["default"].Types.ObjectId,
  denumire: String,
  clovers: Number,
  color: String
});

var _default = _mongoose["default"].model('Product', ProductSchema);

exports["default"] = _default;