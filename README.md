# Setlist.fm → Playlist do YouTube

Uma interface simples em HTML que recebe um link de setlist.fm, envia para um webhook do n8n e cria automaticamente uma playlist no YouTube com as músicas do show.

## Visão geral

Este projeto usa:

- uma página web em HTML/JavaScript para capturar a URL do setlist;
- um workflow exportado do n8n para buscar os dados do setlist;
- a API do YouTube para criar a playlist e adicionar os vídeos;
- a API do setlist.fm para recuperar a setlist do show.

O fluxo funciona assim:

1. O usuário cola a URL do setlist.fm no formulário.
2. A página valida a URL e envia os dados para o webhook do n8n.
3. O n8n busca a setlist na API do setlist.fm.
4. O workflow extrai as músicas do set.
5. O n8n cria uma playlist no YouTube.
6. Busca vídeos correspondentes em cada música.
7. Adiciona os vídeos à playlist.
8. Retorna a URL da playlist criada.

## Estrutura do repositório

- `index.html` — interface web para inserir a URL do setlist.
- `Setlist.fm → Playlist do YouTube.json` — export do workflow do n8n.

## Como funciona a interface

A página `index.html`:

- valida se a URL é de `https://www.setlist.fm`;
- extrai o identificador do setlist;
- envia um `POST` para o webhook configurado no n8n;
- exibe o carregamento, sucesso ou erro;
