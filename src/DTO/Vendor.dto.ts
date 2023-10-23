export interface CreateVendorInput {
    name: string;
    ownerName: string;
    foodType: string[];
    pinCode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
}

export interface VendorLoginInput {
    email: string;
    password: string;
}

export interface EditVendorInput {
    email: string;
    name: string;
    foodType: string[];
    phone: string;
}

export interface UpdateVendorService {
    serviceAvailable: boolean;
}

export interface VendorPayload {
    _id: string;
    email: string;
    name: string;
    foodType: string[];

}

export interface CreateOfferInput {
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