import {Router} from "express";
import {TypeDocumentController} from "../controllers/type-document.controller";
import {container} from "tsyringe";

const router = Router();
const controller = container.resolve(TypeDocumentController);
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