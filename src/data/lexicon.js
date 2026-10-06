/** Glosa curta de formas frequentes. Não é um léxico completo. */

const HE = {
  אלהים: { g: 'Elohim', r: 'אלה' },
  יהוה: { g: 'YHWH, o nome' },
  אדני: { g: 'Adonai, senhor' },
  אל: { g: 'El' },
  אלוה: { g: 'Eloah' },
  ארץ: { g: 'terra' },
  אדמה: { g: 'solo' },
  שמים: { g: 'céus' },
  מים: { g: 'águas' },
  אור: { g: 'luz' },
  חשך: { g: 'treva' },
  יום: { g: 'dia' },
  לילה: { g: 'noite' },
  בקר: { g: 'manhã' },
  ערב: { g: 'tarde' },
  אדם: { g: 'homem; Adão' },
  אשה: { g: 'mulher' },
  איש: { g: 'homem' },
  בן: { g: 'filho' },
  בת: { g: 'filha' },
  אב: { g: 'pai' },
  אם: { g: 'mãe' },
  עם: { g: 'povo' },
  גוי: { g: 'nação' },
  ישראל: { g: 'Israel' },
  מלך: { g: 'rei' },
  עבד: { g: 'servo' },
  כהן: { g: 'sacerdote' },
  נביא: { g: 'profeta' },
  דבר: { g: 'palavra; falar', r: 'דבר' },
  אמר: { g: 'dizer' },
  ברא: { g: 'criar' },
  עשה: { g: 'fazer' },
  היה: { g: 'ser, haver' },
  יהיה: { g: 'será' },
  נתן: { g: 'dar' },
  לקח: { g: 'tomar' },
  הלך: { g: 'andar' },
  בוא: { g: 'vir, entrar' },
  יצא: { g: 'sair' },
  שוב: { g: 'voltar' },
  ישב: { g: 'sentar, habitar' },
  קום: { g: 'levantar' },
  נפל: { g: 'cair' },
  מות: { g: 'morrer' },
  חיה: { g: 'viver' },
  ידע: { g: 'conhecer' },
  ראה: { g: 'ver' },
  שמע: { g: 'ouvir' },
  דבר: { g: 'falar; palavra' },
  קרא: { g: 'chamar; ler' },
  כתב: { g: 'escrever' },
  זכר: { g: 'lembrar' },
  אהב: { g: 'amar' },
  שנא: { g: 'odiar' },
  ירא: { g: 'temer' },
  ברך: { g: 'abençoar' },
  הלל: { g: 'louvar' },
  שמר: { g: 'guardar' },
  שפט: { g: 'julgar' },
  נפש: { g: 'garganta, alma, vida' },
  רוח: { g: 'sopro, vento, espírito' },
  לב: { g: 'coração' },
  לבב: { g: 'coração' },
  עין: { g: 'olho' },
  יד: { g: 'mão' },
  כף: { g: 'palma' },
  רגל: { g: 'pé' },
  פה: { g: 'boca' },
  לשון: { g: 'língua' },
  ראש: { g: 'cabeça' },
  בשר: { g: 'carne' },
  דם: { g: 'sangue' },
  עצם: { g: 'osso' },
  שם: { g: 'nome' },
  פנים: { g: 'face' },
  קול: { g: 'voz' },
  דרך: { g: 'caminho' },
  טוב: { g: 'bom' },
  רע: { g: 'mau' },
  קדש: { g: 'santo, consagrado' },
  קדוש: { g: 'santo' },
  כבוד: { g: 'peso, glória' },
  חסד: { g: 'lealdade' },
  אמת: { g: 'firmeza' },
  שלום: { g: 'integridade, paz' },
  צדק: { g: 'justiça' },
  תורה: { g: 'instrução' },
  מצוה: { g: 'mandamento' },
  ברית: { g: 'aliança' },
  מזמור: { g: 'mizmor, cântico com cordas', r: 'זמר' },
  בית: { g: 'casa' },
  עיר: { g: 'cidade' },
  הר: { g: 'monte' },
  ים: { g: 'mar' },
  מדבר: { g: 'deserto' },
  עץ: { g: 'árvore' },
  גן: { g: 'jardim' },
  שדה: { g: 'campo' },
  לחם: { g: 'pão' },
  יין: { g: 'vinho' },
  אש: { g: 'fogo' },
  עולם: { g: 'duração, era' },
  מלאך: { g: 'mensageiro' },
  חטא: { g: 'falhar, pecar' },
  מזבח: { g: 'altar' },
  שבת: { g: 'cessar; sábado' },
  תפלה: { g: 'oração' },
  חכמה: { g: 'sabedoria' },
  דעת: { g: 'conhecimento' },
  ראשית: { g: 'princípio', r: 'ראש' },
  בראשית: { g: 'no princípio', r: 'ראש' },
  תהום: { g: 'abismo' },
  חדש: { g: 'mês' },
  שביעי: { g: 'sétimo' },
  מקרא: { g: 'convocação' },
  מלאכה: { g: 'trabalho' },
  מעשה: { g: 'obra' },
  ימים: { g: 'dias' },
  את: { g: 'a' },
  לכם: { g: 'a vocês' },
  לכן: { g: 'a vós' },
  להם: { g: 'a eles' },
  להן: { g: 'a elas' },
  לנו: { g: 'a nós' },
  לך: { g: 'a ti' },
  לי: { g: 'a mim' },
  לו: { g: 'a ele' },
  לה: { g: 'a ela' },
  בכם: { g: 'em vocês' },
  מכם: { g: 'de vocês' },
  כל: { g: 'todo' },
  אחד: { g: 'um' },
  לא: { g: 'não' },
  כי: { g: 'porque, que' },
  אשר: { g: 'que, o qual' },
  הנה: { g: 'eis' },
  גם: { g: 'também' },
  עתה: { g: 'agora' },
  אני: { g: 'eu' },
  אנכי: { g: 'eu' },
  אתה: { g: 'tu' },
  הוא: { g: 'ele' },
  היא: { g: 'ela' },
  זה: { g: 'este' },
  זאת: { g: 'esta' },
  מה: { g: 'que' },
  מי: { g: 'quem' },
  נער: { g: 'rapaz' },
  נערה: { g: 'moça' },
  חזק: { g: 'forte' },
  חזקה: { g: 'força' },
  קם: { g: 'levantou' },
  הקים: { g: 'estabeleceu' },
  הביא: { g: 'trouxe' },
  סור: { g: 'desviar' },
  לוי: { g: 'levita' },
};

