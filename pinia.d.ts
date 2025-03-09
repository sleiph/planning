import 'pinia';
import type { Usuario } from './types';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    fetch: () => Promise<unknown>,
    getSalas: () => Promise<unknown>,
    addUsuario: (hash: string, usuario:Usuario) => Usuario,
    removerUsuario: (hash: string, usuario:Usuario) => boolean
  }
}