/**
 * Versículos de demonstração.
 * Português: amostras literais (exemplo / domínio público estilo placeholder),
 * NÃO uma tradução publicada moderna.
 * Hebraico: Westminster Leningrad Codex / Tanach com nikkud (domínio público).
 * Grego: texto koiné clássico (domínio público).
 */


import { lookupPtVersionText, DEFAULT_PT_VERSION } from './versions.js';

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
  {
    bookId: 'gen',
    chapter: 1,
    verse: 6,
    original: 'וַיֹּאמֶר אֱלֹהִים יְהִי רָקִיעַ בְּתוֹךְ הַמָּיִם וִיהִי מַבְדִּיל בֵּין מַיִם לָמָיִם׃',
    originalLang: 'he',
    transliteration: 'Vayomer Elohim yehi rakia betoch hamayim vihi mavdil bein mayim lamayim.',
    portuguese: 'E disse Deus: Haja uma expansão no meio das águas, e haja separação entre águas e águas.',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 7,
    original: 'וַיַּעַשׂ אֱלֹהִים אֶת־הָרָקִיעַ וַיַּבְדֵּל בֵּין הַמַּיִם אֲשֶׁר מִתַּחַת לָרָקִיעַ וּבֵין הַמַּיִם אֲשֶׁר מֵעַל לָרָקִיעַ וַיְהִי־כֵן׃',
    originalLang: 'he',
    transliteration: 'Vaya’as Elohim et-harakia vayavdel bein hamayim asher mitachat larakia uvein hamayim asher me’al larakia vayehi-chen.',
    portuguese: 'E fez Deus a expansão, e fez separação entre as águas que estavam debaixo da expansão e as águas que estavam sobre a expansão; e assim foi.',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 8,
    original: 'וַיִּקְרָא אֱלֹהִים לָרָקִיעַ שָׁמָיִם וַיְהִי־עֶרֶב וַיְהִי־בֹקֶר יוֹם שֵׁנִי׃',
    originalLang: 'he',
    transliteration: 'Vayikra Elohim larakia shamayim vayehi-erev vayehi-boker yom sheni.',
    portuguese: 'E chamou Deus à expansão Céus, e foi a tarde e a manhã, o dia segundo.',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 9,
    original: 'וַיֹּאמֶר אֱלֹהִים יִקָּווּ הַמַּיִם מִתַּחַת הַשָּׁמַיִם אֶל־מָקוֹם אֶחָד וְתֵרָאֶה הַיַּבָּשָׁה וַיְהִי־כֵן׃',
    originalLang: 'he',
    transliteration: 'Vayomer Elohim yikavu hamayim mitachat hashamayim el-makom echad vetera’eh hayabashah vayehi-chen.',
    portuguese: 'E disse Deus: Ajuntem-se as águas debaixo dos céus num lugar; e apareça a porção seca; e assim foi.',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 10,
    original: 'וַיִּקְרָא אֱלֹהִים לַיַּבָּשָׁה אֶרֶץ וּלְמִקְוֵה הַמַּיִם קָרָא יַמִּים וַיַּרְא אֱלֹהִים כִּי־טוֹב׃',
    originalLang: 'he',
    transliteration: 'Vayikra Elohim layabashah eretz ulemikveh hamayim kara yamim vayar Elohim ki-tov.',
    portuguese: 'E chamou Deus à porção seca Terra; e ao ajuntamento das águas chamou Mares; e viu Deus que era bom.',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 11,
    original: 'וַיֹּאמֶר אֱלֹהִים תַּדְשֵׁא הָאָרֶץ דֶּשֶׁא עֵשֶׂב מַזְרִיעַ זֶרַע עֵץ פְּרִי עֹשֶׂה פְּרִי לְמִינוֹ אֲשֶׁר זַרְעוֹ־בוֹ עַל־הָאָרֶץ וַיְהִי־כֵן׃',
    originalLang: 'he',
    transliteration: 'Vayomer Elohim tadshe ha’aretz deshe esev mazria zera etz pri oseh pri lemino asher zar’o-vo al-ha’aretz vayehi-chen.',
    portuguese: 'E disse Deus: Produza a terra erva verde, erva que dê semente, árvore frutífera que dê fruto segundo a sua espécie, cuja semente está nela sobre a terra; e assim foi.',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 12,
    original: 'וַתּוֹצֵא הָאָרֶץ דֶּשֶׁא עֵשֶׂב מַזְרִיעַ זֶרַע לְמִינֵהוּ וְעֵץ עֹשֶׂה־פְּרִי אֲשֶׁר זַרְעוֹ־בוֹ לְמִינֵהוּ וַיַּרְא אֱלֹהִים כִּי־טוֹב׃',
    originalLang: 'he',
    transliteration: 'Vatotze ha’aretz deshe esev mazria zera leminehu ve’etz oseh-pri asher zar’o-vo leminehu vayar Elohim ki-tov.',
    portuguese: 'E a terra produziu erva, erva dando semente conforme a sua espécie, e a árvore frutífera, cuja semente está nela conforme a sua espécie; e viu Deus que era bom.',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 13,
    original: 'וַיְהִי־עֶרֶב וַיְהִי־בֹקֶר יוֹם שְׁלִישִׁי׃',
    originalLang: 'he',
    transliteration: 'Vayehi-erev vayehi-boker yom shelishi.',
    portuguese: 'E foi a tarde e a manhã, o dia terceiro.',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 14,
    original: 'וַיֹּאמֶר אֱלֹהִים יְהִי מְאֹרֹת בִּרְקִיעַ הַשָּׁמַיִם לְהַבְדִּיל בֵּין הַיּוֹם וּבֵין הַלָּיְלָה וְהָיוּ לְאֹתֹת וּלְמוֹעֲדִים וּלְיָמִים וְשָׁנִים׃',
    originalLang: 'he',
    transliteration: 'Vayomer Elohim yehi me’orot birkia hashamayim lehavdil bein hayom uvein halaylah vehayu le’otot ulemo’adim uleyamim veshanim.',
    portuguese: 'E disse Deus: Haja luminares na expansão dos céus, para haver separação entre o dia e a noite; e sejam eles para sinais e para tempos determinados e para dias e anos.',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 15,
    original: 'וְהָיוּ לִמְאוֹרֹת בִּרְקִיעַ הַשָּׁמַיִם לְהָאִיר עַל־הָאָרֶץ וַיְהִי־כֵן׃',
    originalLang: 'he',
    transliteration: 'Vehayu lime’orot birkia hashamayim leha’ir al-ha’aretz vayehi-chen.',
    portuguese: 'E sejam para luminares na expansão dos céus, para alumiar a terra; e assim foi.',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 16,
    original: 'וַיַּעַשׂ אֱלֹהִים אֶת־שְׁנֵי הַמְּאֹרֹת הַגְּדֹלִים אֶת־הַמָּאוֹר הַגָּדֹל לְמֶמְשֶׁלֶת הַיּוֹם וְאֶת־הַמָּאוֹר הַקָּטֹן לְמֶמְשֶׁלֶת הַלַּיְלָה וְאֵת הַכּוֹכָבִים׃',
    originalLang: 'he',
    transliteration: 'Vaya’as Elohim et-shenei hame’orot hagedolim et-hama’or hagadol lememshelet hayom ve’et-hama’or hakaton lememshelet halaylah ve’et hakochavim.',
    portuguese: 'E fez Deus os dois grandes luminares: o luminar maior para governar o dia, e o luminar menor para governar a noite; e fez as estrelas.',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 17,
    original: 'וַיִּתֵּן אֹתָם אֱלֹהִים בִּרְקִיעַ הַשָּׁמָיִם לְהָאִיר עַל־הָאָרֶץ׃',
    originalLang: 'he',
    transliteration: 'Vayiten otam Elohim birkia hashamayim leha’ir al-ha’aretz.',
    portuguese: 'E Deus os pôs na expansão dos céus para alumiar a terra,',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 18,
    original: 'וְלִמְשֹׁל בַּיּוֹם וּבַלַּיְלָה וּלְהַבְדִּיל בֵּין הָאוֹר וּבֵין הַחֹשֶׁךְ וַיַּרְא אֱלֹהִים כִּי־טוֹב׃',
    originalLang: 'he',
    transliteration: 'Velimshol bayom uvalaylah ulehavdil bein ha’or uvein hachoshech vayar Elohim ki-tov.',
    portuguese: 'e para governar o dia e a noite, e para fazer separação entre a luz e as trevas; e viu Deus que era bom.',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 19,
    original: 'וַיְהִי־עֶרֶב וַיְהִי־בֹקֶר יוֹם רְבִיעִי׃',
    originalLang: 'he',
    transliteration: 'Vayehi-erev vayehi-boker yom revi’i.',
    portuguese: 'E foi a tarde e a manhã, o dia quarto.',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 20,
    original: 'וַיֹּאמֶר אֱלֹהִים יִשְׁרְצוּ הַמַּיִם שֶׁרֶץ נֶפֶשׁ חַיָּה וְעוֹף יְעוֹפֵף עַל־הָאָרֶץ עַל־פְּנֵי רְקִיעַ הַשָּׁמָיִם׃',
    originalLang: 'he',
    transliteration: 'Vayomer Elohim yishretzu hamayim sheretz nefesh chayah ve’of yeofef al-ha’aretz al-penei rekia hashamayim.',
    portuguese: 'E disse Deus: Produzam as águas abundantemente répteis de alma vivente; e voem as aves sobre a face da expansão dos céus.',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 21,
    original: 'וַיִּבְרָא אֱלֹהִים אֶת־הַתַּנִּינִם הַגְּדֹלִים וְאֵת כָּל־נֶפֶשׁ הַחַיָּה הָרֹמֶשֶׂת אֲשֶׁר שָׁרְצוּ הַמַּיִם לְמִינֵהֶם וְאֵת כָּל־עוֹף כָּנָף לְמִינֵהוּ וַיַּרְא אֱלֹהִים כִּי־טוֹב׃',
    originalLang: 'he',
    transliteration: 'Vayivra Elohim et-hataninim hagedolim ve’et kol-nefesh hachayah haromeset asher sharetzu hamayim leminehem ve’et kol-of kanuf leminehu vayar Elohim ki-tov.',
    portuguese: 'E Deus criou as grandes criaturas marinhas, e todo o réptil de alma vivente que as águas abundantemente produziram conforme as suas espécies; e toda a ave de asas conforme a sua espécie; e viu Deus que era bom.',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 22,
    original: 'וַיְבָרֶךְ אֹתָם אֱלֹהִים לֵאמֹר פְּרוּ וּרְבוּ וּמִלְאוּ אֶת־הַמַּיִם בַּיַּמִּים וְהָעוֹף יִרֶב בָּאָרֶץ׃',
    originalLang: 'he',
    transliteration: 'Vayevarech otam Elohim lemor peru urevu umil’u et-hamayim bayamim veha’of yirev ba’aretz.',
    portuguese: 'E Deus os abençoou, dizendo: Frutificai e multiplicai-vos, e enchei as águas nos mares; e as aves se multipliquem na terra.',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 23,
    original: 'וַיְהִי־עֶרֶב וַיְהִי־בֹקֶר יוֹם חֲמִישִׁי׃',
    originalLang: 'he',
    transliteration: 'Vayehi-erev vayehi-boker yom chamishi.',
    portuguese: 'E foi a tarde e a manhã, o dia quinto.',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 24,
    original: 'וַיֹּאמֶר אֱלֹהִים תּוֹצֵא הָאָרֶץ נֶפֶשׁ חַיָּה לְמִינָהּ בְּהֵמָה וָרֶמֶשׂ וְחַיְתוֹ־אֶרֶץ לְמִינָהּ וַיְהִי־כֵן׃',
    originalLang: 'he',
    transliteration: 'Vayomer Elohim totze ha’aretz nefesh chayah leminah behemah varemes vechayeto-eretz leminah vayehi-chen.',
    portuguese: 'E disse Deus: Produza a terra alma vivente conforme a sua espécie; gado, e répteis e feras da terra conforme a sua espécie; e assim foi.',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 25,
    original: 'וַיַּעַשׂ אֱלֹהִים אֶת־חַיַּת הָאָרֶץ לְמִינָהּ וְאֶת־הַבְּהֵמָה לְמִינָהּ וְאֵת כָּל־רֶמֶשׂ הָאֲדָמָה לְמִינֵהוּ וַיַּרְא אֱלֹהִים כִּי־טוֹב׃',
    originalLang: 'he',
    transliteration: 'Vaya’as Elohim et-chayat ha’aretz leminah ve’et-habehemah leminah ve’et kol-remes ha’adamah leminehu vayar Elohim ki-tov.',
    portuguese: 'E fez Deus as feras da terra conforme a sua espécie, e o gado conforme a sua espécie, e todo o réptil da terra conforme a sua espécie; e viu Deus que era bom.',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 26,
    original: 'וַיֹּאמֶר אֱלֹהִים נַעֲשֶׂה אָדָם בְּצַלְמֵנוּ כִּדְמוּתֵנוּ וְיִרְדּוּ בִדְגַת הַיָּם וּבְעוֹף הַשָּׁמַיִם וּבַבְּהֵמָה וּבְכָל־הָאָרֶץ וּבְכָל־הָרֶמֶשׂ הָרֹמֵשׂ עַל־הָאָרֶץ׃',
    originalLang: 'he',
    transliteration: 'Vayomer Elohim na’aseh adam betzalmenu kidmutenu veyirdu vidgat hayam uve’of hashamayim uvabehemah uvechol-ha’aretz uvechol-haremes haromes al-ha’aretz.',
    portuguese: 'E disse Deus: Façamos o homem à nossa imagem, conforme a nossa semelhança; e domine sobre os peixes do mar, e sobre as aves dos céus, e sobre o gado, e sobre toda a terra, e sobre todo o réptil que se move sobre a terra.',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 27,
    original: 'וַיִּבְרָא אֱלֹהִים אֶת־הָאָדָם בְּצַלְמוֹ בְּצֶלֶם אֱלֹהִים בָּרָא אֹתוֹ זָכָר וּנְקֵבָה בָּרָא אֹתָם׃',
    originalLang: 'he',
    transliteration: 'Vayivra Elohim et-ha’adam betzalmo betzelem Elohim bara oto zachar unekevah bara otam.',
    portuguese: 'E criou Deus o homem à sua imagem; à imagem de Deus o criou; macho e fêmea os criou.',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 28,
    original: 'וַיְבָרֶךְ אֹתָם אֱלֹהִים וַיֹּאמֶר לָהֶם אֱלֹהִים פְּרוּ וּרְבוּ וּמִלְאוּ אֶת־הָאָרֶץ וְכִבְשֻׁהָ וּרְדוּ בִּדְגַת הַיָּם וּבְעוֹף הַשָּׁמַיִם וּבְכָל־חַיָּה הָרֹמֶשֶׂת עַל־הָאָרֶץ׃',
    originalLang: 'he',
    transliteration: 'Vayevarech otam Elohim vayomer lahem Elohim peru urevu umil’u et-ha’aretz vechivshuha uredu bidgat hayam uve’of hashamayim uvechol-chayah haromeset al-ha’aretz.',
    portuguese: 'E Deus os abençoou, e Deus lhes disse: Frutificai e multiplicai-vos, e enchei a terra, e sujeitai-a; e dominai sobre os peixes do mar e sobre as aves dos céus, e sobre todo o animal que se move sobre a terra.',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 29,
    original: 'וַיֹּאמֶר אֱלֹהִים הִנֵּה נָתַתִּי לָכֶם אֶת־כָּל־עֵשֶׂב זֹרֵעַ זֶרַע אֲשֶׁר עַל־פְּנֵי כָל־הָאָרֶץ וְאֶת־כָּל־הָעֵץ אֲשֶׁר־בּוֹ פְרִי־עֵץ זֹרֵעַ זָרַע לָכֶם יִהְיֶה לְאָכְלָה׃',
    originalLang: 'he',
    transliteration: 'Vayomer Elohim hineh natati lachem et-kol-esev zorea zera asher al-penei chol-ha’aretz ve’et-kol-ha’etz asher-bo peri-etz zorea zara lachem yihyeh le’ochlah.',
    portuguese: 'E disse Deus: Eis que vos tenho dado toda a erva que dê semente, que está sobre a face de toda a terra; e toda a árvore, em que há fruto que dê semente, ser-vos-á para mantimento.',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 30,
    original: 'וּלְכָל־חַיַּת הָאָרֶץ וּלְכָל־עוֹף הַשָּׁמַיִם וּלְכֹל רוֹמֵשׂ עַל־הָאָרֶץ אֲשֶׁר־בּוֹ נֶפֶשׁ חַיָּה אֶת־כָּל־יֶרֶק עֵשֶׂב לְאָכְלָה וַיְהִי־כֵן׃',
    originalLang: 'he',
    transliteration: 'Ulechol-chayat ha’aretz ulechol-of hashamayim ulechol romes al-ha’aretz asher-bo nefesh chayah et-kol-yerek esev le’ochlah vayehi-chen.',
    portuguese: 'E a todo o animal da terra, e a toda a ave dos céus, e a todo o réptil da terra, em que há alma vivente, toda a erva verde será para mantimento; e assim foi.',
  },
  {
    bookId: 'gen',
    chapter: 1,
    verse: 31,
    original: 'וַיַּרְא אֱלֹהִים אֶת־כָּל־אֲשֶׁר עָשָׂה וְהִנֵּה־טוֹב מְאֹד וַיְהִי־עֶרֶב וַיְהִי־בֹקֶר יוֹם הַשִּׁשִּׁי׃',
    originalLang: 'he',
    transliteration: 'Vayar Elohim et-kol-asher asah vehineh-tov me’od vayehi-erev vayehi-boker yom hashishi.',
    portuguese: 'E viu Deus tudo quanto tinha feito, e eis que era muito bom; e foi a tarde e a manhã, o dia sexto.',
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


/**
 * Resolve Portuguese display text for a verse under the selected PT version.
 * Demo uses the built-in `portuguese` field. Other versions fall back to Demo
 * when they lack coverage for that verse.
 */
export function resolvePortuguese(verse, versionId = DEFAULT_PT_VERSION) {
  if (!verse) return '';
  if (!versionId || versionId === 'demo') return verse.portuguese || '';
  const alt = lookupPtVersionText(versionId, verse.bookId, verse.chapter, verse.verse);
  if (alt != null) return alt;
  return verse.portuguese || '';
}

/**
 * @param {string} bookId
 * @param {number} chapter
 * @param {string} [versionId]
 * @returns {Array<object>}
 */
export function getVersesForVersion(bookId, chapter, versionId = DEFAULT_PT_VERSION) {
  return getVerses(bookId, chapter).map((v) => ({
    ...v,
    portuguese: resolvePortuguese(v, versionId),
    portugueseSource: lookupPtVersionText(versionId, v.bookId, v.chapter, v.verse) != null
      ? versionId
      : 'demo',
  }));
}


/**
 * Build reading verses from bible-api.com chapter rows, merging local
 * Hebrew/Greek + transliteration when present.
 * @param {string} bookId
 * @param {number} chapter
 * @param {Array<{ verse: number, text: string }>} apiVerses
 * @param {string} versionId
 * @param {{ originalLang?: 'he'|'el' }} [opts]
 */
export function mergeApiChapterVerses(bookId, chapter, apiVerses, versionId, opts = {}) {
  const local = getVerses(bookId, chapter);
  const byVerse = new Map(local.map((v) => [v.verse, v]));
  const fallbackLang = opts.originalLang === 'el' ? 'el' : 'he';
  return (Array.isArray(apiVerses) ? apiVerses : []).map(({ verse, text }) => {
    const base = byVerse.get(Number(verse));
    if (base) {
      return {
        ...base,
        portuguese: text,
        portugueseSource: versionId,
      };
    }
    return {
      bookId,
      chapter: Number(chapter),
      verse: Number(verse),
      original: '',
      originalLang: fallbackLang,
      transliteration: '',
      portuguese: text,
      portugueseSource: versionId,
    };
  });
}

/** True when the PT version must be loaded via network/cache (not local bundle). */
export function isRemotePtVersion(versionId) {
  const id = String(versionId || '');
  return id === 'almeida' || id === 'acf' || id === 'ra' || id === 'nvi';
}
