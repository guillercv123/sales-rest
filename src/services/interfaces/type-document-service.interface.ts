
import { ITypeDocument } from "../../types/type-document.interface";

export interface ITypeDocumentService {
    getAll(): Promise<ITypeDocument[]>;
    create(description: string): Promise<number>;
    update(id: number, description: string): Promise<number>;
    deactivate(id: number): Promise<number>;
}