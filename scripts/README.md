# Scripts de dados bíblicos

## `build-bible-data.py`

Gera `src/data/books/<id>.json` (66 livros) a partir de:

| Camada | Fonte | Licença |
|--------|--------|---------|
| Hebraico/Aramaico (AT) | Westminster Leningrad Codex via [Hebrew-Bible-JSON-with-Nikkud](https://github.com/Rikartt/Hebrew-Bible-JSON-with-Nikkud) (OSHB/WLC) | Texto WLC: domínio público |
| Grego (NT) | Robinson–Pierpont Byzantine Majority Text (Unicode CCAT) em `vendor/greek-byz-ccat/` | Domínio público |
| Transliteração | Gerada (latina simplificada) | — |
| Português | `pt_overrides/<id>.json` (tradução do app, estilo direto do original) | Conteúdo do projeto |

### Preparar hebraico (não versionado, ~9 MB)

```bash
mkdir -p /tmp/bible-src
curl -sL -o /tmp/bible-src/hebrew_bible_with_nikkud.json \
  https://raw.githubusercontent.com/Rikartt/Hebrew-Bible-JSON-with-Nikkud/main/hebrew_bible_with_nikkud.json
```

### Rodar

```bash
python3 scripts/build-bible-data.py
```

Remapeia divisões judaicas → protestantes (BR) em **Joel**, **Malaquias**, **Jonas**, **Naum**.
Marca aramaico em **Daniel** (2:4–7:28), **Esdras** (4:8–6:18; 7:12–26) e **Jr** 10:11.
