import { singleton } from "tsyringe";
import axios, { AxiosInstance, AxiosError } from 'axios';
import * as cheerio from 'cheerio';

import { SunatData, SunatResponse, SunatScraperConfig } from './type/sunat.interface';
import { NetworkError, NotFoundError, ScrapingError, ValidationError } from '../errors/sunat.error';

@singleton()
export class SunatRepository {

    private readonly baseUrl: string = 'https://e-consultaruc.sunat.gob.pe';
    private readonly searchPath: string = '/cl-ti-itmrconsruc/jcrS00Alias';
    private readonly framePath: string = '/cl-ti-itmrconsruc/FrameCriterioBusquedaWeb.jsp';
    private readonly axiosInstance: AxiosInstance;
    private readonly config: Required<SunatScraperConfig>;

    constructor() {
        this.config = {
            // @ts-ignore
            timeout: process.env.TIMEOUT || 30000,
            maxRetries: 3,
            retryDelay: 1000
        };

        this.axiosInstance = axios.create({
            baseURL: this.baseUrl,
            timeout: this.config.timeout,
            maxRedirects: 5,
            decompress: true
        });
    }

    private getFirstRequestHeaders() {
        return {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'es-ES,es;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',  // ⭐ none en la primera
            'Sec-Fetch-User': '?1',
            'Sec-Ch-Ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"'
        };
    }

    private getSecondRequestHeaders(cookies: string) {
        return {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'es-ES,es;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Origin': 'https://e-consultaruc.sunat.gob.pe',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',  // ⭐ same-origin en la segunda
            'Sec-Fetch-User': '?1',
            'Sec-Ch-Ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Referer': 'https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/FrameCriterioBusquedaWeb.jsp',
            'Cookie': cookies
        };
    }

    /**
     * Ejecuta la consulta con lógica de reintentos
     * @param ruc - RUC a consultar
     * @param attempt - Número de intento actual
     * @returns Datos del contribuyente
     */
    private async fetchWithRetry(ruc: string, attempt: number = 1): Promise<SunatData | null> {
        try {
            return await this.performScraping(ruc);
        } catch (error) {
            if (attempt < this.config.maxRetries && this.isRetryableError(error)) {
                await this.delay(this.config.retryDelay * attempt);
                return this.fetchWithRetry(ruc, attempt + 1);
            }
            throw error;
        }
    }

