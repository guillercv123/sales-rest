import {ICustomerCreateRequest} from "../../dto/customer-create-request";

export interface ICustomerRepository{
    create(req: ICustomerCreateRequest): Promise<number>;
}