const EL = {
  θεος: { g: 'Deus' },
  λογος: { g: 'palavra' },
  ιησους: { g: 'Jesus' },
  χριστος: { g: 'Cristo, ungido' },
  πνευμα: { g: 'sopro, espírito' },
  αγιος: { g: 'santo' },
  ουρανος: { g: 'céu' },
  γη: { g: 'terra' },
  ανθρωπος: { g: 'homem' },
  υιος: { g: 'filho' },
  πατηρ: { g: 'pai' },
  αγαπη: { g: 'amor' },
  πιστις: { g: 'fé, firmeza' },
  χαρις: { g: 'favor, graça' },
  ειρηνη: { g: 'paz' },
  αληθεια: { g: 'verdade' },
  φως: { g: 'luz' },
  ζωη: { g: 'vida' },
  θανατος: { g: 'morte' },
  αμαρτια: { g: 'erro, pecado' },
  νομος: { g: 'lei' },
  βασιλεια: { g: 'reino' },
  εκκλησια: { g: 'assembleia' },
  αγγελος: { g: 'mensageiro' },
  κυριος: { g: 'senhor' },
  δουλος: { g: 'servo' },
  καρδια: { g: 'coração' },
  ψυχη: { g: 'alma' },
  σαρξ: { g: 'carne' },
  αιμα: { g: 'sangue' },
  ονομα: { g: 'nome' },
  οδος: { g: 'caminho' },
  κοσμος: { g: 'mundo, ordem' },
  δοξα: { g: 'glória, opinião' },
  γραφη: { g: 'escrita' },
  προφητης: { g: 'profeta' },
  αποστολος: { g: 'enviado' },
  ευαγγελιον: { g: 'boa notícia' },
};

const HE_PREFIX = new Set(['ו', 'ה', 'ב', 'כ', 'ל', 'מ', 'ש']);

