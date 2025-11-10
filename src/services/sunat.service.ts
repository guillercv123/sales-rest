// src/services/sunat.service.ts

import { singleton, inject } from "tsyringe";
import {SunatRepository} from "../repositories/sunat-repository";
import {SunatResponse} from "../repositories/type/sunat.interface";


@singleton()
export class SunatService {

    constructor(
        @inject(SunatRepository) private readonly sunatRepository: SunatRepository
    ) {}

    /**
     * Consulta datos de un contribuyente por RUC
     * @param ruc - Número de RUC
     * @returns Datos del contribuyente
     */
    async consultarPorRuc(ruc: string): Promise<SunatResponse> {
        return await this.sunatRepository.scrapeSunat(ruc);
    }

    /**
     * Consulta múltiples RUCs de forma secuencial
     * @param rucs - Array de RUCs a consultar
     * @param delayMs - Delay entre consultas en milisegundos
     * @returns Array con las respuestas
     */
    async consultarMultiples(
        rucs: string[],
        delayMs: number = 2000
    ): Promise<SunatResponse[]> {
        const results: SunatResponse[] = [];

        for (const ruc of rucs) {
            const result = await this.consultarPorRuc(ruc);
            results.push(result);

            // Esperar entre consultas para no sobrecargar SUNAT
            if (rucs.indexOf(ruc) < rucs.length - 1) {
                await this.delay(delayMs);
            }
        }

        return results;
    }

    /**
     * Verifica si un RUC está activo y habido
     * @param ruc - Número de RUC
     * @returns true si está activo y habido
     */
    async verificarEstadoActivo(ruc: string): Promise<boolean> {
        const response = await this.consultarPorRuc(ruc);

        if (!response.success || !response.data) {
            return false;
        }

        return response.data.estado.toLowerCase().includes('activo') &&
            response.data.condicion.toLowerCase().includes('habido');
    }

    /**
     * Obtiene solo información básica del contribuyente
     * @param ruc - Número de RUC
     * @returns Información básica
     */
    async obtenerInformacionBasica(ruc: string): Promise<{
        ruc: string;
        razonSocial: string;
        estado: string;
        condicion: string;
    } | null> {
        const response = await this.consultarPorRuc(ruc);

        if (!response.success || !response.data) {
            return null;
        }

        return {
            ruc: response.data.ruc,
            razonSocial: response.data.razonSocial,
            estado: response.data.estado,
            condicion: response.data.condicion
        };
    }

    /**
     * Espera un tiempo específico
     * @param ms - Milisegundos a esperar
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}