import { ITypeDocument } from "../../types/typeDocument.interface";

/**
 * Interfaz para el repositorio de TypeDocument.
 */
export interface ITypeDocumentRepository {
    /**
     * Obtiene todos los documentos de tipo.
     */
    findAll(): Promise<ITypeDocument[]>;
    /**
     * Crea un nuevo tipo documento.
     * @param description
     * @param createUser
     */
    create(description: string,createUser: string): Promise<ITypeDocument>;
    /**
     * Actualiza un tipo de documento existente.
     * @param id
     * @param description
     * @param createUpdate
     */
    update(id: number, description: string, createUpdate: string): Promise<ITypeDocument>;
    /**
     * Desactiva un tipo de documento.
     * @param id
     * @param deleteUser
     */
    deactivate(id: number, deleteUser: string): Promise<number>;
}
