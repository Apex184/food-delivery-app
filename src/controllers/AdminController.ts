import express, { Request, Response, NextFunction } from "express";
import { Vendor } from "../models"
import { CreateVendorInput } from "../DTO";
import { generatePassword, generateSalt, findVendor } from "../utility";


export const CreateVendor = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { name, email, pinCode, address, phone, password, ownerName, foodType } = <CreateVendorInput>req.body;
        const existingEmail = await findVendor('', email);
        if (existingEmail !== null) {
            return res.status(409).json({ success: false, message: "Email already exists" });
        }

        const existingPhone = await Vendor.findOne({ phone: phone });
        if (existingPhone !== null) {
            return res.status(409).json({ success: false, message: "Phone already exists" });
        }

        const salt = await generateSalt();
        const hashedPassword = await generatePassword(password, salt);
        const createdVendor = await Vendor.create({
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
        })

        return res.json({ success: true, message: "Successfully Created", data: createdVendor })
    } catch (error) {
        next(error);
    }
}
export const GetVendors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendors = await Vendor.find();
        if (vendors !== null) return res.status(200).json({
            message: "Successfully fetched", data: vendors
        });
        return res.status(404).json({ success: false, message: "Vendor detail not found" })

    } catch (error) {
        console.log(error);
    }
}
export const GetVendorById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const vendorId = req.params.id;
        const vendor = await findVendor(vendorId);
        if (!vendor) return res.status(404).json({
            success: false, message: `Vendor detail with id ${vendorId} not found`
        });
        if (vendor !== null) return res.status(200).json({ success: true, message: "Successfully fetched vendor detail", data: vendor });


    } catch (error) {
        next(error);
    }
}