#!/usr/bin/env python3
"""
Build modular Bible JSON for biblia-tanakh from public-domain sources.

Sources:
  - OT Hebrew: Westminster Leningrad Codex via Hebrew-Bible-JSON-with-Nikkud (MIT;
    underlying WLC text is public domain / Open Scriptures MorphHB).
  - NT Greek: Robinson-Pierpont Byzantine Majority Text 2018 Unicode (public domain).
  - Transliteration: simplified academic Latin (generated).
  - Portuguese: merged from scripts/pt_overrides/*.json when present (app translation).

Output: src/data/books/<id>.json
"""
from __future__ import annotations

import csv
import json
import re
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "src" / "data" / "books"
HEBREW_JSON = Path("/tmp/bible-src/hebrew_bible_with_nikkud.json")
GREEK_DIR = Path(__file__).resolve().parent / "vendor" / "greek-byz-ccat"
PT_DIR = Path(__file__).resolve().parent / "pt_overrides"

# App book id → Hebrew JSON key
HE_BOOKS = {
    "gen": "Gen", "exo": "Exod", "lev": "Lev", "num": "Num", "deu": "Deut",
    "jos": "Josh", "jdg": "Judg", "rut": "Ruth",
    "1sa": "1Sam", "2sa": "2Sam", "1ki": "1Kgs", "2ki": "2Kgs",
    "1ch": "1Chr", "2ch": "2Chr", "ezr": "Ezra", "neh": "Neh", "est": "Esth",
    "job": "Job", "psa": "Ps", "pro": "Prov", "ecc": "Eccl", "sng": "Song",
    "isa": "Isa", "jer": "Jer", "lam": "Lam", "ezk": "Ezek", "dan": "Dan",
    "hos": "Hos", "jol": "Joel", "amo": "Amos", "oba": "Obad", "jon": "Jonah",
    "mic": "Mic", "nam": "Nah", "hab": "Hab", "zep": "Zeph", "hag": "Hag",
    "zec": "Zech", "mal": "Mal",
}

# App book id → Greek CSV filename stem
EL_BOOKS = {
    "mat": "MAT", "mrk": "MAR", "luk": "LUK", "jhn": "JOH", "act": "ACT",
    "rom": "ROM", "1co": "1CO", "2co": "2CO", "gal": "GAL", "eph": "EPH",
    "php": "PHP", "col": "COL", "1th": "1TH", "2th": "2TH",
    "1ti": "1TI", "2ti": "2TI", "tit": "TIT", "phm": "PHM", "heb": "HEB",
    "jas": "JAM", "1pe": "1PE", "2pe": "2PE", "1jn": "1JO", "2jn": "2JO",
    "3jn": "3JO", "jud": "JUD", "rev": "REV",
}

