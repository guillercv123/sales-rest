import {IPersistence} from "./persistence.interface";

export interface IClientReq extends IPersistence{
    fullName: string;
    surname: string;
    email: string;
    phone: string;
    idTypeDocument: number;
    idGenero: number;
}