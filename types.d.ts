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
    usuarios: Visitante[]
}

export interface ISalasState {
    salas: Sala[],
    carregando: boolean,
    erro: string | null
}