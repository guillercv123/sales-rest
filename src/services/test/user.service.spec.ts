import 'reflect-metadata';
import { UserService } from '../user.service';
import { UserRepository } from '../../repositories/user.repository';
import {ConnectionMysql} from "../../db/mysql";
import {User} from "../../types/user.interface";
jest.mock('../../repositories/user.repository');

describe('UserService', ()=>{
    let userService: UserService;
    let userRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        const connection: ConnectionMysql = new ConnectionMysql();
        userRepository = new UserRepository(connection) as jest.Mocked<UserRepository>;
        userService = new UserService(userRepository);
    });

    it('debe llamar a getAllUsers del repositorio', async () => {
        userRepository.getAllUsers.mockResolvedValue([]);
        await userService.getAllUsers();
        expect(userRepository.getAllUsers).toHaveBeenCalled();
    });

    it('debe crear un usuario correctamente', async () => {
        const name = 'test';
        const password = '123456';
        const email = 'test@example.com';
        userRepository.create.mockResolvedValue([{ id: 1, name, password_user: password, email_user: email, created_date: new Date() }] as User[]);

        await userService.create(name, password, email);

        expect(userRepository.create).toHaveBeenCalledWith(name, password, email);
    });

    it('debe buscar usuario por email', async () => {
        const email = 'test@example.com';
        userRepository.getUserByEmail.mockResolvedValue([]);

        await userService.getUserByEmail(email);

        expect(userRepository.getUserByEmail).toHaveBeenCalledWith(email);
    });

    it('debe buscar usuario por nombre', async () => {
        const name = 'test';
        userRepository.getUserByName.mockResolvedValue([]);

        await userService.getUserByName(name);

        expect(userRepository.getUserByName).toHaveBeenCalledWith(name);
    });

    it('debe actualizar la contraseña por email', async () => {
        const email = 'test@example.com';
        const password = 'newpassword';
        userRepository.updatePasswordUserByEmail.mockResolvedValue([]);

        await userService.updatePasswordUserByEmail(email, password);

        expect(userRepository.updatePasswordUserByEmail).toHaveBeenCalledWith(email, password);
    });
})