BOOK_META = {
    "gen": ("Gênesis", "AT", "he"), "exo": ("Êxodo", "AT", "he"),
    "lev": ("Levítico", "AT", "he"), "num": ("Números", "AT", "he"),
    "deu": ("Deuteronômio", "AT", "he"), "jos": ("Josué", "AT", "he"),
    "jdg": ("Juízes", "AT", "he"), "rut": ("Rute", "AT", "he"),
    "1sa": ("1 Samuel", "AT", "he"), "2sa": ("2 Samuel", "AT", "he"),
    "1ki": ("1 Reis", "AT", "he"), "2ki": ("2 Reis", "AT", "he"),
    "1ch": ("1 Crônicas", "AT", "he"), "2ch": ("2 Crônicas", "AT", "he"),
    "ezr": ("Esdras", "AT", "he"), "neh": ("Neemias", "AT", "he"),
    "est": ("Ester", "AT", "he"), "job": ("Jó", "AT", "he"),
    "psa": ("Salmos", "AT", "he"), "pro": ("Provérbios", "AT", "he"),
    "ecc": ("Eclesiastes", "AT", "he"), "sng": ("Cânticos", "AT", "he"),
    "isa": ("Isaías", "AT", "he"), "jer": ("Jeremias", "AT", "he"),
    "lam": ("Lamentações", "AT", "he"), "ezk": ("Ezequiel", "AT", "he"),
    "dan": ("Daniel", "AT", "he"), "hos": ("Oséias", "AT", "he"),
    "jol": ("Joel", "AT", "he"), "amo": ("Amós", "AT", "he"),
    "oba": ("Obadias", "AT", "he"), "jon": ("Jonas", "AT", "he"),
    "mic": ("Miquéias", "AT", "he"), "nam": ("Naum", "AT", "he"),
    "hab": ("Habacuque", "AT", "he"), "zep": ("Sofonias", "AT", "he"),
    "hag": ("Ageu", "AT", "he"), "zec": ("Zacarias", "AT", "he"),
    "mal": ("Malaquias", "AT", "he"),
    "mat": ("Mateus", "NT", "el"), "mrk": ("Marcos", "NT", "el"),
    "luk": ("Lucas", "NT", "el"), "jhn": ("João", "NT", "el"),
    "act": ("Atos", "NT", "el"), "rom": ("Romanos", "NT", "el"),
    "1co": ("1 Coríntios", "NT", "el"), "2co": ("2 Coríntios", "NT", "el"),
    "gal": ("Gálatas", "NT", "el"), "eph": ("Efésios", "NT", "el"),
    "php": ("Filipenses", "NT", "el"), "col": ("Colossenses", "NT", "el"),
    "1th": ("1 Tessalonicenses", "NT", "el"), "2th": ("2 Tessalonicenses", "NT", "el"),
    "1ti": ("1 Timóteo", "NT", "el"), "2ti": ("2 Timóteo", "NT", "el"),
    "tit": ("Tito", "NT", "el"), "phm": ("Filemom", "NT", "el"),
    "heb": ("Hebreus", "NT", "el"), "jas": ("Tiago", "NT", "el"),
    "1pe": ("1 Pedro", "NT", "el"), "2pe": ("2 Pedro", "NT", "el"),
    "1jn": ("1 João", "NT", "el"), "2jn": ("2 João", "NT", "el"),
    "3jn": ("3 João", "NT", "el"), "jud": ("Judas", "NT", "el"),
    "rev": ("Apocalipse", "NT", "el"),
}

# Aramaic verse ranges (1-indexed, inclusive). Dan 2:4b treated as from v4.
ARAMAIC_RANGES = {
    "dan": [
        (2, 4, 2, 49),
        (3, 1, 3, 30),
        (4, 1, 4, 37),
        (5, 1, 5, 31),
        (6, 1, 6, 28),
        (7, 1, 7, 28),
    ],
    "ezr": [
        (4, 8, 6, 18),
        (7, 12, 7, 26),
    ],
    "jer": [
        (10, 11, 10, 11),
    ],
}

# Cantillation / extra marks to strip for cleaner display & translit
_HE_STRIP = dict.fromkeys(map(ord, "\u0591\u0592\u0593\u0594\u0595\u0596\u0597\u0598\u0599\u059a\u059b\u059c\u059d\u059e\u059f\u05a0\u05a1\u05a2\u05a3\u05a4\u05a5\u05a6\u05a7\u05a8\u05a9\u05aa\u05ab\u05ac\u05ad\u05ae\u05af\u05bd\u05bf\u05c0\u05c4\u05c5\u05c7"), None)

HE_CONS = {
    "א": "'", "ב": "b", "ג": "g", "ד": "d", "ה": "h", "ו": "v", "ז": "z",
    "ח": "ch", "ט": "t", "י": "y", "כ": "k", "ך": "k", "ל": "l", "מ": "m",
    "ם": "m", "נ": "n", "ן": "n", "ס": "s", "ע": "'", "פ": "p", "ף": "p",
    "צ": "ts", "ץ": "ts", "ק": "q", "ר": "r", "ש": "sh", "ת": "t",
}
HE_VOWEL = {
    "\u05b0": "e",  # sheva
    "\u05b1": "e",  # hataf segol
    "\u05b2": "a",  # hataf patah
    "\u05b3": "o",  # hataf qamats
    "\u05b4": "i",  # hiriq
    "\u05b5": "e",  # tsere
    "\u05b6": "e",  # segol
    "\u05b7": "a",  # patah
    "\u05b8": "a",  # qamats
    "\u05b9": "o",  # holam
    "\u05ba": "o",  # holam haser for vav
    "\u05bb": "u",  # qubuts
    "\u05bc": "",   # dagesh
    "\u05c1": "",   # shin dot
    "\u05c2": "",   # sin dot
    "\u05c3": "",   # sof pasuq handled separately
}

