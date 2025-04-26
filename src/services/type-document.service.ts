import { TypeDocumentRepository } from "../repositories/type-document.repository";
import { ITypeDocument } from "../types/type-document.interface";
import {ITypeDocumentService} from "./interfaces/type-document-service.interface";
import {inject, injectable} from "tsyringe";
@injectable()
export class TypeDocumentService implements ITypeDocumentService{
    constructor(
        @inject(TypeDocumentRepository)
        private readonly repository: TypeDocumentRepository) {}

    async getAll(): Promise<ITypeDocument[]> {
        return this.repository.findAll();
    }

    async create(description: string): Promise<number> {
        return this.repository.create(description);
    }

    async update(id: number, description: string): Promise<number> {
        return this.repository.update(id, description);
    }

    async deactivate(id: number): Promise<number> {
        return this.repository.deactivate(id);
    }
}
