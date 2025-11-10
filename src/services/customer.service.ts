import {inject, injectable} from "tsyringe";
import {ICustomerService} from "./interfaces/customer-service.interface";
import {CustomerRepository} from "../repositories/customer.repository";
import {ICustomerCreateRequest} from "../dto/customer-create-request";

@injectable()
export class CustomerService implements ICustomerService {
    constructor(
        @inject(CustomerRepository)
        private readonly customerRepository: CustomerRepository) {
    }

    async create(req: ICustomerCreateRequest):Promise<number>{
        return this.customerRepository.create(req);
    }
}