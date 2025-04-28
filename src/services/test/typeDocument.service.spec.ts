import 'reflect-metadata';
import {ConnectionMysql} from "../../db/mysql";
import {TypeDocumentService} from "../typeDocument.service";
import {TypeDocumentRepository} from "../../repositories/typeDocument.repository";
jest.mock('../../repositories/typeDocument.repository');

describe('TypeDocumentService', ()=>{
    let typeDocumentService: TypeDocumentService;
    let typeDocumentRepository: jest.Mocked<TypeDocumentRepository>;

    beforeEach(() => {
        const connection: ConnectionMysql = new ConnectionMysql();
        typeDocumentRepository = new TypeDocumentRepository(connection) as jest.Mocked<TypeDocumentRepository>;
        typeDocumentService = new TypeDocumentService(typeDocumentRepository);
    });

    test('se debe llamar a getAll del repositorio', async () => {
        typeDocumentRepository.findAll.mockResolvedValue([]);
        await typeDocumentService.getAll();
        expect(typeDocumentRepository.findAll).toHaveBeenCalled();
    });

    test('se debe crear un tipo de documento', async () => {
        const description = '123456';
        typeDocumentRepository.create.mockResolvedValue(1);

        await typeDocumentService.create(description);

        expect(typeDocumentRepository.create).toHaveBeenCalledWith(description);
    });

    test('se debe actualizar un tipo de documento', async () => {
        const description = '123456';
        const id = 1;
        typeDocumentRepository.update.mockResolvedValue(1);

        await typeDocumentService.update(id,description);

        expect(typeDocumentRepository.update).toHaveBeenCalledWith(id, description);
    });

    test('debe desactivar un tipo de documento', async () => {
        const id = 1;
        typeDocumentRepository.deactivate.mockResolvedValue(1);

        await typeDocumentService.deactivate(id);

        expect(typeDocumentRepository.deactivate).toHaveBeenCalledWith(id);
    });

})