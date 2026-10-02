# Bíblia / Tanakh

App web de leitura bíblica (Antigo + Novo Testamento), tema escuro com acentos dourados, com abas sincronizadas:

- **Português** — **tradução do original** embarcada no app (mesma camada local que acompanha Hebraico e Transliteração; sem Almeida / ACF / RA / NVI / APIs)
- **Hebraico** — texto hebraico / aramaico / grego conforme o livro
- **Transliteração** — leitura fonética (LTR)

Interface em **português (pt-BR)**, mobile-first, com layout responsivo para tablet e widescreen. Também é um **PWA** (Progressive Web App).

## Como executar

```bash
cd /workspace/biblia-tanakh
npm install
npm run dev
```

Abra `http://127.0.0.1:5173` (ou o endereço indicado pelo Vite).

## PWA (instalar no dispositivo)

O build gera *service worker* + *web app manifest* (`vite-plugin-pwa`) em modo **offline-first**. Em produção (HTTPS, ex.: Cloudflare Pages):

1. Abra o site **uma vez online** (Chrome/Edge no Android/desktop ou Safari no iOS).
2. Na primeira visita o service worker **pré-cacheia** o shell, JS (inclui dados de livros/versículos), CSS, fontes locais e ícones.
3. Use **Instalar aplicativo** / **Adicionar à Tela de Início**.
4. Depois disso, **Home**, lista da **Bíblia** e **leitura** (ex.: Gênesis 1 e amostras) funcionam **sem internet**.

Nome do app: **Bíblia Tanakh** (nome curto: **Tanakh**). Tema: fundo escuro `#050505` com acento dourado. Fontes (Inter, Noto Sans Hebrew, Noto Serif) vêm empacotadas no build — sem CDN.

## Layout responsivo

| Faixa | Comportamento |
|-------|----------------|
| Mobile | Shell ~430px, navegação inferior |
| Tablet (~768+) | Conteúdo mais largo; Home/Bíblia em grades |
| Desktop (~1024+) | Navegação lateral + área de conteúdo ampla |
| Widescreen (~1280+) | Grade de livros em 3 colunas; leitura mais confortável |

## Telas e rotas

| Rota | Tela |
|------|------|
| `#/` | Home — saudação, marcações, versículos, criar Devocional |
| `#/biblia` | Lista de livros (busca + filtros Todos / AT / NT) |
| `#/livro/:id` | Capítulos do livro |
| `#/ler/:id/:capítulo` | Leitura estilo livro (Português · Hebraico · Transliteração) + marcar versículos |
| `#/devocionais` | Minhas Devocionais (lista) |
| `#/devocionais/nova` | Criar devocional |
| `#/devocionais/:id` | Editar / ver devocional |
| `#/mensagens` | Placeholder |
| `#/conta` | Placeholder |
| `#/favoritos` | Placeholder |
| `#/ajustes` | Placeholder |

Navegação: **Bíblia · Devocionais · Home · Mensagens · Conta** (Home destacado; vira barra lateral no desktop).

### Marcações e devocionais

Na leitura, toque em um versículo para: **Marcar**, **Marcar e salvar** ou **Marcar e associar a uma devocional**. Destaques, marcações salvas e devocionais ficam no `localStorage` (offline).

## Dados de demonstração

Índice completo de **66 livros**. Texto de amostra: **Gênesis 1** (versículos 1–31) e **João 1** (versículos 1–5). Demais capítulos abrem como placeholder.

## Deploy (GitHub → Cloudflare Pages)

O app usa **hash router** (`#/…`), então não é necessário fallback SPA (`_redirects`). Basta publicar o build estático (HTTPS já coberto pelo Pages — exigência do PWA).

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
npm run preview   # opcional: testar dist/ (inclui PWA)
```

## Português (tradução do original)

A aba **Português** mostra **somente** a tradução direta do original embarcada em `src/data/verses.js` (campo `portuguese`), a mesma camada que acompanha Hebraico e Transliteração. Banner: **Português · tradução do original**.

- `FIXED_PT_VERSION = 'demo'` — id interno do texto local; **não** é João Ferreira de Almeida nem outra edição comercial.
- **Sem seletor de versão.** Sem Almeida / ACF / RA / NVI / bible-api.com / ABíbliaDigital na aba Português.
- Capítulos ainda sem texto local: estado **“Capítulo em breve”** (sem fallback para API).
- Hebraico e Transliteração não mudam.

Cobertura atual das três camadas: amostras (ex.: Gênesis 1, João 1). Expanda `verses.js` para novos capítulos.

Código de catálogo/API legado (`versions.js`, `bibleApi.js`, `versionPicker.js`) permanece dormente e **não** alimenta a leitura em português.

