import {ClientResp} from "../../dto/client.resp";
import {IClientReq} from "../../types/client.interface";
/**
 * Interfaz para el servicio de Cliente.
 */
export interface IClientService{
    /**
     * Obtiene todos los clientes
     *  @return Promise<ClientResp[]>
     */
    findAll(): Promise<ClientResp>;
    /**
     *  Crea un cliente
     *  @param req
     *  @return Promise<ClientResp[]>
     */
     create(req:IClientReq): Promise<ClientResp>;
}