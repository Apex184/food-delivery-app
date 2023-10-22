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