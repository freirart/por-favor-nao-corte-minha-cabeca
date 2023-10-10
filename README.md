# Por Favor Não Corte Minha Cabeça! 👻

“Por Favor Não Corte Minha Cabeça!” é um jogo festivo carregado de sangue e risadas onde os jogadores tentam sobreviver a um acampamento de verão que está sendo aterrorizado pelo assassino Escalpo (GEEKS N’ ORCS, 2019).


Disponível para compra tanto na [Amazon](https://www.amazon.com.br/Favor-Corte-Cabe%C3%A7a-Geeks-Orcs/dp/B07WW254FF) quanto na [Steam](https://steamcommunity.com/sharedfiles/filedetails/?id=2081192874), o jogo de cartas simula um acampamento onde os jogadores disputam sua sobrevivência com o Escalpo de modo a coletar as “bolsinhas de vida” (pontos do jogo) de cada turno.


Uma vez que cada um dos jogadores foi o Escalpo do turno, vence o jogo aquele que possui mais pontos.


Neste repositório está contida uma representação deste jogo num ambiente online multijogador através de uma aplicação web utilizando sockets.

## Contribuindo para o projeto ✅

Como o projeto é feito em Javascript, é necessário possuir a versão 18.18.0 do [Node](https://nodejs.org/en).

Para tal ação é necessário obter o código fonte do projeto em sua máquina:

```bash
$ git clone https://github.com/luskas8/card-game.git
$ cd card-game
$ npm ci
```

Uma vez que o código fonte esteja na sua máquina e as dependências do projeto sejam instaladas com sucesso, basta levantar aplicação com o comando:

```bash
$ npm run dev
```

## TO-DO 📝
- [x] Remover informação de quem é o host do jogador `hostId = socketId`
- [x] Cartas escolhidas estarem no turno e não no jogador `{'playerId': [<card-1>, <card-2>]}`
- [x] Remover "ready"
- [x] Escalpo ficar na Rodada (Round) (killerId = socketId)
- [x] Criar função getKillerIds (função do Game)
- [x] Remover `_playersNotWasKillerSocketID` e transformar numa função de `Game` que itera pelos players do jogo e dos killerIds da rodada
- [x] Transformar `GameStates` em "o jogo foi iniciado ou não?" (booleano = wasGameStarted) (ajustar função start)
- [x] Matar `inUse` e `playerSocketId` do `Character` e transformar em função de `Game (getAvailableCharacters)`
- [x] Matar funções `reset` e `findByFavoriteAction` de Character
- [x] Começar o jogo retorna o `killerId` e atribuí a ação favorita para o Zeca
- [ ] Depois disso tudo... melhorar os testes de game utilizando TODAS as funções
- [ ] Resetar o jogo quando já começou mas teve uma desconexão que resultou em menos jogadores que o mínimo permitido
- [ ] Desconectar pelo client side
- [ ] Reconectar quando acontecer uma atualização pelo client side
