import express, { Request, Response, NextFunction } from 'express';
import { validate } from "class-validator";
import { plainToClass } from 'class-transformer';
import { CreateCustomerInput, CustomerLoginInput, EditCustomerProfileInput } from '../DTO';
import { generatePassword, validatePassword, onRequestOTP, generateSignature, generateSalt, GenerateOtp, sendMessage } from '../utility';

import { Customer } from '../models';


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
                    // return res.status(200).json({ success: true, message: "OTP verified" });
                }
            }

        }
        return res.status(404).json({ success: false, message: "Error with OTP validation" });
    } catch (error: any) {

    }

}

export const RequestOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customerInputs = plainToClass(CustomerLoginInput, req.body);
        const errors = await validate(customerInputs, { skipMissingProperties: false });
        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: "Validation errors", errors });
        }
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

    }

}