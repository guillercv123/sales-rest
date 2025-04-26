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
     */
    create(description: string): Promise<number>;
    /**
     * Actualiza un tipo de documento existente.
     */
    update(id: number, description: string): Promise<number>;
    /**
     * Desactiva un tipo de documento.
     */
    deactivate(id: number): Promise<number>;
}
