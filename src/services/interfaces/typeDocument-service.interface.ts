
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
     */
    create(description: string): Promise<number>;
    /**
     * Actualiza un tipo de documento existente.
     * @param id ID del documento a actualizar.
     * @param description Nueva descripción del documento.
     */
    update(id: number, description: string): Promise<number>;
    /**
     * Desactiva un tipo de documento.
     * @param id ID del documento a desactivar.
     */
    deactivate(id: number): Promise<number>;
}