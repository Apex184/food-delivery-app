import mongoose, { Document, Schema, Model } from "mongoose";
import { OrderDoc } from "./Order";

export interface CustomerDoc extends Document {
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    salt: string;
    verified: boolean;
    otp: number;
    otp_expiry: Date;
    lat: number;
    lng: number;
    cart: [any];
    orders: [OrderDoc]

}

const CustomerSchema: Schema = new Schema({
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, },
    lastName: { type: String, },
    address: { type: String },
    salt: { type: String, required: true },
    verified: { type: Boolean, required: true },
    otp: { type: Number, required: true },
    otp_expiry: { type: Date, required: true },
    lat: { type: Number },
    cart: [{
        food: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "Food" },
        unit: { type: Number, required: true },
    }],
    orders: [{
        type: mongoose.SchemaTypes.ObjectId, required: true, ref: "Order"
    }],

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

export const Customer = mongoose.model<CustomerDoc>("customer", CustomerSchema);