EL_MAP = {
    "Α": "A", "Β": "B", "Γ": "G", "Δ": "D", "Ε": "E", "Ζ": "Z", "Η": "Ē",
    "Θ": "Th", "Ι": "I", "Κ": "K", "Λ": "L", "Μ": "M", "Ν": "N", "Ξ": "X",
    "Ο": "O", "Π": "P", "Ρ": "R", "Σ": "S", "Τ": "T", "Υ": "Y", "Φ": "Ph",
    "Χ": "Ch", "Ψ": "Ps", "Ω": "Ō",
    "α": "a", "β": "b", "γ": "g", "δ": "d", "ε": "e", "ζ": "z", "η": "ē",
    "θ": "th", "ι": "i", "κ": "k", "λ": "l", "μ": "m", "ν": "n", "ξ": "x",
    "ο": "o", "π": "p", "ρ": "r", "σ": "s", "ς": "s", "τ": "t", "υ": "y",
    "φ": "ph", "χ": "ch", "ψ": "ps", "ω": "ō",
    "ἀ": "a", "ἁ": "ha", "ἂ": "a", "ἃ": "ha", "ἄ": "a", "ἅ": "ha", "ἆ": "a", "ἇ": "ha",
    "Ἀ": "A", "Ἁ": "Ha", "Ἂ": "A", "Ἃ": "Ha", "Ἄ": "A", "Ἅ": "Ha", "Ἆ": "A", "Ἇ": "Ha",
    "ἐ": "e", "ἑ": "he", "ἒ": "e", "ἓ": "he", "ἔ": "e", "ἕ": "he",
    "Ἐ": "E", "Ἑ": "He", "Ἒ": "E", "Ἓ": "He", "Ἔ": "E", "Ἕ": "He",
    "ἠ": "ē", "ἡ": "hē", "ἢ": "ē", "ἣ": "hē", "ἤ": "ē", "ἥ": "hē", "ἦ": "ē", "ἧ": "hē",
    "Ἠ": "Ē", "Ἡ": "Hē", "Ἢ": "Ē", "Ἣ": "Hē", "Ἤ": "Ē", "Ἥ": "Hē", "Ἦ": "Ē", "Ἧ": "Hē",
    "ἰ": "i", "ἱ": "hi", "ἲ": "i", "ἳ": "hi", "ἴ": "i", "ἵ": "hi", "ἶ": "i", "ἷ": "hi",
    "Ἰ": "I", "Ἱ": "Hi", "Ἲ": "I", "Ἳ": "Hi", "Ἴ": "I", "Ἵ": "Hi", "Ἶ": "I", "Ἷ": "Hi",
    "ὀ": "o", "ὁ": "ho", "ὂ": "o", "ὃ": "ho", "ὄ": "o", "ὅ": "ho",
    "Ὀ": "O", "Ὁ": "Ho", "Ὂ": "O", "Ὃ": "Ho", "Ὄ": "O", "Ὅ": "Ho",
    "ὐ": "y", "ὑ": "hy", "ὒ": "y", "ὓ": "hy", "ὔ": "y", "ὕ": "hy", "ὖ": "y", "ὗ": "hy",
    "Ὑ": "Hy", "Ὓ": "Hy", "Ὕ": "Hy", "Ὗ": "Hy",
    "ὠ": "ō", "ὡ": "hō", "ὢ": "ō", "ὣ": "hō", "ὤ": "ō", "ὥ": "hō", "ὦ": "ō", "ὧ": "hō",
    "Ὠ": "Ō", "Ὡ": "Hō", "Ὢ": "Ō", "Ὣ": "Hō", "Ὤ": "Ō", "Ὥ": "Hō", "Ὦ": "Ō", "Ὧ": "Hō",
    "ὰ": "a", "ά": "a", "ᾶ": "a", "ᾳ": "a", "ᾴ": "a", "ᾷ": "a", "ᾲ": "a",
    "ὲ": "e", "έ": "e",
    "ὴ": "ē", "ή": "ē", "ῆ": "ē", "ῃ": "ē", "ῄ": "ē", "ῇ": "ē",
    "ὶ": "i", "ί": "i", "ῖ": "i", "ϊ": "i", "ΐ": "i", "ῒ": "i", "ῗ": "i",
    "ὸ": "o", "ό": "o",
    "ὺ": "y", "ύ": "y", "ῦ": "y", "ϋ": "y", "ΰ": "y", "ῢ": "y", "ῧ": "y",
    "ὼ": "ō", "ώ": "ō", "ῶ": "ō", "ῳ": "ō", "ῴ": "ō", "ῷ": "ō",
    "ῤ": "r", "ῥ": "rh", "Ῥ": "Rh",
}


