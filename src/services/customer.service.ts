import {inject, injectable} from "tsyringe";
import {ICustomerService} from "./implements/customer-service.interface";
import {CustomerRepository} from "../repositories/customer.repository";
import {ICustomerCreateRequest} from "../dto/customer-create-request";
import {ICustomerListQuery} from "../dto/customer-list-query.dto";
import {IPaginatedResponse} from "../dto/pagination.dto";
import {ICustomer} from "../dto/customer";
import {ICustomerSummary} from "../dto/customer-summary.dto";

@injectable()
export class CustomerService implements ICustomerService {
    constructor(
        @inject(CustomerRepository)
        private readonly customerRepository: CustomerRepository) {
    }

    async create(req: ICustomerCreateRequest):Promise<number>{
        return this.customerRepository.create(req);
    }

    async findAll(query: ICustomerListQuery):Promise<IPaginatedResponse<ICustomerSummary>>{
        return this.customerRepository.findAll(query)
    }

    async findById(id: number): Promise<ICustomer | null>{
        return this.customerRepository.findById(id);
    }

    async delete(id: number): Promise<boolean>{
        return this.customerRepository.delete(id);
    }
}