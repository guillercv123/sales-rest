import { Router } from 'express';
import {UserController} from '../controllers/user.controller';
import {container} from "tsyringe";
const router = Router();
const controller = container.resolve(UserController);
router.get('/', controller.getUsers.bind(controller));
router.post('/', controller.createUser.bind(controller));
router.post('/reset-password', controller.updatePasswordUser.bind(controller));
export default router;
