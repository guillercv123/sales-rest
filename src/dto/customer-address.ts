export interface ICustomerAddress{
    addressId?: number;
    customerId: number;
    street: string;
    reference: string;
    postalCode: string;
    isPrimary: boolean;
    createdAt?: Date;
    ubigeo: string;
}