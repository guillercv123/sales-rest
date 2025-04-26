import {Router} from "express";
import {TypeDocumentController} from "../controllers/type-document.controller";
import {TypeDocumentService} from "../services/type-document.service";
const router = Router();
const controller = new TypeDocumentController(new TypeDocumentService);

router.get(
    "/",
    controller.getAll.bind(controller)
);

router.post(
    "/",
    controller.createTypeDocument.bind(controller)
);

router.put(
    "/",
    controller.updateTypeDocument.bind(controller)
);

router.patch(
    "/eliminar",
    controller.desactiveTypeDocument.bind(controller)
);
export default router;