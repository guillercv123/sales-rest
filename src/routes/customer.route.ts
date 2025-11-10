import {Router} from "express";
import {container} from "tsyringe";
import {CustomerController} from "../controllers/customer.controller";
import {ControllerWrapper} from "../utils/controller.wrapper";
const router = Router();
const controller = container.resolve(CustomerController);
router.post('/', ControllerWrapper.wrap(controller, 'create'));
export default router;