import {GeneroRepository} from "../repositories/genero.repository";
import {inject, injectable} from "tsyringe";
import {IGenero} from "../types/genero.interface";
import {IGeneroService} from "./implements/genero-service.interface";
@injectable()
export class GeneroService implements IGeneroService{

    constructor(
        @inject(GeneroRepository)
        private readonly generoRepository: GeneroRepository) {
    }
    /**
     * Obtiene todos los generos
     */
    async findAll():Promise<IGenero[]>{
        return this.generoRepository.fillAll();
    }
    /**
     * Crea un genero
     * @param description
     * @param createUser
     */
    async create(description:string,createUser: string):Promise<IGenero>{
        return this.generoRepository.create(description, createUser);
    }
    /**
     * Actualiza un genero
     * @param id
     * @param description
     * @param updateUser
     */
    async update(id: number, description: string, updateUser: string): Promise<IGenero>{
        return this.generoRepository.update(id, description, updateUser);
    }
    /**
     * Eliminacion logica de un genero
     * @param id
     * @param userDelete
     */
    async desactive(id:number,userDelete:string): Promise<number> {
        return this.generoRepository.desactive(id, userDelete);
    }
}