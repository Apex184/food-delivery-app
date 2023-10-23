"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCart = exports.GetCart = exports.AddToCart = exports.GetOrderById = exports.GetOrders = exports.CreateOrder = exports.EditCustomerProfile = exports.CustomerProfile = exports.RequestOtp = exports.CustomerVerify = exports.CustomerLogin = exports.CustomerSignUp = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const DTO_1 = require("../DTO");
const utility_1 = require("../utility");
const models_1 = require("../models");
const Order_1 = require("../models/Order");
const CustomerSignUp = async (req, res, next) => {
    try {
        const customerInputs = (0, class_transformer_1.plainToClass)(DTO_1.CreateCustomerInput, req.body);
        const errors = await (0, class_validator_1.validate)(customerInputs, { skipMissingProperties: false });
        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: "Validation errors", errors });
        }
        const { email, phone, password } = customerInputs;
        const emailExists = await models_1.Customer.findOne({ email: email });
        if (emailExists) {
            return res.status(409).json({ success: false, message: "Email already exists" });
        }
        const salt = await (0, utility_1.generateSalt)();
        const hashedPassword = await (0, utility_1.generatePassword)(password, salt);
        const { otp, otp_expiry } = (0, utility_1.GenerateOtp)();
        const createdCustomer = await models_1.Customer.create({
            email,
            phone,
            password: hashedPassword,
            salt,
            verified: false,
            firstName: "",
            lastName: "",
            otp,
            otp_expiry,
            lat: 0,
            lng: 0,
            orders: []
        });
        if (createdCustomer) {
            // await onRequestOTP(otp, phone);
            // await sendMessage(`Your OTP is ${otp}`, phone);
            const signature = await (0, utility_1.generateSignature)({
                _id: createdCustomer._id,
                email: createdCustomer.email,
                verified: createdCustomer.verified
            });
            return res.status(201).json({ success: true, message: "Successfully Created", data: createdCustomer, signature: signature });
        }
        return res.status(500).json({ success: false, message: "An error occurred during customer creation" });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "An error occurred", error: err.message });
    }
};
exports.CustomerSignUp = CustomerSignUp;
const CustomerLogin = async (req, res, next) => {
    try {
        const customerInputs = (0, class_transformer_1.plainToClass)(DTO_1.CustomerLoginInput, req.body);
        const errors = await (0, class_validator_1.validate)(customerInputs, { skipMissingProperties: false });
        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: "Validation errors", errors });
        }
        const { email, password } = customerInputs;
        const customer = await models_1.Customer.findOne({ email: email, verified: true });
        if (customer) {
            const isPasswordValid = await (0, utility_1.validatePassword)(password, customer.salt, customer.password);
            if (isPasswordValid) {
                const signature = await (0, utility_1.generateSignature)({
                    _id: customer._id,
                    email: customer.email,
                    verified: customer.verified
                });
                return res.status(200).json({ success: true, message: "Successfully logged in", signature });
            }
            else {
                return res.status(401).json({ success: false, message: "Invalid password" });
            }
        }
        return res.status(404).json({ success: false, message: "Login credientials not valid" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }
};
exports.CustomerLogin = CustomerLogin;
const CustomerVerify = async (req, res, next) => {
    try {
        const { otp } = req.body;
        const user = req.user;
        if (user) {
            const profile = await models_1.Customer.findById(user._id);
            if (profile) {
                if (profile.otp === parseInt(otp) && profile.otp_expiry <= new Date()) {
                    if (profile.otp !== parseInt(otp)) {
                        return res.status(409).json({ success: true, message: "OTP does not match" });
                    }
                    if (new Date() > profile.otp_expiry) {
                        return res.status(409).json({ success: true, message: "OTP has expired" });
                    }
                    if (profile.verified === true) {
                        return res.status(409).json({ success: true, message: "OTP already verified" });
                    }
                    profile.verified = true;
                    const updatedProfile = await profile.save();
                    const signature = await (0, utility_1.generateSignature)({
                        _id: updatedProfile._id,
                        email: updatedProfile.email,
                        verified: updatedProfile.verified
                    });
                    return res.status(200).json({ success: true, message: "OTP verified", signature });
                }
            }
        }
        return res.status(404).json({ success: false, message: "Error with OTP validation" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }
};
exports.CustomerVerify = CustomerVerify;
const RequestOtp = async (req, res, next) => {
    try {
        const user = req.user;
        if (user) {
            const profile = await models_1.Customer.findById(user._id);
            if (profile) {
                const { otp, otp_expiry } = (0, utility_1.GenerateOtp)();
                profile.otp = otp;
                profile.otp_expiry = otp_expiry;
                const updatedProfile = await profile.save();
                // await onRequestOTP(otp, profile.phone);
                // await sendMessage(`Your OTP is ${otp}`, profile.phone);
                return res.status(200).json({ success: true, message: "OTP sent" });
            }
        }
        return res.status(404).json({ success: false, message: "Error, we can't send you OTP" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }
};
exports.RequestOtp = RequestOtp;
const CustomerProfile = async (req, res, next) => {
    try {
        const user = req.user;
        if (user) {
            const profile = await models_1.Customer.findById(user._id);
            if (profile) {
                return res.status(200).json({ success: true, message: "Profile found", data: profile });
            }
        }
        return res.status(404).json({ success: false, message: "User not found" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }
};
exports.CustomerProfile = CustomerProfile;
const EditCustomerProfile = async (req, res, next) => {
    try {
        const customerInputs = (0, class_transformer_1.plainToClass)(DTO_1.EditCustomerProfileInput, req.body);
        const errors = await (0, class_validator_1.validate)(customerInputs, { skipMissingProperties: true });
        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: "Validation errors", errors });
        }
        const { firstName, lastName } = customerInputs;
        const user = req.user;
        if (user) {
            const profile = await models_1.Customer.findById(user._id);
            if (profile) {
                profile.firstName = firstName;
                profile.lastName = lastName;
                const updatedProfile = await profile.save();
                return res.status(200).json({ success: true, message: "Profile updated", data: updatedProfile });
            }
        }
        return res.status(404).json({ success: false, message: "User not found" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }
};
exports.EditCustomerProfile = EditCustomerProfile;
const CreateOrder = async (req, res, next) => {
    try {
        const customer = req.user;
        if (customer) {
            const orderId = `${Math.floor(Math.random() * 899999) + 1000}`;
            const profile = await models_1.Customer.findById(customer._id);
            const cart = req.body;
            let cartItems = Array();
            let netAmount = 0.0;
            let vendorId;
            const foods = await models_1.Food.find().where('_id').in(cart.map((item) => item._id)).exec();
            foods.map(food => {
                cart.map(({ _id, unit }) => {
                    if (food._id == _id) {
                        vendorId = food.vendorId;
                        netAmount += (food.price * unit);
                        cartItems.push({ food, unit });
                    }
                });
            });
            if (cartItems.length > 0) {
                const currentOrders = await Order_1.Order.create({
                    orderId: orderId,
                    vendorId: vendorId,
                    items: cartItems,
                    totalAmount: netAmount,
                    orderDate: new Date(),
                    paidThrough: "COD",
                    paymentResponse: "Pending",
                    orderStatus: "Waiting",
                    remarks: "",
                    deliveryId: "",
                    appliedOffers: false,
                    offerId: null,
                    readyTime: 45,
                    offerAmount: 0
                });
                if (currentOrders) {
                    if (profile) { // Check if profile is not undefined
                        // profile.cart = [] as any;
                        profile.orders.push(currentOrders);
                        await profile.save();
                    }
                    return res.status(200).json({ success: true, message: "Order created", data: currentOrders });
                }
            }
        }
        return res.status(404).json({ success: false, message: "User not found" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }
};
exports.CreateOrder = CreateOrder;
const GetOrders = async (req, res, next) => {
    try {
        const customer = req.user;
        if (customer) {
            const profile = await models_1.Customer.findById(customer._id).populate("orders");
            if (profile) {
                return res.status(200).json({ success: true, message: "Orders found", data: profile.orders });
            }
        }
        return res.status(404).json({ success: false, message: "User not found" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }
};
exports.GetOrders = GetOrders;
const GetOrderById = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        if (orderId) {
            const order = await Order_1.Order.findById(orderId).populate("items.food");
            if (order) {
                return res.status(200).json({ success: true, message: "Order found", data: order });
            }
        }
        return res.status(404).json({ success: false, message: "No order in your cart" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }
};
exports.GetOrderById = GetOrderById;
const AddToCart = async (req, res, next) => {
    try {
        const customer = req.user;
        if (customer) {
            const profile = await models_1.Customer.findById(customer._id).populate("cart.food");
            let cartItems = Array();
            const { _id, unit } = req.body;
            const food = await models_1.Food.findById(_id);
            if (food) {
                if (profile !== null) {
                    cartItems = profile.cart;
                    if (cartItems.length > 0) {
                        let existFoodItems = cartItems.filter((item) => item.food._id.toString() === _id);
                        if (existFoodItems.length > 0) {
                            const indexItem = cartItems.indexOf(existFoodItems[0]);
                            if (unit > 0) {
                                cartItems[indexItem] = { unit, food };
                            }
                            else {
                                cartItems.splice(indexItem, 1);
                            }
                        }
                        else {
                            cartItems.push({ food, unit });
                        }
                    }
                    else {
                        cartItems.push({ food, unit });
                    }
                    if (cartItems) {
                        profile.cart = cartItems;
                        const updatedProfile = await profile.save();
                        return res.status(200).json({ success: true, message: "Cart updated", data: updatedProfile.cart });
                    }
                    else {
                        return res.status(200).json({ success: true, message: "You have no item in your cart", data: [] });
                    }
                }
            }
        }
        return res.status(404).json({ success: false, message: "User not found" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }
};
exports.AddToCart = AddToCart;
const GetCart = async (req, res, next) => {
    try {
        const customer = req.user;
        if (customer) {
            const profile = await models_1.Customer.findById(customer._id).populate("cart.food");
            if (profile) {
                return res.status(200).json({ success: true, message: "Cart found", data: profile.cart });
            }
        }
        return res.status(404).json({ success: false, message: "User not found" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }
};
exports.GetCart = GetCart;
const DeleteCart = async (req, res, next) => {
    try {
        const customer = req.user;
        if (customer) {
            const profile = await models_1.Customer.findById(customer._id).populate("cart.food");
            if (profile !== null) {
                profile.cart = [];
                const result = profile.save();
                return res.status(200).json({ success: true, message: "Cart is empty", data: result });
            }
        }
        return res.status(404).json({ success: false, message: "User not found" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }
};
exports.DeleteCart = DeleteCart;
//# sourceMappingURL=CustomerController.js.map