def strip_cantillation(text: str) -> str:
    return text.translate(_HE_STRIP).replace("\u05c3", "").replace("׃", "").strip()


def join_hebrew_words(words: list[str]) -> str:
    # Re-join with spaces; keep maqaf as-is inside words
    cleaned = [strip_cantillation(w) for w in words if w]
    text = " ".join(cleaned)
    text = re.sub(r"\s+", " ", text).strip()
    if text and not text.endswith("׃"):
        text += "׃"
    return text


def transliterate_hebrew(text: str) -> str:
    t = strip_cantillation(text).replace("׃", "").replace("־", "-")
    out = []
    i = 0
    while i < len(t):
        ch = t[i]
        if ch in HE_CONS:
            # shin/sin via next combining dot if present
            cons = HE_CONS[ch]
            if ch == "ש" and i + 1 < len(t):
                if t[i + 1] == "\u05c2":
                    cons = "s"
            out.append(cons)
        elif ch in HE_VOWEL:
            out.append(HE_VOWEL[ch])
        elif ch in (" ", "-", "'", ",", ".", ";", ":", "?", "!"):
            out.append(ch if ch != " " else " ")
        elif ch == "ו" :
            out.append("v")
        else:
            # drop unknown marks
            if unicodedata.category(ch)[0] != "M":
                if ch.isalpha():
                    out.append(ch)
                elif ch in "()[]":
                    out.append(ch)
        i += 1
    s = "".join(out)
    s = re.sub(r"\s+", " ", s).strip()
    # Capitalize first letter of each word-ish token for readability
    parts = []
    for tok in s.split(" "):
        if not tok:
            continue
        parts.append(tok[0].upper() + tok[1:] if tok[0].isalpha() else tok)
    result = " ".join(parts)
    if result and not result.endswith("."):
        result += "."
    return result


def transliterate_greek(text: str) -> str:
    # Decompose accents; keep rough breathing as "h", drop other combining marks.
    norm = unicodedata.normalize("NFD", text)
    rough_br = "̔"
    out = []
    i = 0
    while i < len(norm):
        ch = norm[i]
        is_greek_letter = ch in EL_MAP or (
            unicodedata.name(ch, "").startswith("GREEK") and ch.isalpha()
        )
        if is_greek_letter:
            base = EL_MAP.get(ch, ch)
            j = i + 1
            rough = False
            while j < len(norm) and unicodedata.category(norm[j]) == "Mn":
                if norm[j] == rough_br:
                    rough = True
                j += 1
            out.append(("h" + base) if rough else base)
            i = j
            continue
        if unicodedata.category(ch) == "Mn":
            i += 1
            continue
        if ch in ",.;:!?··'\"«»()[]—–-":
            out.append(ch)
        elif ch == " ":
            out.append(" ")
        else:
            out.append(ch)
        i += 1
    s = re.sub(r"\s+", " ", "".join(out)).strip()
    return s


