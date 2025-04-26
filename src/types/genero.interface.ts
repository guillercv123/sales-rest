import {IPersistence} from "./persistence.interface";

export interface IGenero extends IPersistence{
    id:number;
    description: string;
}