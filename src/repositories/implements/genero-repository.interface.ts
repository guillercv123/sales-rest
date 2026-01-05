import {IGenero} from "../../types/genero.interface";
/**
 * Interfaz para el repositorio de Genero.
 */
export interface IGeneroRepository {
    /**
     * Obtiene todos los generos
     */
    fillAll():Promise<IGenero[]>;
    /**
     * Crea un genero
     * @param description
     * @param create_user
     */
    create(description: string,create_user: string): Promise<IGenero>;
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
    desactive(id: number, userDelete:string): Promise<number>;
}