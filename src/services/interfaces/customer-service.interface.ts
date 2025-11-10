import {ICustomerCreateRequest} from "../../dto/customer-create-request";
import {ICustomerListQuery} from "../../dto/customer-list-query.dto";
import {IPaginatedResponse} from "../../dto/pagination.dto";
import {ICustomer} from "../../dto/customer";
import {ICustomerSummary} from "../../dto/customer-summary.dto";

export interface ICustomerService{
    create(req: ICustomerCreateRequest): Promise<number>;
    findAll(query: ICustomerListQuery): Promise<IPaginatedResponse<ICustomerSummary>>;
    findById(id: number): Promise<ICustomer | null>;
}
