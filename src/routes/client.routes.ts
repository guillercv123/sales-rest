import { Router } from 'express';
import {insertClient, listClient} from "../controllers/client.controller";

const router = Router();
router.post('/', insertClient);
router.get('/', listClient);
export default router;
