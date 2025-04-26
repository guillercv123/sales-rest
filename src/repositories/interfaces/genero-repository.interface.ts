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
     */
    create(description: string): Promise<number>;
    /**
     * Actualiza un genero
     * @param id
     * @param description
     */
    update(id: number,description: string): Promise<number>;
    /**
     * Eliminacion logica de un genero
     * @param id
     */
    desactive(id: number): Promise<number>;
}