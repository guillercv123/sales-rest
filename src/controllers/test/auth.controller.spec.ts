import 'reflect-metadata';
import {Request, Response} from "express";
import {AuthController} from "../auth.controller";
import {UserService} from "../../services/user.service";
import {MESSAGES} from "../../constants/message";
import {User} from "../../types/user.interface";
import {validateCode} from "../../utils/codeStorage";

jest.useFakeTimers();

jest.mock('../../db/mysql', () => {
    return {
        __esModule: true,
        default: Promise.resolve({
            query: jest.fn(),
            execute: jest.fn(),
        }),
    };
});

jest.mock('../../utils/codeStorage', () => ({
    storeCode:   jest.fn(),
    validateCode: jest.fn(),
}));

jest.mock('nodemailer', () => {
    return {
            createTransport: jest.fn().mockReturnValue({
            sendMail: jest.fn().mockResolvedValue({}),  // nunca abre socket
            close: jest.fn(),                          // por si quieres cerrar
        }),
    };
});

const mockService = {
    getUserByEmail: jest.fn(),
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

describe('AuthController', ()=>{
    let controller: AuthController;

    beforeEach(()=>{
        controller = new AuthController(mockService);
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    test('sendResetCode devuelve un 400, y mesaje requerido', async ()=>{

        const req = mockRequest({});
        const res = mockResponse();

        await controller.sendResetCode(req,res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: MESSAGES.EMAIL_REQUIRED })
    });

    test('sendResetCode devuelve 400, y correo no existe', async ()=>{

        mockService.getUserByEmail = jest.fn().mockResolvedValue([]);

        const req = mockRequest({ email: 'guillercv123@gmail.com'});
        const res = mockResponse();

        await controller.sendResetCode(req,res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: MESSAGES.EMAIL_NOT_REGISTERED })
    });

    test('sendResetCode devuelve 200, y envia el codigo', async ()=> {
        const user:User[] = [{ id: 1, name: 'Guillermo', email_user: 'guillercv123', password_user: 'password123', created_date: new Date() }];
        mockService.getUserByEmail = jest.fn().mockResolvedValue(user);
        const req = mockRequest({ email: 'guillercv123@gmail.com'});
        const res = mockResponse();
        await controller.sendResetCode(req,res);
        const nodemailer = require('nodemailer');

        const transport = nodemailer.createTransport();
        expect(transport.sendMail).toHaveBeenCalledWith(
            expect.objectContaining({
                from: `"Soporte sistema de venta" <${process.env.MAIL_USER}>`,
                to: 'guillercv123@gmail.com',
                subject: 'Código de recuperación de contraseña',
                text: expect.stringMatching(/^Tu código de verificación es: \d{6}$/),
                html: expect.stringMatching(
                    /^<p>Tu código de verificación es: <b>\d{6}<\/b><\/p>$/
                ),
            })
        );

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: MESSAGES.CODE_SENT_SUCCESS})
    });

    test('validateResetCode devuelve un 400 cuando no se proporciona email o código', async () => {
        let req = mockRequest({});
        let res = mockResponse();

        controller.validateResetCode(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Email y código son requeridos" });


        req = mockRequest({ email: 'guillercv123@gmail.com' });
        res = mockResponse();

        controller.validateResetCode(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Email y código son requeridos" });

        // Caso 3: Con código pero sin email
        req = mockRequest({ code: '123456' });
        res = mockResponse();

        controller.validateResetCode(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Email y código son requeridos" });
    });

    test('validateResetCode devuelve 400 cuando el código es incorrecto o ha expirado', async () => {

        (validateCode as jest.Mock).mockReturnValue(false);

        const req = mockRequest({ email: 'guillercv123@gmail.com', code: '123456' });
        const res = mockResponse();

        controller.validateResetCode(req, res);

        expect(validateCode).toHaveBeenCalledWith('guillercv123@gmail.com', '123456');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Código incorrecto o expirado" });
    });

    test('validateResetCode devuelve 200 cuando el código es válido', async () => {
        const email = 'guillercv123@gmail.com';
        const code  = '123456';
        (validateCode as jest.Mock).mockReturnValue(true);
        const req = mockRequest({ email: 'guillercv123@gmail.com', code: '123456' });
        const res = mockResponse();

        controller.validateResetCode(req, res);

        expect(validateCode).toHaveBeenCalledWith(email, code);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Código validado correctamente" });
    });
});