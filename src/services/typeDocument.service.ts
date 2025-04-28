import { TypeDocumentRepository } from "../repositories/typeDocument.repository";
import { ITypeDocument } from "../types/typeDocument.interface";
import {ITypeDocumentService} from "./interfaces/typeDocument-service.interface";
import {inject, injectable} from "tsyringe";
@injectable()
export class TypeDocumentService implements ITypeDocumentService{
    constructor(
        @inject(TypeDocumentRepository)
        private readonly repository: TypeDocumentRepository) {}
    /**
     * Obtiene todos los documentos de tipo.
     */
    async getAll(): Promise<ITypeDocument[]> {
        return this.repository.findAll();
    }
    /**
     * Crea un nuevo tipo documento.
     */
    async create(description: string,createUser:string): Promise<ITypeDocument> {
        return this.repository.create(description,createUser);
    }
    /**
     * Actualiza un tipo de documento existente.
     */
    async update(id: number, description: string, updateUser:string): Promise<ITypeDocument> {
        return this.repository.update(id, description, updateUser);
    }
    /**
     * Desactiva un tipo de documento.
     */
    async deactivate(id: number, deleteUser: string): Promise<number> {
        return this.repository.deactivate(id, deleteUser);
    }
}
