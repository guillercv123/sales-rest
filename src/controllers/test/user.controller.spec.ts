import 'reflect-metadata';
import { Request, Response } from 'express';
import {UserController} from "../user.controller";
import {UserService} from "../../services/user.service";
import {User} from "../../types/user.interface";
import {MESSAGES} from "../../constants/message";
import bcrypt from "bcrypt";

jest.mock('bcrypt'); // ¡mockea bcrypt para que no tarde!

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
    getAllUsers: jest.fn(),
    getUserByName: jest.fn(),
    getUserByEmail: jest.fn(),
    create: jest.fn(),
    updatePasswordUserByEmail:jest.fn()
} as unknown as UserService;

const mockRequest = (body = {}) => ({
    body,
} as Request);

const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('UserController', ()=>{
    let controller: UserController;
    beforeEach(() => {
        controller = new UserController(mockService);
        jest.clearAllMocks(); // Limpia los mocks en cada test
    });

    test('getUsers debe retornar status 200 y los usuarios', async () => {
        const users:User[] = [{ id: 1, name: 'Guillermo', email_user: 'guillercv123', password_user: '12', created_date: new Date() }];
        mockService.getAllUsers = jest.fn().mockResolvedValue(users);

        const req = mockRequest();
        const res = mockResponse();

        await controller.getUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ resp: users });
    });

    test('createUser debería devolver 400 si el username ya existe', async () => {
        const mockReq = {
            body: {
                name: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            }
        };
        const users:User[] = [{ id: 1, name: 'Guillermo', email_user: 'guillercv123', password_user: '12', created_date: new Date() }];
        mockService.getUserByName = jest.fn().mockResolvedValue(users);
        const req = mockRequest(mockReq.body);
        const res = mockResponse();

        await controller.createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: MESSAGES.USERNAME_TAKEN });
    });

    test('createUser deberia devolver 400 si el correo ya existe', async ()=>{
        const mockReq = {
            body: {
                name: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            }
        };
        const users:User[] = [{ id: 1, name: 'Guillermo', email_user: 'guillercv123', password_user: '12', created_date: new Date() }];
        mockService.getUserByName = jest.fn().mockReturnValue([]);
        mockService.getUserByEmail = jest.fn().mockReturnValue(users);
        const req = mockRequest(mockReq);
        const res = mockResponse();

        await controller.createUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({error: MESSAGES.EMAIL_ALREADY_REGISTERED})
    });

    test('createUser deberia devolver 201, y el usuario creado', async () => {
        const user:User[] = [{ id: 1, name: 'Guillermo', email_user: 'guillercv123', password_user: 'password123', created_date: new Date() }];
        mockService.getUserByName = jest.fn().mockResolvedValue([]);
        mockService.getUserByEmail = jest.fn().mockReturnValue([]);
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');

        mockService.create =  jest.fn().mockResolvedValue(user);
        const req = mockRequest({
            name: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        });
        const res = mockResponse();

        await controller.createUser(req, res);
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: MESSAGES.USER_REGISTERED_SUCCESS, user });
    });

    test('createUser deberia devolver 500 y manejar errores', async ()=> {
        const mockReq = {
            body: {
                name: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            }
        };
        const error = new Error('Error inesperado');

        mockService.getUserByName = jest.fn().mockRejectedValue(error);

        const req = mockRequest(mockReq);
        const res = mockResponse();

        await controller.createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: error.message});
    })

    test('updatePasswordUser deberia devolver 200 y actualizar el usuario', async () => {
        const mockReq = {
            body: {
                email: 'test@example.com',
                password: 'password123'
            }
        };
        const user: User[] = [{
            id: 1,
            name: 'Guillermo',
            email_user: 'guillercv123',
            password_user: '12',
            created_date: new Date()
        }];
        mockService.updatePasswordUserByEmail = jest.fn().mockResolvedValue(user);

        const req = mockRequest(mockReq);
        const res = mockResponse();
        await controller.updatePasswordUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: MESSAGES.USER_UPDATED_SUCCESS, user })
    });

    test('updatePasswordUser deberia devolver 500 y manejar error', async ()=>{
        const error = new Error('data and salt arguments required');
        mockService.updatePasswordUserByEmail = jest.fn().mockRejectedValue(error);
        const req = mockRequest();
        const res = mockResponse();
        await controller.updatePasswordUser(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: error.message});
    });

});

