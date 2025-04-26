import {Router} from "express";
import {container} from "tsyringe";
import {LoginController} from "../controllers/login.controller";
const router = Router();
const controller = container.resolve(LoginController);
router.post('/', controller.getUser.bind(controller));
export default router;