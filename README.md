# Digital Store — Drip Store

Projeto inicial em React + Vite, criado com base nas telas de referência enviadas e nos requisitos do repositório Digital College.

## Requisitos
- Node.js LTS instalado no Windows
- Visual Studio Code

## Como executar
1. Extraia o ZIP.
2. Abra a pasta `drip-store` no VS Code.
3. Abra o terminal integrado: **Terminal > New Terminal**.
4. Execute:

```bash
npm install
npm run dev
```

5. Abra no navegador o endereço mostrado pelo Vite (normalmente http://localhost:5173).

## O que já está implementado
- Home responsiva com banner, coleções, categorias e produtos.
- Listagem de produtos com filtro por marca, categoria e gênero.
- Ordenação por preço.
- Busca pelo cabeçalho usando query string `?filter=`.
- Detalhes do produto com seleção de tamanho/cor e galeria simples.
- Carrinho local em memória.
- Componentes reutilizáveis e React Router.

## Estrutura
- `src/components`: Header, Footer, Layout, Section, ProductCard, ProductListing.
- `src/pages`: as páginas são organizadas pelas rotas no App.
- `src/data`: catálogo local de exemplo.

## Observação
As imagens de produto usam URLs externas para prototipagem visual. É possível substituí-las por arquivos locais na pasta `public` quando os assets oficiais estiverem disponíveis.