def is_aramaic(book_id: str, chapter: int, verse: int) -> bool:
    ranges = ARAMAIC_RANGES.get(book_id)
    if not ranges:
        return False
    for c1, v1, c2, v2 in ranges:
        if (chapter, verse) < (c1, v1):
            continue
        if (chapter, verse) > (c2, v2):
            continue
        return True
    return False


def load_pt_override(book_id: str) -> dict:
    """Return {(chapter, verse): portuguese_text} and chapterNotes."""
    path = PT_DIR / f"{book_id}.json"
    verses = {}
    notes = {}
    if not path.exists():
        return verses, notes
    data = json.loads(path.read_text(encoding="utf-8"))
    for ch in data.get("chapters", []):
        c = int(ch["n"])
        if ch.get("notes"):
            notes[c] = ch["notes"]
        for v in ch.get("verses", []):
            pt = (v.get("portuguese") or "").strip()
            if pt:
                verses[(c, int(v["n"]))] = pt
    return verses, notes



def remap_protestant_chapters(book_id: str, chapters: list) -> list:
    """Align WLC Jewish chapter divisions to Protestant (Brazilian Almeida) numbering."""
    if book_id == "jol" and len(chapters) == 4:
        # Prot Joel 1 = Heb 1; Prot 2 = Heb 2+3; Prot 3 = Heb 4
        c1, c2, c3, c4 = chapters
        merged2 = []
        n = 1
        for v in c2:
            vv = dict(v); vv["n"] = n; merged2.append(vv); n += 1
        for v in c3:
            vv = dict(v); vv["n"] = n; merged2.append(vv); n += 1
        c4r = []
        for i, v in enumerate(c4, 1):
            vv = dict(v); vv["n"] = i; c4r.append(vv)
        return [
            {"n": 1, "verses": c1, **({} if "notes" not in chapters[0] else {})},
            {"n": 2, "verses": merged2},
            {"n": 3, "verses": c4r},
        ]
    if book_id == "mal" and len(chapters) == 3:
        # Prot Mal 4 = Heb Mal 3:19–24 (last 6 verses)
        c1, c2, c3 = chapters
        if len(c3) >= 6:
            head = []
            for i, v in enumerate(c3[:-6], 1):
                vv = dict(v); vv["n"] = i; head.append(vv)
            tail = []
            for i, v in enumerate(c3[-6:], 1):
                vv = dict(v); vv["n"] = i; tail.append(vv)
            return [
                {"n": 1, "verses": c1},
                {"n": 2, "verses": c2},
                {"n": 3, "verses": head},
                {"n": 4, "verses": tail},
            ]
    # renumber n fields to be safe
    out = []
    for i, ch in enumerate(chapters, 1):
        verses = []
        for j, v in enumerate(ch.get("verses", ch) if isinstance(ch, dict) else ch, 1):
            if isinstance(ch, dict):
                vv = dict(v)
                vv["n"] = v.get("n", j)
                verses.append(vv)
            else:
                # shouldn't happen
                verses.append(v)
        obj = {"n": i, "verses": verses}
        if isinstance(ch, dict) and ch.get("notes"):
            obj["notes"] = ch["notes"]
        out.append(obj)
    return out if book_id not in ("jol", "mal") else chapters


