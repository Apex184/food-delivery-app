"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRestaurantById = exports.searchFoods = exports.getFoodIn30Min = exports.getTopRestaurants = exports.getFoodAvailability = void 0;
const models_1 = require("../models");
const getFoodAvailability = async (req, res, next) => {
    try {
        const pincode = req.params.pincode;
        const result = await models_1.Vendor.find({ pinCode: pincode, serviceAvailable: true })
            .sort([["rating", "descending"]])
            .populate("foods");
        if (result.length > 0) {
            res.status(200).json({
                message: "Available",
                data: result
            });
        }
        else {
            res.status(400).json({
                message: "Not Available",
                data: []
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false, message: error.message
        });
    }
};
exports.getFoodAvailability = getFoodAvailability;
const getTopRestaurants = async (req, res, next) => {
    try {
        const pincode = req.params.pincode;
        const result = await models_1.Vendor.find({ pinCode: pincode, serviceAvailable: true })
            .sort([["rating", "descending"]])
            .limit(1);
        if (result.length > 0) {
            res.status(200).json({
                message: "Available",
                data: result
            });
        }
        else {
            res.status(400).json({
                message: "Not Available",
                data: []
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false, message: error.message
        });
    }
};
exports.getTopRestaurants = getTopRestaurants;
const getFoodIn30Min = async (req, res, next) => {
    try {
        const pincode = req.params.pincode;
        const result = await models_1.Vendor.find({ pinCode: pincode, serviceAvailable: true }).populate('foods');
        if (result.length > 0) {
            let foodResult = [];
            result.map(vendor => {
                const foods = vendor.foods;
                foodResult.push(...foods.filter(food => food.readyTime <= 30));
            });
            res.status(200).json({
                message: "Available",
                data: foodResult
            });
        }
        else {
            res.status(400).json({
                message: "Not Available",
                data: []
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false, message: error.message
        });
    }
};
exports.getFoodIn30Min = getFoodIn30Min;
const searchFoods = async (req, res, next) => {
    try {
        const pincode = req.params.pincode;
        const result = await models_1.Vendor.find({ pinCode: pincode, serviceAvailable: true })
            .populate('foods');
        if (result.length > 0) {
            let foodResult = [];
            result.map(item => foodResult.push(...item.foods));
            res.status(200).json({
                message: "Available",
                data: foodResult
            });
        }
        else {
            res.status(400).json({
                message: "Not Available",
                data: []
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false, message: error.message
        });
    }
};
exports.searchFoods = searchFoods;
const getRestaurantById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await models_1.Vendor.findById(id)
            .populate("foods");
        if (result) {
            res.status(200).json({
                message: "Available",
                data: result
            });
        }
        else {
            res.status(400).json({
                message: "Not Available",
                data: []
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false, message: error.message
        });
    }
};
exports.getRestaurantById = getRestaurantById;
//# sourceMappingURL=ShoppingController.js.map