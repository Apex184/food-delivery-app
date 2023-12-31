import mongoose, { Document, Schema, Model } from "mongoose";

export interface OrderDoc extends Document {
    orderId: string;
    vendorId: string;
    items: [any];
    totalAmount: number;
    orderDate: Date;
    paidThrough: string;
    paymentResponse: string;
    orderStatus: string;
    remarks: string;
    deliveryId: string;
    appliedOffers: boolean;
    offerId: string;
    offerAmount: number;
    readyTime: number;



}

const OrderSchema: Schema = new Schema({
    orderId: { type: String, required: true },
    vendorId: { type: String, required: true },
    items: [
        {
            food: {
                type: Schema.Types.ObjectId, ref: "Food", required: true
            },
            unit: { type: Number, required: true },
        },

    ],
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, },
    paidThrough: { type: String, },
    paymentResponse: { type: String },
    orderStatus: { type: String },
    remarks: { type: String },
    deliveryId: { type: String },
    appliedOffers: { type: Boolean },
    offerId: { type: String },
    offerAmount: { type: Number },
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

export const Order = mongoose.model<OrderDoc>("Order", OrderSchema);