import 'reflect-metadata';
import {ClientService} from "../../services/client.service";
import {Request, Response} from "express";
import {ClientController} from "../client.controller";
import {ClientResp} from "../../dto/client.resp";
import {MESSAGES} from "../../constants/message";
import {IClientReq} from "../../types/client.interface";

jest.mock('../../db/mysql', () => {
    return {
        __esModule: true,
        default: Promise.resolve({
            query: jest.fn(),
            execute: jest.fn(),
        }),
    };
});

const mockService = {
    findAll: jest.fn(),
    create: jest.fn(),
} as unknown as ClientService;

const mockRequest = (body = {}) => ({
    body,
} as Request);

const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('ClientController', ()=> {
    let controller: ClientController;
    beforeEach(()=>{
        controller = new ClientController(mockService);
        jest.clearAllMocks();
    });

    test('findAll devuelve 200, y retorna los clientes', async ()=>{
        const fakeValue: ClientResp[] = [{id: 1, fullName: 'fakename', surname: 'fakesurname', numberDocument: 'fakenumberDocument', email: 'fakemail',descriptionTypeDocument: '', descriptionGenero:'',
            createUser:'', createDate: ''}];
        mockService.findAll = jest.fn().mockReturnValue(fakeValue);
        const req = mockRequest();
        const res = mockResponse();

        await controller.findAll(req,res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({resp: fakeValue});
    });

    test('find devuelve 500, retorna mensaje de error', async()=>{
        const error = new Error('Error inesperado');
        mockService.findAll = jest.fn().mockRejectedValue(error);
        const req = mockRequest();
        const res = mockResponse();
        await controller.findAll(req,res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });

    test('create devuelve 201, retorna el cliente creado', async ()=>{
        const client: ClientResp[] =  [];
        const clientReq: IClientReq = {
            fullName: "",
            surname: "",
            email: "",
            phone: "",
            idTypeDocument:1,
            numberDocument: "",
            idGenero: 1,
            createDate: '2020-02-12T12:00:00Z',
            createUser: 'SYSTEM'
        }
        mockService.create = jest.fn().mockReturnValue(client);
        const req = mockRequest(clientReq);
        const res = mockResponse();
        await controller.create(req,res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: MESSAGES.CLIENT_REGISTERED_SUCCESS, client})
    });

    test('create devuelve 500, retorna el mensaje de error', async ()=>{
        const error = new Error('Error inesperado');
        mockService.create = jest.fn().mockRejectedValue(error);
        const clientReq: IClientReq = {
            fullName: "",
            surname: "",
            email: "",
            phone: "",
            idTypeDocument:1,
            numberDocument: "",
            idGenero: 1,
            createDate: '2020-02-12T12:00:00Z',
            createUser: 'SYSTEM'
        }
        const req = mockRequest(clientReq);
        const res = mockResponse();

        await controller.create(req,res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: error.message})
    });

})
