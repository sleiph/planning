import 'pinia';
import type { Usuario, Sala } from './types';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    getSalas: () => Promise<Array<Sala>>,
    getUsuarios: (sala:Sala) => Promise<Array<Usuario>>,
    getUsuario: (usuario:Usuario) => Usuario | null,
    addUsuario: (usuario:Usuario) => Promise<Usuario>,
    removerUsuario: (usuario:Usuario) => boolean,
    updateNota: (usuario:Usuario) => boolean,
  }
}