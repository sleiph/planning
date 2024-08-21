import type { ISalasState, Sala, Usuario } from './../types';

export const useWebsiteStore = defineStore<'websiteStore', ISalasState>('websiteStore', {
  state: () => ({
    salas: []
  }),
  actions: {
    async fetch() : Promise<void> {
      this.salas = [];
    },
    async addSala(sala : Sala) {
      this.salas.push(sala);
    },
    async removerSala(indice:number) {
      if (indice > -1) {
        this.salas.splice(indice, 1);
      }
    },

    async addUsuario(hash: string, usuario:Usuario) {
      let sala : Sala | undefined = this.salas.find(s => s.hash === hash);

      if (!sala?.usuarios.includes(usuario))
        sala?.usuarios.push(usuario);
    }
  }
})
