import {IGenero} from "../../types/genero.interface";
/**
 * Interfaz para el servicios de Genero.
 */
export interface IGeneroService{
    /**
     * Obtiene todos los generos
     */
    findAll():Promise<IGenero[]>;
    /**
     * Crea un genero
     * @param description
     * @param createUser
     */
    create(description: string,createUser: string): Promise<IGenero>;
    /**
     * Actualiza un genero
     * @param id
     * @param description
     * @param updateUser
     */
    update(id: number,description: string,updateUser: string): Promise<IGenero>;
    /**
     * Eliminacion logica de un genero
     * @param id
     * @param userDelete
     */
    desactive(id: number,userDelete:string): Promise<number>;
}