export function hebrewKey(word) {
  return String(word || '')
    .replace(/[\u0591-\u05C7\u200d\u200c]/g, '')
    .replace(/[.,;:!?«»"'()[\]׃]/g, '');
}

export function greekKey(word) {
  return String(word || '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[.,;:·;—–\-!?«»"'()]/g, '')
    .toLowerCase()
    .replace(/ς/g, 'σ');
}

export function formKey(word, lang) {
  return lang === 'el' ? greekKey(word) : hebrewKey(word);
}

const HE_SUFFIX = ['יכם', 'יהם', 'יהן', 'ותי', 'ום', 'ים', 'ות', 'כם', 'כן', 'הם', 'הן', 'נו', 'יה', 'ך', 'י', 'ו', 'ה', 'ת'];

function remember(list, entry) {
  if (!entry) return;
  list.push(entry);
}

function hebrewLookup(key) {
  const found = [];
  const consider = (base, prefixed) => {
    if (HE[base]) {
      remember(found, { gloss: HE[base].g, root: HE[base].r || '', prefixed, len: base.length });
    }
    for (const suffix of HE_SUFFIX) {
      if (base.length - suffix.length < 2 || !base.endsWith(suffix)) continue;
      const core = base.slice(0, -suffix.length);
      const entry = HE[core] || (suffix === 'ת' ? HE[`${core}ה`] : null);
      if (entry) {
        remember(found, { gloss: entry.g, root: entry.r || core, prefixed, len: core.length });
        continue;
      }
      if (suffix === 'ו' && core.length >= 2) {
        const hollow = `${core[0]}ו${core.slice(1)}`;
        if (HE[hollow]) {
          remember(found, { gloss: HE[hollow].g, root: HE[hollow].r || hollow, prefixed, len: hollow.length });
        }
      }
    }
  };

  consider(key, false);
  const stems = [key];
  let stem = key;
  for (let i = 0; i < 4 && stem.length > 2; i += 1) {
    const head = stem[0];
    const verbal = i > 0 && 'איתנ'.includes(head);
    if (!HE_PREFIX.has(head) && !verbal) break;
    stem = stem.slice(1);
    stems.push(stem);
    consider(stem, true);
  }

  if (!found.length) return null;
  found.sort((a, b) => b.len - a.len);
  const best = found[0];
  return { gloss: best.gloss, root: best.root, prefixed: best.prefixed };
}

export function lookupGloss(word, lang) {
  if (lang === 'el') {
    const key = greekKey(word);
    const hit = EL[key];
    return hit ? { key, gloss: hit.g, root: hit.r || '', prefixed: false } : { key, gloss: '', root: '', prefixed: false };
  }
  const key = hebrewKey(word);
  if (key === 'עם') {
    const mark = String(word).slice(String(word).indexOf('ע') + 1, String(word).indexOf('ע') + 2);
    if (mark === '\u05B4') return { key, gloss: 'com', root: '', prefixed: false };
    if (mark === '\u05B7') return { key, gloss: 'povo', root: '', prefixed: false };
  }
  const hit = hebrewLookup(key);
  if (hit) return { key, ...hit };
  return { key, gloss: '', root: '', prefixed: false };
}

export function sameForm(word, targetKey, lang) {
  return formKey(word, lang) === targetKey;
}

export function tokenizeOriginal(text) {
  return String(text || '')
    .split(/[\s־]+/)
    .map((part) => part.replace(/^[.,;:!?«»"'()]+|[.,;:!?«»"'()׃׀]+$/g, ''))
    .filter(Boolean);
}

export function findFormInBook(book, targetKey, lang, limit = 30) {
  const hits = [];
  if (!book?.chapters || !targetKey) return hits;
  for (const chapter of book.chapters) {
    for (const verse of chapter.verses || []) {
      const words = tokenizeOriginal(verse.original);
      if (!words.some((word) => formKey(word, verse.lang || lang) === targetKey)) continue;
      hits.push({
        chapter: chapter.n,
        verse: verse.n,
        portuguese: verse.portuguese || '',
        original: verse.original || '',
      });
      if (hits.length >= limit) return hits;
    }
  }
  return hits;
}
