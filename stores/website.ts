import type { ISalaState, Sala, Usuario, Visitante } from './../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_PORTA = import.meta.env.VITE_API_BASE_PORTA;
const API_KEY = import.meta.env.VITE_API_KEY;

export const useWebsiteStore = defineStore<'websiteStore', ISalaState>('websiteStore', {
  state: () => ({
    sala: {} as Sala,
    usuario: {} as Usuario,
    carregando: false,
    erro: null as string | null
  }),
  actions: {

    async getSalaByHash(salaHash: string) {

      if (this.sala.hash === salaHash)
        return this.sala;

      if (!salaHash)
        return null;

      this.carregando = true;
      this.erro = null;
      try {
        const response = await fetch(`${API_BASE_URL}:${API_BASE_PORTA}/planning/sala/${salaHash}`, {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
          },
          body: JSON.stringify({ sala: { hash: salaHash } }),
        });
        if (!response.ok) {
          throw new Error('Erro buscando a sala');
        }
        this.sala = await response.json();
      } catch (err: any) {
        this.erro = err.message || 'Um erro insperado deveria ter sido esperado';
      } finally {
        this.carregando = false;
      }
    },

    async addSala(sala : Sala) {
      this.carregando = true;
      this.erro = null;
      try {
        const response = await fetch(`${API_BASE_URL}:${API_BASE_PORTA}/addsala`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
          },
          body: JSON.stringify({ sala }),
        });
        if (!response.ok) {
          throw new Error('Falha ao adicionar sala');
        }
        await response.json();
        sala.usuarios = [];
        this.sala = sala;
      } catch (err: any) {
        this.erro = err.message || 'Erro inesperado no addSala';
      } finally {
        this.carregando = false;
      }
    },

    async getVisitantes(salaHsh: Sala) {
      if (!salaHsh || !salaHsh.hash)
        return [];

      let sala : Sala | undefined = this.sala;

      if (!sala) {
        throw new Error('Sala não encontrada');
      }

      this.carregando = true;
      this.erro = null;
      try {
        const response = await fetch(`${API_BASE_URL}:${API_BASE_PORTA}/getusuarios`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
          },
          body: JSON.stringify({ sala }),
        });
        if (!response.ok) {
          throw new Error('Erro buscando a sala');
        }
        sala.usuarios = await response.json();
      } catch (err: any) {
        this.erro = err.message || 'Um erro insperado deveria ter sido esperado';
      } finally {
        this.carregando = false;
      }
    },

    getVisitante(usuario: Visitante): Visitante | null {
      if (!usuario.nome || !usuario.sala)
        return null;

      let sala : Sala | undefined = this.sala;

      if (!sala) {
        throw new Error('Sala não encontrada');
      }

      if (!sala.usuarios)
        return null;
      
      let usrSala : Visitante | undefined = sala.usuarios.find(u => u.nome === usuario.nome);
      if (!usrSala)
        return null;
      return usrSala;
    },

    async addVisitante(usuario:Visitante): Promise<Visitante | null> {

      if (!usuario.nome || !usuario.sala)
        return null;

      let sala : Sala | undefined = this.sala;

      if (!sala) {
        throw new Error('Sala não encontrada');
      }

      this.carregando = true;
      try {
        const response = await fetch(`${API_BASE_URL}:${API_BASE_PORTA}/addusuario`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
          },
          body: JSON.stringify({ usuario }),
        });
        /*if (!response.ok) {
          throw new Error('Failed to post user');
        }*/
        await response.json();
      } finally {
        this.carregando = false;
        return usuario;
      }
    },

    async removerVisitante(usuario:Visitante) {
      let sala : Sala | undefined = this.sala;

      if (!sala)
        return false;

      if (!sala.usuarios)
        return false;

      let usrSala : Visitante | undefined = sala.usuarios.find(u => u.nome === usuario.nome);

      if (!usrSala)
        return false;

      this.carregando = true;
      this.erro = null;
      try {
        const response = await fetch(`${API_BASE_URL}:${API_BASE_PORTA}/removeusuario`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
          },
          body: JSON.stringify({ usuario }),
        });
        if (!response.ok) {
          throw new Error('Erro deletando usuario');
        }
        await response.json();
      } catch (err: any) {
        this.erro = err.message || 'Erro inesperado no removerUsuario';
      } finally {
        this.carregando = false;
        return true;
      }
    },

    async updateNota(usuario: Visitante) {
      let sala : Sala | undefined = this.sala;

      if (!sala)
        return false;

      if (!sala.usuarios)
        return false;

      let usrSala : Visitante | undefined = sala.usuarios.find(u => u.nome === usuario.nome);

      if (!usrSala)
        return false;

      this.carregando = true;
      this.erro = null;
      try {
        const response = await fetch(`${API_BASE_URL}:${API_BASE_PORTA}/updatenota`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
          },
          body: JSON.stringify({ usuario }),
        });
        if (!response.ok) {
          throw new Error('Erro atualizando nota do usuario');
        }
        await response.json();
      } catch (err: any) {
        this.erro = err.message || 'Erro inesperado no updateNota';
      } finally {
        this.carregando = false;
      }
    },

    async criaUsuario(usuario: Usuario): Promise<Usuario | null> {

      if (!usuario.nome || !usuario.senha)
        return null;

      this.carregando = true;
      try {
        const response = await fetch(`${API_BASE_URL}:${API_BASE_PORTA}/planning/criarusuario`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
          },
          body: JSON.stringify({ usuario }),
        });
        if (!response.ok) {
          throw new Error('Erro criando Usuário', { cause: response });
        }
        let resposta = await response.json();
        this.sala = resposta.sala;
        this.usuario = resposta.usuario;
        return resposta.usuario;
      } finally {
        this.carregando = false;
      }
    },

    async login(usuario: Usuario): Promise<Usuario | null> {
      this.carregando = true;
      this.erro = null;
      try {
        const response = await fetch(`${API_BASE_URL}:${API_BASE_PORTA}/planning/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
          },
          body: JSON.stringify({ usuario }),
        });
        if (!response.ok) {
          throw new Error('Usuário ou senha incorretos');
        }
        let resposta = await response.json();
        this.sala = resposta.sala;
        console.log(resposta);
        console.log(this.sala);
        this.usuario = resposta.usuario;
        return resposta.usuario;
      } catch (err: any) {
        this.erro = err.message || 'Um erro insperado deveria ter sido esperado...';
        throw err;
      } finally {
        this.carregando = false;
      }
    }

  }
})
