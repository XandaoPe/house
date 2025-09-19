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