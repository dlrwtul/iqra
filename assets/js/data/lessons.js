/* Parcours Iqra : unités, leçons, explications et exercices de grammaire.
   L'arabe est détecté automatiquement à l'affichage (pas de balisage nécessaire).
   Types d'exercices manuels :
     {t:"mcq", q, o:[bonne réponse, …distracteurs], why?}  — les options sont mélangées à l'affichage
     {t:"order", ar:[mots dans l'ordre], fr}                 — reconstituer une phrase
*/
window.IQRA = window.IQRA || {};

IQRA.units = [
  { id: 1, title: "Al-Fâtiha, la porte d'entrée", desc: "Comprendre mot à mot la sourate que vous récitez chaque jour.", ar: "الفَاتِحَة" },
  { id: 2, title: "Les petits mots qui font le Coran", desc: "Prépositions, négations, liaisons : peu de mots, des milliers d'occurrences.", ar: "الحُرُوف" },
  { id: 3, title: "Qui parle ? Les pronoms", desc: "Pronoms isolés et attachés, démonstratifs et questions.", ar: "الضَّمَائِر" },
  { id: 4, title: "Le verbe au passé", desc: "La conjugaison du passé et les verbes piliers du Coran.", ar: "المَاضِي" },
  { id: 5, title: "Le présent et l'impératif", desc: "Présent, futur, ordres et interdictions : comprendre les commandements.", ar: "المُضَارِع" },
  { id: 6, title: "Les noms essentiels", desc: "Création, humanité, foi, au-delà : les noms qui reviennent sans cesse.", ar: "الأَسْمَاء" },
  { id: 7, title: "Racines et schèmes", desc: "Comprendre comment les mots sont fabriqués pour deviner des centaines de mots.", ar: "الجُذُور" }
];

