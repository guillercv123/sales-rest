// src/repositories/interfaces/type-document-repository.interface.ts

import { ITypeDocument } from "../../types/typeDocument.interface";

export interface ITypeDocumentRepository {
    findAll(): Promise<ITypeDocument[]>;
    create(description: string): Promise<number>;
    update(id: number, description: string): Promise<number>;
    deactivate(id: number): Promise<number>;
}
