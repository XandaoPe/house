// src/interfaces/Imovel.ts
// src/interfaces/users.ts
export interface User {
    _id: any;
    name: string;
    email: string;
    phone: string;
    cpf: string;
    cargo: string;
    roles: string[];
    password?: string;
    isDisabled?: boolean; // Deve estar presente
}

// 🔥 NOVA INTERFACE: Para a resposta do endpoint de importação
export interface ImportSummary {
    message: string;
    created: number;
    updated: number;
    ignored: number;
    details: { email: string; status: string; reason?: string }[];
}