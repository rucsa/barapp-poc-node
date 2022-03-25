"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var StorageSchema = new Schema({
  _id: _mongoose["default"].Types.ObjectId,
  denumire: String,
  size: Number,
  portion: Number,
  qty: Number,
  productCode: Number
});

var _default = _mongoose["default"].model('StorageItem', StorageSchema);

exports["default"] = _default;