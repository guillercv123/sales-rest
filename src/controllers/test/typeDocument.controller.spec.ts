import 'reflect-metadata';
import { TypeDocumentController } from '../typeDocument.controller';
import { Request, Response } from 'express';
import {TypeDocumentService} from "../../services/typeDocument.service";

jest.mock('../../db/mysql', () => {
    return {
        __esModule: true,
        default: Promise.resolve({
            query: jest.fn(),
            execute: jest.fn(),
        }),
    };
});
// Mocks
const mockService = {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    deactivate: jest.fn(),
} as unknown as TypeDocumentService;

const mockRequest = (body = {}) => ({
    body,
} as Request);

const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('TypeDocumentController', () => {
    let controller: TypeDocumentController;

    beforeEach(() => {
        controller = new TypeDocumentController(mockService);
        jest.clearAllMocks(); // Limpia los mocks en cada test
    });

    test('getAll debe retornar status 200 y los documentos', async () => {
        const documents = [{ id: 1, description: 'DNI' }];
        mockService.getAll = jest.fn().mockResolvedValue(documents);

        const req = mockRequest();
        const res = mockResponse();

        await controller.getAll(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ resp: documents });
    });

    test('create debe retornar status 201 y el id creado', async () => {
        mockService.create = jest.fn().mockResolvedValue(1);

        const req = mockRequest({ description: 'DNI' });
        const res = mockResponse();

        await controller.createTypeDocument(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            resp: 1,
        }));
    });

    test('update debe retornar status 200 después de actualizar', async () => {
        mockService.update = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest({ id: 1, description: 'DNI actualizado' });
        const res = mockResponse();

        await controller.updateTypeDocument(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.any(String),
        }));
    });

    test('deactivate debe retornar status 200 después de desactivar', async () => {
        mockService.deactivate = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest({ id: 1 });
        const res = mockResponse();

        await controller.desactiveTypeDocument(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.any(String),
        }));
    });
});
