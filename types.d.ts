export interface Usuario {
    nome: string,
    nota: number
}

export interface Sala {
    hash: string,
    usuarios: Usuario[]
}

export interface ISalasState {
    salas: Sala[]
}