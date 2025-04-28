import {User} from "../../types/user.interface";
/**
 * Interfaz para el repositorio de Usuario.
 */
export interface IUserRepository{
    /**
     * Obtiene todos los usuarios.
     */
    getAllUsers(): Promise<User[]>;
    /**
     * Crea un usuario nuevo en el sistema
     * @param name
     * @param password
     * @param email
     */
    create(name: string,password: string,email: string): Promise<User[]>;
    /**
     * Actualiza la password si se olvido por el email
     * @param email
     * @param password
     */
    updatePasswordUserByEmail(email: string,password: string): Promise<User[]>;
    /**
     *  Obtiene el usuario por el email.
     * @param email
     */
    getUserByEmail(email: string):Promise<User[]>;
    /**
     * Obtiene el usuario por nombre
     * @param name
     */
    getUserByName(name: string):Promise<User[]>;
}