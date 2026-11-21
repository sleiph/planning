# Planning Poker App

Aplicação web em tempo real pra estimativas de esforço em equipes ágeis (Scrum / Sprints) usando Planning Poker.

## Funcionalidades

- **Salas em Tempo Real:** Crie ou entre em salas utilizando identificadores únicos via WebSocket (`Socket.io`).
- **Painel do Organizador:** Controle de tarefas, revelação de votos, reinício de votações e gerenciamento do baralho de cartas.
- **Votação Interativa:** Participantes votam simultaneamente com feedback visual em tempo real.
- **Lista de Participantes:** Acompanhamento dinâmico de quem está presente na sala e o status de voto de cada membro.

## Tecnologias

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

## Estrutura do Projeto

- `server/` - Servidor backend (Node.js, Express e Socket.io) responsável pela lógica de salas e eventos em tempo real.
- `client/` - Aplicação frontend (React, Vite, Tailwind CSS) contendo as telas de Landing, Sala, Votação e Painel do Organizador.


## Corrigir

- [ ] Quando troca de tarefa ele esconde as notas e remove a pontuação definida do select


## Fazer

- [x] Feedback visual quando card é escolhido
- [ ] Tirar todo esse texto de IA
- [x] Adicionar nome da sala no título da página
- [ ] Travar mudanças quando as notas foram reveladas
- [ ] Persistir as notas quando fechar a votação, independente se o usuário saiu ou continua na página
- [ ] Usar um banco de dados e criar logins persistidos
- [ ] Poder reordenar tarefas no planning
- [ ] Organizador poder remover participantes
- [x] Arredondar a soma dos esforços
- [ ] Melhorar o design, de feio ja basta o basileia
- [x] Modo claro
- [x] Adicionar licença de uso e alteração livre (The Unlicense)
- [ ] Transformar o campo de descrição da tarefa em um bloco de texto maior com markdown
- [ ] Trocar o status da tarefa de 'Em Votação' pra 'Votada' quando o organizador definir a nota final


### Fazer?

- [ ] Revelar automaticamente as notas quando todos tiverem votado?
- [ ] Passar o servidor pra um projeto separado?
