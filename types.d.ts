export interface Usuario {
    nome: string,
    carta: number
}

export interface Sala {
    hash: string,
    usuarios: Usuario[]
}

export interface ISalasState {
    salas: Sala[]
}