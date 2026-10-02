/**
 * Versículos de demonstração.
 * Português: amostras literais curtas (exemplo / domínio público estilo placeholder),
 * NÃO uma tradução publicada moderna.
 * Hebraico: texto consonantal/massorético clássico (domínio público).
 * Grego: texto koiné clássico (domínio público).
 */

export const verses = [
  // —— Gênesis 1 (hebraico) ——
  {
    bookId: 'gen',
    chapter: 1,
    verse: 1,
    original: 'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ׃',
    originalLang: 'he',
    transliteration: 'Bereshit bara Elohim et hashamayim ve’et ha’aretz.',
    portuguese: 'No princípio criou Deus os céus e a terra.',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 2,
    original: 'וְהָאָרֶץ הָיְתָה תֹהוּ וָבֹהוּ וְחֹשֶׁךְ עַל־פְּנֵי תְהוֹם וְרוּחַ אֱלֹהִים מְרַחֶפֶת עַל־פְּנֵי הַמָּיִם׃',
    originalLang: 'he',
    transliteration: 'Veha’aretz hayetah tohu vavohu vechoshech al-penei tehom veruach Elohim merachefet al-penei hamayim.',
    portuguese: 'E a terra estava sem forma e vazia; e havia trevas sobre a face do abismo; e o Espírito de Deus pairava sobre a face das águas.',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 3,
    original: 'וַיֹּאמֶר אֱלֹהִים יְהִי אוֹר וַיְהִי־אוֹר׃',
    originalLang: 'he',
    transliteration: 'Vayomer Elohim yehi or vayehi-or.',
    portuguese: 'E disse Deus: Haja luz; e houve luz.',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 4,
    original: 'וַיַּרְא אֱלֹהִים אֶת־הָאוֹר כִּי־טוֹב וַיַּבְדֵּל אֱלֹהִים בֵּין הָאוֹר וּבֵין הַחֹשֶׁךְ׃',
    originalLang: 'he',
    transliteration: 'Vayar Elohim et-ha’or ki-tov vayavdel Elohim bein ha’or uvein hachoshech.',
    portuguese: 'E viu Deus que a luz era boa; e fez Deus separação entre a luz e as trevas.',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 5,
    original: 'וַיִּקְרָא אֱלֹהִים לָאוֹר יוֹם וְלַחֹשֶׁךְ קָרָא לָיְלָה וַיְהִי־עֶרֶב וַיְהִי־בֹקֶר יוֹם אֶחָד׃',
    originalLang: 'he',
    transliteration: 'Vayikra Elohim la’or yom velachoshech kara laylah vayehi-erev vayehi-boker yom echad.',
    portuguese: 'E Deus chamou à luz Dia; e às trevas chamou Noite. E foi a tarde e a manhã, o dia primeiro.',
  },
  // —— João 1 (grego) ——
  {
    bookId: 'jhn',
    chapter: 1,
    verse: 1,
    original: 'Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν, καὶ θεὸς ἦν ὁ λόγος.',
    originalLang: 'el',
    transliteration: 'En archē ēn ho logos, kai ho logos ēn pros ton theon, kai theos ēn ho logos.',
    portuguese: 'No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.',
  },
  {
    bookId: 'jhn',
    chapter: 1,
    verse: 2,
    original: 'Οὗτος ἦν ἐν ἀρχῇ πρὸς τὸν θεόν.',
    originalLang: 'el',
    transliteration: 'Houtos ēn en archē pros ton theon.',
    portuguese: 'Ele estava no princípio com Deus.',
  },
  {
    bookId: 'jhn',
    chapter: 1,
    verse: 3,
    original: 'Πάντα διʼ αὐτοῦ ἐγένετο, καὶ χωρὶς αὐτοῦ ἐγένετο οὐδὲ ἕν ὃ γέγονεν.',
    originalLang: 'el',
    transliteration: 'Panta di’ autou egeneto, kai chōris autou egeneto oude hen ho gegonen.',
    portuguese: 'Todas as coisas foram feitas por intermédio dele, e sem ele nada do que foi feito se fez.',
  },
  {
    bookId: 'jhn',
    chapter: 1,
    verse: 4,
    original: 'Ἐν αὐτῷ ζωὴ ἦν, καὶ ἡ ζωὴ ἦν τὸ φῶς τῶν ἀνθρώπων·',
    originalLang: 'el',
    transliteration: 'En autō zōē ēn, kai hē zōē ēn to phōs tōn anthrōpōn.',
    portuguese: 'Nele estava a vida, e a vida era a luz dos homens.',
  },
  {
    bookId: 'jhn',
    chapter: 1,
    verse: 5,
    original: 'καὶ τὸ φῶς ἐν τῇ σκοτίᾳ φαίνει, καὶ ἡ σκοτία αὐτὸ οὐ κατέλαβεν.',
    originalLang: 'el',
    transliteration: 'Kai to phōs en tē skotia phainei, kai hē skotia auto ou katelaben.',
    portuguese: 'E a luz resplandece nas trevas, e as trevas não a compreenderam.',
  },
];

export function getVerses(bookId, chapter) {
  return verses
    .filter((v) => v.bookId === bookId && v.chapter === chapter)
    .sort((a, b) => a.verse - b.verse);
}

export function hasDemoContent(bookId, chapter) {
  return verses.some((v) => v.bookId === bookId && v.chapter === chapter);
}
