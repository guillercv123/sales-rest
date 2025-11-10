import {singleton} from "tsyringe";
import {ICustomerRepository} from "./interfaces/customer-repository.interface";
import {ConnectionMysql} from "../db/mysql";
import {ICustomerCreateRequest} from "../dto/customer-create-request";
import {CustomerIdentityRepository} from "./customer-identity.repository";
import {CustomerAddressRepository} from "./customer-address.repository";


@singleton()
export class CustomerRepository implements ICustomerRepository{
    constructor(private readonly connection: ConnectionMysql,
                private customerIdentityRepository: CustomerIdentityRepository,
                private customerAddressRepository: CustomerAddressRepository) {
    }

    async create(req: ICustomerCreateRequest): Promise<number>{
        const conn = await this.connection.getConnection();

        try {
            await conn.beginTransaction();
            const {customer, identity, address} = req;
            const [result]: any = await conn.execute(
                `INSERT INTO customer (
                          person_type_id, first_name,
                          middle_name, last_name, 
                          birth_date, legal_name, 
                          trade_name, email_main, 
                          phone_main) VALUES (?,?,?,?,?,?,?,?,?);`,
                [
                    customer.personTypeId,
                    customer?.firstName,
                    customer?.middleName,
                    customer?.lastName,
                    customer?.birthDate,
                    customer?.legalName,
                    customer?.tradeName,
                    customer?.emailMain,
                    customer?.phoneMain
                ]
            );
            identity.customerId = result.insertId;
            await this.customerIdentityRepository.create(identity);
            if(address){
                address.customerId = result.insertId;
                await this.customerAddressRepository.create(address);
            }
            await conn.commit();
            return result.insertId;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }
}