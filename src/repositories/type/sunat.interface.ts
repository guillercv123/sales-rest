
export interface SunatData {
    ruc: string;
    razonSocial: string;
    tipoContribuyente: string;
    nombreComercial: string;
    fechaInscripcion: string;
    fechaInicioActividades: string;
    estado: string;
    condicion: string;
    direccion: string;
    sistemaEmision: string;
    actividadComercial: string;
    sistemaContabilidad: string;
    fechaConsulta: string;
}

export interface SunatResponse {
    success: boolean;
    data?: SunatData;
    error?: string;
}

export interface SunatScraperConfig {
    timeout?: number;
    maxRetries?: number;
    retryDelay?: number;
}