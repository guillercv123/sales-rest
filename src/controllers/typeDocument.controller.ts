import {TypeDocumentService} from "../services/typeDocument.service";
import {MESSAGES} from "../constants/message";
import {autoInjectable} from "tsyringe";
@autoInjectable()
export class TypeDocumentController {
    constructor(private readonly service: TypeDocumentService) {}
    /**
     * Obtiene todos los tipo de documentos
     * @param req
     * @param res
     */
    async getAll(req:any, res:any) {
        try {
            const typeDocuments = await this.service.getAll();
            res.status(200).json({resp: typeDocuments})
        }catch (err:any) {
            res.status(500).json({error:err.message})
        }
    }
    /**
     * Crea un nuevo tipo de documento
     * @param req
     * @param res
     */
    async createTypeDocument (req:any, res:any) {
        const {description,createUser} = req.body;
        try{
            const typeDocument = await this.service.create(description,createUser);
            res.status(201).json({
                message: MESSAGES.TYPE_DOCUMENT.TYPE_DOCUMENT_REGISTERED_SUCCESS,
                resp: typeDocument
            })
        }catch (err:any) {
            res.status(500).json({
                error: err.message
            });
        }
    }
    /**
     * Actualiza un tipo de documento
     * @param req
     * @param res
     */
    async updateTypeDocument(req:any, res:any){
        const {id, description, updateUser} = req.body;
        try{
         const typeDocument = await this.service.update(id, description, updateUser);
            res.status(200).json({
                message: MESSAGES.TYPE_DOCUMENT.TYPE_DOCUMENT_REGISTERED_SUCCESS,
                resp: typeDocument
            })
        }catch (err:any) {
            res.status(500).json({
                error: err.message
            })
        }
    }

    /**
     * Desactiva un tipo de documento con eliminacion logica cambia de 1 a 0
     * @param req
     * @param res
     */
    async desactiveTypeDocument(req:any, res:any) {
        const {id,userDelete} = req.body;
        try{
            const typeDocument = await this.service.deactivate(id,userDelete);
            res.status(200).json({
                message: MESSAGES.TYPE_DOCUMENT.DESACTIVE,
                resp: typeDocument
            })
        }catch (err:any) {
            res.status(500).json({
                error: err.message
            });
        }
    }
}