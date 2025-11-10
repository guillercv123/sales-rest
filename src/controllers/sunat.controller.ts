import { Request, Response, NextFunction } from 'express';
import {autoInjectable} from 'tsyringe';
import { SunatService } from '../services/sunat.service';

@autoInjectable()
export class SunatController {

    constructor(private readonly sunatService: SunatService,) {}

    /**
     * Consulta un RUC individual
     */
    async consultarRuc(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { ruc } = req.params;

            if (!ruc) {
                res.status(400).json({
                    success: false,
                    error: 'El parámetro RUC es requerido'
                });
                return;
            }

            const result = await this.sunatService.consultarPorRuc(ruc);

            if (!result.success) {
                res.status(404).json(result);
                return;
            }

            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}