#!/usr/bin/env python3
"""Assemble pt_faithful/*.txt (lines: ch<TAB>v<TAB>text) into pt_overrides/<id>.json.
Preserves existing chapter notes unless a notes file is supplied.
"""
import json, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
OVR = ROOT / "pt_overrides"
SRC = Path(__file__).resolve().parent

def load_lines(book):
    verses = {}
    for p in sorted(SRC.glob(f"{book}*.txt")):
        if p.name.endswith(".notes.txt"):
            continue
        for i, line in enumerate(p.read_text(encoding="utf-8").splitlines(), 1):
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            parts = line.split("\t")
            if len(parts) != 3:
                raise SystemExit(f"{p}:{i} expected 3 tab fields, got {len(parts)}: {line[:80]}")
            c, v, t = int(parts[0]), int(parts[1]), parts[2].strip()
            if not t:
                raise SystemExit(f"{p}:{i} empty text")
            key = (c, v)
            if key in verses:
                raise SystemExit(f"duplicate {book} {c}:{v}")
            verses[key] = t
    return verses

def main():
    book = sys.argv[1]
    expect_path = ROOT.parent / "src" / "data" / "books" / f"{book}.json"
    # ROOT is scripts/
    expect_path = ROOT.parent / "src" / "data" / "books" / f"{book}.json"
    book_json = json.loads(expect_path.read_text(encoding="utf-8"))
    expected = []
    for ch in book_json["chapters"]:
        for v in ch["verses"]:
            expected.append((ch["n"], v["n"]))
    verses = load_lines(book)
    missing = [f"{c}:{v}" for c, v in expected if (c, v) not in verses]
    extra = [f"{c}:{v}" for c, v in verses if (c, v) not in set(expected)]
    if missing or extra:
        print("MISSING", len(missing), missing[:20])
        print("EXTRA", len(extra), extra[:20])
        raise SystemExit(1)
    old = json.loads((OVR / f"{book}.json").read_text(encoding="utf-8"))
    notes = {c["n"]: c.get("notes") for c in old["chapters"] if c.get("notes")}
    # rewrite notes that still say SENHOR
    for k, arr in list(notes.items()):
        notes[k] = [s.replace("SENHOR", "YHWH").replace("Senhor", "Adonai") for s in arr]
    data = {"id": book, "chapters": []}
    by = {}
    for (c, v), t in verses.items():
        by.setdefault(c, []).append((v, t))
    for c in sorted(by):
        ch = {"n": c, "verses": [{"n": v, "portuguese": t} for v, t in sorted(by[c])]}
        if notes.get(c):
            ch["notes"] = notes[c]
        data["chapters"].append(ch)
    out = OVR / f"{book}.json"
    out.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"assembled {book}: {len(verses)} verses")

if __name__ == "__main__":
    main()
