import {ICustomer} from "./customer";
import {ICustomerIdentity} from "./customer-identity";
import {ICustomerAddress} from "./customer-address";

export interface ICustomerCreateRequest {
    customer: ICustomer,
    identity: ICustomerIdentity,
    address: ICustomerAddress
}