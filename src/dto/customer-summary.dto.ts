export interface ICustomerSummary {
    customerId: number;
    personTypeId: number;
    personType: string;
    fullName: string;
    emailMain: string | null;
    phoneMain: string | null;
    primaryDocument: string | null; // "DNI: 12345678"
    documentsCount: number;
    primaryAddress: string | null;
    addressesCount: number;
    createdAt: Date;
}