"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditOffer = exports.PostOffers = exports.GetOffers = exports.ProcessOrder = exports.GetOrderDetails = exports.GetCurrentOrders = exports.getFoods = exports.addFood = exports.updateService = exports.updateCoverImages = exports.updateVendorProfile = exports.getVendorProfile = exports.VendorLogin = void 0;
const utility_1 = require("../utility");
const models_1 = require("../models");
const Order_1 = require("../models/Order");
const VendorLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const existingVendor = await models_1.Vendor.findOne({ email: email });
        if (existingVendor !== null) {
            const isPasswordValid = await (0, utility_1.validatePassword)(password, existingVendor.salt, existingVendor.password);
            if (isPasswordValid) {
                const vendorPayload = {
                    _id: existingVendor._id,
                    email: existingVendor.email,
                    name: existingVendor.name,
                    foodType: existingVendor.foodType,
                };
                const signature = await (0, utility_1.generateSignature)(vendorPayload);
                return res.status(200).json({ success: true, message: "Successfully logged in", data: signature });
            }
            else {
                return res.status(401).json({ success: false, message: "Invalid password" });
            }
        }
        return res.status(404).json({ success: false, message: "Login credientials not valid" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.VendorLogin = VendorLogin;
const getVendorProfile = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user)
            return res.status(404).json({ success: false, message: "Vendor not found" });
        if (user) {
            const existingVendor = await (0, utility_1.findVendor)(user._id);
            if (existingVendor !== null) {
                return res.status(200).json({ success: true, message: "Vendor profile", data: existingVendor });
            }
        }
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getVendorProfile = getVendorProfile;
const updateVendorProfile = async (req, res, next) => {
    try {
        const { email, name, foodType, phone } = req.body;
        const user = req.user;
        if (user) {
            const existingVendor = await models_1.Vendor.findOne({ _id: user._id });
            if (existingVendor !== null) {
                existingVendor.name = name;
                existingVendor.phone = phone;
                existingVendor.email = email;
                existingVendor.foodType = foodType;
                const savedResult = await existingVendor.save();
                return res.status(200).json({ success: true, message: "Vendor profile updated successfully", data: savedResult });
            }
            return res.status(200).json({ success: true, message: "Vendor profile updated successfully", data: existingVendor });
        }
        return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateVendorProfile = updateVendorProfile;
const updateCoverImages = async (req, res, next) => {
    try {
        const user = req.user;
        if (user) {
            const existingVendor = await models_1.Vendor.findOne({ _id: user._id });
            if (existingVendor !== null) {
                const files = req.files;
                const images = files.map((file) => file.filename);
                existingVendor.coverImages.push(...images);
                const coverImagesSaved = await existingVendor.save();
                return res.status(200).json({ success: true, message: "Food added successfully", data: coverImagesSaved });
            }
        }
        return res.status(404).json({ success: false, message: "Something went wrong" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateCoverImages = updateCoverImages;
const updateService = async (req, res, next) => {
    try {
        const { serviceAvailable } = req.body;
        const user = req.user;
        if (user) {
            const existingVendor = await models_1.Vendor.findOne({ _id: user._id });
            if (existingVendor !== null) {
                existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
                const savedResult = await existingVendor.save();
                return res.status(200).json({ success: true, message: "Service updated successfully", data: existingVendor });
            }
            return res.status(200).json({ success: true, message: "Service updated", data: existingVendor });
        }
        return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateService = updateService;
const addFood = async (req, res, next) => {
    try {
        const { price, name, description, readyTime, category, foodType } = req.body;
        const user = req.user;
        if (user) {
            const existingVendor = await models_1.Vendor.findOne({ _id: user._id });
            if (existingVendor !== null) {
                const files = req.files;
                const images = files.map((file) => file.filename);
                const createdFood = await models_1.Food.create({
                    vendorId: existingVendor._id,
                    price,
                    name,
                    description,
                    readyTime,
                    category,
                    foodType,
                    rating: 0,
                    images: images,
                });
                existingVendor.foods.push(createdFood);
                const foodSaved = await existingVendor.save();
                return res.status(200).json({ success: true, message: "Food added successfully", data: existingVendor });
            }
        }
        return res.status(404).json({ success: false, message: "Something went wrong" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.addFood = addFood;
const getFoods = async (req, res, next) => {
    try {
        const user = req.user;
        if (user) {
            const existingVendor = await models_1.Vendor.findById(user._id);
            if (existingVendor !== null) {
                const findFoods = await models_1.Food.find({ vendorId: existingVendor._id });
                return res.status(200).json({ success: true, message: "All foods fetched successfully", data: findFoods });
            }
        }
        return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getFoods = getFoods;
const GetCurrentOrders = async (req, res, next) => {
    try {
        const user = req.user;
        if (user) {
            const existingOrder = await Order_1.Order.find({ vendorId: user._id }).populate("items.food");
            if (existingOrder !== null) {
                return res.status(200).json({ success: true, message: "All orders fetched successfully", data: existingOrder });
            }
        }
        return res.status(404).json({ success: false, message: "Order not found" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.GetCurrentOrders = GetCurrentOrders;
const GetOrderDetails = async (req, res, next) => {
    try {
        const user = req.user;
        if (user) {
            const id = req.params.id;
            const existingOrder = await Order_1.Order.findById(id).populate("items.food");
            if (existingOrder) {
                return res.status(200).json({ success: true, message: "Order fetched successfully", data: existingOrder });
            }
        }
        return res.status(404).json({ success: false, message: "Order not found" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.GetOrderDetails = GetOrderDetails;
const ProcessOrder = async (req, res, next) => {
    try {
        const user = req.user;
        const { status, time, remarks } = req.body;
        if (user) {
            const orderId = req.params.id;
            if (orderId) {
                const order = await Order_1.Order.findById(orderId);
                if (order) {
                    order.orderStatus = status;
                    if (time) {
                        order.readyTime = time;
                    }
                    order.remarks = remarks;
                    const savedOrder = await order.save();
                    return res.status(200).json({ success: true, message: "Order processed successfully", data: savedOrder });
                }
            }
            else {
                return res.status(404).json({ success: false, message: "Order not found" });
            }
        }
        return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.ProcessOrder = ProcessOrder;
const GetOffers = async (req, res, next) => {
    try {
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.GetOffers = GetOffers;
const PostOffers = async (req, res, next) => {
    try {
        const user = req.user;
        if (user) {
            const { title, description, offerAmount, offerType, endValidity, promoCode, startValidity, pinCode, bank, bins, minValue, isActive, promoType } = req.body;
            const vendor = await models_1.Vendor.findById(user._id);
            if (vendor) {
                const offer = await models_1.Offer.create({
                    title,
                    description,
                    offerAmount,
                    offerType,
                    endValidity,
                    promoCode,
                    startValidity,
                    pinCode,
                    bank,
                    bins,
                    minValue,
                    isActive,
                    promoType,
                    vendors: [vendor],
                });
                return res.status(200).json({ success: true, message: "Offer created successfully", data: offer });
            }
        }
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.PostOffers = PostOffers;
const EditOffer = async (req, res, next) => {
    try {
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.EditOffer = EditOffer;
//# sourceMappingURL=VendorController.js.map