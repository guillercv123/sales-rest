import {User} from "../../types/user.interface";

export interface IUserService{
    getAllUsers(): Promise<User[]>;
    create(name: string,password: string,email: string): Promise<User[]>;
    updatePasswordUserByEmail(email: string,password: string): Promise<User[]>;
    getUserByEmail(email: string):Promise<User[]>;
    getUserByName(name: string):Promise<User[]>;
}