def build_hebrew_book(book_id: str, raw_chapters: list) -> dict:
    name, testament, default_lang = BOOK_META[book_id]
    pt_map, notes_map = load_pt_override(book_id)
    chapters = []
    for ci, verses_words in enumerate(raw_chapters):
        cnum = ci + 1
        verses = []
        for vi, words in enumerate(verses_words):
            vnum = vi + 1
            original = join_hebrew_words(words)
            lang = "arc" if is_aramaic(book_id, cnum, vnum) else "he"
            pt = pt_map.get((cnum, vnum), "")
            verses.append({
                "n": vnum,
                "portuguese": pt,
                "original": original,
                "transliteration": transliterate_hebrew(original),
                "lang": lang,
            })
        ch_obj = {"n": cnum, "verses": verses}
        if cnum in notes_map:
            ch_obj["notes"] = notes_map[cnum]
        chapters.append(ch_obj)
    if book_id in ("jol", "mal", "jon", "nam"):
        # Rebuild plain verse lists then remap Jewish→Protestant chapters
        plain = [ch["verses"] for ch in chapters]
        notes_keep = {ch["n"]: ch.get("notes") for ch in chapters if ch.get("notes")}
        if book_id == "jol" and len(plain) == 4:
            c1, c2, c3, c4 = plain
            merged2 = []
            n = 1
            for v in c2 + c3:
                vv = dict(v); vv["n"] = n; merged2.append(vv); n += 1
            c4r = [dict(v, n=i) for i, v in enumerate(c4, 1)]
            chapters = [
                {"n": 1, "verses": [dict(v, n=i) for i, v in enumerate(c1, 1)]},
                {"n": 2, "verses": merged2},
                {"n": 3, "verses": c4r},
            ]
        elif book_id == "mal" and len(plain) == 3:
            c1, c2, c3 = plain
            if len(c3) >= 6:
                head = [dict(v, n=i) for i, v in enumerate(c3[:-6], 1)]
                tail = [dict(v, n=i) for i, v in enumerate(c3[-6:], 1)]
                chapters = [
                    {"n": 1, "verses": [dict(v, n=i) for i, v in enumerate(c1, 1)]},
                    {"n": 2, "verses": [dict(v, n=i) for i, v in enumerate(c2, 1)]},
                    {"n": 3, "verses": head},
                    {"n": 4, "verses": tail},
                ]
        elif book_id == "jon" and len(plain) == 4:
            # Prot Jon 1:17 = Heb 2:1; Prot 2:1–10 = Heb 2:2–11
            c1, c2, c3, c4 = plain
            if len(c2) >= 2:
                p1 = [dict(v, n=i) for i, v in enumerate(c1, 1)]
                p1.append(dict(c2[0], n=len(p1) + 1))  # 1:17
                p2 = [dict(v, n=i) for i, v in enumerate(c2[1:], 1)]
                chapters = [
                    {"n": 1, "verses": p1},
                    {"n": 2, "verses": p2},
                    {"n": 3, "verses": [dict(v, n=i) for i, v in enumerate(c3, 1)]},
                    {"n": 4, "verses": [dict(v, n=i) for i, v in enumerate(c4, 1)]},
                ]
        elif book_id == "nam" and len(plain) == 3:
            # Prot Nam 1:15 = Heb 2:1; Prot 2:1–13 = Heb 2:2–14
            c1, c2, c3 = plain
            if len(c2) >= 2:
                p1 = [dict(v, n=i) for i, v in enumerate(c1, 1)]
                p1.append(dict(c2[0], n=len(p1) + 1))
                p2 = [dict(v, n=i) for i, v in enumerate(c2[1:], 1)]
                chapters = [
                    {"n": 1, "verses": p1},
                    {"n": 2, "verses": p2},
                    {"n": 3, "verses": [dict(v, n=i) for i, v in enumerate(c3, 1)]},
                ]
        # notes keyed by protestant chapter if present in overrides (applied earlier on Jewish nums — re-apply from notes_map)
        pt_map, notes_map = load_pt_override(book_id)
        for ch in chapters:
            if ch["n"] in notes_map:
                ch["notes"] = notes_map[ch["n"]]
            for v in ch["verses"]:
                pt = pt_map.get((ch["n"], v["n"]))
                if pt:
                    v["portuguese"] = pt

    return {
        "id": book_id,
        "name": name,
        "testament": testament,
        "defaultLang": default_lang,
        "source": {
            "original": "Westminster Leningrad Codex (public domain) via OSHB/JSON",
            "portuguese": "Tradução do app (direta do original) onde preenchida",
        },
        "chapters": chapters,
    }