    async scrapeSunat(ruc: string): Promise<SunatResponse> {
        try {
            // Realizar scraping con reintentos
            const data = await this.fetchWithRetry(ruc);

            if (!data) {
                return {
                    success: false,
                    error: 'No se encontraron datos para el RUC proporcionado'
                };
            }

            return {
                success: true,
                data
            };

        } catch (error) {
            return this.handleError(error);
        }
    }
    /**
     * Realiza el scraping efectivo de los datos
     * @param ruc - RUC a consultar
     * @returns Datos del contribuyente
     */
    private async performScraping(ruc: string): Promise<SunatData | null> {
        try {
            // Primera petición para obtener cookies
            const firstResponse = await this.axiosInstance.get(
                this.framePath,
                { headers: this.getFirstRequestHeaders() }
            );

            const cookies = this.extractCookies(firstResponse.headers['set-cookie']);

            await this.delay(1500);
            // Segunda petición con los datos del formulario
            const formData = new URLSearchParams({
                'accion': 'consPorRuc',
                'nroRuc': ruc,
                'actReturn': '1'
            });

            const response = await this.axiosInstance.post(
                this.searchPath,
                formData,
                { headers: this.getSecondRequestHeaders(cookies) }
            );

            // Verificar si la respuesta es válida
            if (response.status === 404 || !response.data) {
                throw new NotFoundError('No se encontraron datos para el RUC proporcionado');
            }

            // Parsear HTML y extraer datos
            return this.parseHtmlResponse(response.data, ruc);

        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new NetworkError(`Error de red al consultar SUNAT: ${error.message}`);
            }
            throw error;
        }
    }

    /**
     * Extrae y parsea las cookies de la respuesta
     * @param setCookieHeader - Header set-cookie de la respuesta
     * @returns String con las cookies formateadas
     */
    private extractCookies(setCookieHeader?: string[]): string {
        if (!setCookieHeader || setCookieHeader.length === 0) {
            return '';
        }
        return setCookieHeader.join('; ');
    }

    /**
     * Parsea el HTML de respuesta y extrae los datos
     * @param html - HTML a parsear
     * @param ruc - RUC consultado
     * @returns Datos extraídos o null si no se encontraron
     */
    private parseHtmlResponse(html: string, ruc: string): SunatData | null {
        const $ = cheerio.load(html);

        const data: SunatData = {
            ruc,
            razonSocial: '',
            tipoContribuyente: '',
            nombreComercial: '',
            fechaInscripcion: '',
            fechaInicioActividades: '',
            estado: '',
            condicion: '',
            direccion: '',
            sistemaEmision: '',
            actividadComercial: '',
            sistemaContabilidad: '',
            fechaConsulta: new Date().toISOString()
        };

        // Extraer datos de los elementos de la lista
        this.extractListGroupData($, data, ruc);

        // Extraer razón social
        this.extractRazonSocial($, data);

        // Validar que se encontraron datos mínimos
        if (!data.razonSocial && !data.estado) {
            return null;
        }

        return data;
    }
    /**
     * Extrae datos de los elementos list-group
     * @param $ - Instancia de Cheerio
     * @param data - Objeto donde se almacenarán los datos
     * @param ruc - RUC consultado
     */
    // @ts-ignore
    private extractListGroupData($: cheerio.Root, data: SunatData, ruc: string): void {
        const fieldMappings: Record<string, keyof SunatData> = {
            'Número de RUC:': 'ruc',
            'Tipo Contribuyente:': 'tipoContribuyente',
            'Nombre Comercial:': 'nombreComercial',
            'Fecha de Inscripción:': 'fechaInscripcion',
            'Fecha de Inicio de Actividades:': 'fechaInicioActividades',
            'Estado del Contribuyente:': 'estado',
            'Condición del Contribuyente:': 'condicion',
            'Domicilio Fiscal:': 'direccion',
            'Sistema Emisión de Comprobante:': 'sistemaEmision',
            'Actividad Comercio Exterior:': 'actividadComercial',
            'Sistema Contabilidad:': 'sistemaContabilidad'
        };

        $('.list-group .list-group-item').each((_: any, element: any) => {
            const text = $(element).text().trim();

            for (const [label, field] of Object.entries(fieldMappings)) {
                if (text.includes(label)) {
                    const value = text.split(':')[1]?.trim() || '';
                    if (field === 'ruc' && value) {
                        data[field] = value;
                    } else if (field !== 'ruc') {
                        data[field] = value;
                    }
                    break;
                }
            }
        });
    }

    /**
     * Extrae la razón social usando múltiples selectores
     * @param $ - Instancia de Cheerio
     * @param data - Objeto donde se almacenará la razón social
     */
    // @ts-ignore
    private extractRazonSocial($: cheerio.Root, data: SunatData): void {
        // Intentar con selectores específicos
        const selectors = [
            '.list-group-item h4',
            '.bg-success h4',
            'table td b',
            '.panel-heading h4',
            'h4.list-group-item-heading'
        ];

        for (const selector of selectors) {
            const element = $(selector).first();
            if (element.length > 0) {
                const text = element.text().trim();
                if (text) {
                    data.razonSocial = text;
                    return;
                }
            }
        }

        // Si no se encontró, buscar en tablas
        $('table tr').each((_: any, row: any) => {
            const cells = $(row).find('td');
            if (cells.length >= 2) {
                const label = $(cells[0]).text().trim().toLowerCase();
                const value = $(cells[1]).text().trim();

                if ((label.includes('razón social') ||
                    label.includes('denominación') ||
                    label.includes('nombre o razón social')) && value) {
                    data.razonSocial = value;
                    return false; // break
                }
            }
        });
    }

    /**
     * Determina si un error es reintentable
     * @param error - Error a evaluar
     * @returns true si el error es reintentable
     */
    private isRetryableError(error: any): boolean {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            return <boolean>(
                axiosError.code === 'ECONNABORTED' ||
                axiosError.code === 'ETIMEDOUT' ||
                axiosError.code === 'ECONNRESET' ||
                (axiosError.response?.status && axiosError.response.status >= 500)
            );
        }
        return false;
    }

    /**
     * Maneja los errores y devuelve una respuesta estructurada
     * @param error - Error a manejar
     * @returns Respuesta de error estructurada
     */
    private handleError(error: any): SunatResponse {
        console.error('Error en SunatRepository:', error);

        if (error instanceof ValidationError ||
            error instanceof NetworkError ||
            error instanceof NotFoundError ||
            error instanceof ScrapingError) {
            return {
                success: false,
                error: error.message
            };
        }

        if (axios.isAxiosError(error)) {
            return {
                success: false,
                error: `Error de red: ${error.message}`
            };
        }

        return {
            success: false,
            error: 'Error inesperado al consultar SUNAT'
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