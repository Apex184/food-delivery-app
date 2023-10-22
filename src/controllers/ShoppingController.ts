import express, { Request, Response, NextFunction } from "express";
import { Vendor, FoodDoc } from "../models"



export const getFoodAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pincode = req.params.pincode;
        const result = await Vendor.find({ pinCode: pincode, serviceAvailable: true })
            .sort([["rating", "descending"]])
            .populate("foods")

        if (result.length > 0) {
            res.status(200).json({
                message: "Available",
                data: result
            })
        }
        else {
            res.status(400).json({
                message: "Not Available",
                data: []
            })
        }
    } catch (error: any) {
        return res.status(500).json({
            success: false, message: error.message
        })
    }


}

export const getTopRestaurants = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pincode = req.params.pincode;
        const result = await Vendor.find({ pinCode: pincode, serviceAvailable: true })
            .sort([["rating", "descending"]])
            .limit(1)

        if (result.length > 0) {
            res.status(200).json({
                message: "Available",
                data: result
            })
        }
        else {
            res.status(400).json({
                message: "Not Available",
                data: []
            })
        }
    } catch (error: any) {
        return res.status(500).json({
            success: false, message: error.message
        })
    }
}
export const getFoodIn30Min = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pincode = req.params.pincode;
        const result = await Vendor.find({ pinCode: pincode, serviceAvailable: true }).populate('foods')

        if (result.length > 0) {
            let foodResult: any = [];
            result.map(vendor => {
                const foods = vendor.foods as [FoodDoc]
                foodResult.push(...foods.filter(food => food.readyTime <= 30));

            })

            res.status(200).json({
                message: "Available",
                data: foodResult
            })
        }
        else {
            res.status(400).json({
                message: "Not Available",
                data: []
            })
        }
    } catch (error: any) {
        return res.status(500).json({
            success: false, message: error.message
        })
    }
}

export const searchFoods = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pincode = req.params.pincode;
        const result = await Vendor.find({ pinCode: pincode, serviceAvailable: true })
            .populate('foods')

        if (result.length > 0) {
            let foodResult: any = [];
            result.map(item => foodResult.push(...item.foods));
            res.status(200).json({
                message: "Available",
                data: foodResult
            })
        }
        else {
            res.status(400).json({
                message: "Not Available",
                data: []
            })
        }
    } catch (error: any) {
        return res.status(500).json({
            success: false, message: error.message
        })
    }

}
export const getRestaurantById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const result = await Vendor.findById(id)
            .populate("foods")

        if (result) {
            res.status(200).json({
                message: "Available",
                data: result
            })
        }
        else {
            res.status(400).json({
                message: "Not Available",
                data: []
            })
        }
    } catch (error: any) {
        return res.status(500).json({
            success: false, message: error.message
        })
    }
}



