
import { ITypeDocument } from "../../types/typeDocument.interface";
/**
 * Interfaz para el servicio de TypeDocument.
 */
export interface ITypeDocumentService {
    /**
     * Obtiene todos los tipo de documento.
     */
    getAll(): Promise<ITypeDocument[]>;
    /**
     * Crea un nuevo tipo de documento.
     * @param description Descripción del documento.
     * @param createUser
     */
    create(description: string,createUser: string): Promise<ITypeDocument>;
    /**
     * Actualiza un tipo de documento existente.
     * @param id ID del documento a actualizar.
     * @param description Nueva descripción del documento.
     * @param updateUser
     */
    update(id: number, description: string,updateUser: string): Promise<ITypeDocument>;
    /**
     * Desactiva un tipo de documento.
     * @param id ID del documento a desactivar.
     * @param deleteUser
     */
    deactivate(id: number, deleteUser: string): Promise<number>;
}