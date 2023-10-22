import mongoose, { Document, Schema, Model } from "mongoose";

export interface VendorDoc extends Document {
    name: string;
    ownerName: string;
    foodType: string[];
    pinCode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    salt: string;
    serviceAvailable: boolean;
    coverImages: string[];
    rating: number;
    foods: any;

}

const VendorSchema: Schema = new Schema({
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodType: { type: [String] },
    pinCode: { type: String, required: true },
    address: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    serviceAvailable: { type: Boolean, required: true },
    coverImages: { type: [String] },
    rating: { type: Number },
    foods: [{
        type: mongoose.SchemaTypes.ObjectId, ref: "Food"
    }]

},
    {
        toJSON: {
            transform(doc, ret) {

                delete ret.password;
                delete ret.salt;
                delete ret.__v;
                delete ret.updatedAt;
                delete ret.createdAt;
            },
        },
        timestamps: true
    });

export const Vendor = mongoose.model<VendorDoc>("vendor", VendorSchema);