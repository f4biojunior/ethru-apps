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

Abra o app pelo GitHub Pages: https://f4biojunior.github.io/ethru-apps/

- **Todos veem os mesmos dados**, guardados no Firebase (Firestore) e atualizados ao vivo.
- **Qualquer pessoa pode ver.** Para editar, clique em **Entrar com Google** usando um e-mail autorizado.
- **O administrador** usa o botão **Editores** para autorizar e-mails.
- Quem controla o acesso são as regras do Firestore, no console do Firebase. A configuração em `grimorio/firebase-config.js` é pública por natureza.

### Dados iniciais

`data/grimorio.json` e `data/mapa-ethru.jpg` guardam a cópia inicial do mundo e das campanhas. Com o banco vazio, o administrador clica em **Trazer os dados publicados** para copiá-los para o Firebase.

### Publicar com GitHub Pages

Em *Settings → Pages*, escolha a branch `main` e a pasta `/ (root)`. O app fica disponível em `https://f4biojunior.github.io/ethru-apps/grimorio/`.
