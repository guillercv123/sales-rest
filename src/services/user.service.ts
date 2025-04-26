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
    getAllUsers(){
        return this.repository.getAllUsers();
    }

    create(name: string, password: string, email: string){
        return this.repository.create(name, password,email);
    }

    updatePasswordUserByEmail(email: string, password: string){
        return this.repository.updatePasswordUserByEmail(email, password);
    }

    getUserByEmail(email: string){
        return this.repository.getUserByEmail(email);
    }

    getUserByName(name: string): Promise<User[]> {
        return this.repository.getUserByName(name);
    }
}