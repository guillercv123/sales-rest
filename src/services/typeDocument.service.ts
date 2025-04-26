import { TypeDocumentRepository } from "../repositories/typeDocument.repository";
import { ITypeDocument } from "../types/typeDocument.interface";
import {ITypeDocumentService} from "./interfaces/typeDocument-service.interface";
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
