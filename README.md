# Setlist.fm → Playlist do YouTube

Aplicação web simples para transformar um link de setlist.fm em uma playlist do YouTube de forma automatizada. A interface coleta a URL do show, valida o formato e envia a requisição para um endpoint do Netlify. A função serverless repassa a solicitação para um webhook do n8n, que busca os dados do set, cria a playlist e adiciona os vídeos correspondentes.

## Visão geral

Este projeto combina:

- front-end em HTML/JavaScript para capturar a URL do setlist;
- função serverless do Netlify para validar e encaminhar a requisição;
- workflow do n8n para consultar a API do setlist.fm e da API do YouTube;
- criação automática de playlists com os vídeos das músicas do show.

## Fluxo de funcionamento

1. O usuário insere a URL do setlist.fm no formulário.
2. O navegador valida o formato da URL.
3. A requisição é enviada para o endpoint `/.netlify/functions/criar-playlist`.
4. A função `criar-playlist.mjs` valida novamente o payload no servidor.
5. O Netlify envia os dados para o webhook configurado em `N8N_WEBHOOK_URL`.
6. O workflow do n8n busca o set na API do setlist.fm.
7. O n8n extrai as músicas e cria a playlist no YouTube.
8. Os vídeos de cada faixa são pesquisados e adicionados à playlist.
9. O retorno final é a URL da playlist criada.

## Estrutura do repositório

- `public/index.html` — interface web com formulário e lógica de envio.
- `netlify/functions/criar-playlist.mjs` — função serverless que recebe a requisição e repassa ao n8n.
- `netlify.toml` — configuração do deploy do Netlify.
- `Setlist.fm → Playlist do YouTube.json` — export do workflow do n8n.
- `README.md` — documentação do projeto.

## Como a interface funciona

O arquivo `public/index.html`:

- valida se a URL começa com `https://www.setlist.fm`;
- extrai o identificador do setlist do final da URL;
- envia um `POST` com `url`, `setlistId`, `privacy` e `source`;
- apresenta estados de carregamento, sucesso e erro;
- abre a playlist final em uma nova aba quando a criação é concluída.

A função `netlify/functions/criar-playlist.mjs` também valida a entrada do lado do servidor e rejeita requisições inválidas ou sem o webhook configurado.

## Configuração

### Variável de ambiente

No Netlify, defina a variável:

- `N8N_WEBHOOK_URL` — URL do webhook do n8n responsável por criar a playlist.

### Privacidade da playlist

No front-end, a constante `PRIVACIDADE` pode ser ajustada para:

- `private`
- `unlisted`
- `public`

Exemplo em `public/index.html`:

```js
const WEBHOOK_N8N = '/.netlify/functions/criar-playlist';
const PRIVACIDADE = 'private';
```

## Como executar localmente

1. Faça o clone do repositório.
2. Rode o projeto em um ambiente Netlify local ou publique no Netlify.
3. Configure a variável `N8N_WEBHOOK_URL` no painel do Netlify.
4. Acesse a página do front-end e cole a URL do setlist.fm.

## Requisitos

- conta no Netlify;
- webhook configurado no n8n;
- acesso à API do setlist.fm;
- acesso à API do YouTube com permissões para criação de playlists;
- workflow do n8n exportado e importado para o ambiente do n8n.

## Observações

- A validação ocorre em dois níveis: no navegador e no servidor.
- O projeto foi desenhado para ser simples e fácil de adaptar a outros fluxos de automação.
- A URL de origem esperada é do formato do setlist.fm, com identificador final em hexadecimal e extensão `.html`.

## Exemplo de uso

```text
https://www.setlist.fm/setlist/the-gathering/2026/audio-sao-paulo-brazil-7340de45.html
```

Se a URL for válida, a aplicação envia a requisição e retorna a playlist criada no YouTube.
