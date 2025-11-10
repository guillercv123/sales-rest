import {CustomerService} from "../services/customer.service";
import {autoInjectable} from "tsyringe";
import {Request, Response} from 'express';
import {MESSAGES} from "../constants/message";

@autoInjectable()
export class CustomerController {
    constructor(private readonly customerService: CustomerService,) {}

    async create(req: Request, res: Response){
        const customerId = await this.customerService.create(req.body);
        return res.status(201).json({
            success: true,
            data: {
                customerId,
                message: MESSAGES.CLIENT_REGISTERED_SUCCESS
            }
        });
    }
}
