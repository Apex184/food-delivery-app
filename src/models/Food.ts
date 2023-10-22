import mongoose, { Document, Schema, Model } from "mongoose";

export interface FoodDoc extends Document {
    vendorId: string;
    name: string;
    price: number;
    description: string;
    readyTime: number;
    category: string;
    foodType: string;
    rating: number;
    images: string[];

}

const FoodSchema: Schema = new Schema({
    vendorId: { type: String },
    name: { type: String, required: true },
    foodType: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    images: { type: [String] },
    rating: { type: Number },
    readyTime: { type: Number },


},
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.__v,
                    delete ret.createdAt,
                    delete ret.updatedAt
            }

        },

        timestamps: true
    });

export const Food = mongoose.model<FoodDoc>("Food", FoodSchema);