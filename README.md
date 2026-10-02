# Bíblia / Tanakh

App web de leitura bíblica (Antigo + Novo Testamento), tema escuro com acentos dourados, com abas sincronizadas:

- **Original** — hebraico / aramaico / grego conforme o livro  
- **Transliteração** — leitura fonética (LTR)  
- **Português** — tradução fiel de demonstração (sem marca de editora)

Interface em **português (pt-BR)**, mobile-first (~390–430px).

## Como executar

```bash
cd /workspace/biblia-tanakh
npm install
npm run dev
```

Abra `http://127.0.0.1:5173` (ou o endereço indicado pelo Vite).

## Telas e rotas

| Rota | Tela |
|------|------|
| `#/` | Home — saudação, marcações, versículos, criar Devocional |
| `#/biblia` | Lista de livros (busca + filtros Todos / AT / NT) |
| `#/livro/:id` | Capítulos do livro |
| `#/ler/:id/:capítulo` | Leitura com 3 abas + prev/próx. capítulo |
| `#/agenda` | Placeholder |
| `#/mensagens` | Placeholder |
| `#/conta` | Placeholder |
| `#/favoritos` | Placeholder |
| `#/ajustes` | Placeholder |

Navegação inferior: **Bíblia · Agenda · Home · Mensagens · Conta** (Home central destacado).

## Dados de demonstração

Índice completo de **66 livros**. Texto de amostra: **Gênesis 1** (versículos 1–31) e **João 1** (versículos 1–5). Demais capítulos abrem como placeholder.

## Deploy (GitHub → Cloudflare Pages)

O app usa **hash router** (`#/…`), então não é necessário fallback SPA (`_redirects`). Basta publicar o build estático.

### Passo a passo

1. Crie um repositório no **GitHub** e faça push deste projeto (`main`).
2. Em [Cloudflare Pages](https://dash.cloudflare.com/) → **Create** → **Connect to Git** → selecione o repositório.
3. Configure o build:

| Campo | Valor |
|-------|--------|
| **Framework preset** | Vite (ou None) |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Node.js version** | 18 ou superior (Compatibility Flags / Environment) |

4. Salve e aguarde o primeiro deploy. Deploys seguintes ocorrem a cada push em `main`.

Arquivo `wrangler.toml` documenta `pages_build_output_dir = "dist"` para referência; o fluxo preferido é **Pages conectado ao Git** (sem token Wrangler local).

### Build local

```bash
npm install
npm run build
npm run preview   # opcional: testar dist/
```
