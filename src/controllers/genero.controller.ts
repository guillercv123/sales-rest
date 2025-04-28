import {autoInjectable} from "tsyringe";
import {GeneroService} from "../services/genero.service";
import {MESSAGES} from "../constants/message";

@autoInjectable()
export class GeneroController {
    constructor(private readonly generoService: GeneroService) {}
    /**
     * Obtiene todos los generos
     */
    async findAll(req:any, res:any){
        try{
            const data = await this.generoService.findAll();
            res.status(200).json({
                resp: data
            })
        }catch (error:any) {
            res.status(500).json({error: error.message})
        }
    }
    /**
     * Crea un genero
     * @param req
     * @param res
     */
    async create(req:any, res:any){
        const {description, createUser} = req.body;
        try{
            const result = await this.generoService.create(description,createUser);
            if(result){
                res.status(201).json({
                        message: MESSAGES.GENERO.GENERO_REGISTERED_SUCCESS,
                        resp: result
                });
            }
        }catch (error:any) {
            res.status(500).json({error: error.message})
        }
    }
    /**
     * Actualiza un genero
     * @param req
     * @param res
     */
    async update(req:any, res:any){
        const {id, description, updateUser} = req.body;
        try{
            const result = await this.generoService.update(id,description,updateUser);
            if(result){
                res.status(200).json({
                    message: MESSAGES.GENERO.GENERO_UPDATED_SUCCESS,
                    resp: result
                });
            }
        }catch (error:any) {
            res.status(500).json({error: error.message})
        }
    }
    /**
     * Eliminacion logica de un genero
     * @param req
     * @param res
     */
    async desactive(req:any, res:any){
        const {id,userDelete} = req.body;
        try{
            const data = await this.generoService.desactive(id,userDelete);
            res.status(200).json({
                resp: data
            })
        }catch (error:any) {
            res.status(500).json({error: error.message})
        }
    }

}