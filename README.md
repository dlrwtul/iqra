# Iqra — l’arabe du Coran

**Iqra** (اقْرَأْ, « Lis ! ») est un site simple et méthodique pour apprendre l’arabe
dans le but de **comprendre le Coran**. Séances courtes et chronométrées, exercices
variés, répétition espacée, lecture mot à mot des sourates récitées dans la prière.

> Les 261 mots du parcours couvrent **68,4 %** des 77 429 mots du texte coranique.
> Ce chiffre est calculé sur le Quranic Arabic Corpus, pas estimé.

## La méthode

| Principe | Mise en œuvre |
|---|---|
| **La fréquence d’abord** (Pareto) | Les mots sont choisis et ordonnés selon leur fréquence réelle dans le Coran. Chaque fiche affiche le nombre d’occurrences et le rang du mot. |
| **Répétition espacée** | Algorithme de type SM-2 (comme Anki) : chaque mot revient juste avant l’oubli (1 j, 3 j, 1 semaine, 1 mois…). |
| **Rappel actif** | Arabe → français, français → arabe, écoute, association, repérage du mot dans un vrai verset, remise en ordre. Une question ratée revient plus tard dans la séance. |
| **Racines et schèmes** | Une unité entière pour deviner le sens des mots à partir de la racine (فاعل، مفعول، فعيل، أفعل…). |
| **Input compréhensible** | Les versets d’exemple sont choisis automatiquement parmi les plus courts **et** ceux qui contiennent le plus de mots déjà appris à ce stade. |
| **Séances courtes et chronométrées** | Objectif quotidien (5 à 45 min), chronomètre d’étude active (il s’arrête en cas d’inactivité), série de jours, rappel de pause après 25 min, défi de 60 secondes. |
| **Maîtrise progressive** | 70 % minimum pour débloquer la leçon suivante (un mode libre existe dans les réglages). |

## Le parcours (28 leçons, 7 étapes)

1. **Al-Fâtiha, la porte d’entrée** : basmala, article, annexion, impératif, relatifs.
2. **Les petits mots** : prépositions, négations, liaisons, conditions. Lecture : *Al-ʿAṣr*.
3. **Les pronoms** : isolés, attachés, démonstratifs, questions. Lecture : *Al-Ikhlâṣ*.
4. **Le verbe au passé** : conjugaison, verbes piliers. Lectures : *Al-Kawthar*, *An-Naṣr*.
5. **Le présent et l’impératif** : préfixes, futur, ordres, interdictions. Lecture : *Al-Kâfirûn*.
6. **Les noms essentiels** : création, humanité, foi, au-delà, corps. Lecture : *Al-Falaq* et *An-Nâs*.
7. **Racines et schèmes** : familles de mots, Noms d’Allah, participes. Lecture : *Âyat al-Kursî*.

Chaque leçon (15 à 20 min) suit le même déroulé : **Comprendre** (explication courte)
→ **Mémoriser** (fiches avec audio, racine, fréquence, verset) → **S’exercer**
→ **Lire** (texte réel avec mot à mot) → **Bilan** (score, temps, progression de la compréhension).

### La séance du jour

L’accueil propose une séance guidée en trois étapes : **révisions** (≈ 5 min), **nouvelle leçon**
(≈ 10 min) et **lecture** d’une sourate étudiée (≈ 3 min). Le bouton « Démarrer » les enchaîne.

### Autres fonctions

- **Lecture** : Al-Fâtiha, Âyat al-Kursî et les sourates 97, 103, 105 à 114, avec glose
  mot à mot, traduction, récitation verset par verset et mot par mot, et le pourcentage
  de mots déjà connus. Toucher un mot affiche son sens, sa racine et sa fiche.
- **Mes mots** : lexique complet (recherche, filtres, tri par leçon ou par fréquence).
- **Défi chrono** et **entraînement libre**.
- **Hors ligne** (application installable, PWA). L’audio nécessite une connexion.
- Thème clair/sombre, taille du texte arabe réglable, translittération optionnelle.
- Progression enregistrée dans le navigateur, avec export et import en fichier JSON.

## Lancer le site

Le site est **100 % statique** : HTML, CSS et JavaScript, sans framework ni étape de compilation.

```bash
# en local
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

Ouvrir directement `index.html` fonctionne aussi. Pour publier le site, n’importe quel
hébergement statique convient (GitHub Pages, Netlify, Cloudflare Pages…). Avec GitHub Pages :
*Settings → Pages → Deploy from a branch*, puis choisir la branche et le dossier `/ (root)`.

## Structure

```
index.html                 page unique
assets/css/app.css         styles (mobile d’abord, clair/sombre)
assets/js/core.js          utilitaires, stockage, répétition espacée, audio, chronomètre
assets/js/ui.js            composants (fiches, versets, feuilles, notifications)
assets/js/exercises.js     génération et déroulé des exercices
assets/js/views-main.js    accueil, parcours, lexique, méthode, réglages
assets/js/views-study.js   leçon, révisions, entraînement, défi chrono, lecture
assets/js/app.js           routeur et démarrage
assets/js/data/lessons.js  contenu pédagogique (écrit à la main)
assets/js/data/vocab.js    vocabulaire + fréquences       (généré)
assets/js/data/quran.js    textes, gloses, versets         (généré)
tools/vocab.txt            source du vocabulaire
tools/reader.txt           gloses mot à mot et traductions
tools/build_data.py        génère les fichiers de données à partir du corpus
sw.js, manifest.webmanifest  mode hors ligne / installation
```

### Modifier le contenu

- **Explications et exercices de grammaire** : `assets/js/data/lessons.js`.
- **Vocabulaire** : `tools/vocab.txt` (un mot par ligne, rattaché à une leçon), puis
  `python3 tools/build_data.py`. Le script télécharge le corpus (≈ 6 Mo, dans `tools/.cache/`),
  vérifie chaque lemme, recalcule fréquences et couverture, et choisit les versets d’exemple.
- **Textes de lecture** : `tools/reader.txt`, puis relancer le script, qui vérifie
  qu’il y a une glose par mot.
- Après une modification, incrémenter `CACHE` dans `sw.js` pour que les utilisateurs
  hors ligne reçoivent la nouvelle version.

## Sources et crédits

- Texte coranique (écriture uthmanie) et morphologie : [Quranic Arabic Corpus](https://corpus.quran.com)
  (Université de Leeds), d’après le texte de [Tanzil](https://tanzil.net), via
  [mustafa0x/quran-morphology](https://github.com/mustafa0x/quran-morphology).
- Récitations des versets : [EveryAyah](https://everyayah.com). Récitation mot à mot : [Quran.com](https://quran.com).
- Polices : Amiri et Amiri Quran (Khaled Hosny), Inter (Google Fonts).

Les gloses et les traductions en français sont des **traductions indicatives du sens**,
écrites pour l’apprentissage. Elles ne remplacent ni une traduction de référence ni l’exégèse (tafsîr).
