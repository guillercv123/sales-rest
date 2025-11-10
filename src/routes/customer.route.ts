import {Router} from "express";
import {container} from "tsyringe";
import {CustomerController} from "../controllers/customer.controller";
const router = Router();
const controller = container.resolve(CustomerController);
router.post('/', controller.create.bind(controller));
export default router;