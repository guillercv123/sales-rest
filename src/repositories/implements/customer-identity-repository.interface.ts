import {ICustomerIdentity} from "../../dto/customer-identity";

export interface ICustomerIdentityRepository{
    create(req: ICustomerIdentity): Promise<number>;
}