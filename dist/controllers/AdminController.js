"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetVendorById = exports.GetVendors = exports.CreateVendor = void 0;
const models_1 = require("../models");
const utility_1 = require("../utility");
const CreateVendor = async (req, res, next) => {
    try {
        const { name, email, pinCode, address, phone, password, ownerName, foodType } = req.body;
        const existingEmail = await (0, utility_1.findVendor)('', email);
        if (existingEmail !== null) {
            return res.status(409).json({ success: false, message: "Email already exists" });
        }
        const existingPhone = await models_1.Vendor.findOne({ phone: phone });
        if (existingPhone !== null) {
            return res.status(409).json({ success: false, message: "Phone already exists" });
        }
        const salt = await (0, utility_1.generateSalt)();
        const hashedPassword = await (0, utility_1.generatePassword)(password, salt);
        const createdVendor = await models_1.Vendor.create({
            name,
            email,
            pinCode,
            address,
            phone,
            password: hashedPassword,
            ownerName,
            foodType,
            rating: 0,
            salt: salt,
            serviceAvailable: false,
            coverImages: [],
            foods: []
        });
        return res.json({ success: true, message: "Successfully Created", data: createdVendor });
    }
    catch (error) {
        next(error);
    }
};
exports.CreateVendor = CreateVendor;
const GetVendors = async (req, res, next) => {
    try {
        const vendors = await models_1.Vendor.find();
        if (vendors !== null)
            return res.status(200).json({
                message: "Successfully fetched", data: vendors
            });
        return res.status(404).json({ success: false, message: "Vendor detail not found" });
    }
    catch (error) {
        console.log(error);
    }
};
exports.GetVendors = GetVendors;
const GetVendorById = async (req, res, next) => {
    try {
        const vendorId = req.params.id;
        const vendor = await (0, utility_1.findVendor)(vendorId);
        if (!vendor)
            return res.status(404).json({
                success: false, message: `Vendor detail with id ${vendorId} not found`
            });
        if (vendor !== null)
            return res.status(200).json({ success: true, message: "Successfully fetched vendor detail", data: vendor });
    }
    catch (error) {
        next(error);
    }
};
exports.GetVendorById = GetVendorById;
//# sourceMappingURL=AdminController.js.map