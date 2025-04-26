import {TypeDocumentService} from "../services/type-document.service";
import {MESSAGES} from "../constants/message";
import {autoInjectable} from "tsyringe";
@autoInjectable()
export class TypeDocumentController {
    constructor(private service?: TypeDocumentService) {}

    async getAll(req:any, res:any) {
        try {
            const typeDocuments = await this.service!.getAll();
            res.status(200).json({resp: typeDocuments})
        }catch (err){
            res.status(500).json({error:err})
        }
    }

    async createTypeDocument (req:any, res:any) {
        const {description} = req.body;
        try{
            const idTypeDocument = await this.service!.create(description);
            res.status(200).json({
                message: MESSAGES.TYPE_DOCUMENT.TYPE_DOCUMENT_REGISTERED_SUCCESS,
                resp: idTypeDocument
            })
        }catch (err) {
            res.status(500).json({
                error: err
            });
        }
    }

    async updateTypeDocument(req:any, res:any){
        const {description, id} = req.body;
        try{
         const resp = await this.service!.update(id, description) === 1;
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

    async desactiveTypeDocument(req:any, res:any) {
        const {id} = req.body;
        try{
            const resp = await this.service!.deactivate(id) === 1;
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