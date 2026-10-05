export const NODES = [
  {
    id: "origens",
    parentId: null,
    title: "Origens",
    kicker: "O começo",
    era: "Gênesis e a promessa",
    summary:
      "A Bíblia não abre com um verbete. Abre com uma história: Deus cria um mundo bom, o ser humano se afasta, e uma promessa começa a caminhar — de uma família até todos os povos.",
    points: [
      "O mapa liga criação, queda, nações e patriarcas numa leitura só.",
      "Cada folha traz o fio do texto, referências e uma pergunta.",
      "Marque o que já estudou. O progresso fica neste aparelho.",
    ],
    refs: [
      { cite: "Gênesis 1.1", text: "No princípio, criou Deus os céus e a terra." },
      {
        cite: "João 1.1–3",
        text: "No princípio era o Verbo. Tudo foi feito por ele, e sem ele nada do que foi feito se fez.",
      },
    ],
    reflection: "Por onde você quer começar: pelo mundo, pela queda ou pela promessa?",
  },
  {
    id: "criacao",
    parentId: "origens",
    title: "A criação",
    kicker: "Gênesis 1–2",
    era: "O mundo",
    summary:
      "O primeiro relato não é um manual de laboratório. É uma liturgia: Deus fala, separa, nomeia e chama tudo de bom. O mundo tem origem, ordem e propósito.",
    points: [
      "A criação acontece pela palavra, não pela luta entre deuses.",
      "O humano aparece no fim da obra, como imagem, não como sobra.",
      "O sétimo dia consagra o tempo: o mundo não existe só para produzir.",
    ],
    refs: [
      { cite: "Gênesis 1.1", text: "No princípio, criou Deus os céus e a terra." },
      {
        cite: "Gênesis 1.31",
        text: "Viu Deus tudo quanto tinha feito, e eis que era muito bom.",
      },
    ],
    reflection: "O que muda na sua semana se o mundo é dom, e não só cenário?",
  },
  {
    id: "criacao-luz",
    parentId: "criacao",
    title: "A luz",
    kicker: "Gênesis 1.1–5",
    era: "O primeiro dia",
    summary:
      "Antes das luminárias, Deus já chama a luz. O primeiro ato é separar o que se confunde. Dia e noite nascem como ritmo, não como ameaça.",
    points: [
      "«No princípio» situa tudo o que existe como dependente.",
      "A terra está sem forma; a palavra começa a distinguir.",
      "A luz é chamada boa antes do sol e da lua. O foco é Deus, não o astro.",
    ],
    refs: [
      { cite: "Gênesis 1.2–3", text: "A terra era sem forma e vazia. E disse Deus: haja luz." },
      { cite: "Gênesis 1.4–5", text: "Separou Deus a luz das trevas. E foi a tarde e a manhã, o dia primeiro." },
    ],
    reflection: "Onde a sua vida ainda está sem forma e pede uma palavra que separe?",
  },
  {
    id: "criacao-vida",
    parentId: "criacao",
    title: "A vida",
    kicker: "Gênesis 1.9–25",
    era: "Terra, mar e céu",
    summary:
      "Terra seca, vegetação, águas e céu se enchem de seres que se reproduzem segundo a sua espécie. A criação é fértil e diversa, e cada camada é declarada boa.",
    points: [
      "O mar deixa de ser só ameaça e vira berço.",
      "Plantas e animais carregam a capacidade de continuar a vida.",
      "A diversidade não é erro de fábrica: está no desígnio.",
    ],
    refs: [
      { cite: "Gênesis 1.11–12", text: "Produza a terra erva verde. E a terra produziu. E viu Deus que era bom." },
      { cite: "Gênesis 1.20–21", text: "Produzam as águas enxames de seres viventes, e voem as aves sobre a terra." },
    ],
    reflection: "Que parte do mundo criado você tem tratado como descartável?",
  },
  {
    id: "criacao-imagem",
    parentId: "criacao",
    title: "A imagem",
    kicker: "Gênesis 1.26–31",
    era: "O ser humano",
    summary:
      "Homem e mulher são feitos à imagem de Deus e recebem o jardim para cultivar e guardar. No texto da criação, os dois juntos recebem a vocação.",
    points: [
      "Imagem não é aparência física: é vocação de representar Deus no mundo.",
      "O domínio é cuidado responsável, não licença para destruir.",
      "Gênesis 2 aproxima a cena: o humano do pó, o sopro, a parceria.",
    ],
    refs: [
      {
        cite: "Gênesis 1.27",
        text: "Criou Deus o homem à sua imagem; homem e mulher os criou.",
      },
      { cite: "Gênesis 2.7", text: "Formou o Senhor Deus o homem do pó da terra e soprou em seus narizes o fôlego da vida." },
    ],
    reflection: "Quem, perto de você, precisa ser visto de novo como imagem de Deus?",
  },
  {
    id: "criacao-descanso",
    parentId: "criacao",
    title: "O descanso",
    kicker: "Gênesis 2.1–3",
    era: "O sétimo dia",
    summary:
      "Deus descansa não porque se esgotou, mas porque a obra está inteira. O sétimo dia é abençoado: o tempo santo faz parte da criação tanto quanto a luz e o solo.",
    points: [
      "O descanso divino é coroação, não interrupção por falha.",
      "Abençoar o dia é declarar que a vida não cabe só no útil.",
      "O sábado depois será sinal da aliança, mas nasce aqui, na origem.",
    ],
    refs: [
      { cite: "Gênesis 2.2", text: "Descansou no sétimo dia de toda a sua obra que tinha feito." },
      { cite: "Gênesis 2.3", text: "Abençoou Deus o dia sétimo e o santificou." },
    ],
    reflection: "O que você precisaria soltar para tratar um dia como dom, e não como atraso?",
  },
  {
    id: "queda",
    parentId: "origens",
    title: "A queda",
    kicker: "Gênesis 3–4",
    era: "A ruptura",
    summary:
      "O jardim tem um limite. A transgressão é querer o bem e o mal sem Deus. Vergonha, medo e expulsão mostram a ruptura — e, no meio da sentença, uma promessa.",
    points: [
      "A pergunta da serpente torce a palavra que Deus tinha dado.",
      "A culpa se espalha: acusar o outro, devolver a responsabilidade.",
      "Mesmo assim Deus cobre, chama e anuncia uma semente.",
    ],
    refs: [
      { cite: "Gênesis 3.6", text: "Vendo a mulher que a árvore era boa para se comer, tomou do seu fruto, e comeu, e deu também a seu marido." },
      { cite: "Gênesis 3.15", text: "Porei inimizade entre ti e a mulher, e entre a tua semente e a sua semente." },
    ],
    reflection: "Que atalho você tem acreditado mais do que na palavra que já recebeu?",
  },
  {
    id: "queda-tentacao",
    parentId: "queda",
    title: "A tentação",
    kicker: "Gênesis 3.1–6",
    era: "O jardim",
    summary:
      "A serpente não inventa um deus novo. Ela faz duvidar do que foi dito e oferece um atalho para ser como Deus. O fruto é visto como bom antes de ser tomado.",
    points: [
      "A dúvida começa com uma citação pela metade.",
      "Desejo, visão e ato se encadeiam.",
      "Adão está no relato: a queda não é história de uma pessoa só.",
    ],
    refs: [
      { cite: "Gênesis 3.1", text: "É assim que Deus disse: não comereis de toda árvore do jardim?" },
      { cite: "Gênesis 3.5", text: "Sereis como Deus, sabendo o bem e o mal." },
    ],
    reflection: "Qual meia-verdade tem soado mais razoável do que o limite que você já conhece?",
  },
  {
    id: "queda-ruptura",
    parentId: "queda",
    title: "A ruptura",
    kicker: "Gênesis 3.7–24",
    era: "Fora do jardim",
    summary:
      "Os olhos se abrem, e o que aparece é nudez e medo. Esconder-se entre as árvores é o contrário da caminhada com Deus. A sentença atinge serpente, mulher, homem e solo. Antes de os enviar, Deus os veste.",
    points: [
      "Vergonha e medo substituem a confiança.",
      "Trabalho e parto continuam, agora com dor.",
      "O solo, que era vocação, passa a resistir.",
    ],
    refs: [
      { cite: "Gênesis 3.9", text: "E chamou o Senhor Deus ao homem e lhe disse: onde estás?" },
      { cite: "Gênesis 3.21", text: "Fez o Senhor Deus túnicas de peles, e os vestiu." },
    ],
    reflection: "Onde você está se escondendo em vez de responder ao chamado pelo nome?",
  },
  {
    id: "queda-semente",
    parentId: "queda",
    title: "A semente",
    kicker: "Gênesis 3.15",
    era: "A primeira promessa",
    summary:
      "No meio do juízo, uma descendência é anunciada: a semente da mulher ferirá a cabeça da serpente, ainda que ferida no calcanhar. A esperança entra na história com forma de alguém, não de fórmula.",
    points: [
      "O conflito não termina no jardim: atravessa a história.",
      "A esperança tem forma de descendência.",
      "A leitura cristã vê aqui o primeiro anúncio do Messias.",
    ],
    refs: [
      {
        cite: "Gênesis 3.15",
        text: "Esta te ferirá a cabeça, e tu lhe ferirás o calcanhar.",
      },
    ],
    reflection: "Você lê a Bíblia procurando essa linha de esperança, ou só o peso da queda?",
  },
  {
    id: "queda-caim",
    parentId: "queda",
    title: "Caim e Abel",
    kicker: "Gênesis 4",
    era: "Os irmãos",
    summary:
      "Fora do jardim, a adoração já divide. Caim se ira porque Deus olha para a oferta de Abel. O aviso vem antes do crime: o pecado está à porta. Caim recusa, e o sangue do irmão clama do chão. Depois nasce Sete: a linhagem continua.",
    points: [
      "A queda se torna violência entre irmãos.",
      "Deus avisa e ainda conversa com o agressor.",
      "A marca de Caim é proteção no exílio, não troféu.",
    ],
    refs: [
      { cite: "Gênesis 4.7", text: "Se bem fizeres, não é certo que serás aceito? O pecado jaz à porta, e sobre ti será o seu desejo." },
      { cite: "Gênesis 4.26", text: "A Sete também nasceu um filho; então se começou a invocar o nome do Senhor." },
    ],
    reflection: "Que ira você tem alimentado achando que Deus deveria ter preferido você?",
  },
  {
    id: "diluvio",
    parentId: "origens",
    title: "O dilúvio",
    kicker: "Gênesis 5–9",
    era: "Juízo e aliança",
    summary:
      "A genealogia de Sete chega a Noé num mundo em que a violência virou normal. O dilúvio é juízo sobre uma terra corrompida e, ao mesmo tempo, preservação de uma família. No fim, Deus pendura o arco.",
    points: [
      "A lista de nomes é a promessa atravessando séculos.",
      "Noé acha graça, não porque o mundo estivesse bem.",
      "O juízo não é o fim da história: há aliança do outro lado.",
    ],
    refs: [
      { cite: "Gênesis 6.8", text: "Noé, porém, achou graça aos olhos do Senhor." },
      { cite: "Gênesis 9.13", text: "O meu arco tenho posto na nuvem; este será por sinal da aliança entre mim e a terra." },
    ],
    reflection: "Você consegue nomear graça sem fingir que o mal não é grave?",
  },
  {
    id: "diluvio-linhagem",
    parentId: "diluvio",
    title: "A linhagem",
    kicker: "Gênesis 5",
    era: "De Adão a Noé",
    summary:
      "Gênesis 5 repete gerou e morreu. A morte anunciada no jardim virou refrão. Ainda assim a linha não se apaga: de Adão a Noé, o texto guarda os nomes como quem guarda um fio.",
    points: [
      "A fórmula «gerou e morreu» mostra o peso da queda.",
      "Enoque quebra o padrão: andou com Deus.",
      "A genealogia prepara Noé sem pressa.",
    ],
    refs: [
      { cite: "Gênesis 5.1", text: "Este é o livro das gerações de Adão." },
      { cite: "Gênesis 5.24", text: "Enoque andou com Deus; e não apareceu mais, porquanto Deus para si o tomou." },
    ],
    reflection: "Que nomes, vivos ou já idos, fazem parte do fio da fé que chegou até você?",
  },
  {
    id: "diluvio-violencia",
    parentId: "diluvio",
    title: "A violência",
    kicker: "Gênesis 6.5–13",
    era: "A terra corrompida",
    summary:
      "Deus vê que a maldade é contínua e que a terra está cheia de violência. O lamento divino não é capricho: o mundo criado bom foi desfigurado. A decisão do dilúvio nasce desse olhar.",
    points: [
      "O texto fala de coração e de prática, não só de um erro isolado.",
      "Violência é a palavra que resume a corrupção da terra.",
      "Noé é contraste: justo, íntegro, andava com Deus.",
    ],
    refs: [
      { cite: "Gênesis 6.5", text: "Viu o Senhor que a maldade do homem se multiplicara sobre a terra." },
      { cite: "Gênesis 6.11", text: "A terra estava corrompida diante da face de Deus, e cheia de violência." },
    ],
    reflection: "O que, ao seu redor, já foi normalizado e o texto chamaria de violência?",
  },
  {
    id: "diluvio-arca",
    parentId: "diluvio",
    title: "A arca",
    kicker: "Gênesis 6–8",
    era: "A preservação",
    summary:
      "A arca é obediência em medidas concretas. Noé faz conforme tudo o que Deus lhe ordenou. Lá dentro cabem a família e os animais: a preservação da vida é o propósito, não o gosto pela destruição.",
    points: [
      "Fé aqui é construção, não só sentimento.",
      "Deus fecha a porta: a salvação não é autoengano.",
      "Depois das águas, o altar de Noé é a primeira cena em terra seca.",
    ],
    refs: [
      { cite: "Gênesis 6.22", text: "Assim fez Noé; conforme a tudo o que Deus lhe mandou, assim o fez." },
      { cite: "Gênesis 8.21", text: "Não tornarei mais a amaldiçoar a terra por causa do homem." },
    ],
    reflection: "Qual obediência concreta você tem adiado porque ainda não vê a chuva?",
  },
  {
    id: "diluvio-arco",
    parentId: "diluvio",
    title: "O arco",
    kicker: "Gênesis 8.22–9.17",
    era: "A aliança com a vida",
    summary:
      "Deus estabelece aliança com Noé, com os filhos e com toda carne viva. O arco nas nuvens é sinal de memória: Deus se lembra. A estabilidade das estações vira promessa, e o mandato de frutificar é renovado.",
    points: [
      "A aliança é universal: não só com um povo.",
      "O sinal aparece justo quando a chuva poderia assustar de novo.",
      "O mandato ecoa Gênesis 1: a vida deve continuar.",
    ],
    refs: [
      { cite: "Gênesis 8.22", text: "Enquanto a terra durar, sementeira e sega, frio e calor, verão e inverno, dia e noite não cessarão." },
      { cite: "Gênesis 9.15", text: "Lembrar-me-ei da minha aliança, que está entre mim e vós e toda alma vivente." },
    ],
    reflection: "Que medo antigo você ainda lê como se Deus não tivesse feito aliança com a vida?",
  },
  {
    id: "nacoes",
    parentId: "origens",
    title: "As nações",
    kicker: "Gênesis 10–11",
    era: "Os povos",
    summary:
      "De uma família saem os povos. A távola das nações mapeia o mundo conhecido como parentesco. Babel mostra o projeto de um nome próprio sem Deus — e a dispersão que o capítulo anterior já tinha cantado como fecundidade.",
    points: [
      "A humanidade continua uma só família, mesmo dividida em línguas.",
      "Babel inverte o «enchei a terra»: quer concentrar, não espalhar.",
      "A dispersão prepara o chamado de Abraão, bênção para todas as famílias.",
    ],
    refs: [
      { cite: "Gênesis 10.32", text: "Estas são as famílias dos filhos de Noé, segundo as suas gerações, nas suas nações." },
      { cite: "Gênesis 12.3", text: "Em ti serão benditas todas as famílias da terra." },
    ],
    reflection: "Você vê os outros povos como ameaça ao seu nome, ou como endereço da promessa?",
  },
  {
    id: "nacoes-filhos",
    parentId: "nacoes",
    title: "Três filhos",
    kicker: "Gênesis 9.18–29",
    era: "Depois da arca",
    summary:
      "Sem, Cam e Jafé são a porta da nova humanidade. O episódio da nudez de Noé mostra que a queda continua dentro da família salva. Ninguém neste mapa é herói sem sombra. De Sem virá Abraão.",
    points: [
      "A preservação da arca não produz gente sem falha.",
      "O texto passa a olhar para povos, não só para uma casa.",
      "Sem fica em destaque porque dele virá o chamado.",
    ],
    refs: [
      { cite: "Gênesis 9.19", text: "Estes três foram os filhos de Noé, e destes se povoou toda a terra." },
      { cite: "Gênesis 11.10", text: "Estas são as gerações de Sem." },
    ],
    reflection: "Onde você tem exigido perfeição de quem já foi alcançado por misericórdia?",
  },
  {
    id: "nacoes-povos",
    parentId: "nacoes",
    title: "Os povos",
    kicker: "Gênesis 10",
    era: "A távola das nações",
    summary:
      "Gênesis 10 é um mapa em forma de genealogia. Povos, línguas, terras e nações aparecem como desdobramento da bênção de frutificar. O mundo não é um vazio a conquistar: já está habitado por famílias.",
    points: [
      "A lista inclui cidades e regiões do Antigo Oriente.",
      "Repete-se a fórmula: famílias, línguas, terras, nações.",
      "Israel ainda não existe: o texto olha o mundo inteiro primeiro.",
    ],
    refs: [
      { cite: "Gênesis 10.5", text: "Por estes foram repartidas as ilhas das nações nas suas terras, cada qual segundo a sua língua." },
      { cite: "Gênesis 10.32", text: "Deles se dividiram as nações na terra depois do dilúvio." },
    ],
    reflection: "Como a sua leitura da Bíblia muda se os outros povos já estão no primeiro mapa?",
  },
  {
    id: "nacoes-babel",
    parentId: "nacoes",
    title: "Babel",
    kicker: "Gênesis 11.1–9",
    era: "A cidade e a torre",
    summary:
      "Na planície de Sinar, tijolo e betume viram um projeto: cidade e torre para não serem espalhados. O medo da dispersão produz um nome único. Deus desce, confunde a língua, e o projeto para.",
    points: [
      "O problema não é a técnica: é a recusa de encher a terra.",
      "«Façamos um nome» é o contrário do nome que Deus dará a Abraão.",
      "Deus desce: a torre não chega até ele.",
    ],
    refs: [
      { cite: "Gênesis 11.4", text: "Eia, edifiquemos nós uma cidade e uma torre cujo cume toque nos céus, e façamo-nos um nome." },
      { cite: "Gênesis 11.7", text: "Eia, desçamos e confundamos ali a sua língua." },
    ],
    reflection: "Que projeto seu é, no fundo, medo de depender e de ser espalhado?",
  },
  {
    id: "nacoes-dispersao",
    parentId: "nacoes",
    title: "A dispersão",
    kicker: "Gênesis 11.9–32",
    era: "Do mundo a uma família",
    summary:
      "A confusão das línguas espalha a humanidade. O que Babel tentou evitar acontece por ação de Deus. A genealogia de Sem estreita a câmera até Tera e Abrão. Do mapa do mundo, a história desce a uma casa.",
    points: [
      "Dispersão aqui não é o fim do cuidado de Deus.",
      "A genealogia de Sem liga Noé ao chamado que vem.",
      "O mapa estreita para poder abençoar todos de novo.",
    ],
    refs: [
      { cite: "Gênesis 11.9", text: "Por isso se chamou o seu nome Babel, porque ali confundiu o Senhor a língua de toda a terra." },
      { cite: "Gênesis 11.26", text: "Tera viveu setenta anos e gerou a Abrão, a Naor e a Harã." },
    ],
    reflection: "Você consegue ver um recomeço pequeno como resposta a um projeto grande que desabou?",
  },
  {
    id: "patriarcas",
    parentId: "origens",
    title: "Os patriarcas",
    kicker: "Gênesis 12–50",
    era: "Uma família",
    summary:
      "Com Abrão, a história universal ganha um nome, uma terra e uma promessa. Isaque, Jacó e José carregam essa palavra por fome, engano, exílio e reconciliação. No fim, Israel está no Egito, vivo por causa de José.",
    points: [
      "A eleição de uma família é para abençoar, não para se fechar.",
      "A promessa atravessa esterilidade, espera e ameaça.",
      "A providência não apaga a culpa: ela atravessa o mal.",
    ],
    refs: [
      { cite: "Gênesis 12.2–3", text: "Far-te-ei uma grande nação, e abençoar-te-ei. Em ti serão benditas todas as famílias da terra." },
      { cite: "Gênesis 50.20", text: "Vós bem intentastes mal contra mim; porém Deus o intentou para bem, para fazer como se vê neste dia, para conservar muita gente com vida." },
    ],
    reflection: "A sua fé cabe numa promessa que ainda não cabe na sua mão?",
  },
  {
    id: "patriarcas-chamado",
    parentId: "patriarcas",
    title: "O chamado",
    kicker: "Gênesis 12.1–9",
    era: "Abrão sai",
    summary:
      "Deus manda Abrão sair da sua terra, da parentela e da casa do pai. O destino é dito pela metade: a terra que eu te mostrarei. A obediência começa sem o mapa completo. O altar marca o chão antes da posse.",
    points: [
      "Três bens são deixados: lugar, clã e casa.",
      "A bênção inclui nação, nome, cuidado e todos os povos.",
      "O altar vem antes do título de propriedade.",
    ],
    refs: [
      { cite: "Gênesis 12.1", text: "Sai-te da tua terra, da tua parentela e da casa de teu pai, para a terra que eu te mostrarei." },
      { cite: "Gênesis 12.7", text: "Apareceu o Senhor a Abrão e disse: à tua semente darei esta terra. E edificou ali um altar." },
    ],
    reflection: "Do que você teria que sair para andar só com o que Deus ainda vai mostrar?",
  },
  {
    id: "patriarcas-alianca",
    parentId: "patriarcas",
    title: "A aliança",
    kicker: "Gênesis 15 e 17",
    era: "Abraão",
    summary:
      "A promessa se torna aliança: descendência como as estrelas, terra, e um corte solene em que Deus passa no meio dos animais enquanto Abrão dorme. O nome muda. Abraão: pai de muitas nações. Sara entra na promessa.",
    points: [
      "A fé é contada como justiça antes da lei do Sinai.",
      "A aliança é iniciativa de Deus, não negociação entre iguais.",
      "O sinal da circuncisão entra no corpo da família.",
    ],
    refs: [
      { cite: "Gênesis 15.6", text: "Ele creu no Senhor, e imputou-lhe isto por justiça." },
      { cite: "Gênesis 17.5", text: "O teu nome será Abraão; porque por pai de muitas nações te tenho posto." },
    ],
    reflection: "Você tem pedido sinais para controlar o prazo, ou para lembrar quem jurou?",
  },
  {
    id: "patriarcas-isaque",
    parentId: "patriarcas",
    title: "Isaque e Jacó",
    kicker: "Gênesis 21–35",
    era: "O filho e as tribos",
    summary:
      "O filho da promessa nasce contra o calendário de Sara. No monte, um carneiro ocupa o lugar de Isaque. Jacó, o suplantador, recebe o nome Israel. Dos seus doze filhos nascem as tribos — promessa virando povo, numa história cheia de sombra.",
    points: [
      "A promessa cabe num berço que quase não veio.",
      "O monte mostra substituição: Deus provê o cordeiro.",
      "Jacó é escolhido sem ser exemplo moral completo.",
    ],
    refs: [
      { cite: "Gênesis 22.14", text: "Abraão chamou o nome daquele lugar: o Senhor proverá." },
      { cite: "Gênesis 32.28", text: "Não se chamará mais o teu nome Jacó, mas Israel." },
    ],
    reflection: "Onde você precisa do nome novo mais do que da desculpa antiga?",
  },
  {
    id: "patriarcas-jose",
    parentId: "patriarcas",
    title: "José",
    kicker: "Gênesis 37–50",
    era: "O Egito",
    summary:
      "O filho preferido é vendido pelos irmãos. No Egito, José passa por escravidão, acusação e prisão, e chega ao palácio. A fome traz a família. José relê o mal sem apagar a culpa: o que intentaram para o mal, Deus intentou para conservar muita gente.",
    points: [
      "A providência não inocenta os irmãos.",
      "Israel sobrevive como família estrangeira, não como império.",
      "Os ossos de José ainda apontam para outra terra.",
    ],
    refs: [
      { cite: "Gênesis 45.7", text: "Deus me enviou adiante de vós, para conservar-vos em vida." },
      { cite: "Gênesis 50.20", text: "Vós bem intentastes mal contra mim; porém Deus o intentou para bem." },
    ],
    reflection: "Que traição você ainda não consegue imaginar sendo atravessada por um bem maior?",
  },
  {
    id: "promessa",
    parentId: "origens",
    title: "A promessa",
    kicker: "Da saída ao Messias",
    era: "O fio que continua",
    summary:
      "Origens não acaba em Gênesis. A família vira povo oprimido, sai do Egito, recebe a lei, ganha a promessa de um trono, e os profetas apertam o fio até um rei justo. O Novo Testamento lê Jesus como o sim dessa linha.",
    points: [
      "Êxodo: o Deus dos pais ouve e tira o povo.",
      "Sinai: a liberdade ganha aliança e caminho.",
      "Davi e os profetas: um trono que o exílio não apaga.",
    ],
    refs: [
      { cite: "Êxodo 3.15", text: "Este é o meu nome eternamente, e este é o meu memorial de geração em geração." },
      { cite: "Lucas 1.32–33", text: "O Senhor Deus lhe dará o trono de Davi, seu pai. E reinará eternamente." },
    ],
    reflection: "Você consegue contar a sua fé como uma história que começou muito antes de você?",
  },
  {
    id: "promessa-exodo",
    parentId: "promessa",
    title: "O êxodo",
    kicker: "Êxodo 1–15",
    era: "A saída",
    summary:
      "No Egito a família virou multidão, e a multidão virou mão de obra. Deus se apresenta a Moisés pelo nome e pela memória dos pais. A saída é a origem de Israel como povo livre, marcada pela Páscoa.",
    points: [
      "O nome de Deus se revela no meio da opressão.",
      "A Páscoa liga sangue, pressa e memória.",
      "O mar é a fronteira entre a casa de escravos e o caminho.",
    ],
    refs: [
      { cite: "Êxodo 3.7–8", text: "Tenho visto a aflição do meu povo. Por isso desci para livrá-lo." },
      { cite: "Êxodo 12.14", text: "Este dia vos será por memória, e celebrá-lo-eis por festa ao Senhor." },
    ],
    reflection: "Que memória de libertação a sua casa ainda não aprendeu a contar?",
  },
  {
    id: "promessa-sinai",
    parentId: "promessa",
    title: "O Sinai",
    kicker: "Êxodo 19–20",
    era: "A lei",
    summary:
      "No monte, o povo ouve quem o tirou do Egito antes de ouvir os mandamentos. A lei não é o preço da saída: é a forma da liberdade. A aliança faz de Israel propriedade peculiar no meio das nações. O bezerro mostra a queda de novo.",
    points: [
      "O prólogo do decálogo é graça: eu te tirei.",
      "A lei guarda a imagem de Deus no próximo.",
      "O bezerro mostra que a queda continua dentro do povo.",
    ],
    refs: [
      { cite: "Êxodo 19.5–6", text: "Sereis a minha propriedade peculiar dentre todos os povos, reino sacerdotal e povo santo." },
      { cite: "Êxodo 20.2", text: "Eu sou o Senhor teu Deus, que te tirei da terra do Egito, da casa da servidão." },
    ],
    reflection: "Você trata o mandamento como jaula, ou como o formato de uma liberdade recebida?",
  },
  {
    id: "promessa-trono",
    parentId: "promessa",
    title: "O trono",
    kicker: "2 Samuel 7",
    era: "Davi e os profetas",
    summary:
      "A Davi, Deus promete casa: um descendente, um trono e um reino estável. Reis falham, o exílio chega, mas a palavra não é recolhida. Os profetas falam de um renovo e de um rei que fará justiça de verdade.",
    points: [
      "A aliança davídica estreita a promessa de Abraão num trono.",
      "O exílio testa a palavra sem cancelá-la.",
      "Isaías e outros profetas mantêm o fio aceso.",
    ],
    refs: [
      { cite: "2 Samuel 7.16", text: "A tua casa e o teu reino serão firmados para sempre diante de ti." },
      { cite: "Isaías 9.7", text: "Do incremento deste principado e da paz não haverá fim, sobre o trono de Davi." },
    ],
    reflection: "Que promessa você deu por encerrada cedo demais porque o meio do caminho parecia exílio?",
  },
  {
    id: "promessa-messias",
    parentId: "promessa",
    title: "O Messias",
    kicker: "Mateus 1 e Lucas 3",
    era: "A leitura cristã",
    summary:
      "Os evangelhos abrem genealogia. Jesus é filho de Davi, filho de Abraão — e, em Lucas, o fio volta até Adão. A origem do mundo, a semente da mulher, a bênção das nações e o trono de Davi são lidos como convergindo numa pessoa. As origens eram prólogo.",
    points: [
      "Mateus organiza a história em gerações até o Cristo.",
      "Lucas leva a genealogia até Adão, filho de Deus.",
      "O mapa não substitui os evangelhos: aponta para eles.",
    ],
    refs: [
      { cite: "Mateus 1.1", text: "Livro da geração de Jesus Cristo, filho de Davi, filho de Abraão." },
      { cite: "Gálatas 3.8", text: "A Escritura prevendo que Deus havia de justificar pela fé os gentios, anunciou primeiro o evangelho a Abraão." },
    ],
    reflection: "Se as origens apontam para alguém, o que você ainda está tratando só como história antiga?",
  },
];


