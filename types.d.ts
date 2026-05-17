export interface Usuario {
    nome: string,
    senha: string,
    sala: string
}

export interface Visitante {
    nome: string,
    sala: string,
    nota: number
}

export interface Sala {
    hash: string,
    visitantes: Visitante[]
}

export interface ISalaState {
    sala: Sala,
    usuario: Usuario,
    carregando: boolean,
    erro: string | null
}