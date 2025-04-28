import 'reflect-metadata';
import {UserService} from "../../services/user.service";
import {Request, Response} from "express";
import {LoginController} from "../login.controller";
import {MESSAGES} from "../../constants/message";
import bcrypt from 'bcrypt';

jest.mock('../../db/mysql', () => {
    return {
        __esModule: true,
        default: Promise.resolve({
            query: jest.fn(),
            execute: jest.fn(),
        }),
    };
});

jest.mock('bcrypt');

const mockRequest = (body = {}) => ({
    body,
} as Request);

const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockService = {
    getUserByName: jest.fn(),
} as unknown as UserService;

describe('LoginController', ()=>{
    let controller: LoginController;

    beforeEach(()=>{
        controller = new LoginController(mockService);
        jest.clearAllMocks();
    });

    test('getUser devuelve 404, sino existe un usuario', async ()=>{
        mockService.getUserByName = jest.fn().mockResolvedValue(null);
        const req = mockRequest({name: 'guillercv123', password: '12'});
        const res = mockResponse();

        await controller.getUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error: MESSAGES.USER_NOT_FOUND})
    });

    test('getUser devuelve 401, si la contraseña es incorrecta', async ()=>{
        const fakeUser = [{ password_user: 'hashed' }];
        mockService.getUserByName = jest.fn().mockResolvedValue(fakeUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        const req = mockRequest({name: 'guillercv123', password: 'hashedPwd'});
        const res = mockResponse();

        await controller.getUser(req, res);
        expect(bcrypt.compare).toHaveBeenCalledWith('hashedPwd', 'hashed');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: MESSAGES.INCORRECT_PASSWORD })
    });

    test('getUser devuelve 200, y el usuario si login OK', async ()=>{
        const fakeUser = [{ id:1, name:'foo', email_user:'foo@x.com', password_user:'hashed', created_date: new Date() }];
        mockService.getUserByName = jest.fn().mockResolvedValue(fakeUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        const req = mockRequest({name: 'foo', password: 'correctpass'});
        const res = mockResponse();

        await controller.getUser(req, res);

        expect(bcrypt.compare).toHaveBeenCalledWith('correctpass', 'hashed');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.LOGIN_SUCCESS,
            user: fakeUser
        });
    });

    test('debe devolver 500 si ocurre un error interno', async ()=>{
        const err = new Error('fail');
        mockService.getUserByName = jest.fn().mockRejectedValue(err);
        const req = mockRequest({ name: 'foo', password: 'bar' });
        const res = mockResponse();
        await controller.getUser(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: err.message });
    })
});
