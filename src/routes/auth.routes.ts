import {Router} from "express";
import {AuthController} from "../controllers/auth.controller";
import {container} from "tsyringe";
const router = Router();
const controller = container.resolve(AuthController);
router.post('/send-reset-code', controller.sendResetCode.bind(controller));
router.post("/validate-reset-code", controller.validateResetCode.bind(controller));
export default router;