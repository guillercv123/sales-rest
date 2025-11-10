import {IPersonType} from "./person-type.interface";

export interface ICustomer{
    customerId: number;
    personType: IPersonType | null;
    firstName: string;
    middleName: string;
    lastName: string;
    birthDate: Date;
    legalName: string;
    tradeName: string;
    emailMain: string;
    phoneMain: string;
    status: string;
    createAt: Date;
    updateAt: Date;
}