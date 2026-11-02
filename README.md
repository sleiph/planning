# Planning Poker App

Aplicação web em tempo real pra estimativas de esforço em equipes ágeis (Scrum / Sprints) usando Planning Poker.

## Funcionalidades

- **Salas em Tempo Real:** Crie ou entre em salas utilizando identificadores únicos via WebSocket (`Socket.io`).
- **Painel do Organizador:** Controle de tarefas, revelação de votos, reinício de votações e gerenciamento do baralho de cartas.
- **Votação Interativa:** Participantes votam simultaneamente com feedback visual em tempo real.
- **Lista de Participantes:** Acompanhamento dinâmico de quem está presente na sala e o status de voto de cada membro.

## 💻 Tecnologias

### Backend
- **Node.js** & **Express**
- **Socket.io** (Comunicação bidirecional em tempo real)
- **UUID** (Identificadores únicos de salas)
- **CORS**

### Frontend
- **React** (v19)
- **Vite** (com [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) utilizando [Oxc](https://oxc.rs))
- **Tailwind CSS** (v4)
- **Lucide React** (Ícones)
- **Socket.io Client**

## Como rodar

Para instalar todas as dependências (raiz e cliente) e iniciar os ambientes.

### Desenvolvimento

```shell
npm run install:all
npm run dev:server
npm run dev:client
```

### Produção

```shell
npm run install:all
npm run build
npm run start:prod
```

## 📁 Estrutura do Projeto

- `server/` - Servidor backend (Node.js, Express e Socket.io) responsável pela lógica de salas e eventos em tempo real.
- `client/` - Aplicação frontend (React, Vite, Tailwind CSS) contendo as telas de Landing, Sala, Votação e Painel do Organizador.

## 📋 Fazer

- [ ] Feedback visual quando card é escolhido
- [ ] Adicionar nome da sala no título da página
- [ ] Refinamentos de estilos e UI/UX
- [ ] Passar o servidor pra um projeto próprio?
- [ ] Tirar todo esse texto de IA
- [ ] Usar um banco de dados e criar logins persistentes
