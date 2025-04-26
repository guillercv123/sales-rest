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
        }catch (err){
            res.status(500).json({error:err})
        }
    }
    /**
     * Crea un nuevo tipo de documento
     * @param req
     * @param res
     */
    async createTypeDocument (req:any, res:any) {
        const {description} = req.body;
        try{
            const idTypeDocument = await this.service.create(description);
            res.status(201).json({
                message: MESSAGES.TYPE_DOCUMENT.TYPE_DOCUMENT_REGISTERED_SUCCESS,
                resp: idTypeDocument
            })
        }catch (err) {
            res.status(500).json({
                error: err
            });
        }
    }
    /**
     * Actualiza un tipo de documento
     * @param req
     * @param res
     */
    async updateTypeDocument(req:any, res:any){
        const {description, id} = req.body;
        try{
         const resp = await this.service.update(id, description) === 1;
            res.status(200).json({
                message: MESSAGES.TYPE_DOCUMENT.TYPE_DOCUMENT_REGISTERED_SUCCESS,
                resp
            })
        }catch (err) {
            res.status(500).json({
                error: err
            })
        }
    }

    /**
     * Desactiva un tipo de documento con eliminacion logica cambia de 1 a 0
     * @param req
     * @param res
     */
    async desactiveTypeDocument(req:any, res:any) {
        const {id} = req.body;
        try{
            const resp = await this.service.deactivate(id) === 1;
            res.status(200).json({
                message: MESSAGES.TYPE_DOCUMENT.DESACTIVE,
                resp
            })
        }catch (err) {
            res.status(500).json({
                error: err
            });
        }
    }
}