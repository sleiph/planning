import type { ISalasState, Sala, Usuario } from './../types';

export const useWebsiteStore = defineStore<'websiteStore', ISalasState>('websiteStore', {
  state: () => ({
    salas: [] as Array<Sala>,
    carregando: false,
    erro: null as string | null
  }),
  actions: {
    async addSala(sala : Sala) {
      this.salas.push(sala);
    },
    async removerSala(indice:number) {
      if (indice > -1) {
        this.salas.splice(indice, 1);
      }
    },

    async getSalas() {
      this.carregando = true;
      this.erro = null;
      try {
        const response = await fetch('http://localhost:3050/salas');
        if (!response.ok) {
          throw new Error('Erro buscando as salas');
        }
        this.salas = await response.json();
      } catch (err: any) {
        this.erro = err.message || 'Um erro insperado deveria ter sido esperado';
      } finally {
        this.carregando = false;
      }
    },

    async addUsuario(hash: string, usuario:Usuario) {
      let sala : Sala | undefined = this.salas.find(s => s.hash === hash);

      if (!sala?.usuarios.includes(usuario))
        sala?.usuarios.push(usuario);
    }
  }
})
