import json
from pathlib import Path
OUT = Path(__file__).resolve().parent / 'pt_overrides'

def save(book_id, chapters, notes=None, merge=False):
    """chapters: {ch: {v: pt_str}}"""
    path = OUT / f'{book_id}.json'
    by_ch, notes_ex = {}, {}
    if merge and path.exists():
        existing = json.loads(path.read_text(encoding='utf-8'))
        by_ch = {c['n']: {v['n']: v['portuguese'] for v in c['verses']} for c in existing['chapters']}
        notes_ex = {c['n']: c.get('notes') for c in existing['chapters'] if c.get('notes')}
    for c, vs in chapters.items():
        by_ch.setdefault(int(c), {}).update({int(k): v for k, v in vs.items()})
    if notes:
        notes_ex.update({int(k): v for k, v in notes.items()})
    data = {'id': book_id, 'chapters': []}
    for c in sorted(by_ch):
        ch = {'n': c, 'verses': [{'n': v, 'portuguese': by_ch[c][v]} for v in sorted(by_ch[c])]}
        if notes_ex.get(c):
            ch['notes'] = notes_ex[c]
        data['chapters'].append(ch)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    total = sum(len(by_ch[c]) for c in by_ch)
    print(f'wrote {book_id}: {total} verses / {len(by_ch)} ch')
    return total

def expect(book_id):
    b = json.loads((Path(__file__).resolve().parents[1] / 'src/data/books' / f'{book_id}.json').read_text())
    return {c['n']: len(c['verses']) for c in b['chapters']}
