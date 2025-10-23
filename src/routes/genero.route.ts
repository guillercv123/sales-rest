import {Router} from "express";
import {container} from "tsyringe";
import {GeneroController} from "../controllers/genero.controller";

const router = Router();
const controller = container.resolve(GeneroController);
router.get(
    "/",
    controller.findAll.bind(controller)
);

router.post(
    "/",
    controller.create.bind(controller)
);

router.put(
    "/",
    controller.update.bind(controller)
);

router.patch(
    "" +
    "",
    controller.desactive.bind(controller)
);
export default router;