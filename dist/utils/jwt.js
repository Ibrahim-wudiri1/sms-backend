"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.signRefreshToken = exports.signAccessToken = void 0;
// src/utils/jwt.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const signAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.JWT_ACCESS_SECRET, { expiresIn: config_1.ACCESS_TOKEN_EXPIRY });
};
exports.signAccessToken = signAccessToken;
const signRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.JWT_REFRESH_SECRET, { expiresIn: config_1.REFRESH_TOKEN_EXPIRY });
};
exports.signRefreshToken = signRefreshToken;
const verifyAccessToken = (token) => {
    return jsonwebtoken_1.default.verify(token, config_1.JWT_ACCESS_SECRET);
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    return jsonwebtoken_1.default.verify(token, config_1.JWT_REFRESH_SECRET);
};
exports.verifyRefreshToken = verifyRefreshToken;
//# sourceMappingURL=jwt.js.map