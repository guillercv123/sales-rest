import {Router} from "express";
import { getUser } from '../controllers/login.controller';
const router = Router();
router.post('/', getUser);
export default router;