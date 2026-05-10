import 'pinia';
import type { Usuario, Sala } from './types';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    getSalaByHash: (salaHash: string) => Promise<Sala | null>,
    getUsuarios: (sala:Sala) => Promise<Array<Visitante>>,
    getUsuario: (usuario:Visitante) => Visitante | null,
    addUsuario: (usuario:Visitante) => Promise<Visitante>,
    removerUsuario: (usuario:Visitante) => boolean,
    updateNota: (usuario:Visitante) => boolean,
    criaUsuario: (usuario:Usuario) => Promise<Usuario>,
    login: (usuario:Usuario) => Promise<Usuario>,
  }
}