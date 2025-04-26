import { Router } from 'express';
import {ClientController} from "../controllers/client.controller";
import {container} from "tsyringe";

const router = Router();
const controller = container.resolve(ClientController);
router.post(
    "/",
    controller.create.bind(controller)
);

router.get(
    "/",
    controller.findAll.bind(controller)
);
export default router;
