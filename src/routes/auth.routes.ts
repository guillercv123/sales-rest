import {Router} from "express";
import {sendResetCode, validateResetCode} from "../controllers/auth.controller";
const router = Router();
router.post('/send-reset-code', sendResetCode);
router.post("/validate-reset-code", validateResetCode);
export default router;