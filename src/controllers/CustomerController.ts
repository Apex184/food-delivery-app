import express, { Request, Response, NextFunction } from 'express';
import { validate } from "class-validator";
import { plainToClass } from 'class-transformer';
import { CreateCustomerInput, CustomerLoginInput, OrderInput, EditCustomerProfileInput } from '../DTO';
import { generatePassword, validatePassword, onRequestOTP, generateSignature, generateSalt, GenerateOtp, sendMessage } from '../utility';

import { Customer, Food } from '../models';
import { Order } from '../models/Order';


export const CustomerSignUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customerInputs = plainToClass(CreateCustomerInput, req.body);
        const errors = await validate(customerInputs, { skipMissingProperties: false });

        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: "Validation errors", errors });
        }

        const { email, phone, password } = customerInputs;

        const emailExists = await Customer.findOne({ email: email });

        if (emailExists) {
            return res.status(409).json({ success: false, message: "Email already exists" });
        }

        const salt = await generateSalt();
        const hashedPassword = await generatePassword(password, salt);
        const { otp, otp_expiry } = GenerateOtp();

        const createdCustomer = await Customer.create({
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

            const signature = await generateSignature({
                _id: createdCustomer._id,
                email: createdCustomer.email,
                verified: createdCustomer.verified
            });

            return res.status(201).json({ success: true, message: "Successfully Created", data: createdCustomer, signature: signature });
        }

        return res.status(500).json({ success: false, message: "An error occurred during customer creation" });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: "An error occurred", error: err.message });
    }
};

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customerInputs = plainToClass(CustomerLoginInput, req.body);
        const errors = await validate(customerInputs, { skipMissingProperties: false });
        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: "Validation errors", errors });
        }

        const { email, password } = customerInputs;
        const customer = await Customer.findOne({ email: email, verified: true });
        if (customer) {
            const isPasswordValid = await validatePassword(password, customer.salt, customer.password);
            if (isPasswordValid) {
                const signature = await generateSignature({
                    _id: customer._id,
                    email: customer.email,
                    verified: customer.verified
                });
                return res.status(200).json({ success: true, message: "Successfully logged in", signature });
            } else {
                return res.status(401).json({ success: false, message: "Invalid password" });
            }
        }
        return res.status(404).json({ success: false, message: "Login credientials not valid" });


    } catch (error: any) {
        return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }

}

export const CustomerVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { otp } = req.body;
        const user = req.user;
        if (user) {
            const profile = await Customer.findById(user._id);

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
                    const signature = await generateSignature({
                        _id: updatedProfile._id,
                        email: updatedProfile.email,
                        verified: updatedProfile.verified
                    });
                    return res.status(200).json({ success: true, message: "OTP verified", signature });
                }
            }

        }
        return res.status(404).json({ success: false, message: "Error with OTP validation" });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }

}

export const RequestOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = req.user;
        if (user) {
            const profile = await Customer.findById(user._id);
            if (profile) {
                const { otp, otp_expiry } = GenerateOtp();
                profile.otp = otp;
                profile.otp_expiry = otp_expiry;
                const updatedProfile = await profile.save();
                // await onRequestOTP(otp, profile.phone);
                // await sendMessage(`Your OTP is ${otp}`, profile.phone);
                return res.status(200).json({ success: true, message: "OTP sent" });
            }

        }
        return res.status(404).json({ success: false, message: "Error, we can't send you OTP" });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }

}

export const CustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (user) {
            const profile = await Customer.findById(user._id);
            if (profile) {
                return res.status(200).json({ success: true, message: "Profile found", data: profile });

            }

        }
        return res.status(404).json({ success: false, message: "User not found" });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }

}

export const EditCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customerInputs = plainToClass(EditCustomerProfileInput, req.body);
        const errors = await validate(customerInputs, { skipMissingProperties: true });

        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: "Validation errors", errors });
        }

        const { firstName, lastName } = customerInputs;
        const user = req.user;
        if (user) {
            const profile = await Customer.findById(user._id);
            if (profile) {
                profile.firstName = firstName;
                profile.lastName = lastName;
                const updatedProfile = await profile.save();
                return res.status(200).json({ success: true, message: "Profile updated", data: updatedProfile });
            }

        }
        return res.status(404).json({ success: false, message: "User not found" });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }

}
export const CreateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = req.user;

        if (customer) {
            const orderId = `${Math.floor(Math.random() * 899999) + 1000}`;
            const profile = await Customer.findById(customer._id);
            const cart = <[OrderInput]>req.body;
            let cartItems = Array();
            let netAmount = 0.0;

            let vendorId;

            const foods = await Food.find().where('_id').in(cart.map((item) => item._id)).exec();

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
                const currentOrders = await Order.create({
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
    } catch (error: any) {
        return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }

}

export const GetOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = req.user;
        if (customer) {
            const profile = await Customer.findById(customer._id).populate("orders");
            if (profile) {
                return res.status(200).json({ success: true, message: "Orders found", data: profile.orders });
            }

        }

        return res.status(404).json({ success: false, message: "User not found" });

    } catch (error: any) {
        return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }

}

export const GetOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = req.params.id
        if (orderId) {
            const order = await Order.findById(orderId).populate("items.food");
            if (order) {
                return res.status(200).json({ success: true, message: "Order found", data: order });
            }

        }

        return res.status(404).json({ success: false, message: "No order in your cart" });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }

}
export const AddToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const customer = req.user;
        if (customer) {
            const profile = await Customer.findById(customer._id).populate("cart.food");

            let cartItems = Array();
            const { _id, unit } = <OrderInput>req.body;
            const food = await Food.findById(_id);
            if (food) {

                if (profile !== null) {
                    cartItems = profile.cart;
                    if (cartItems.length > 0) {
                        let existFoodItems = cartItems.filter((item) => item.food._id.toString() === _id);
                        if (existFoodItems.length > 0) {
                            const indexItem = cartItems.indexOf(existFoodItems[0]);
                            if (unit > 0) {
                                cartItems[indexItem] = { unit, food };
                            } else {
                                cartItems.splice(indexItem, 1);
                            }
                        } else {
                            cartItems.push({ food, unit });
                        }

                    } else {
                        cartItems.push({ food, unit });
                    }
                    if (cartItems) {
                        profile.cart = cartItems as any;
                        const updatedProfile = await profile.save();
                        return res.status(200).json({ success: true, message: "Cart updated", data: updatedProfile.cart });
                    } else {
                        return res.status(200).json({ success: true, message: "You have no item in your cart", data: [] });
                    }
                }

            }
        }
        return res.status(404).json({ success: false, message: "User not found" });

    } catch (error: any) {
        return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }

}

export const GetCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = req.user;
        if (customer) {
            const profile = await Customer.findById(customer._id).populate("cart.food");
            if (profile) {
                return res.status(200).json({ success: true, message: "Cart found", data: profile.cart });
            }

        }
        return res.status(404).json({ success: false, message: "User not found" });


    } catch (error: any) {
        return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }

}

export const DeleteCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = req.user;
        if (customer) {
            const profile = await Customer.findById(customer._id).populate("cart.food");
            if (profile !== null) {
                profile.cart = [] as any;
                const result = profile.save();
                return res.status(200).json({ success: true, message: "Cart is empty", data: result });
            }

        }
        return res.status(404).json({ success: false, message: "User not found" });


    } catch (error: any) {
        return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }

}

