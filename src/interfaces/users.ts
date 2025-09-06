// src/interfaces/Imovel.ts
export interface User {
    _id: any;
    name: string;
    email: string;
    phone: string;
    cpf: string;
    cargo: string;
    roles: string[];
    password?: string; // Adicione a senha como opcional
}
