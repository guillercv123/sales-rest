import {ClientResp} from "../../dto/client.resp";
import {IClientReq} from "../../types/client.interface";
/**
 * Interfaz para el repositorio de Cliente.
 */
export interface IClientRepository {
    /**
     * Obtiene todos los clientes
     *  @return Promise<any[]>
     */
    findAll(): Promise<any[]>;
    /**
     *  Crea un cliente
     *  @param req
     *  @return Promise<ClientResp[]>
     */
    create(req:IClientReq): Promise<any[]>;
}