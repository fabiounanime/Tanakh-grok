# Bíblia / Tanakh

App web de leitura bíblica (Antigo + Novo Testamento), tema escuro com acentos dourados, com abas sincronizadas:

- **Português** — seletor de versão (Demo + Almeida 1911 local; João Ferreira de Almeida via bible-api.com; NVI/NVT/ARC via API licenciada)
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

## Versões em português

O seletor de versão (cabeçalho **Bíblia** e leitura na aba Português) afeta **somente** o texto em português. Hebraico e Transliteração continuam no original.

### Embarcadas (sempre disponíveis)

| Id | Rótulo | Licença |
|----|--------|---------|
| `demo` | Demo (local) | Amostra de demonstração (não é edição comercial) |
| `almeida1911` | Almeida 1911 (local) | Domínio público (Lisboa 1911 · Project Gutenberg 62383) — Gênesis 1 |

A escolha é persistida em `localStorage` (`biblia-tanakh:ptVersion`).

### João Ferreira de Almeida via bible-api.com (sem chave)

| Id | Rótulo | Fonte |
|----|--------|-------|
| `almeida` | João Ferreira de Almeida | [bible-api.com](https://bible-api.com/) `translation=almeida` (domínio público) |

Na aba **Português**, com esta versão selecionada, a leitura busca o capítulo pela API parametrizada (`/data/almeida/{BOOK}/{CHAPTER}`). Respostas são cacheadas em **memória + `localStorage`** (`biblia-tanakh:bibleApi:…`) para reuso offline após o primeiro fetch. Implementação: `src/utils/bibleApi.js`.

### Licenciadas via API (NVI / NVT / ARC atual)

**Não** embutimos NVI, NVT nem edições ARC/ACF atuais — exigem licença do detentor dos direitos. A UI lista essas opções como *Requer licença / API* até existir configuração.

**Sobre [HelioGiroto/Biblia-ARC](https://github.com/HelioGiroto/Biblia-ARC):** o repositório tem LICENSE MIT para o *software* do autor, mas o README identifica o texto como **ACF (Almeida Corrigida Fiel)** — tradução moderna com direitos autorais (não domínio público). O MIT do wrapper **não** autoriza redistribuir o texto bíblico; por isso **não** embarcamos ARC/ACF a partir desse repo. ARC permanece atrás de API licenciada.

Integração prevista para NVI/NVT/ARC (stub em `src/utils/bibleApi.js`):

1. Obtenha chave e direitos em [api.Bible](https://scripture.api.bible/) (American Bible Society) ou [Digital Bible Platform](https://4.dbt.io/) (FCBH).
2. Copie `.env.example` → `.env` e preencha:
   - `VITE_BIBLE_API_ENABLED=true`
   - `VITE_BIBLE_API_PROVIDER=api.bible` (ou `dbp`)
   - `VITE_BIBLE_API_KEY=…`
   - `VITE_BIBLE_API_BIBLE_NVI` / `_NVT` / `_ARC` = ids da bíblia no provedor
3. Com flag + chave + id mapeado, a opção correspondente fica **selecionável**. O fetch real ainda é um stub — ligue o adapter do provedor em `bibleApi.js` (sem scraping).

Catálogo e fontes: `src/data/versions.js` (`source: 'local' | 'bible-api' | 'api'`).

