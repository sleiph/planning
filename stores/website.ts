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
          throw new Error('Falha ao adicionar sala');
        }
        await response.json();
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
          throw new Error('Falha ao remover sala');
        }
        await response.json();

        let indice = this.salas.indexOf(salaArr);
        this.salas.splice(indice, 1);
      } catch (err: any) {
        this.erro = err.message || 'Erro inesperado no addSala';
      } finally {
        this.carregando = false;
      }
    },

    getUsuario(usuario: Usuario): Usuario | null {
      if (!usuario.nome || !usuario.sala)
        return null;

      let sala : Sala | undefined = this.salas.find(s => s.hash === usuario.sala);

      if (!sala) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Sala não encontrada'
        })
      }

      if (!sala.usuarios)
        sala.usuarios = [];
      
      let usrSala : Usuario | undefined = sala.usuarios.find(u => u.nome === usuario.nome);
      if (!usrSala)
        return null;
      return usrSala;
    },

    async addUsuario(usuario:Usuario): Promise<Usuario | null> {

      if (!usuario.nome || !usuario.sala)
        return null;

      let sala : Sala | undefined = this.salas.find(s => s.hash === usuario.sala);

      if (!sala) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Sala não encontrada'
        })
      }

      if (!sala.usuarios)
        sala.usuarios = [];

      this.carregando = true;
      try {
        const response = await fetch('http://localhost:3050/addusuario', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ usuario }),
        });
        if (!response.ok) {
          throw new Error('Failed to post user');
        }
        await response.json();
      } finally {
        sala.usuarios.push(usuario);
        this.carregando = false;
        
        return usuario;
      }
    },

    async removerUsuario(usuario:Usuario) {
      let sala : Sala | undefined = this.salas.find(s => s.hash === usuario.sala);

      if (!sala)
        return false;

      let usrSala : Usuario | undefined = sala.usuarios.find(u => u.nome === usuario.nome);

      if (!usrSala)
        return false;

      let indice = sala.usuarios.indexOf(usrSala);
      sala.usuarios.splice(indice, 1);
      return true;
    }
  }
})
