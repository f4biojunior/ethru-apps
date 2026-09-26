# Apps de Ethrü

Ferramentas para as mesas de RPG no mundo de **Ethrü**, criado entre amigos e inspirado inicialmente em D&D.

## Grimório (`grimorio/`)

Assistente para mestre e jogadores durante as sessões.

- **Campanhas separadas.** Cada campanha guarda as próprias personalidades, sessões e anotações, e uma não interfere na outra. Ao abrir o app, você escolhe qual campanha vai jogar.
- **Qualquer sistema.** D&D, Dungeon World, Tormenta20, sistema próprio… Cada campanha registra também o ano em que se passa na história de Ethrü.
- **Personalidades.** Ficha de cada NPC, com relação com o grupo, estado, facção, local e uma linha do tempo de registros ligada às sessões.
- **Sessões.** Diário ao vivo com horário, resumo, personalidades e lugares de cada sessão.
- **Mundo compartilhado.** O mapa de Ethrü tem zoom, movimento e marcadores para cidades, vilas, vilarejos, castelos, templos, ruínas e mais. Ao afastar o zoom, os lugares menores somem. Há também localidades com hierarquia (um lugar dentro de outro) e lore. As campanhas usam o mundo e guardam notas próprias sobre cada lugar.
- **Rolador de dados.** Aceita `2d6+3`, vantagem, desvantagem e `4d6kh3`.
- **Backup.** Exportar e importar em JSON.

### Como usar

Abra o app pelo GitHub Pages. Tudo funciona no navegador, sem instalar nada.

### De onde vêm os dados

- **`data/grimorio.json`** guarda os dados publicados: o mundo de Ethrü, as localidades, o lore e as campanhas.
- **`data/mapa-ethru.jpg`** é o mapa de Ethrü.

Esses arquivos são uma cópia do Grimório principal, que fica no Claude. Quando alguém abre o app pelo GitHub, esses dados são carregados automaticamente.

Quem editar alguma coisa pelo GitHub tem as edições salvas **só no próprio navegador**, e elas não somem quando os dados publicados são atualizados. Para mandar edições de volta para o Grimório principal, use **Exportar** e depois **Importar**.

Os dados publicados só carregam quando o app é aberto por um endereço web (GitHub Pages ou um servidor local). Abrindo o arquivo direto do disco, o app começa vazio.

### Publicar com GitHub Pages

Em *Settings → Pages*, escolha a branch `main` e a pasta `/ (root)`. O app fica disponível em `https://f4biojunior.github.io/ethru-apps/grimorio/`.
