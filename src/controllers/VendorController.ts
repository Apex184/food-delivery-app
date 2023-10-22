import express, { Request, Response, NextFunction } from "express";
import { CreateFood, EditVendorInput, UpdateVendorService, VendorLoginInput, VendorPayload } from "../DTO";
import { findVendor, validatePassword, generateSignature } from "../utility";
import { Food, Vendor } from "../models";

export const VendorLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = <VendorLoginInput>req.body;
        const existingVendor = await Vendor.findOne({ email: email });
        if (existingVendor !== null) {
            const isPasswordValid = await validatePassword(password, existingVendor.salt, existingVendor.password);

            if (isPasswordValid) {
                const vendorPayload: VendorPayload = {
                    _id: existingVendor._id,
                    email: existingVendor.email,
                    name: existingVendor.name,
                    foodType: existingVendor.foodType,
                };
                const signature = await generateSignature(vendorPayload);
                return res.status(200).json({ success: true, message: "Successfully logged in", data: signature });
            } else {
                return res.status(401).json({ success: false, message: "Invalid password" });
            }

        }
        return res.status(404).json({ success: false, message: "Login credientials not valid" });


    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


export const getVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) return res.status(404).json({ success: false, message: "Vendor not found" });
        if (user) {
            const existingVendor = await findVendor(user._id);

            if (existingVendor !== null) {
                return res.status(200).json({ success: true, message: "Vendor profile", data: existingVendor });
            }
        }

    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
}



export const updateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, name, foodType, phone } = <EditVendorInput>req.body
        const user = req.user;
        if (user) {
            const existingVendor = await Vendor.findOne({ _id: user._id });
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
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }


}
export const updateCoverImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (user) {
            const existingVendor = await Vendor.findOne({ _id: user._id });
            if (existingVendor !== null) {
                const files = req.files as Express.Multer.File[];
                const images = files.map((file: Express.Multer.File) => file.filename);
                existingVendor.coverImages.push(...images);
                const coverImagesSaved = await existingVendor.save();
                return res.status(200).json({ success: true, message: "Food added successfully", data: coverImagesSaved });
            }

        }
        return res.status(404).json({ success: false, message: "Something went wrong" });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }


}


export const updateService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { serviceAvailable } = <UpdateVendorService>req.body
        const user = req.user;
        if (user) {
            const existingVendor = await Vendor.findOne({ _id: user._id });
            if (existingVendor !== null) {
                existingVendor.serviceAvailable = !existingVendor.serviceAvailable;

                const savedResult = await existingVendor.save();
                return res.status(200).json({ success: true, message: "Service updated successfully", data: existingVendor });

            }
            return res.status(200).json({ success: true, message: "Service updated", data: existingVendor });

        }
        return res.status(404).json({ success: false, message: "Vendor not found" });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }


}
export const addFood = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { price, name, description, readyTime, category, foodType } = <CreateFood>req.body
        const user = req.user;
        if (user) {
            const existingVendor = await Vendor.findOne({ _id: user._id });
            if (existingVendor !== null) {
                const files = req.files as Express.Multer.File[];
                const images = files.map((file: Express.Multer.File) => file.filename);

                const createdFood = await Food.create({
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
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }


}
export const getFoods = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (user) {
            const existingVendor = await findVendor(user._id);
            if (existingVendor !== null) {

                const findFoods = await Food.find({ vendorId: existingVendor._id });
                return res.status(200).json({ success: true, message: "All foods fetched successfully", data: findFoods });

            }

        }
        return res.status(404).json({ success: false, message: "Vendor not found" });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }


}