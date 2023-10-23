import { IsEmail, IsEmpty, Length, } from "class-validator";

export class CreateCustomerInput {
    @IsEmail()
    email: string;


    @Length(7, 14)
    phone: string;


    @Length(6, 12)
    password: string
}

export class CustomerLoginInput {
    @IsEmail()
    email: string;

    @Length(6, 12)
    password: string
}
export class EditCustomerProfileInput {
    @Length(3, 15)
    firstName: string;

    @Length(3, 15)
    lastName: string;

    @Length(6, 60)
    address: string;


}

export interface CustomerPayload {
    _id: string;
    email: string;
    verified: boolean;
}

export class OrderInput {
    _id: string;
    unit: number;
}