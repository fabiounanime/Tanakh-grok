# Bíblia Origens

Sua fé, direto da fonte.

App web de leitura bíblica (Antigo + Novo Testamento), tema escuro com acentos dourados, com abas sincronizadas:

- **Português** — tradução direta do original embarcada no app (não é Almeida / NVI / APIs)
- **Hebraico / Aramaico / Grego** — rótulo dinâmico conforme o livro/capítulo
- **Transliteração** — leitura fonética (LTR)

Interface em **português (pt-BR)**, mobile-first, PWA offline-first.

## Como executar

```bash
cd /workspace/biblia-tanakh
npm install
npm run dev
```

Abra `http://127.0.0.1:5173`.

## Cobertura dos textos (out/2026)

Arquitetura modular: `src/data/books/<id>.json` (66 livros) + `index.json`.

| Camada | Cobertura |
|--------|-----------|
| **Original** (he/arc/el) | **66/66 livros** — todos os capítulos |
| **Transliteração** | **66/66** (gerada) |
| **Português** | Livros **completos**: Rute, Obadias, Jonas, Naum, Habacuque, Sofonias, Ageu, Filipenses, Tito, Filemom, 2 João, 3 João, Judas. **Parciais**: Gênesis (caps. 1–3), João (caps. 1–3). Demais: aba Português mostra “em breve”; Hebraico/Grego/Aramaico e Transliteração já funcionam. |
| **Notas de capítulo** | Presentes nos capítulos com português preenchido (observações breves) |

Fontes do original: WLC (domínio público) + Robinson–Pierpont Byzantine NT (domínio público). Ver `scripts/README.md`.

Para regenerar os JSON após editar `scripts/pt_overrides/`:

```bash
# baixar hebraico em /tmp/bible-src (ver scripts/README.md)
python3 scripts/build-bible-data.py
```

## PWA

Build com `vite-plugin-pwa`, precache do shell + dados + fontes. Em produção (HTTPS): instalar / adicionar à tela de início.

## Layout responsivo

| Faixa | Comportamento |
|-------|----------------|
| Mobile | Shell full-bleed, navegação inferior |
| Tablet (~768+) | Grades mais largas |
| Desktop (~1024+) | Navegação lateral |
| Widescreen (~1280+) | Leitura mais confortável |

## Telas e rotas

| Rota | Tela |
|------|------|
| `#/` | Home |
| `#/biblia` | 66 livros (busca + AT/NT) |
| `#/livro/:id` | Capítulos (destaque se há português) |
| `#/ler/:id/:capítulo` | Português · Hebraico/Aramaico/Grego · Transliteração + notas |
| `#/mapa` | Mapa mental: criação, queda, dilúvio, nações, patriarcas e promessa |
| `#/devocionais` | Devocionais |
| `#/favoritos` | Marcações |

### Aba do original (dinâmica)

O segundo separador deixa de ser fixo “Hebraico”:

- AT hebraico → **Hebraico**
- Seções aramaicas (Daniel 2–7, Esdras 4–7, etc.) → **Aramaico**
- NT → **Grego**

### Notas

Após o último versículo do capítulo, bloco opcional **Notas e observações** (`chapter.notes`).

## Deploy (GitHub → Cloudflare Pages)

| Campo | Valor |
|-------|--------|
| Build command | `npm run build` |
| Output | `dist` |
| Node | 18+ |

Hash router (`#/…`) — sem `_redirects` SPA obrigatório.

```bash
npm run build
npm run preview
```

## Português

Somente texto local (`portuguese` nos JSON). Banner: **Português · tradução do original**. Sem seletor de versão comercial. Capítulos sem PT: aviso na aba Português; outras abas seguem com o original.
