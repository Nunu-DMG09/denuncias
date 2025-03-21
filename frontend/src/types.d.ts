export interface Denunciante {
    nombres: string;
    email: string;
    telefono: string;
    tipo_documento: string;
    numero_documento: string;
    sexo: string;
}

export interface Denunciado {
    nombre: string;
    tipo_documento: string;
    numero_documento: string;
    representante_legal: string;
    razon_social: string;
    cargo: string;
}

export interface Adjunto {
    file: File;
    name: string;
}

export interface FormData {
    es_anonimo: boolean;
    denunciante: Denunciante | null;
    denunciado: Denunciado;
    motivo_id: string;
    motivo_otro: string;
    descripcion: string;
    fecha_incidente: string | null;
    adjuntos: Adjunto[];
    tracking_code?: string;
}