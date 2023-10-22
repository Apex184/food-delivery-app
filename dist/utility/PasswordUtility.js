"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSignature = exports.generateSignature = exports.validatePassword = exports.findCustomer = exports.findVendor = exports.generatePassword = exports.generateSalt = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_1 = require("../models");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const generateSalt = async () => {
    return await bcryptjs_1.default.genSalt();
};
exports.generateSalt = generateSalt;
const generatePassword = async (password, salt) => {
    return await bcryptjs_1.default.hash(password, salt);
};
exports.generatePassword = generatePassword;
const findVendor = async (id, email) => {
    if (email) {
        return await models_1.Customer.findOne({ email: email });
    }
    else {
        return await models_1.Customer.findById(id);
    }
};
exports.findVendor = findVendor;
const findCustomer = async (id, email) => {
    if (email) {
        return await models_1.Vendor.findOne({ email: email });
    }
    else {
        return await models_1.Vendor.findById(id);
    }
};
exports.findCustomer = findCustomer;
const validatePassword = async (password, salt, hashedPassword) => {
    const newHashedPassword = await (0, exports.generatePassword)(password, salt);
    return newHashedPassword === hashedPassword;
};
exports.validatePassword = validatePassword;
const generateSignature = async (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.APP_SECRET, { expiresIn: "1d" });
};
exports.generateSignature = generateSignature;
const validateSignature = async (req) => {
    const signature = req.get("Authorization");
    if (signature) {
        const payload = await jsonwebtoken_1.default.verify(signature.split(' ')[1], config_1.APP_SECRET);
        req.user = payload;
        return true;
    }
    return false;
};
exports.validateSignature = validateSignature;
//# sourceMappingURL=PasswordUtility.js.map