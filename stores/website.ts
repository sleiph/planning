import type { ISalasState, Sala, Usuario } from './../types';

export const useWebsiteStore = defineStore<'websiteStore', ISalasState>('websiteStore', {
  state: () => ({
    salas: [] as Array<Sala>,
    carregando: false,
    erro: null as string | null
  }),
  actions: {

    async getSalas() {
      this.carregando = true;
      this.erro = null;
      try {
        const response = await fetch('http://localhost:3050/salas');
        if (!response.ok) {
          throw new Error('Erro buscando as salas');
        }
        this.salas = await response.json();
        return true;
      } catch (err: any) {
        this.erro = err.message || 'Um erro insperado deveria ter sido esperado';
        return false;
      } finally {
        this.carregando = false;
      }
    },

    async addSala(sala : Sala) {
      this.carregando = true;
      this.erro = null;
      try {
        const response = await fetch('http://localhost:3050/addsala', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sala }),
        });
        if (!response.ok) {
          throw new Error('Failed to post user');
        }
        let resposta = await response.json();
        this.salas.push(sala);
      } catch (err: any) {
        this.erro = err.message || 'Erro inesperado no addSala';
      } finally {
        this.carregando = false;
      }
    },

    async removerSala(sala: Sala) {

      let salaArr = this.salas.find(s => s.hash===sala.hash);

      if (!salaArr)
        return false;

      this.carregando = true;
      this.erro = null;
      try {
        const response = await fetch('http://localhost:3050/removesala', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sala }),
        });
        if (!response.ok) {
          throw new Error('Failed to post user');
        }
        let resposta = await response.json();

        let indice = this.salas.indexOf(salaArr);
        this.salas.splice(indice, 1);
      } catch (err: any) {
        this.erro = err.message || 'Erro inesperado no addSala';
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
