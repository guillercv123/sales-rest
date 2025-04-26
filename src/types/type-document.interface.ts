import {IPersistence} from "./persistence.interface";

export interface ITypeDocument extends IPersistence{
    id:number;
    description:string;
}