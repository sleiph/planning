import 'pinia';
import type { Usuario } from './types';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    getSalas: () => Promise<Array<Sala>>,
    addUsuario: (usuario:Usuario) => Promise<Usuario>,
    removerUsuario: (hash: string, usuario:Usuario) => boolean
  }
}