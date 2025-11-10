import {CustomerService} from "../services/customer.service";
import {autoInjectable} from "tsyringe";
import {MESSAGES} from "../constants/message";
import {ICustomerCreateRequest} from "../dto/customer-create-request";

@autoInjectable()
export class CustomerController {
    constructor(private readonly customerService: CustomerService,) {}

    async create(req:any, res:any){
        const  request: ICustomerCreateRequest= req.body;
        try{
            const result = await this.customerService.create(request);
            if(result){
                res.status(201).json({
                    message: MESSAGES.CLIENT_REGISTERED_SUCCESS,
                    resp: result
                });
            }
        }catch (error:any) {
            res.status(500).json({error: error.message})
        }
    }
}
