import { Router } from 'express';
import {insertClient} from "../controllers/client.controller";

const router = Router();
router.post('/', insertClient);
export default router;
