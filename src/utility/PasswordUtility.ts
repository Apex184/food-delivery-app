import bcrypt from "bcryptjs";
import { Request } from "express";
import { Vendor, Customer } from "../models"
import jwt from "jsonwebtoken";
import { VendorPayload } from "../DTO";
import { APP_SECRET } from "../config";
import { AuthPayload } from "../DTO/Auth.dto";
export const generateSalt = async () => {
    return await bcrypt.genSalt();
}

export const generatePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt);
}

export const findVendor = async (id: string | undefined, email?: string) => {
    if (email) {
        return await Customer.findOne({ email: email });

    } else {
        return await Customer.findById(id);

    }
}

export const findCustomer = async (id: string | undefined, email?: string) => {
    if (email) {
        return await Vendor.findOne({ email: email });

    } else {
        return await Vendor.findById(id);

    }
}

export const validatePassword = async (password: string, salt: string, hashedPassword: string) => {
    const newHashedPassword = await generatePassword(password, salt);
    return newHashedPassword === hashedPassword;
}

export const generateSignature = async (payload: AuthPayload) => {
    return jwt.sign(payload, APP_SECRET, { expiresIn: "1d" });
}


export const validateSignature = async (req: Request) => {
    const signature = req.get("Authorization");
    if (signature) {
        const payload = await jwt.verify(signature.split(' ')[1], APP_SECRET) as AuthPayload;
        req.user = payload;

        return true;
    }
    return false;

}



