// src/interfaces/Imovel.ts
export interface Imovel {
    _id: any;
    tipo: string;
    rua: string;
    numero: string;
    complemento: string;
    cep: string;
    cidade: string;
    uf: string;
    obs: string;
    copasa: string;
    cemig: string;
    isDisabled?: boolean; // Deve estar presente
    id_user?: string;
}