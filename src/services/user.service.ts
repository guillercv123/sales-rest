import {User} from "../types/user.interface";
import {UserRepository} from "../repositories/user.repository";
import {inject, injectable} from "tsyringe";
import {IUserService} from "./interfaces/user-service.interface";
@injectable()
export class UserService implements IUserService{
    constructor(
        @inject(UserRepository)
        private readonly repository:UserRepository) {
    }
    /**
     * Obtiene todos los usuarios.
     */
    async getAllUsers(){
        return this.repository.getAllUsers();
    }
    /**
     * Crea un usuario nuevo en el sistema
     * @param name
     * @param password
     * @param email
     */
    async create(name: string, password: string, email: string){
        return this.repository.create(name, password,email);
    }
    /**
     * Actualiza la password si se olvido por el email
     * @param email
     * @param password
     */
    async updatePasswordUserByEmail(email: string, password: string){
        return this.repository.updatePasswordUserByEmail(email, password);
    }
    /**
     *  Obtiene el usuario por el email.
     * @param email
     */
    async getUserByEmail(email: string){
        return this.repository.getUserByEmail(email);
    }
    /**
     * Obtiene el usuario por nombre
     * @param name
     */
    async getUserByName(name: string): Promise<any> {
        return this.repository.getUserByName(name);
    }

    async getPermissionUser(userId:number){
        return this.repository.getPermissionUser(userId);
    }
}