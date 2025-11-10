export interface ICustomerIdentity {
    identityId?: number;
    customerId: number;
    typeDocumentId:number;
    idNumber: string;
    isPrimary: boolean;
    createdAt?: Date;
    issuedAt?: Date;
    experiedAt?: Date;
}