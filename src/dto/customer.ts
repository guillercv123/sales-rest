export interface ICustomer{
    customerId?: number;
    personTypeId: number;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    birthDate?: Date;
    legalName?: string;
    tradeName?: string;
    emailMain?: string;
    phoneMain?: string;
    status?: string;
    createAt?: Date;
    createdBy?: string;
}