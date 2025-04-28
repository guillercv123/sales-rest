import {
    UserService
} from '../services/user.service';
import bcrypt from "bcrypt";
import {MESSAGES} from "../constants/message";
import {autoInjectable} from "tsyringe";
@autoInjectable()
export class UserController{
    constructor(private readonly service: UserService) {}
    /**
     * Obtiene todos los usuarios
     * @param req
     * @param res
     */
    async getUsers(req:any, res:any) {
        try {
            const users = await this.service.getAllUsers();
            res.status(200).json({resp:users});
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
    /**
     * Crea usuarios nuevos.
     * @param req
     * @param res
     */
    async createUser(req:any, res:any) {
        const { name, password ,email } = req.body;
        try {
            const existingUser = await this.service.getUserByName(name);
            if (existingUser && existingUser.length > 0) {
                return res.status(400).json({ error: MESSAGES.USERNAME_TAKEN });
            }
            const existingEmail = await this.service.getUserByEmail(email);
            if (existingEmail && existingEmail.length > 0) {
                return res.status(400).json({ error: MESSAGES.EMAIL_ALREADY_REGISTERED});
            }
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const user = await this.service.create(name,hashedPassword, email);
            res.status(201).json({ message: MESSAGES.USER_REGISTERED_SUCCESS, user});
        } catch (err:any) {
            res.status(500).json({ error: err.message });
        }
    }
    /**
     * Actualiza la password del usuario
     * @param req
     * @param res
     */
    async updatePasswordUser(req:any , res:any){
        const { password ,email } = req.body;
        try{
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const user = await this.service.updatePasswordUserByEmail(email,hashedPassword);
            res.status(200).json({ message: MESSAGES.USER_UPDATED_SUCCESS, user});
        }catch (err:any) {
            res.status(500).json({ error: err.message });
        }
    }
}