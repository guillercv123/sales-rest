import {CustomerService} from "../services/customer.service";
import {autoInjectable} from "tsyringe";
import {Request, Response} from 'express';
import {MESSAGES} from "../constants/message";
import {ICustomerListQuery} from "../dto/customer-list-query.dto";

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

    async findAll(req: Request, res: Response){
        const query: ICustomerListQuery = {
            page: req.query.page ? Number(req.query.page) : undefined,
            limit: req.query.limit ? Number(req.query.limit) : undefined,
            sortBy: req.query.sortBy as string,
            sortOrder: req.query.sortOrder as 'ASC' | 'DESC',
            search: req.query.search as string,
            personTypeId: req.query.personTypeId ? Number(req.query.personTypeId) : undefined
        };

        const result = await this.customerService.findAll(query);
        return res.status(200).json(result);
    }

    async findById(req: Request, res: Response): Promise<Response | void> {
        const id = Number(req.params.id);
        const customer = await this.customerService.findById(id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Cliente no encontrado'
                }
            });
        }

        return res.status(200).json({
            success: true,
            data: customer
        });
    }

    async delete(req: Request, res: Response):Promise<Response | void>{
        const id = Number(req.params.id);
        await this.customerService.delete(id);
        return res.status(200).json({
            success: true,
            message: MESSAGES.CUSTOMER.DELETE_SUCCESS
        });
    }
}
