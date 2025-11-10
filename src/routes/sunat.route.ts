import { Router } from 'express';
import { SunatController } from '../controllers/sunat.controller';
import {container} from "tsyringe";
import {ControllerWrapper} from "../utils/controller.wrapper";

const router = Router();
const controller = container.resolve(SunatController);
/**
 * @route   GET /api/sunat/consultar/:ruc
 * @desc    Consulta datos de un RUC
 * @access  Public
 */
router.post('/consultar/:ruc', ControllerWrapper.wrap(controller, 'consultarRuc'));

export default router;