export interface Usuario {
    nome: string,
    sala: string,
    nota: number
}

export interface Sala {
    hash: string,
    usuarios: Usuario[]
}

export interface ISalasState {
    salas: Sala[],
    carregando: boolean,
    erro: string | null
}