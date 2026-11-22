# App de Planning Poker

Aplicação web em tempo real pra estimativas de esforço em equipes ágeis (Scrum / Sprints) usando Planning Poker.


## Funcionalidades

- **Salas em Tempo Real:** Criar ou entrar em salas usando identificadores únicos via WebSocket (`Socket.io`).
- **Painel do Organizador:** Criação de tarefas, revelação de votos, reinício de votações e gerenciamento do baralho.
- **Votação Interativa:** Participantes votam simultaneamente com feedback visual.
- **Lista de Participantes:** Acompanhamento de quem está presente na sala e o status de voto de cada membro.


## Tecnologias

### Backend
- **Node.js** & **Express**
- **Socket.io** (Comunicação bidirecional em tempo real)
- **UUID** (Identificadores únicos de salas)
- **CORS**

### Frontend
- **React** (v19)
- **Vite** (com [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) usando [Oxc](https://oxc.rs))
- **Tailwind CSS** (v4)
- **Lucide React** (Ícones)
- **Socket.io Client**


## Como rodar

Pra instalar todas as dependências (servidor e cliente) e iniciar os ambientes.

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

- `server/` - Servidor backend responsável pela lógica de salas e eventos em tempo real.
- `client/` - Aplicação frontend contendo as telas de Landing, Sala, Votação e Painel do Organizador.


## Fazer

### Corrigir

- [ ] Quando troca de tarefa ele esconde as notas e remove a pontuação definida do select
- [ ] Repetindo o participante se abrir em mais de uma aba
- [ ] Se o usuário já votou e saiu, a nota continua sendo mostrada com o nome 'Usuário'

### Melhorar

- [x] Feedback visual quando card é escolhido
- [x] Adicionar nome da sala no título da página
- [x] Travar mudanças quando as notas foram reveladas
- [x] Arredondar a soma dos esforços
- [x] Modo claro
- [x] Adicionar licença de uso e alteração livre (The Unlicense)
- [ ] Juntar hash da sala com o botão de copiar link
- [ ] Organizador poder remover participantes
- [ ] Poder reordenar tarefas do planning
- [ ] Transformar o campo de descrição da tarefa em um bloco de texto maior com markdown
- [ ] Tirar todo esse texto de IA
- [ ] Melhorar o design, de feio ja basta o basileia

### Fazer?

- [ ] Usar um banco de dados e criar logins persistidos?
- [ ] Revelar automaticamente as notas quando todos tiverem votado?
- [ ] Passar o servidor pra um projeto separado?
