import { Router } from 'express';
import {container} from "tsyringe";
import {MenuController} from "../controllers/menu.controller";
const router = Router();
const controller = container.resolve(MenuController);
router.post('/', controller.createMenu.bind(controller));
export default router;
