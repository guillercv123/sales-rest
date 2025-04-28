import {GeneroRepository} from "../repositories/genero.repository";
import {inject, injectable} from "tsyringe";
import {IGenero} from "../types/genero.interface";
import {IGeneroService} from "./interfaces/genero-service.interface";
@injectable()
export class GeneroService implements IGeneroService{

    constructor(
        @inject(GeneroRepository)
        private readonly generoRepository: GeneroRepository) {
    }

    async findAll():Promise<IGenero[]>{
        return this.generoRepository.fillAll();
    }

    async create(description:string,createUser: string):Promise<IGenero>{
        return this.generoRepository.create(description, createUser);
    }

    async update(id: number, description: string, updateUser: string): Promise<IGenero>{
        return this.generoRepository.update(id, description, updateUser);
    }

    async desactive(id:number,userDelete:string): Promise<number> {
        return this.generoRepository.desactive(id, userDelete);
    }
}