const BY_ID = new Map(NODES.map((node) => [node.id, node]));

export function nodeById(id) {
  return BY_ID.get(id) || BY_ID.get("origens");
}

export function childrenOf(id) {
  return NODES.filter((node) => node.parentId === id);
}

export function ancestorsOf(id) {
  const chain = [];
  let current = id;
  const guard = new Set();
  while (current && !guard.has(current)) {
    guard.add(current);
    chain.push(current);
    current = BY_ID.get(current)?.parentId ?? null;
  }
  return chain;
}

export function branchOf(id) {
  if (id === "origens") return null;
  const chain = ancestorsOf(id);
  return chain.length >= 2 ? chain[chain.length - 2] : null;
}

export const TRAIL = (() => {
  const out = [];
  const walk = (id) => {
    const node = BY_ID.get(id);
    if (!node) return;
    out.push(node);
    for (const child of childrenOf(id)) walk(child.id);
  };
  walk("origens");
  return out;
})();

const BRANCH_R = 228;
const LEAF_R = 640;
const STEP = (15 * Math.PI) / 180;

export const POSITIONS = (() => {
  const pos = new Map();
  pos.set("origens", { x: 0, y: 0, depth: 0 });
  const branches = childrenOf("origens");
  branches.forEach((branch, index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / branches.length;
    pos.set(branch.id, {
      x: Math.cos(angle) * BRANCH_R,
      y: Math.sin(angle) * BRANCH_R,
      depth: 1,
    });
    const leaves = childrenOf(branch.id);
    leaves.forEach((leaf, leafIndex) => {
      const offset = (leafIndex - (leaves.length - 1) / 2) * STEP;
      const leafAngle = angle + offset;
      pos.set(leaf.id, {
        x: Math.cos(leafAngle) * LEAF_R,
        y: Math.sin(leafAngle) * LEAF_R,
        depth: 2,
      });
    });
  });
  return pos;
})();

export function dimmedIds(filter, query) {
  const q = query.trim().toLowerCase();
  let keep = null;
  if (q) {
    keep = new Set();
    for (const node of NODES) {
      const blob = `${node.title} ${node.kicker} ${node.era} ${node.summary}`.toLowerCase();
      if (!blob.includes(q)) continue;
      for (const ancestor of ancestorsOf(node.id)) keep.add(ancestor);
      for (const child of childrenOf(node.id)) keep.add(child.id);
    }
  }
  const dimmed = new Set();
  for (const node of NODES) {
    if (filter && node.id !== "origens") {
      const branch = branchOf(node.id);
      if (node.id !== filter && branch !== filter) {
        dimmed.add(node.id);
        continue;
      }
    }
    if (keep && !keep.has(node.id)) dimmed.add(node.id);
  }
  return dimmed;
}
