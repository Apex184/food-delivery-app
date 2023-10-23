import mongoose, { Document, Schema, Model } from "mongoose";

export interface OfferDoc extends Document {
    offerType: string;
    vendors: [any];
    title: string;
    description: string;
    minValue: number;
    offerAmount: number;
    startValidity: Date;
    endValidity: Date;
    promoCode: string;
    promoType: string;
    bank: [any];
    bins: [any];
    pinCode: string;
    isActive: boolean;






}

const OfferSchema: Schema = new Schema({
    offerType: { type: String, required: true },
    vendors: [
        {
            type: Schema.Types.ObjectId, ref: "Vendor",
        }
    ],
    title: { type: String, required: true },
    description: { type: String, },
    minValue: { type: Number, required: true },
    offerAmount: { type: Number, required: true },
    startValidity: { type: Date, },
    endValidity: { type: Date, },
    promoCode: { type: String, required: true },
    promoType: { type: String, required: true },
    bank: [
        {
            type: String, required: true
        }
    ],
    bins: [
        {
            type: Number,
        }
    ],

    pinCode: { type: String, required: true },
    isActive: { type: Boolean, },


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

export const Offer = mongoose.model<OfferDoc>("Offer", OfferSchema);