def build_greek_book(book_id: str) -> dict:
    name, testament, default_lang = BOOK_META[book_id]
    csv_path = GREEK_DIR / f"{EL_BOOKS[book_id]}.csv"
    pt_map, notes_map = load_pt_override(book_id)
    by_ch: dict[int, list] = {}
    with csv_path.open(encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            c = int(row["chapter"])
            v = int(row["verse"])
            text = (row["text"] or "").strip()
            by_ch.setdefault(c, []).append((v, text))
    chapters = []
    for cnum in sorted(by_ch):
        verses = []
        for vnum, original in sorted(by_ch[cnum], key=lambda x: x[0]):
            pt = pt_map.get((cnum, vnum), "")
            verses.append({
                "n": vnum,
                "portuguese": pt,
                "original": original,
                "transliteration": transliterate_greek(original),
                "lang": "el",
            })
        ch_obj = {"n": cnum, "verses": verses}
        if cnum in notes_map:
            ch_obj["notes"] = notes_map[cnum]
        chapters.append(ch_obj)
    return {
        "id": book_id,
        "name": name,
        "testament": testament,
        "defaultLang": default_lang,
        "source": {
            "original": "Robinson-Pierpont Byzantine Majority Text (public domain)",
            "portuguese": "Tradução do app (direta do original) onde preenchida",
        },
        "chapters": chapters,
    }


def main() -> int:
    if not HEBREW_JSON.exists():
        print(f"Missing Hebrew JSON: {HEBREW_JSON}", file=sys.stderr)
        return 1
    if not GREEK_DIR.exists():
        print(f"Missing Greek dir: {GREEK_DIR}", file=sys.stderr)
        return 1

    hebrew = json.loads(HEBREW_JSON.read_text(encoding="utf-8"))
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    index = []
    pt_complete = []
    pt_partial = []
    pt_none = []

    for book_id, he_key in HE_BOOKS.items():
        print(f"Building {book_id} (Hebrew)…")
        book = build_hebrew_book(book_id, hebrew[he_key])
        (OUT_DIR / f"{book_id}.json").write_text(
            json.dumps(book, ensure_ascii=False, separators=(",", ":")),
            encoding="utf-8",
        )
        total = sum(len(ch["verses"]) for ch in book["chapters"])
        with_pt = sum(1 for ch in book["chapters"] for v in ch["verses"] if v["portuguese"])
        index.append({
            "id": book_id, "name": book["name"], "testament": book["testament"],
            "chapters": len(book["chapters"]), "verses": total,
            "ptVerses": with_pt, "defaultLang": book["defaultLang"],
        })
        if with_pt == 0:
            pt_none.append(book_id)
        elif with_pt == total:
            pt_complete.append(book_id)
        else:
            pt_partial.append(book_id)

    for book_id in EL_BOOKS:
        print(f"Building {book_id} (Greek)…")
        book = build_greek_book(book_id)
        (OUT_DIR / f"{book_id}.json").write_text(
            json.dumps(book, ensure_ascii=False, separators=(",", ":")),
            encoding="utf-8",
        )
        total = sum(len(ch["verses"]) for ch in book["chapters"])
        with_pt = sum(1 for ch in book["chapters"] for v in ch["verses"] if v["portuguese"])
        index.append({
            "id": book_id, "name": book["name"], "testament": book["testament"],
            "chapters": len(book["chapters"]), "verses": total,
            "ptVerses": with_pt, "defaultLang": book["defaultLang"],
        })
        if with_pt == 0:
            pt_none.append(book_id)
        elif with_pt == total:
            pt_complete.append(book_id)
        else:
            pt_partial.append(book_id)

    (OUT_DIR / "index.json").write_text(
        json.dumps({"books": index, "ptComplete": pt_complete, "ptPartial": pt_partial, "ptNone": pt_none},
                   ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print("Done.", len(index), "books")
    print("PT complete:", pt_complete)
    print("PT partial:", pt_partial)
    print("PT none:", len(pt_none))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
