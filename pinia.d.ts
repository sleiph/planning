import 'pinia';
import type { Usuario, Sala } from './types';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    getSalaByHash: (salaHash: string) => Promise<Sala | null>,
    getVisitantes: (sala:Sala) => Promise<Array<Visitante>>,
    getUsuario: (usuario:Visitante) => Visitante | null,
    addVisitante: (usuario:Visitante) => Promise<Visitante>,
    removerVisitante: (usuario:Visitante) => boolean,
    updateNota: (usuario:Visitante) => boolean,
    criaUsuario: (usuario:Usuario) => Promise<Usuario>,
    login: (usuario:Usuario) => Promise<Usuario>,
  }
}