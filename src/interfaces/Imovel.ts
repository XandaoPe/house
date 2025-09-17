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
    id_user?: string;
}
// thumb: string;
// tipo: string;
// endereco: string;
// cidade: string;
// uf: string;
// valor: string;
// descricao: string;