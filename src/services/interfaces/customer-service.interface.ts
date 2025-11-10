import {ICustomerCreateRequest} from "../../dto/customer-create-request";

export interface ICustomerService{
    create(req: ICustomerCreateRequest): Promise<number>;
}