IQRA.lessons = [
  /* ============================ UNITÉ 1 ============================ */
  {
    id: "l01", unit: 1, title: "Au nom d'Allah",
    goal: "Comprendre la basmala et « al-ḥamdu lillâh », découvrir l'article et les racines.",
    read: [["fatiha", 1, 2]],
    theory: [
      { h: "Pourquoi commencer par Al-Fâtiha ?", p: "Vous la récitez au moins 17 fois par jour. En comprendre chaque mot transforme immédiatement votre prière : c'est le principe du « plus utile d'abord ». Ses mots reviennent des milliers de fois dans le Coran : اللَّه apparaît 2 699 fois, رَبّ 975 fois." },
      { h: "L'article al- : الـ", p: "الـ = le, la, les. Il se colle au nom : حَمْد (une louange) → الْحَمْدُ (la louange). Devant les lettres dites « solaires » (t, th, d, dh, r, z, s, sh, ṣ, ḍ, ṭ, ẓ, l, n), le l ne se prononce pas et la lettre suivante est doublée : الرَّحْمٰن se lit ar-Raḥmân et non al-Raḥmân." },
      { h: "Les prépositions collées bi- et li-", p: "Certaines prépositions d'une seule lettre se collent au mot suivant : بِـ bi- (par, avec, au nom de) et لِـ li- (à, pour, appartient à).", tbl: [["بِسْمِ", "bi + ism = au nom de"], ["لِلَّهِ", "li + Allâh = à Allah"], ["بِاللَّهِ", "bi + Allâh = par Allah"]] },
      { h: "Une racine, une famille", p: "Les mots arabes sont bâtis sur une racine de 3 consonnes qui porte le sens. ر ح م (miséricorde) donne رَحْمَة (miséricorde), رَحْمٰن (le Tout Miséricordieux) et رَحِيم (le Très Miséricordieux). Apprendre une racine, c'est apprendre une famille de mots." }
    ],
    ex: [["بِسْمِ اللَّهِ", "au nom d'Allah"], ["الْحَمْدُ لِلَّهِ", "la louange est à Allah"], ["رَبِّ الْعَالَمِينَ", "Seigneur des mondes"]],
    quiz: [
      { t: "mcq", q: "Dans بِسْمِ, que signifie le préfixe بِـ ?", o: ["au nom de, par", "et", "le, la", "pour"] },
      { t: "mcq", q: "Comment se lit الرَّحْمٰن ?", o: ["ar-Raḥmân", "al-Raḥmân", "a-l-raḥmân", "ra-Raḥmân"], why: "ر est une lettre solaire : le l de l'article s'assimile." },
      { t: "mcq", q: "Quelle racine partagent رَحْمٰن, رَحِيم et رَحْمَة ?", o: ["ر ح م", "ر ب ب", "ح م د", "ع ل م"] },
      { t: "mcq", q: "لِلَّهِ signifie :", o: ["à Allah, pour Allah", "au nom d'Allah", "par Allah", "ô Allah"] },
      { t: "order", ar: ["بِسْمِ", "اللَّهِ", "الرَّحْمٰنِ", "الرَّحِيمِ"], fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux" }
    ]
  },
  {
    id: "l02", unit: 1, title: "Le Maître du Jour",
    goal: "Comprendre les versets 3 à 5 : l'annexion, le « nous » du verbe et l'exclusivité.",
    read: [["fatiha", 3, 5]],
    theory: [
      { h: "L'annexion : « Maître du Jour »", p: "Pour dire « le X de Y », l'arabe place simplement les deux noms côte à côte : مَالِكِ يَوْمِ الدِّينِ = « Maître (du) Jour (de) la Rétribution ». Le premier nom ne prend jamais l'article. C'est l'iḍâfa (annexion), omniprésente : رَبِّ الْعَالَمِينَ, بِسْمِ اللَّهِ." },
      { h: "Le verbe et sa personne : na- = nous", p: "Au présent, une lettre au début du verbe indique qui agit. نَـ na- = nous : نَعْبُدُ (naʿbudu) = nous adorons ; نَسْتَعِينُ (nastaʿînu) = nous demandons l'aide. Les autres personnes viendront dans l'unité 5." },
      { h: "Insister par l'ordre des mots", p: "Normalement, le complément vient après le verbe. En plaçant إِيَّاكَ (toi) en tête, la phrase signifie « c'est TOI seul que nous adorons » : l'ordre des mots exprime l'exclusivité. Le وَ (wa = et) relie les deux phrases." }
    ],
    ex: [["مَالِكِ يَوْمِ الدِّينِ", "Maître du Jour de la Rétribution"], ["إِيَّاكَ نَعْبُدُ", "c'est Toi (seul) que nous adorons"], ["وَإِيَّاكَ نَسْتَعِينُ", "et c'est Toi (seul) dont nous implorons l'aide"]],
    quiz: [
      { t: "mcq", q: "Dans نَعْبُدُ, qui fait l'action ?", o: ["nous", "je", "il", "vous"], why: "Le préfixe na- indique « nous »." },
      { t: "mcq", q: "يَوْمِ الدِّينِ signifie :", o: ["le Jour de la Rétribution", "le jour de la création", "aujourd'hui", "un jour religieux"], why: "dîn : religion, mais aussi rétribution, jugement." },
      { t: "mcq", q: "Pourquoi إِيَّاكَ est-il placé avant le verbe ?", o: ["pour exprimer l'exclusivité : Toi seul", "parce que c'est une question", "pour marquer le féminin", "pour marquer le passé"] },
      { t: "mcq", q: "Dans مَالِكِ يَوْمِ الدِّينِ, pourquoi مَالِكِ n'a-t-il pas l'article الـ ?", o: ["c'est le premier nom d'une annexion", "c'est un verbe", "c'est un nom propre", "par erreur"] },
      { t: "order", ar: ["إِيَّاكَ", "نَعْبُدُ", "وَإِيَّاكَ", "نَسْتَعِينُ"], fr: "C'est Toi seul que nous adorons, et c'est Toi seul dont nous implorons l'aide" }
    ]
  },
  {
    id: "l03", unit: 1, title: "Le droit chemin",
    goal: "Comprendre les versets 6 et 7 : impératif, adjectif, relatif et négation.",
    read: [["fatiha", 6, 7]],
    theory: [
      { h: "L'impératif : « guide-nous ! »", p: "اهْدِ (ihdi) = guide ! C'est l'impératif du verbe هَدَى (guider). On y colle le pronom ـنَا (nous) : اهْدِنَا = guide-nous. Les pronoms compléments se collent à la fin du verbe." },
      { h: "Le nom et son adjectif", p: "L'adjectif se place après le nom et s'accorde avec lui, y compris pour l'article : الصِّرَاطَ الْمُسْتَقِيمَ = « le chemin, le droit », c'est-à-dire le droit chemin." },
      { h: "Les relatifs : celui qui, ceux qui", p: "الَّذِي (alladhî) = celui qui ; الَّذِينَ (alladhîna) = ceux qui ; الَّتِي (allatî) = celle qui. C'est l'un des mots les plus fréquents du Coran (1 468 fois) : il introduit la description des croyants ou des mécréants." },
      { h: "Ghayr et lâ : dire non", p: "غَيْرِ (ghayri) = autre que, non pas. لَا (lâ) = non, ne… pas ; وَلَا = et ni. Le verset 7 distingue trois groupes : ceux qu'Allah a comblés, ceux qui ont encouru la colère, et les égarés." }
    ],
    ex: [["اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", "guide-nous sur le droit chemin"], ["صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ", "le chemin de ceux que Tu as comblés"], ["غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ", "non pas ceux qui ont encouru la colère"], ["وَلَا الضَّالِّينَ", "ni les égarés"]],
    quiz: [
      { t: "mcq", q: "اهْدِنَا signifie :", o: ["guide-nous", "nous guidons", "il nous a guidés", "notre guide"] },
      { t: "mcq", q: "Dans الصِّرَاطَ الْمُسْتَقِيمَ, quel mot est l'adjectif ?", o: ["الْمُسْتَقِيمَ (droit)", "الصِّرَاطَ (chemin)", "les deux", "aucun"] },
      { t: "mcq", q: "الَّذِينَ signifie :", o: ["ceux qui", "celui qui", "celle qui", "ce que"] },
      { t: "mcq", q: "عَلَيْهِمْ = عَلَى + ـهِمْ. Cela signifie :", o: ["sur eux", "sur nous", "sur toi", "sur lui"] },
      { t: "order", ar: ["اهْدِنَا", "الصِّرَاطَ", "الْمُسْتَقِيمَ"], fr: "Guide-nous sur le droit chemin" }
    ]
  },

  /* ============================ UNITÉ 2 ============================ */
  {
    id: "l04", unit: 2, title: "Les prépositions",
    goal: "Maîtriser les prépositions les plus fréquentes et les préfixes wa, fa, ka.",
    theory: [
      { h: "Peu de mots, beaucoup de sens", p: "Les mots les plus fréquents du Coran sont presque tous de « petits mots » : prépositions, négations, liaisons. مِنْ apparaît à lui seul 3 226 fois ! Les maîtriser, c'est comprendre la charpente de chaque verset." },
      { h: "Les prépositions principales", p: "Après une préposition, le nom prend la voyelle i (cas indirect) : فِي الْأَرْضِ (fi l-arḍi) = sur la terre.", tbl: [["مِنْ", "de, parmi"], ["فِي", "dans"], ["إِلَى", "vers"], ["عَلَى", "sur"], ["عَنْ", "au sujet de"], ["مَعَ", "avec"], ["عِنْدَ", "auprès de"], ["بَيْنَ", "entre"]] },
      { h: "Les préfixes wa, fa, ka", p: "وَ wa = et ; فَـ fa = alors, donc (conséquence ou suite immédiate) ; كَـ ka = comme. Ils se collent au mot suivant : فَصَلِّ = alors prie ; كَعَصْفٍ = comme de la paille." },
      { h: "Préposition + pronom", p: "Les pronoms se collent aussi aux prépositions : فِيهِ (en lui), مِنْهُ (de lui), عَلَيْهِمْ (sur eux), إِلَيْهِ (vers lui). Attention : عَلَى devient عَلَيْـ et إِلَى devient إِلَيْـ devant un pronom." }
    ],
    ex: [["إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ", "nous sommes à Allah et c'est vers Lui que nous retournons"], ["فِي سَبِيلِ اللَّهِ", "dans le chemin d'Allah"], ["إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", "Allah est avec les endurants"], ["مِنْ عِنْدِ اللَّهِ", "de chez Allah"]],
    quiz: [
      { t: "mcq", q: "إِلَيْهِ signifie :", o: ["vers lui", "sur lui", "en lui", "de lui"] },
      { t: "mcq", q: "Après une préposition, le nom se termine généralement par la voyelle :", o: ["i (kasra)", "u (ḍamma)", "a (fatḥa)", "aucune voyelle"] },
      { t: "mcq", q: "Dans فَصَلِّ, le préfixe فَـ exprime :", o: ["la suite : alors, donc", "la négation", "la question", "le futur"] },
      { t: "mcq", q: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ : Allah est … les endurants", o: ["avec", "contre", "au-dessus de", "loin de"] },
      { t: "order", ar: ["إِنَّا", "لِلَّهِ", "وَإِنَّا", "إِلَيْهِ", "رَاجِعُونَ"], fr: "Nous sommes à Allah et c'est vers Lui que nous retournons" }
    ]
  },
  {
    id: "l05", unit: 2, title: "Dire non, affirmer",
    goal: "Reconnaître les négations, l'exclusivité et les mots d'insistance.",
    theory: [
      { h: "Quatre façons de dire « non »", p: "Chaque négation a son emploi :", tbl: [["لَا", "non, ne… pas (présent, interdiction)"], ["مَا", "ne… pas (souvent au passé)"], ["لَمْ", "+ présent = n'a pas (passé)"], ["لَنْ", "+ présent = ne… jamais (futur)"], ["لَيْسَ", "n'est pas"]] },
      { h: "Lâ ilâha illâ Allâh", p: "لَا إِلٰهَ إِلَّا اللَّهُ : لَا (aucune) + إِلٰهَ (divinité) + إِلَّا (sauf) + اللَّهُ (Allah). La structure « lâ… illâ » (aucun… sauf) est la formule d'exclusivité la plus forte de la langue." },
      { h: "Affirmer avec force", p: "إِنَّ inna = certes, en vérité : il ouvre une phrase pour l'affirmer avec force, et le nom qui suit prend la voyelle a : إِنَّ اللَّهَ. قَدْ qad + passé = « certes, déjà » : قَدْ أَفْلَحَ = a certes réussi. بَلْ bal = mais plutôt, au contraire." },
      { h: "Mâ : un mot, trois sens", p: "مَا peut être une négation (« ne… pas »), un relatif (« ce que ») ou une question (« quoi ? »). Le contexte tranche : dans Al-Kâfirûn, لَا أَعْبُدُ مَا تَعْبُدُونَ = « je n'adore pas ce que vous adorez »." }
    ],
    ex: [["لَا إِلٰهَ إِلَّا اللَّهُ", "pas de divinité sauf Allah"], ["لَمْ يَلِدْ وَلَمْ يُولَدْ", "Il n'a pas engendré et n'a pas été engendré"], ["إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ", "certes Allah est Pardonneur, Miséricordieux"], ["قَدْ أَفْلَحَ الْمُؤْمِنُونَ", "les croyants ont certes réussi"]],
    quiz: [
      { t: "mcq", q: "لَمْ يَلِدْ signifie :", o: ["Il n'a pas engendré", "Il n'engendrera jamais", "Il engendre", "n'engendre pas !"], why: "lam + verbe au présent = négation du passé." },
      { t: "mcq", q: "Dans لَا إِلٰهَ إِلَّا اللَّهُ, que signifie إِلَّا ?", o: ["sauf", "non", "certes", "vers"] },
      { t: "mcq", q: "Quel mot sert à affirmer avec force (« certes ») ?", o: ["إِنَّ", "لَنْ", "بَلْ", "لَيْسَ"] },
      { t: "mcq", q: "لَنْ + verbe exprime :", o: ["une négation du futur : ne… jamais", "une question", "un ordre", "le passé"] },
      { t: "order", ar: ["لَا", "إِلٰهَ", "إِلَّا", "اللَّهُ"], fr: "Pas de divinité sauf Allah" }
    ]
  },
  {
    id: "l06", unit: 2, title: "Relier les idées",
    goal: "Comprendre les mots de liaison, de condition et de but.",
    theory: [
      { h: "Enchaîner : thumma, aw, lâkinna", p: "ثُمَّ thumma = puis, ensuite (après un intervalle). أَوْ aw = ou. لٰكِنَّ lâkinna = mais : وَلٰكِنَّ أَكْثَرَ النَّاسِ لَا يَعْلَمُونَ = mais la plupart des gens ne savent pas." },
      { h: "Exprimer la condition et le temps", p: "Les mots « si » et « quand » :", tbl: [["إِنْ", "si (possible)"], ["لَوْ", "si (irréel : si seulement…)"], ["إِذَا", "quand (avenir)"], ["إِذْ", "lorsque (récit au passé)"], ["لَمَّا", "lorsque (passé)"]] },
      { h: "An, anna : « que »", p: "أَنْ an introduit un verbe : أَنْ يَقُولَ = qu'il dise, de dire. أَنَّ anna introduit un nom ou un pronom : أَنَّ اللَّهَ = qu'Allah… Ne les confondez pas avec إِنْ (si) et إِنَّ (certes) !" },
      { h: "Laʿalla : le but", p: "لَعَلَّ laʿalla = peut-être, afin que. Une formule clé du Coran : لَعَلَّكُمْ تَتَّقُونَ = afin que vous soyez pieux ; لَعَلَّكُمْ تَعْقِلُونَ = afin que vous raisonniez." }
    ],
    ex: [["إِذَا جَاءَ نَصْرُ اللَّهِ", "lorsque vient le secours d'Allah"], ["إِنْ شَاءَ اللَّهُ", "si Allah veut"], ["لَعَلَّكُمْ تَتَّقُونَ", "afin que vous soyez pieux"], ["ثُمَّ إِلَيْهِ تُرْجَعُونَ", "puis vers Lui vous serez ramenés"]],
    quiz: [
      { t: "mcq", q: "Lequel signifie « si » pour une hypothèse irréelle ?", o: ["لَوْ", "إِنْ", "إِذَا", "ثُمَّ"] },
      { t: "mcq", q: "إِنْ شَاءَ اللَّهُ signifie :", o: ["si Allah veut", "certes Allah veut", "quand Allah voulut", "Allah ne veut pas"] },
      { t: "mcq", q: "Quelle est la différence entre إِنَّ et إِنْ ?", o: ["inna = certes ; in = si", "aucune", "inna = si ; in = certes", "les deux signifient « que »"] },
      { t: "mcq", q: "لَعَلَّكُمْ تَتَّقُونَ exprime :", o: ["un but : afin que vous soyez pieux", "une condition", "une négation", "un ordre"] },
      { t: "order", ar: ["إِذَا", "جَاءَ", "نَصْرُ", "اللَّهِ", "وَالْفَتْحُ"], fr: "Lorsque viendra le secours d'Allah ainsi que la victoire" }
    ]
  },
  {
    id: "l07", unit: 2, title: "Lecture : Al-ʿAṣr", reading: true,
    goal: "Lire et comprendre la sourate Al-ʿAṣr, un programme de vie en trois versets.",
    read: [["asr"]],
    theory: [
      { h: "Une sourate, un programme de vie", p: "Al-ʿAṣr résume la voie du salut : la foi, les bonnes œuvres, l'entraide dans la vérité et dans l'endurance. Vous connaissez déjà la plupart de ses mots-outils : إِنَّ, فِي, إِلَّا, الَّذِينَ." },
      { h: "Le serment wa-", p: "وَ en début de sourate introduit souvent un serment : وَالْعَصْرِ = « Par le Temps ! ». Allah jure par Ses créations pour attirer l'attention sur ce qui suit." },
      { h: "L'insistance la-", p: "لَـ la- collé à un mot renforce l'affirmation : إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ = « l'homme est CERTES en perdition ». Double insistance : إِنَّ + لَـ." },
      { h: "Le pluriel des verbes au passé : -û", p: "آمَنُوا (ils ont cru), عَمِلُوا (ils ont accompli), تَوَاصَوْا (ils se sont recommandé) : la terminaison ـُوا -û marque « ils » au passé. Le alif final ne se prononce pas." }
    ],
    ex: [["وَالْعَصْرِ", "par le Temps !"], ["إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ", "l'homme est certes en perdition"], ["إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ", "sauf ceux qui croient et font les bonnes œuvres"]],
    quiz: [
      { t: "mcq", q: "وَالْعَصْرِ : que marque le وَ ici ?", o: ["un serment : par…", "et", "ou", "la négation"] },
      { t: "mcq", q: "آمَنُوا signifie :", o: ["ils ont cru", "il a cru", "croyez !", "nous croyons"] },
      { t: "mcq", q: "Dans لَفِي خُسْرٍ, le préfixe لَـ sert à :", o: ["insister : certes", "dire « pour »", "nier", "interroger"] },
      { t: "mcq", q: "Selon la sourate, qui échappe à la perte ?", o: ["ceux qui croient, agissent bien et s'enjoignent la vérité et l'endurance", "tous les hommes", "ceux qui sont riches", "personne"] },
      { t: "order", ar: ["إِنَّ", "الْإِنْسَانَ", "لَفِي", "خُسْرٍ"], fr: "L'homme est certes en perdition" }
    ]
  },

  /* ============================ UNITÉ 3 ============================ */
  {
    id: "l08", unit: 3, title: "Les pronoms isolés",
    goal: "Connaître les sept pronoms essentiels et la phrase sans verbe « être ».",
    theory: [
      { h: "Les sept pronoms à connaître", p: "Ils couvrent à eux seuls plus de 3 000 mots du Coran.", tbl: [["أَنَا", "je, moi"], ["نَحْنُ", "nous"], ["أَنْتَ", "tu, toi"], ["أَنْتُمْ", "vous"], ["هُوَ", "il, lui"], ["هِيَ", "elle"], ["هُمْ", "ils, eux"]] },
      { h: "Une phrase sans verbe « être »", p: "Au présent, l'arabe n'utilise pas de verbe « être » : هُوَ اللَّهُ = « Il (est) Allah » ; أَنْتَ الْعَلِيمُ = « Tu (es) l'Omniscient ». C'est la phrase nominale, très fréquente pour décrire Allah." },
      { h: "Le pronom qui insiste", p: "Le pronom peut renforcer l'affirmation : إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ = « c'est Toi, Toi l'Audient, l'Omniscient » ; هُمُ الْمُفْلِحُونَ = « ce sont eux, les gagnants »." }
    ],
    ex: [["هُوَ اللَّهُ الَّذِي لَا إِلٰهَ إِلَّا هُوَ", "C'est Lui Allah, nulle divinité sauf Lui"], ["إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ", "c'est Toi l'Audient, l'Omniscient"], ["نَحْنُ أَنْصَارُ اللَّهِ", "nous sommes les auxiliaires d'Allah"], ["وَأُولٰئِكَ هُمُ الْمُفْلِحُونَ", "et ce sont eux qui réussissent"]],
    quiz: [
      { t: "mcq", q: "هُوَ اللَّهُ signifie :", o: ["Il est Allah", "Il était Allah", "Est-ce Allah ?", "à Allah"] },
      { t: "mcq", q: "Quel pronom signifie « nous » ?", o: ["نَحْنُ", "أَنْتُمْ", "هُمْ", "أَنَا"] },
      { t: "mcq", q: "Comment dit-on « vous » (pluriel) ?", o: ["أَنْتُمْ", "أَنْتَ", "هُمْ", "نَحْنُ"] },
      { t: "mcq", q: "Pourquoi n'y a-t-il pas de verbe dans هُوَ اللَّهُ أَحَدٌ ?", o: ["le verbe « être » au présent est sous-entendu", "c'est une question", "le verbe est à la fin", "c'est une erreur de traduction"] },
      { t: "order", ar: ["إِنَّكَ", "أَنْتَ", "السَّمِيعُ", "الْعَلِيمُ"], fr: "C'est Toi l'Audient, l'Omniscient" }
    ]
  },
  {
    id: "l09", unit: 3, title: "Les pronoms attachés",
    goal: "Reconnaître les suffixes « mon, ton, son, notre… » collés aux mots.",
    theory: [
      { h: "Des pronoms collés au mot", p: "Pour dire « son, ton, notre… » ou « le, te, nous… », l'arabe colle un petit suffixe à la fin du mot. Ce sont les mêmes suffixes pour un nom (possessif), un verbe (complément) ou une préposition." },
      { h: "Le tableau des suffixes, avec رَبّ", p: "Apprenez-les avec un mot que vous connaissez :", tbl: [["رَبِّي", "mon Seigneur (-î)"], ["رَبُّنَا", "notre Seigneur (-nâ)"], ["رَبُّكَ", "ton Seigneur (-ka)"], ["رَبُّكُمْ", "votre Seigneur (-kum)"], ["رَبُّهُ", "son Seigneur (-hu)"], ["رَبُّهَا", "son Seigneur, à elle (-hâ)"], ["رَبُّهُمْ", "leur Seigneur (-hum)"]] },
      { h: "Hu devient hi", p: "Après un i ou un y, ـهُ devient ـهِ et ـهُمْ devient ـهِمْ : بِهِ (par lui), فِيهِ (en lui), عَلَيْهِمْ (sur eux). C'est le même pronom : seule la voyelle change, pour faciliter la prononciation." }
    ],
    ex: [["رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً", "Notre Seigneur, accorde-nous une belle part ici-bas"], ["رَبِّ اغْفِرْ لِي", "Mon Seigneur, pardonne-moi"], ["ذٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ", "ce Livre, nul doute en lui"], ["إِنَّ رَبَّكَ هُوَ أَعْلَمُ", "ton Seigneur est le plus savant"]],
    quiz: [
      { t: "mcq", q: "رَبُّكُمْ signifie :", o: ["votre Seigneur", "ton Seigneur", "leur Seigneur", "notre Seigneur"] },
      { t: "mcq", q: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ : « à vous votre religion et à moi … »", o: ["ma religion", "ta religion", "sa religion", "leur religion"], why: "Le ي final est sous-entendu par la kasra : دِينِ = ma religion." },
      { t: "mcq", q: "Pourquoi écrit-on عَلَيْهِمْ et non عَلَيْهُمْ ?", o: ["après un y, -hum devient -him", "c'est un autre pronom", "c'est un féminin", "c'est un duel"] },
      { t: "mcq", q: "Que signifie ـنَا dans اهْدِنَا ?", o: ["nous", "notre maison", "ils", "moi"] },
      { t: "mcq", q: "رَبِّ اغْفِرْ لِي : « Mon Seigneur, pardonne … »", o: ["moi", "nous", "lui", "eux"] }
    ]
  },
  {
    id: "l10", unit: 3, title: "Montrer et interroger",
    goal: "Utiliser les démonstratifs, les mots interrogatifs et « tout / certains ».",
    theory: [
      { h: "Ceci et cela", p: "Pour ce qui est proche : هٰذَا ceci (masc.), هٰذِهِ ceci (fém.), هٰؤُلَاءِ ceux-ci. Pour ce qui est lointain ou noble : ذٰلِكَ cela, تِلْكَ cela (fém.), أُولٰئِكَ ceux-là. ذٰلِكَ الْكِتَابُ = « ce Livre-là », marque de grandeur." },
      { h: "Poser des questions", p: "Le Coran pose souvent des questions pour faire réfléchir : هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ = « Sont-ils égaux, ceux qui savent et ceux qui ne savent pas ? »", tbl: [["هَلْ / أَ", "est-ce que ?"], ["مَنْ", "qui ?"], ["مَا / مَاذَا", "quoi ?"], ["كَيْفَ", "comment ?"], ["أَيّ", "quel ?"], ["أَمْ", "ou bien ?"]] },
      { h: "Tout, certains", p: "كُلّ = tout, chaque : عَلَى كُلِّ شَيْءٍ قَدِيرٌ = capable de toute chose. بَعْض = certains, une partie : بَعْضُهُمْ = certains d'entre eux." }
    ],
    ex: [["ذٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ", "ce Livre, nul doute à son sujet"], ["أُولٰئِكَ عَلَى هُدًى مِنْ رَبِّهِمْ", "ceux-là suivent une guidée de leur Seigneur"], ["أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ", "n'as-tu pas vu comment ton Seigneur a agi ?"], ["إِنَّ اللَّهَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", "Allah est capable de toute chose"]],
    quiz: [
      { t: "mcq", q: "ذٰلِكَ الْكِتَابُ signifie :", o: ["ce Livre-là", "ces livres", "quel livre ?", "le livre de celui-là"] },
      { t: "mcq", q: "Quel mot signifie « comment ? »", o: ["كَيْفَ", "مَنْ", "هَلْ", "كُلّ"] },
      { t: "mcq", q: "Dans أَلَمْ تَرَ, le préfixe أَ marque :", o: ["une question", "un serment", "le futur", "la négation"], why: "أَ + لَمْ = « est-ce que… ne… pas ? » : n'as-tu pas vu ?" },
      { t: "mcq", q: "عَلَى كُلِّ شَيْءٍ : كُلِّ signifie :", o: ["toute, chaque", "certaines", "aucune", "quelle"] },
      { t: "order", ar: ["إِنَّ", "اللَّهَ", "عَلَى", "كُلِّ", "شَيْءٍ", "قَدِيرٌ"], fr: "Allah est capable de toute chose" }
    ]
  },
  {
    id: "l11", unit: 3, title: "Lecture : Al-Ikhlâṣ", reading: true,
    goal: "Lire et comprendre la sourate Al-Ikhlâṣ, qui équivaut au tiers du Coran.",
    read: [["ikhlas"]],
    theory: [
      { h: "Le tiers du Coran", p: "Al-Ikhlâṣ définit Allah en quatre versets. Vous y retrouvez les pronoms (هُوَ, لَهُ) et la négation لَمْ vus dans les leçons précédentes." },
      { h: "Qul : « Dis ! »", p: "قُلْ est l'impératif du verbe قَالَ (dire), l'un des mots les plus fréquents du Coran (1 618 fois, toutes formes comprises). Il ouvre de nombreuses sourates : Allah ordonne au Prophète ﷺ de transmettre." },
      { h: "Lam + présent = passé nié", p: "لَمْ يَلِدْ = Il n'a pas engendré ; وَلَمْ يُولَدْ = et Il n'a pas été engendré ; وَلَمْ يَكُنْ = et il n'y a pas eu… Après لَمْ, le verbe perd sa voyelle finale (sukûn) : يَلِدُ → يَلِدْ." }
    ],
    ex: [["قُلْ هُوَ اللَّهُ أَحَدٌ", "Dis : Il est Allah, Unique"], ["اللَّهُ الصَّمَدُ", "Allah, l'Absolu"], ["وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ", "et nul n'est égal à Lui"]],
    quiz: [
      { t: "mcq", q: "قُلْ est :", o: ["l'impératif de « dire » : dis !", "un nom : la parole", "le passé : il a dit", "une question"] },
      { t: "mcq", q: "يُولَدْ signifie :", o: ["il est engendré (passif)", "il engendre", "engendre !", "un enfant"] },
      { t: "mcq", q: "لَهُ = لِـ + ـهُ signifie :", o: ["à Lui", "par Lui", "sur Lui", "de Lui"] },
      { t: "order", ar: ["قُلْ", "هُوَ", "اللَّهُ", "أَحَدٌ"], fr: "Dis : Il est Allah, Unique" },
      { t: "order", ar: ["لَمْ", "يَلِدْ", "وَلَمْ", "يُولَدْ"], fr: "Il n'a pas engendré et n'a pas été engendré" }
    ]
  },

  /* ============================ UNITÉ 4 ============================ */
  {
    id: "l12", unit: 4, title: "Le passé : la conjugaison",
    goal: "Conjuguer et reconnaître le passé, apprendre 10 verbes piliers.",
    theory: [
      { h: "Le verbe arabe : trois consonnes", p: "Presque tous les verbes reposent sur 3 consonnes. Le modèle des grammairiens est فَعَلَ (faʿala, faire). La forme du dictionnaire est « il a fait » (3e personne du passé) : خَلَقَ = il a créé ; عَلِمَ = il a su." },
      { h: "Les terminaisons du passé", p: "Au passé, la personne se lit à la FIN du verbe :", tbl: [["فَعَلَ", "il a fait"], ["فَعَلَتْ", "elle a fait"], ["فَعَلُوا", "ils ont fait"], ["فَعَلْتَ", "tu as fait"], ["فَعَلْتُمْ", "vous avez fait"], ["فَعَلْتُ", "j'ai fait"], ["فَعَلْنَا", "nous avons fait"]] },
      { h: "Croyants et mécréants", p: "Deux verbes reviennent sans cesse : آمَنُوا (ils ont cru) et كَفَرُوا (ils ont mécru). إِنَّ الَّذِينَ آمَنُوا = ceux qui ont cru ; إِنَّ الَّذِينَ كَفَرُوا = ceux qui ont mécru. Repérez-les : ils structurent des centaines de versets." },
      { h: "Le verbe avant le sujet", p: "Souvent le verbe vient d'abord, puis le sujet : خَلَقَ اللَّهُ السَّمَاوَاتِ = « Allah a créé les cieux » (mot à mot : a créé Allah les cieux). Quand le verbe précède son sujet, il reste au singulier." }
    ],
    ex: [["خَلَقَ اللَّهُ السَّمَاوَاتِ وَالْأَرْضَ", "Allah a créé les cieux et la terre"], ["إِنَّ الَّذِينَ كَفَرُوا", "ceux qui ont mécru"], ["قَالُوا آمَنَّا", "ils ont dit : nous avons cru"], ["رَبَّنَا ظَلَمْنَا أَنْفُسَنَا", "Notre Seigneur, nous nous sommes fait du tort"]],
    quiz: [
      { t: "mcq", q: "فَعَلْنَا signifie :", o: ["nous avons fait", "ils ont fait", "j'ai fait", "vous avez fait"] },
      { t: "mcq", q: "قَالُوا signifie :", o: ["ils ont dit", "il a dit", "dis !", "vous avez dit"] },
      { t: "mcq", q: "جَعَلْتُمْ : qui a fait l'action ?", o: ["vous", "nous", "ils", "elle"] },
      { t: "mcq", q: "خَلَقْتَ : qui a créé ?", o: ["tu", "je", "elle", "nous"], why: "-ta = tu ; -tu = je." },
      { t: "mcq", q: "عَلِمَتْ نَفْسٌ : « une âme … »", o: ["a su", "saura", "sait", "sache !"], why: "-at = elle : le sujet نَفْس est féminin." },
      { t: "order", ar: ["خَلَقَ", "اللَّهُ", "السَّمَاوَاتِ", "وَالْأَرْضَ"], fr: "Allah a créé les cieux et la terre" }
    ]
  },
  {
    id: "l13", unit: 4, title: "Les verbes de la révélation",
    goal: "Comprendre les verbes des récits prophétiques et les formes dérivées.",
    theory: [
      { h: "Envoyer, révéler, démentir", p: "Le Coran décrit sans cesse la relation entre Allah et les hommes : Il أَرْسَلَ (a envoyé) des messagers, Il أَنْزَلَ (a fait descendre) le Livre ; les gens كَذَّبُوا (ont démenti) ou ont cru. Ces verbes forment la trame des récits prophétiques." },
      { h: "Les formes dérivées", p: "Une même racine prend plusieurs « formes » qui modifient le sens : نَزَلَ descendre → أَنْزَلَ faire descendre ; أَخَذَ prendre → اتَّخَذَ prendre pour, adopter. Le a- initial (forme IV) rend souvent le verbe causatif." },
      { h: "La shadda qui intensifie", p: "كَذَّبَ (kadhdhaba) : traiter de menteur. Le doublement de la consonne intensifie ou rend causatif. ظَلَمَ = être injuste ; ظَلَمُوا أَنْفُسَهُمْ = ils se sont fait du tort à eux-mêmes." }
    ],
    ex: [["إِنَّا أَنْزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ", "Nous l'avons fait descendre durant la Nuit du Destin"], ["وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ", "et Il envoya contre eux des oiseaux par volées"], ["كَذَّبَتْ ثَمُودُ", "les Thamûd ont démenti"], ["وَمَا ظَلَمَهُمُ اللَّهُ", "et Allah ne leur a fait aucun tort"]],
    quiz: [
      { t: "mcq", q: "أَنْزَلْنَاهُ (-nâ + -hu) signifie :", o: ["Nous l'avons fait descendre", "Il nous a fait descendre", "nous sommes descendus", "fais-le descendre"] },
      { t: "mcq", q: "Quelle est la nuance entre نَزَلَ et أَنْزَلَ ?", o: ["descendre / faire descendre", "aucune", "passé / futur", "singulier / pluriel"] },
      { t: "mcq", q: "وَمَا ظَلَمَهُمُ اللَّهُ signifie :", o: ["et Allah ne leur a fait aucun tort", "et Allah les a lésés", "qui les a lésés ?", "ne soyez pas injustes"] },
      { t: "order", ar: ["إِنَّا", "أَنْزَلْنَاهُ", "فِي", "لَيْلَةِ", "الْقَدْرِ"], fr: "Nous l'avons fait descendre durant la Nuit du Destin" }
    ]
  },
  {
    id: "l14", unit: 4, title: "Lecture : Al-Kawthar", reading: true,
    goal: "Lire et comprendre la plus courte sourate du Coran.",
    read: [["kawthar"]],
    theory: [
      { h: "Dix mots, trois versets", p: "Révélée pour réconforter le Prophète ﷺ, moqué parce que ses fils étaient morts en bas âge : c'est son ennemi qui sera « coupé » de tout bien." },
      { h: "Innâ : « certes Nous »", p: "إِنَّا = إِنَّ + نَا = « certes Nous ». Allah parle souvent de Lui-même au pluriel de majesté. أَعْطَيْنَاكَ = أَعْطَيْ + نَا (Nous, sujet) + كَ (te, complément) = Nous t'avons donné." },
      { h: "Fa + impératif", p: "فَصَلِّ = alors prie ! ; وَانْحَرْ = et sacrifie ! La gratitude pour le don se traduit en actes : la prière et le sacrifice, pour Allah seul (لِرَبِّكَ)." }
    ],
    ex: [["إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", "Nous t'avons accordé l'Abondance"], ["فَصَلِّ لِرَبِّكَ وَانْحَرْ", "prie donc pour ton Seigneur et sacrifie"], ["إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", "c'est ton ennemi qui sera sans postérité"]],
    quiz: [
      { t: "mcq", q: "أَعْطَيْنَاكَ signifie :", o: ["Nous t'avons donné", "tu nous as donné", "donne-nous", "il t'a donné"] },
      { t: "mcq", q: "لِرَبِّكَ = لِـ + رَبّ + ـكَ :", o: ["pour ton Seigneur", "par ton Seigneur", "ton Seigneur est", "vers notre Seigneur"] },
      { t: "mcq", q: "Dans فَصَلِّ, le فَـ signifie :", o: ["alors, donc", "et", "certes", "ne… pas"] },
      { t: "order", ar: ["إِنَّا", "أَعْطَيْنَاكَ", "الْكَوْثَرَ"], fr: "Nous t'avons accordé l'Abondance" }
    ]
  },
  {
    id: "l15", unit: 4, title: "Lecture : An-Naṣr", reading: true,
    goal: "Lire et comprendre la sourate An-Naṣr : la victoire appelle la louange.",
    read: [["nasr"]],
    theory: [
      { h: "La victoire et la gratitude", p: "Révélée à la fin de la mission du Prophète ﷺ. Ibn ʿAbbâs y voyait l'annonce que sa mission s'achevait. La réaction demandée face au succès : glorifier Allah et Lui demander pardon." },
      { h: "Idhâ + passé = futur", p: "Après إِذَا (quand), le verbe au passé prend souvent un sens futur : إِذَا جَاءَ = « quand viendra ». وَرَأَيْتَ = et (que) tu verras. Le passé exprime ici une certitude." },
      { h: "Deux impératifs à retenir", p: "سَبِّحْ = glorifie ! (de سَبَّحَ ; سُبْحَانَ اللَّهِ = gloire à Allah). اسْتَغْفِرْ = demande pardon ! (de اسْتَغْفَرَ ; أَسْتَغْفِرُ اللَّهَ = je demande pardon à Allah). Le schème ista- exprime la demande : istaghfara = demander le pardon." }
    ],
    ex: [["إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ", "quand viendra le secours d'Allah et la victoire"], ["يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا", "ils entrent en foule dans la religion d'Allah"], ["فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ", "glorifie ton Seigneur par Sa louange et implore Son pardon"]],
    quiz: [
      { t: "mcq", q: "يَدْخُلُونَ signifie :", o: ["ils entrent", "ils sont entrés", "entrez !", "il entre"], why: "ya- … -ûna = ils, au présent (unité suivante)." },
      { t: "mcq", q: "اسْتَغْفِرْهُ signifie :", o: ["demande-Lui pardon", "Il a pardonné", "pardonne-lui", "nous demandons pardon"] },
      { t: "mcq", q: "Que marque le schème ista- dans اسْتَغْفَرَ et اسْتَعَانَ ?", o: ["la demande de quelque chose", "le passif", "le pluriel", "le futur"] },
      { t: "order", ar: ["فَسَبِّحْ", "بِحَمْدِ", "رَبِّكَ", "وَاسْتَغْفِرْهُ"], fr: "Glorifie ton Seigneur par Sa louange et implore Son pardon" }
    ]
  },

  /* ============================ UNITÉ 5 ============================ */
  {
    id: "l16", unit: 5, title: "Le présent et le futur",
    goal: "Reconnaître la personne au présent et exprimer le futur.",
    theory: [
      { h: "Le présent : des préfixes", p: "Au passé, la personne est à la fin du verbe. Au présent, elle est surtout au DÉBUT. Avec عَلِمَ (savoir) :", tbl: [["يَعْلَمُ", "il sait (ya-)"], ["تَعْلَمُ", "tu sais / elle sait (ta-)"], ["أَعْلَمُ", "je sais (a-)"], ["نَعْلَمُ", "nous savons (na-)"]] },
      { h: "Le pluriel : -ûna", p: "Pour « ils » et « vous », on ajoute ـُونَ -ûna à la fin : يَعْلَمُونَ ils savent ; تَعْلَمُونَ vous savez. Formules fréquentes : لَعَلَّكُمْ تَعْقِلُونَ = afin que vous raisonniez ; أَكْثَرُهُمْ لَا يَعْلَمُونَ = la plupart d'entre eux ne savent pas." },
      { h: "Le futur : sa- et sawfa", p: "Pour le futur, on place سَـ sa- (proche) ou سَوْفَ sawfa (plus lointain) devant le présent : سَيَعْلَمُونَ = ils sauront ; سَوْفَ تَعْلَمُونَ = vous saurez bientôt." }
    ],
    ex: [["وَاللَّهُ يَعْلَمُ وَأَنْتُمْ لَا تَعْلَمُونَ", "Allah sait, et vous ne savez pas"], ["أَفَلَا تَعْقِلُونَ", "ne raisonnez-vous donc pas ?"], ["كَلَّا سَوْفَ تَعْلَمُونَ", "mais non ! vous saurez bientôt"], ["لَعَلَّهُمْ يَتَّقُونَ", "afin qu'ils soient pieux"]],
    quiz: [
      { t: "mcq", q: "يَعْلَمُونَ signifie :", o: ["ils savent", "vous savez", "il sait", "nous savons"] },
      { t: "mcq", q: "تَعْقِلُونَ signifie :", o: ["vous raisonnez", "ils raisonnent", "tu raisonnes", "raisonnez !"], why: "ta- … -ûna = vous." },
      { t: "mcq", q: "Dans سَيَعْلَمُونَ, le préfixe سَـ indique :", o: ["le futur", "la négation", "une question", "le passé"] },
      { t: "mcq", q: "أَعْبُدُ : qui adore ?", o: ["je", "nous", "il", "tu"] },
      { t: "mcq", q: "نَسْتَعِينُ : qui demande l'aide ?", o: ["nous", "je", "ils", "vous"] },
      { t: "order", ar: ["وَاللَّهُ", "يَعْلَمُ", "وَأَنْتُمْ", "لَا", "تَعْلَمُونَ"], fr: "Allah sait, et vous ne savez pas" }
    ]
  },
  {
    id: "l17", unit: 5, title: "L'impératif et l'interdiction",
    goal: "Comprendre les commandements et les interdictions du Coran.",
    theory: [
      { h: "Donner un ordre", p: "L'impératif se forme à partir du présent, sans préfixe de personne. Au pluriel, il se termine par ـُوا -û :", tbl: [["قُلْ", "dis !"], ["اعْبُدُوا", "adorez !"], ["اتَّقُوا", "craignez (Allah) !"], ["أَطِيعُوا", "obéissez !"], ["أَقِيمُوا", "accomplissez !"]] },
      { h: "Les grands commandements", p: "أَقِيمُوا الصَّلَاةَ = accomplissez la prière ; وَآتُوا الزَّكَاةَ = et acquittez la zakât ; أَطِيعُوا اللَّهَ وَأَطِيعُوا الرَّسُولَ = obéissez à Allah et obéissez au Messager ; اتَّقُوا اللَّهَ = craignez Allah." },
      { h: "Interdire : lâ + verbe", p: "لَا + verbe au présent (sans le -na final) = interdiction : لَا تَخَافُوا = n'ayez pas peur ; لَا تَأْكُلُوا = ne mangez pas ; لَا تَقْنَطُوا مِنْ رَحْمَةِ اللَّهِ = ne désespérez pas de la miséricorde d'Allah." },
      { h: "Yâ ayyuhâ… : l'appel", p: "Les ordres sont souvent introduits par un appel : يَا أَيُّهَا الَّذِينَ آمَنُوا = « Ô vous qui avez cru ! » (89 fois dans le Coran). Quand vous l'entendez, un commandement suit." }
    ],
    ex: [["يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ", "ô vous qui avez cru, craignez Allah"], ["وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ", "accomplissez la prière et acquittez la zakât"], ["وَأَطِيعُوا اللَّهَ وَالرَّسُولَ", "obéissez à Allah et au Messager"], ["لَا تَقْنَطُوا مِنْ رَحْمَةِ اللَّهِ", "ne désespérez pas de la miséricorde d'Allah"]],
    quiz: [
      { t: "mcq", q: "اعْبُدُوا signifie :", o: ["adorez !", "ils ont adoré", "vous adorez", "nous adorons"] },
      { t: "mcq", q: "لَا تَخَافُوا signifie :", o: ["n'ayez pas peur", "ils n'ont pas peur", "vous n'avez pas eu peur", "il ne craint pas"] },
      { t: "mcq", q: "أَقِيمُوا الصَّلَاةَ signifie :", o: ["accomplissez la prière", "ils ont accompli la prière", "la prière est accomplie", "nous prions"] },
      { t: "mcq", q: "يَا أَيُّهَا الَّذِينَ آمَنُوا signifie :", o: ["ô vous qui avez cru", "ceux qui croient sont…", "croyez-vous ?", "ils ont cru"] },
      { t: "order", ar: ["يَا", "أَيُّهَا", "الَّذِينَ", "آمَنُوا", "اتَّقُوا", "اللَّهَ"], fr: "Ô vous qui avez cru, craignez Allah" }
    ]
  },
  {
    id: "l18", unit: 5, title: "Lecture : Al-Kâfirûn", reading: true,
    goal: "Lire Al-Kâfirûn : une leçon de conjugaison révélée.",
    read: [["kafirun"]],
    theory: [
      { h: "Une leçon de conjugaison révélée", p: "Al-Kâfirûn oppose le présent et le passé, le « je » et le « vous » : أَعْبُدُ (j'adore), تَعْبُدُونَ (vous adorez), عَبَدْتُمْ (vous avez adoré). Toute la sourate tourne autour de la racine ع ب د." },
      { h: "Le participe ʿâbid", p: "عَابِدٌ = adorateur (celui qui adore) ; pluriel عَابِدُونَ. C'est le schème fâʿil, étudié dans l'unité 7 : il désigne celui qui fait l'action. وَلَا أَنَا عَابِدٌ = et je ne suis pas adorateur." },
      { h: "Lakum… wa liya…", p: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ : « à vous votre religion, à moi la mienne ». La préposition لِـ (à, appartient à) + pronom : لَكُمْ = à vous ; لِيَ = à moi." }
    ],
    ex: [["قُلْ يَا أَيُّهَا الْكَافِرُونَ", "dis : ô vous les mécréants !"], ["لَا أَعْبُدُ مَا تَعْبُدُونَ", "je n'adore pas ce que vous adorez"], ["لَكُمْ دِينُكُمْ وَلِيَ دِينِ", "à vous votre religion, et à moi ma religion"]],
    quiz: [
      { t: "mcq", q: "لَا أَعْبُدُ signifie :", o: ["je n'adore pas", "n'adore pas !", "il n'adore pas", "nous n'adorons pas"] },
      { t: "mcq", q: "عَبَدْتُمْ signifie :", o: ["vous avez adoré", "vous adorez", "adorez !", "ils ont adoré"] },
      { t: "mcq", q: "عَابِدُونَ signifie :", o: ["des adorateurs", "ils adorent", "l'adoration", "adorés"] },
      { t: "order", ar: ["لَكُمْ", "دِينُكُمْ", "وَلِيَ", "دِينِ"], fr: "À vous votre religion, et à moi ma religion" },
      { t: "order", ar: ["لَا", "أَعْبُدُ", "مَا", "تَعْبُدُونَ"], fr: "Je n'adore pas ce que vous adorez" }
    ]
  },

  /* ============================ UNITÉ 6 ============================ */
  {
    id: "l19", unit: 6, title: "La création",
    goal: "Nommer les signes de la création et reconnaître le pluriel en -ât.",
    theory: [
      { h: "Les signes dans l'univers", p: "Le Coran invite sans cesse à observer la création : le ciel, la terre, la nuit et le jour, le soleil et la lune sont appelés des « signes » (آيَات). أَرْض (terre) apparaît 461 fois, سَمَاء (ciel) 310 fois." },
      { h: "Le pluriel féminin : -ât", p: "La terminaison ـَات -ât marque un pluriel, souvent de mots féminins :", tbl: [["سَمَاوَات", "cieux (sing. سَمَاء)"], ["آيَات", "signes, versets (sing. آيَة)"], ["جَنَّات", "jardins (sing. جَنَّة)"], ["صَالِحَات", "bonnes œuvres (sing. صَالِحَة)"]] },
      { h: "Les paires du Coran", p: "Le Coran associe souvent les contraires : اللَّيْل et النَّهَار (la nuit et le jour), السَّمَاوَات et الْأَرْض, الدُّنْيَا (ici-bas) et الْآخِرَة (l'au-delà). Retenez-les par paires !" }
    ],
    ex: [["إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ", "dans la création des cieux et de la terre"], ["وَاخْتِلَافِ اللَّيْلِ وَالنَّهَارِ", "et l'alternance de la nuit et du jour"], ["الشَّمْسُ وَالْقَمَرُ بِحُسْبَانٍ", "le soleil et la lune évoluent selon un calcul"], ["وَجَعَلْنَا مِنَ الْمَاءِ كُلَّ شَيْءٍ حَيٍّ", "Nous avons fait de l'eau toute chose vivante"]],
    quiz: [
      { t: "mcq", q: "السَّمَاوَات signifie :", o: ["les cieux", "le ciel", "les signes", "la terre"] },
      { t: "mcq", q: "Quel est le contraire de اللَّيْل (la nuit) dans le Coran ?", o: ["النَّهَار", "الشَّمْس", "الْقَمَر", "الْأَرْض"] },
      { t: "mcq", q: "الدُّنْيَا (la vie d'ici-bas) s'oppose à :", o: ["الْآخِرَة (l'au-delà)", "الْأَرْض (la terre)", "السَّمَاء (le ciel)", "الْبَحْر (la mer)"] },
      { t: "mcq", q: "La terminaison ـَات marque :", o: ["un pluriel", "un duel", "un verbe", "une négation"] },
      { t: "order", ar: ["وَجَعَلْنَا", "مِنَ", "الْمَاءِ", "كُلَّ", "شَيْءٍ", "حَيٍّ"], fr: "Nous avons fait de l'eau toute chose vivante" }
    ]
  },
  {
    id: "l20", unit: 6, title: "Les êtres humains",
    goal: "Nommer les personnes et reconnaître les pluriels.",
    theory: [
      { h: "Les personnes du Coran", p: "قَوْم (peuple) apparaît 383 fois : les récits prophétiques commencent souvent par يَا قَوْمِ « Ô mon peuple ! ». نَفْس (âme, soi) sert aussi de réfléchi : أَنْفُسَهُمْ = eux-mêmes." },
      { h: "Les pluriels internes", p: "Beaucoup de pluriels se forment en changeant les voyelles à l'intérieur du mot. Retenez singulier et pluriel ensemble :", tbl: [["رَسُول ← رُسُل", "messager(s)"], ["نَفْس ← أَنْفُس", "âme(s)"], ["رَجُل ← رِجَال", "homme(s)"], ["أَب ← آبَاء", "père(s), ancêtres"], ["ابْن ← أَبْنَاء / بَنُون", "fils"]] },
      { h: "Le pluriel masculin : -ûn / -în", p: "Pour les noms de personnes : مُؤْمِن → مُؤْمِنُونَ / مُؤْمِنِينَ (croyants). -ûna quand le mot est sujet, -îna après une préposition ou en complément : قَدْ أَفْلَحَ الْمُؤْمِنُونَ ; وَبَشِّرِ الْمُؤْمِنِينَ." }
    ],
    ex: [["يَا قَوْمِ اعْبُدُوا اللَّهَ", "ô mon peuple, adorez Allah"], ["وَلٰكِنْ كَانُوا أَنْفُسَهُمْ يَظْلِمُونَ", "mais c'est à eux-mêmes qu'ils faisaient du tort"], ["يَا بَنِي إِسْرَائِيلَ", "ô enfants d'Israël"], ["وَبَشِّرِ الْمُؤْمِنِينَ", "et annonce la bonne nouvelle aux croyants"]],
    quiz: [
      { t: "mcq", q: "يَا قَوْمِ signifie :", o: ["ô mon peuple", "ô peuples", "un peuple", "leur peuple"] },
      { t: "mcq", q: "Le pluriel de رَسُول (messager) est :", o: ["رُسُل", "رَسُولَات", "أَرْسَال", "رَسَائِل"] },
      { t: "mcq", q: "آبَاؤُنَا signifie :", o: ["nos ancêtres", "notre père", "nos frères", "nos fils"] },
      { t: "mcq", q: "الْمُؤْمِنُونَ et الْمُؤْمِنِينَ :", o: ["même mot (croyants), fonction différente", "croyants / croyantes", "un croyant / deux croyants", "deux mots sans rapport"] },
      { t: "order", ar: ["يَا", "قَوْمِ", "اعْبُدُوا", "اللَّهَ"], fr: "Ô mon peuple, adorez Allah" }
    ]
  },
  {
    id: "l21", unit: 6, title: "Foi et révélation",
    goal: "Maîtriser le vocabulaire de la révélation, de la foi et de la pratique.",
    theory: [
      { h: "Le vocabulaire de la révélation", p: "كِتَاب (livre, Écriture), آيَة (signe, verset), قُرْآن (Coran, « la lecture »), ذِكْر (rappel) : le Coran se désigne par plusieurs noms. هُدًى (guidée) est sa fonction : هُدًى لِلْمُتَّقِينَ = une guidée pour les pieux." },
      { h: "Les piliers de la pratique", p: "الصَّلَاة (la prière) et الزَّكَاة (l'aumône purificatrice) sont presque toujours cités ensemble. Le ة final (tâʾ marbûṭa) se prononce -a à la pause et -at en liaison : ṣalât." },
      { h: "Le monde invisible", p: "مَلَك (ange), pluriel مَلَائِكَة ; شَيْطَان (diable), pluriel شَيَاطِين. وَلِيّ (allié, protecteur) : اللَّهُ وَلِيُّ الَّذِينَ آمَنُوا = Allah est le protecteur de ceux qui ont cru." }
    ],
    ex: [["ذٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِلْمُتَّقِينَ", "ce Livre, nul doute en lui, est une guidée pour les pieux"], ["اللَّهُ وَلِيُّ الَّذِينَ آمَنُوا", "Allah est le protecteur de ceux qui ont cru"], ["وَقُلْ رَبِّ زِدْنِي عِلْمًا", "et dis : Mon Seigneur, accrois-moi en savoir"], ["إِنَّ الشَّيْطَانَ لَكُمْ عَدُوٌّ", "le diable est pour vous un ennemi"]],
    quiz: [
      { t: "mcq", q: "هُدًى لِلْمُتَّقِينَ signifie :", o: ["une guidée pour les pieux", "les pieux sont guidés", "guide les pieux !", "la guidée des anges"] },
      { t: "mcq", q: "Le pluriel de مَلَك (ange) est :", o: ["مَلَائِكَة", "مُلُوك", "أَمْلَاك", "مَلَكُونَ"] },
      { t: "mcq", q: "رَبِّ زِدْنِي عِلْمًا : « Mon Seigneur, accrois-moi en … »", o: ["savoir", "foi", "richesse", "patience"] },
      { t: "mcq", q: "Quels deux mots sont presque toujours cités ensemble ?", o: ["الصَّلَاة et الزَّكَاة", "الْكِتَاب et الشَّيْطَان", "الْقُرْآن et الْمَلَك", "الْعِلْم et الْوَلِيّ"] },
      { t: "order", ar: ["وَقُلْ", "رَبِّ", "زِدْنِي", "عِلْمًا"], fr: "Et dis : Mon Seigneur, accrois-moi en savoir" }
    ]
  },
  {
    id: "l22", unit: 6, title: "L'au-delà",
    goal: "Comprendre le vocabulaire du Jour dernier, du Paradis et de l'Enfer.",
    theory: [
      { h: "Le Jour dernier", p: "الْيَوْمِ الْآخِرِ (le Jour dernier), يَوْمَ الْقِيَامَةِ (le Jour de la Résurrection), يَوْمِ الدِّينِ (le Jour de la Rétribution) : le Coran rappelle sans cesse que la vie continue après la mort. الْآخِرَة (l'au-delà) s'oppose à الدُّنْيَا." },
      { h: "Paradis et Enfer", p: "جَنَّة (jardin) désigne le Paradis : جَنَّاتٍ تَجْرِي مِنْ تَحْتِهَا الْأَنْهَارُ = des jardins sous lesquels coulent les rivières. نَار (feu) et جَهَنَّم (la Géhenne) désignent l'Enfer. خَالِدِينَ فِيهَا = pour y demeurer éternellement." },
      { h: "Récompense et châtiment", p: "أَجْر (récompense) et فَضْل (grâce) d'un côté ; عَذَاب أَلِيم (châtiment douloureux) de l'autre. Le nom est suivi de son adjectif : عَذَابٌ أَلِيمٌ ; أَجْرٌ عَظِيمٌ (une récompense immense)." }
    ],
    ex: [["جَنَّاتٍ تَجْرِي مِنْ تَحْتِهَا الْأَنْهَارُ خَالِدِينَ فِيهَا", "des jardins sous lesquels coulent les rivières, pour y demeurer éternellement"], ["وَلَهُمْ عَذَابٌ أَلِيمٌ", "et ils auront un châtiment douloureux"], ["أُولٰئِكَ أَصْحَابُ الْجَنَّةِ", "ceux-là sont les gens du Paradis"], ["وَالْآخِرَةُ خَيْرٌ وَأَبْقَى", "alors que l'au-delà est meilleur et plus durable"]],
    quiz: [
      { t: "mcq", q: "خَالِدِينَ فِيهَا signifie :", o: ["y demeurant éternellement", "sortant de là", "entrant en elle", "ses habitants"] },
      { t: "mcq", q: "عَذَابٌ أَلِيمٌ signifie :", o: ["un châtiment douloureux", "une récompense immense", "un feu ardent", "une grâce"] },
      { t: "mcq", q: "أَصْحَابُ الْجَنَّةِ signifie :", o: ["les gens du Paradis", "les jardins", "les compagnons du Prophète", "les gens du Feu"] },
      { t: "mcq", q: "وَالْآخِرَةُ خَيْرٌ : l'au-delà est …", o: ["meilleur", "mauvais", "proche", "lointain"] },
      { t: "order", ar: ["وَالْآخِرَةُ", "خَيْرٌ", "وَأَبْقَى"], fr: "Alors que l'au-delà est meilleur et plus durable" }
    ]
  },
  {
    id: "l23", unit: 6, title: "Temps, espace et corps",
    goal: "Situer dans le temps et l'espace, nommer le corps, reconnaître le duel.",
    theory: [
      { h: "Situer dans le temps et l'espace", p: "قَبْل avant · بَعْد après · فَوْق au-dessus · تَحْت sous · دُون en dehors de. Ils s'emploient comme des prépositions : مِنْ قَبْلِكَ = avant toi ; مِنْ دُونِ اللَّهِ = en dehors d'Allah (formule fréquente pour les fausses divinités)." },
      { h: "Le corps, siège du sens", p: "Le Coran fait du قَلْب (cœur) l'organe de la compréhension : لَهُمْ قُلُوبٌ لَا يَفْقَهُونَ بِهَا = ils ont des cœurs avec lesquels ils ne comprennent pas. صَدْر (poitrine) : رَبِّ اشْرَحْ لِي صَدْرِي = Mon Seigneur, ouvre-moi ma poitrine." },
      { h: "Le duel : -âni / -ayni", p: "Pour dire « deux », on ajoute ـَانِ -âni ou ـَيْنِ -ayni : يَدَانِ / يَدَيْنِ (deux mains). En annexion, le n tombe : تَبَّتْ يَدَا أَبِي لَهَبٍ = que périssent les deux mains d'Abû Lahab." }
    ],
    ex: [["مِنْ دُونِ اللَّهِ", "en dehors d'Allah"], ["رَبِّ اشْرَحْ لِي صَدْرِي", "Mon Seigneur, ouvre-moi ma poitrine"], ["فِي سَبِيلِ اللَّهِ", "dans le chemin d'Allah"], ["كُلُّ شَيْءٍ هَالِكٌ إِلَّا وَجْهَهُ", "toute chose périt sauf Son Visage"]],
    quiz: [
      { t: "mcq", q: "مِنْ قَبْلِكَ signifie :", o: ["avant toi", "après toi", "au-dessus de toi", "sans toi"] },
      { t: "mcq", q: "مِنْ دُونِ اللَّهِ signifie :", o: ["en dehors d'Allah", "auprès d'Allah", "par Allah", "au-dessus d'Allah"] },
      { t: "mcq", q: "يَدَا dans تَبَّتْ يَدَا أَبِي لَهَبٍ est :", o: ["un duel : les deux mains", "un pluriel : les mains", "un verbe", "un singulier"] },
      { t: "mcq", q: "Selon le Coran, l'organe de la compréhension est :", o: ["le cœur (قَلْب)", "la main (يَد)", "le visage (وَجْه)", "l'œil (عَيْن)"] },
      { t: "order", ar: ["رَبِّ", "اشْرَحْ", "لِي", "صَدْرِي"], fr: "Mon Seigneur, ouvre-moi ma poitrine" }
    ]
  },
  {
    id: "l24", unit: 6, title: "Lecture : Al-Falaq et An-Nâs", reading: true,
    goal: "Comprendre les deux sourates de protection récitées matin et soir.",
    read: [["falaq"], ["nas"]],
    theory: [
      { h: "Les deux protectrices", p: "Le Prophète ﷺ les récitait chaque soir et après chaque prière. Elles commencent toutes deux par قُلْ أَعُوذُ بِرَبِّ : « Dis : je cherche refuge auprès du Seigneur… »." },
      { h: "Min sharri… : contre le mal de…", p: "مِنْ شَرِّ = contre le mal de. Al-Falaq énumère des maux extérieurs (la nuit, la sorcellerie, l'envie) ; An-Nâs, le mal intérieur : le chuchotement du tentateur dans les cœurs (صُدُور, pluriel de صَدْر)." },
      { h: "Trois noms en gradation", p: "رَبِّ النَّاسِ (Seigneur des hommes), مَلِكِ النَّاسِ (Roi des hommes), إِلٰهِ النَّاسِ (Dieu des hommes) : Seigneurie, Royauté, Divinité. Distinguez مَالِك (Maître, possesseur) dans Al-Fâtiha et مَلِك (Roi) ici." }
    ],
    ex: [["قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", "dis : je cherche refuge auprès du Seigneur de l'aube"], ["وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ", "et contre le mal de l'envieux quand il envie"], ["مَلِكِ النَّاسِ إِلٰهِ النَّاسِ", "le Roi des hommes, le Dieu des hommes"]],
    quiz: [
      { t: "mcq", q: "أَعُوذُ signifie :", o: ["je cherche refuge", "il cherche refuge", "cherchez refuge !", "le refuge"], why: "a- = je, au présent." },
      { t: "mcq", q: "مِنْ شَرِّ مَا خَلَقَ signifie :", o: ["contre le mal de ce qu'Il a créé", "du bien qu'Il a créé", "Il n'a pas créé le mal", "le mal est créé"] },
      { t: "mcq", q: "مَلِك et مَالِك :", o: ["Roi / Maître-possesseur", "identiques", "ange / roi", "pluriel / singulier"] },
      { t: "order", ar: ["قُلْ", "أَعُوذُ", "بِرَبِّ", "النَّاسِ"], fr: "Dis : je cherche refuge auprès du Seigneur des hommes" },
      { t: "order", ar: ["الَّذِي", "يُوَسْوِسُ", "فِي", "صُدُورِ", "النَّاسِ"], fr: "Qui souffle le mal dans les poitrines des hommes" }
    ]
  },

  /* ============================ UNITÉ 7 ============================ */
  {
    id: "l25", unit: 7, title: "Une racine, une famille",
    goal: "Identifier la racine d'un mot et relier verbes et noms d'action.",
    theory: [
      { h: "Le génie de l'arabe", p: "Le Coran compte environ 77 400 mots, mais seulement 1 650 racines environ. Chaque racine de 3 consonnes porte une idée ; des « moules » (schèmes) en tirent des mots précis. Connaître une racine, c'est déjà deviner des dizaines de mots." },
      { h: "Exemple : la racine ع ل م (savoir)", p: "La racine ع ل م apparaît 854 fois dans le Coran :", tbl: [["عَلِمَ / يَعْلَمُ", "il a su / il sait"], ["عِلْم", "savoir"], ["عَالِم", "savant"], ["عَلِيم", "Omniscient"], ["أَعْلَم", "plus savant"], ["عَلَّمَ", "enseigner"], ["عَالَم", "monde"]] },
      { h: "Verbe et nom d'action", p: "Chaque verbe a un nom d'action (maṣdar) : كَفَرَ → كُفْر (mécréance) ; خَلَقَ → خَلْق (création) ; عَمِلَ → عَمَل (action) ; قَالَ → قَوْل (parole) ; غَفَرَ → مَغْفِرَة (pardon). Connaître le verbe, c'est connaître le nom !" },
      { h: "La shadda qui fait faire", p: "Doubler la 2e consonne (forme II) rend souvent le verbe intensif ou causatif : عَلِمَ savoir → عَلَّمَ faire savoir, enseigner ; كَذَبَ mentir → كَذَّبَ traiter de menteur." }
    ],
    ex: [["وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا", "et Il apprit à Adam tous les noms"], ["كُتِبَ عَلَيْكُمُ الصِّيَامُ", "le jeûne vous a été prescrit"], ["قَوْلٌ مَعْرُوفٌ وَمَغْفِرَةٌ خَيْرٌ", "une parole convenable et un pardon valent mieux"], ["إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا", "Allah pardonne tous les péchés"]],
    quiz: [
      { t: "mcq", q: "Quelle est la racine de مَغْفِرَة ?", o: ["غ ف ر", "م غ ف", "ف ر ة", "غ ر م"] },
      { t: "mcq", q: "Quelle est la racine de عَلَّمَ ?", o: ["ع ل م", "ع ل ل", "ل م م", "ع م ل"] },
      { t: "mcq", q: "خَلْق est le nom d'action de :", o: ["خَلَقَ (créer)", "خَلَفَ (succéder)", "قَالَ (dire)", "حَلَقَ (raser)"] },
      { t: "mcq", q: "Que signifie probablement كَاتِب (racine ك ت ب, schème fâʿil) ?", o: ["écrivain, scribe", "livre", "écrit", "bureau"] },
      { t: "mcq", q: "عَلَّمَ par rapport à عَلِمَ :", o: ["enseigner (faire savoir)", "oublier", "être savant", "le savoir"] },
      { t: "order", ar: ["إِنَّ", "اللَّهَ", "يَغْفِرُ", "الذُّنُوبَ", "جَمِيعًا"], fr: "Allah pardonne tous les péchés" }
    ]
  },
  {
    id: "l26", unit: 7, title: "Les Noms d'Allah : faʿîl",
    goal: "Reconnaître les schèmes des Noms divins et les paires de fin de verset.",
    theory: [
      { h: "Le schème faʿîl : une qualité permanente", p: "Le moule فَعِيل (faʿîl) exprime une qualité stable et profonde :", tbl: [["عَلِيم", "Omniscient (ع ل م)"], ["حَكِيم", "Sage (ح ك م)"], ["سَمِيع", "qui entend tout (س م ع)"], ["بَصِير", "qui voit tout (ب ص ر)"], ["قَدِير", "Omnipotent (ق د ر)"], ["رَحِيم", "Très Miséricordieux (ر ح م)"]] },
      { h: "Les fins de versets", p: "Beaucoup de versets se terminent par deux Noms d'Allah : وَاللَّهُ عَلِيمٌ حَكِيمٌ ; إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ ; وَهُوَ السَّمِيعُ الْعَلِيمُ ; وَهُوَ الْعَزِيزُ الْحَكِيمُ. Ces paires résument le message du verset : repérez-les !" },
      { h: "Faʿûl et faʿʿâl : l'intensité", p: "فَعُول et فَعَّال expriment l'abondance : غَفُور (Très Pardonneur), شَكُور (très Reconnaissant), تَوَّاب (qui accueille sans cesse le repentir), خَنَّاس (qui se dérobe sans cesse)." }
    ],
    ex: [["إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ", "Allah est Pardonneur et Miséricordieux"], ["وَهُوَ السَّمِيعُ الْعَلِيمُ", "et c'est Lui l'Audient, l'Omniscient"], ["وَاللَّهُ بِمَا تَعْمَلُونَ بَصِيرٌ", "et Allah voit parfaitement ce que vous faites"], ["إِنَّ اللَّهَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", "Allah est capable de toute chose"]],
    quiz: [
      { t: "mcq", q: "Le schème فَعِيل exprime :", o: ["une qualité permanente", "une action passée", "un lieu", "un pluriel"] },
      { t: "mcq", q: "Quelle est la racine de بَصِير ?", o: ["ب ص ر", "ب ص ي", "ص ر ب", "ب ي ر"] },
      { t: "mcq", q: "وَاللَّهُ بِمَا تَعْمَلُونَ بَصِيرٌ : Allah … ce que vous faites", o: ["voit parfaitement", "entend", "pardonne", "écrit"] },
      { t: "mcq", q: "Sur le modèle de عَلِيم, que signifie قَدِير (racine ق د ر, pouvoir) ?", o: ["Omnipotent", "la puissance", "il a pu", "le destin"] },
      { t: "order", ar: ["وَهُوَ", "السَّمِيعُ", "الْعَلِيمُ"], fr: "Et c'est Lui l'Audient, l'Omniscient" }
    ]
  },
  {
    id: "l27", unit: 7, title: "Celui qui fait : fâʿil, mufʿil, afʿal",
    goal: "Deviner le sens des participes et des comparatifs à partir de la racine.",
    theory: [
      { h: "Fâʿil : celui qui fait", p: "Le schème فَاعِل (fâʿil) forme le participe actif : celui qui fait l'action. كَفَرَ → كَافِر (mécréant) ; ظَلَمَ → ظَالِم (injuste) ; صَدَقَ → صَادِق (véridique) ; عَبَدَ → عَابِد (adorateur) ; خَسِرَ → خَاسِر (perdant)." },
      { h: "Mu- : celui qui fait (formes dérivées)", p: "Pour les verbes dérivés, le participe commence par مُـ mu- :", tbl: [["مُؤْمِن", "croyant (آمَنَ)"], ["مُسْلِم", "soumis à Dieu (أَسْلَمَ)"], ["مُحْسِن", "bienfaisant (أَحْسَنَ)"], ["مُشْرِك", "associateur (أَشْرَكَ)"], ["مُتَّقِي", "pieux (اتَّقَى)"]] },
      { h: "Mafʿûl : celui qui subit", p: "Le participe passif مَفْعُول désigne celui qui subit l'action : مَغْضُوب (objet de la colère, dans Al-Fâtiha), مَعْرُوف (connu, convenable), مَأْكُول (mangé, dans Al-Fîl)." },
      { h: "Afʿal : plus, le plus", p: "Le schème أَفْعَل forme le comparatif et le superlatif : أَكْبَر (plus grand — le takbîr اللَّهُ أَكْبَرُ), أَعْلَم (plus savant), أَكْثَر (plus nombreux, la plupart), أَحْسَن (meilleur, plus beau)." }
    ],
    ex: [["وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ", "et Allah aime les bienfaisants"], ["إِنَّ اللَّهَ لَا يَهْدِي الْقَوْمَ الظَّالِمِينَ", "Allah ne guide pas les gens injustes"], ["وَلٰكِنَّ أَكْثَرَ النَّاسِ لَا يَعْلَمُونَ", "mais la plupart des gens ne savent pas"], ["وَاللَّهُ أَعْلَمُ بِمَا يَكْتُمُونَ", "et Allah sait mieux ce qu'ils cachent"]],
    quiz: [
      { t: "mcq", q: "Sur le schème fâʿil, que signifie شَاكِر (racine ش ك ر, remercier) ?", o: ["reconnaissant", "remerciement", "il a remercié", "remercié"] },
      { t: "mcq", q: "مُسْلِم vient du verbe :", o: ["أَسْلَمَ (se soumettre)", "سَلِمَ (être sain)", "سَأَلَ (demander)", "مَسَّ (toucher)"] },
      { t: "mcq", q: "مَغْضُوب (al-maghḍûb) désigne :", o: ["celui qui subit la colère", "celui qui se met en colère", "la colère", "être en colère"] },
      { t: "mcq", q: "أَكْثَرُ النَّاسِ signifie :", o: ["la plupart des gens", "beaucoup de gens", "les gens nombreux", "tous les gens"] },
      { t: "mcq", q: "Dans اللَّهُ أَكْبَرُ, أَكْبَر est :", o: ["un superlatif : le plus grand", "un participe : grandissant", "un verbe : il a grandi", "un pluriel : les grands"] },
      { t: "order", ar: ["وَلٰكِنَّ", "أَكْثَرَ", "النَّاسِ", "لَا", "يَعْلَمُونَ"], fr: "Mais la plupart des gens ne savent pas" }
    ]
  },
  {
    id: "l28", unit: 7, title: "Lecture : Âyat al-Kursî", reading: true,
    goal: "Comprendre le plus grand verset du Coran, presque mot par mot.",
    read: [["kursi"]],
    theory: [
      { h: "Le plus grand verset du Coran", p: "Le Prophète ﷺ demanda à Ubayy ibn Kaʿb quel était le plus grand verset du Livre d'Allah ; il répondit : Âyat al-Kursî. Avec tout ce que vous avez appris, vous pouvez en comprendre presque chaque mot." },
      { h: "Ce que vous reconnaissez déjà", p: "لَا إِلٰهَ إِلَّا هُوَ (la négation exclusive) ; لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ (pronoms et prépositions) ; يَعْلَمُ (présent) ; مَنْ ذَا الَّذِي (question + relatif) ; بِإِذْنِهِ (préposition + nom + pronom)…" },
      { h: "Deux Noms majestueux", p: "الْحَيُّ : le Vivant, d'une vie parfaite et sans fin. الْقَيُّومُ : Celui qui subsiste par Lui-même et fait subsister toute chose (racine ق و م, se tenir debout, comme مُسْتَقِيم). Le verset se termine par الْعَلِيُّ الْعَظِيمُ : le Très-Haut, l'Immense." }
    ],
    ex: [["اللَّهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", "Allah, nulle divinité sauf Lui, le Vivant, Celui qui subsiste par Lui-même"], ["لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ", "ni somnolence ni sommeil ne Le saisissent"], ["وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ", "Son Siège englobe les cieux et la terre"]],
    quiz: [
      { t: "mcq", q: "مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ est :", o: ["une question rhétorique : nul n'intercède sans Sa permission", "une affirmation : tout le monde intercède", "un ordre d'intercéder", "une condition"] },
      { t: "mcq", q: "الْقَيُّوم partage sa racine avec :", o: ["مُسْتَقِيم (droit)", "قَلْب (cœur)", "قَوْل (parole)", "قَدِير (Omnipotent)"] },
      { t: "mcq", q: "Dans وَلَا يَئُودُهُ حِفْظُهُمَا, ـهُمَا désigne :", o: ["les deux : les cieux et la terre", "eux (pluriel)", "elle", "nous deux"] },
      { t: "order", ar: ["اللَّهُ", "لَا", "إِلٰهَ", "إِلَّا", "هُوَ", "الْحَيُّ", "الْقَيُّومُ"], fr: "Allah, nulle divinité sauf Lui, le Vivant, Celui qui subsiste par Lui-même" }
    ]
  }
];
