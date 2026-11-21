#!/usr/bin/env python3
"""Génère les données du site (assets/js/data/*.js) à partir :
  - du Quranic Arabic Corpus (morphologie, texte uthmani) ;
  - de tools/vocab.txt (vocabulaire du parcours) ;
  - de tools/reader.txt (gloses mot à mot + traductions).

Usage : python3 tools/build_data.py [chemin/vers/quran-morphology.txt]
Sans argument, le fichier est téléchargé dans tools/.cache/.
"""
import collections
import json
import os
import re
import sys
import unicodedata
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOOLS = os.path.join(ROOT, 'tools')
OUT = os.path.join(ROOT, 'assets', 'js', 'data')
CORPUS_URL = 'https://raw.githubusercontent.com/mustafa0x/quran-morphology/master/quran-morphology.txt'

SURAH_NAMES = """Al-Fâtiha|Al-Baqara|Âl ʿImrân|An-Nisâʾ|Al-Mâʾida|Al-Anʿâm|Al-Aʿrâf|Al-Anfâl|At-Tawba|Yûnus|Hûd|Yûsuf|Ar-Raʿd|Ibrâhîm|Al-Ḥijr|An-Naḥl|Al-Isrâʾ|Al-Kahf|Maryam|Ṭâ-Hâ|Al-Anbiyâʾ|Al-Ḥajj|Al-Muʾminûn|An-Nûr|Al-Furqân|Ash-Shuʿarâʾ|An-Naml|Al-Qaṣaṣ|Al-ʿAnkabût|Ar-Rûm|Luqmân|As-Sajda|Al-Aḥzâb|Sabaʾ|Fâṭir|Yâ-Sîn|Aṣ-Ṣâffât|Ṣâd|Az-Zumar|Ghâfir|Fuṣṣilat|Ash-Shûrâ|Az-Zukhruf|Ad-Dukhân|Al-Jâthiya|Al-Aḥqâf|Muḥammad|Al-Fatḥ|Al-Ḥujurât|Qâf|Adh-Dhâriyât|Aṭ-Ṭûr|An-Najm|Al-Qamar|Ar-Raḥmân|Al-Wâqiʿa|Al-Ḥadîd|Al-Mujâdila|Al-Ḥashr|Al-Mumtaḥana|Aṣ-Ṣaff|Al-Jumuʿa|Al-Munâfiqûn|At-Taghâbun|Aṭ-Ṭalâq|At-Taḥrîm|Al-Mulk|Al-Qalam|Al-Ḥâqqa|Al-Maʿârij|Nûḥ|Al-Jinn|Al-Muzzammil|Al-Muddaththir|Al-Qiyâma|Al-Insân|Al-Mursalât|An-Nabaʾ|An-Nâziʿât|ʿAbasa|At-Takwîr|Al-Infiṭâr|Al-Muṭaffifîn|Al-Inshiqâq|Al-Burûj|Aṭ-Ṭâriq|Al-Aʿlâ|Al-Ghâshiya|Al-Fajr|Al-Balad|Ash-Shams|Al-Layl|Aḍ-Ḍuḥâ|Ash-Sharḥ|At-Tîn|Al-ʿAlaq|Al-Qadr|Al-Bayyina|Az-Zalzala|Al-ʿÂdiyât|Al-Qâriʿa|At-Takâthur|Al-ʿAṣr|Al-Humaza|Al-Fîl|Quraysh|Al-Mâʿûn|Al-Kawthar|Al-Kâfirûn|An-Naṣr|Al-Masad|Al-Ikhlâṣ|Al-Falaq|An-Nâs""".split('|')
assert len(SURAH_NAMES) == 114

PRON_RE = re.compile(r'^[123](MS|FS|MP|FP|D|MD|FD|S|P)$')
DIACRITICS = re.compile('[ً-ٰٟۖ-ۭـ]')


def nfc(s):
    return unicodedata.normalize('NFC', s)


def loose(s):
    s = DIACRITICS.sub('', nfc(s))
    return s.replace('ٱ', 'ا').replace('ى', 'ي').replace('أ', 'ا').replace('إ', 'ا').replace('آ', 'ا')


# ---------------------------------------------------------------- corpus
def load_corpus(path):
    words = collections.OrderedDict()
    with open(path, encoding='utf-8') as f:
        for line in f:
            line = line.rstrip('\n')
            if not line or line.startswith('#'):
                continue
            loc, form, pos, feat = line.split('\t')
            s, v, w, _ = map(int, loc.split(':'))
            feats = [nfc(x) for x in feat.split('|')]
            words.setdefault((s, v, w), []).append((nfc(form), pos, feats))
    return words


def lem_of(feats):
    return next((f[4:] for f in feats if f.startswith('LEM:')), None)


def root_of(feats):
    return next((f[5:] for f in feats if f.startswith('ROOT:')), None)


def is_pref(feats):
    return 'PREF' in feats


def is_suff(feats):
    return 'SUFF' in feats


def stem(segs):
    for seg in segs:
        if not is_pref(seg[2]) and not is_suff(seg[2]):
            return seg
    return segs[0]


def stem_lemma(segs):
    st = stem(segs)
    lem = lem_of(st[2])
    if lem is None and 'PRON' in st[2]:
        p = next((f for f in st[2] if PRON_RE.match(f)), '?')
        lem = 'PRON:' + p
    return lem


def dem_kind(segs):
    """Distingue les démonstratifs : proche (هٰذا…), pluriel lointain (أولٰئك), lointain (ذٰلك…)."""
    has_att = any(is_pref(s[2]) and 'ATT' in s[2] for s in segs)
    if has_att:
        return 'near'
    st = stem(segs)
    has_far = any(is_suff(s[2]) and ('ADDR' in s[2] or 'DIST' in s[2]) for s in segs)
    if 'P' in st[2] and has_far:
        return 'plfar'
    return 'far'


AFFIX_RULES = {
    'al': lambda f: lem_of(f) == 'ال',
    'wa': lambda f: lem_of(f) == 'و',
    'bi': lambda f: lem_of(f) == 'ب',
    'li': lambda f: lem_of(f) == 'ل' and 'EMPH' not in f,
    'la': lambda f: lem_of(f) == 'ل' and 'EMPH' in f,
    'fa': lambda f: lem_of(f) == 'ف',
    'ka': lambda f: lem_of(f) == 'ك',
    'a': lambda f: lem_of(f) == 'أ' and 'INTG' in f,
    'ya': lambda f: 'VOC' in f,
    'sa': lambda f: 'FUT' in f,
}


def suffix_person(segs, i):
    """Renvoie la personne d'un pronom suffixe complément/possessif (pas les suffixes sujets des verbes)."""
    form, pos, feats = segs[i]
    if not (is_suff(feats) and 'PRON' in feats):
        return None
    p = next((f for f in feats if PRON_RE.match(f)), None)
    bare = DIACRITICS.sub('', form)
    if not p:
        return None
    if p.startswith('3') and bare.startswith('ه'):
        return {'3MS': '3MS', '3FS': '3FS', '3MP': '3MP'}.get(p)
    if p in ('2MS', '2MP') and bare.startswith('ك'):
        return p
    if p == '1S' and bare in ('ي', 'ى', 'ىَ', 'يَ'):
        return '1S'
    if p == '1P' and bare.startswith('نا'):
        prev = segs[i - 1] if i > 0 else None
        if prev and prev[1] == 'V' and 'PERF' in prev[2]:
            return None  # فَعَلْنَا : suffixe sujet
        return '1P'
    return None


# ---------------------------------------------------------------- sources
def parse_vocab(path):
    items, lesson = [], None
    with open(path, encoding='utf-8') as f:
        for raw in f:
            line = raw.strip()
            if not line or line.startswith('#'):
                continue
            if line.startswith('@'):
                lesson = line[1:].strip()
                continue
            parts = [p.strip() for p in line.split('|')]
            while len(parts) < 6:
                parts.append('')
            iid, ar, tr, fr, lem, note = parts[:6]
            items.append(dict(id=iid, ar=nfc(ar), tr=tr, fr=fr, lem=lem, note=note, lesson=lesson))
    ids = [i['id'] for i in items]
    dup = [x for x, c in collections.Counter(ids).items() if c > 1]
    if dup:
        sys.exit('Identifiants en double : %s' % dup)
    return items


def parse_reader(path):
    passages, cur = [], None
    with open(path, encoding='utf-8') as f:
        for raw in f:
            line = raw.strip()
            if not line or line.startswith('#'):
                continue
            if line.startswith('='):
                pid, s, rng, name, meaning, ar, intro = [p.strip() for p in line[1:].split('|')]
                a, b = map(int, rng.split('-'))
                cur = dict(id=pid, s=int(s), a=a, b=b, name=name, meaning=meaning, ar=nfc(ar), intro=intro, tr={}, gl={})
                passages.append(cur)
                continue
            m = re.match(r'^(\d+):(\d+)\s*([=~])\s*(.*)$', line)
            if not m:
                sys.exit('Ligne illisible dans reader.txt : ' + line)
            v = int(m.group(2))
            if m.group(3) == '=':
                cur['tr'][v] = m.group(4)
            else:
                cur['gl'][v] = [g.strip() for g in m.group(4).split('|')]
    return passages


# ---------------------------------------------------------------- build
def main():
    path = sys.argv[1] if len(sys.argv) > 1 else os.path.join(TOOLS, '.cache', 'quran-morphology.txt')
    if not os.path.exists(path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        print('Téléchargement du corpus…')
        urllib.request.urlretrieve(CORPUS_URL, path)
    words = load_corpus(path)
    total = len(words)
    vocab = parse_vocab(os.path.join(TOOLS, 'vocab.txt'))
    passages = parse_reader(os.path.join(TOOLS, 'reader.txt'))
    lesson_order = []
    for it in vocab:
        if it['lesson'] not in lesson_order:
            lesson_order.append(it['lesson'])
    lesson_idx = {l: i for i, l in enumerate(lesson_order)}

    # --- index des lemmes
    lemma_count = collections.Counter(stem_lemma(segs) for segs in words.values())
    lemma_root = {}
    for segs in words.values():
        lem = stem_lemma(segs)
        if lem not in lemma_root:
            lemma_root[lem] = root_of(stem(segs)[2])
    by_loose = collections.defaultdict(list)
    for lem in lemma_count:
        if lem:
            by_loose[loose(lem)].append(lem)
    ranked = [l for l, _ in lemma_count.most_common()]
    rank_of = {l: i + 1 for i, l in enumerate(ranked)}

    def resolve(lem):
        lem = nfc(lem)
        if lem in lemma_count:
            return lem
        c = by_loose.get(loose(lem), [])
        if len(c) == 1:
            return c[0]
        sys.exit('Lemme introuvable ou ambigu : %r -> %r' % (lem, c))

    lem_map = {}      # lemme -> id (ou dict pour DEM)
    affix_items, suff_items = {}, {}
    for it in vocab:
        spec = it['lem']
        if spec.startswith('AFX:'):
            it['kind'] = 'affix'
            affix_items[spec[4:]] = it['id']
            continue
        if spec.startswith('SUFF:'):
            it['kind'] = 'suffix'
            suff_items[spec[5:]] = it['id']
            continue
        it['kind'] = 'word'
        if spec.startswith('DEM:'):
            key = resolve('ذا')
            lem_map.setdefault(key, {})[spec[4:]] = it['id']
            it['lemmas'] = [key]
            continue
        lems = []
        for l in spec.split(','):
            l = l.strip()
            r = l if l.startswith('PRON:') else resolve(l)
            if r in lem_map:
                sys.exit('Lemme %s utilisé deux fois (%s, %s)' % (r, lem_map[r], it['id']))
            lem_map[r] = it['id']
            lems.append(r)
        it['lemmas'] = lems

    # --- passage sur tout le corpus
    token_item = {}
    counts = collections.Counter()
    occ = collections.defaultdict(list)   # id -> [(s, v, w)]
    verse_tokens = collections.defaultdict(list)
    for key, segs in words.items():
        s, v, w = key
        verse_tokens[(s, v)].append(key)
        lem = stem_lemma(segs)
        target = lem_map.get(lem)
        if isinstance(target, dict):
            target = target.get(dem_kind(segs))
        if target:
            token_item[key] = target
            counts[target] += 1
            occ[target].append(key)
        for i, (form, pos, feats) in enumerate(segs):
            if is_pref(feats):
                for name, rule in AFFIX_RULES.items():
                    if name in affix_items and rule(feats):
                        counts[affix_items[name]] += 1
                        occ[affix_items[name]].append(key)
                        break
            elif is_suff(feats):
                p = suffix_person(segs, i)
                if p and p in suff_items:
                    counts[suff_items[p]] += 1
                    occ[suff_items[p]].append(key)

    vocab_by_id = {it['id']: it for it in vocab}
    reader_verses = set()
    for p in passages:
        for v in range(p['a'], p['b'] + 1):
            reader_verses.add((p['s'], v))

    def verse_text(sv):
        return [''.join(seg[0] for seg in words[k]) for k in verse_tokens[sv]]

    # --- versets d'exemple : courts, avec le plus de mots déjà connus (input compréhensible)
    used_verses = set()
    for it in vocab:
        li = lesson_idx[it['lesson']]
        cands = {}
        for key in occ.get(it['id'], []):
            sv = key[:2]
            if sv in cands:
                continue
            toks = verse_tokens[sv]
            n = len(toks)
            in_reader = sv in reader_verses
            known = sum(1 for k in toks if k in token_item and lesson_idx[vocab_by_id[token_item[k]]['lesson']] <= li)
            ratio = known / n
            eff = min(n, 12) if in_reader else n
            score = ratio * 4 - max(0, eff - 9) * 0.22 - (1.5 if n < 3 else 0) + (0.8 if in_reader else 0)
            if n > 22 and not in_reader:
                score -= 20  # verset trop long : seulement en dernier recours
            cands[sv] = (score, key[2])
        best = sorted(cands.items(), key=lambda x: (-x[1][0], x[0]))[:2]
        it['ex'] = ['%d:%d:%d' % (sv[0], sv[1], w) for sv, (_, w) in best]
        for sv, _ in best:
            used_verses.add(sv)

    # --- sortie vocabulaire
    out_vocab = []
    missing = []
    for it in vocab:
        n = counts.get(it['id'], 0)
        if n == 0:
            missing.append(it['id'])
        root = None
        rank = None
        if it['kind'] == 'word':
            roots = [lemma_root.get(l) for l in it['lemmas'] if lemma_root.get(l)]
            root = roots[0] if roots else None
            if len(it['lemmas']) == 1 and not it['lemmas'][0].startswith('PRON:') and 'DEM' not in it['lem']:
                rank = rank_of.get(it['lemmas'][0])
        d = dict(id=it['id'], ar=it['ar'], tr=it['tr'], fr=it['fr'], l=it['lesson'], k=it['kind'][0], n=n)
        if root:
            d['r'] = ' '.join(root)
        if rank:
            d['rk'] = rank
        if it['note']:
            d['note'] = it['note']
        if it['ex']:
            d['ex'] = it['ex']
        out_vocab.append(d)
    if missing:
        print('ATTENTION — aucune occurrence pour :', missing)

    # --- textes de lecture
    out_reader = []
    for p in passages:
        verses = []
        for v in range(p['a'], p['b'] + 1):
            sv = (p['s'], v)
            toks = verse_tokens[sv]
            gl = p['gl'].get(v)
            if gl is None or len(gl) != len(toks):
                sys.exit('Gloses %d:%d : %s mots attendus, %s fournis\n%s' % (
                    p['s'], v, len(toks), None if gl is None else len(gl), ' | '.join(verse_text(sv))))
            ws = []
            for k, g in zip(toks, gl):
                segs = words[k]
                r = root_of(stem(segs)[2])
                ws.append([''.join(seg[0] for seg in segs), g, token_item.get(k, ''), ' '.join(r) if r else ''])
            verses.append(dict(v=v, w=ws, t=p['tr'][v]))
            used_verses.discard(sv)
        out_reader.append(dict(id=p['id'], s=p['s'], name=p['name'], meaning=p['meaning'], ar=p['ar'],
                               intro=p['intro'], verses=verses))

    out_verses = {}
    for sv in sorted(used_verses):
        out_verses['%d:%d' % sv] = [[''.join(seg[0] for seg in words[k]), token_item.get(k, '')] for k in verse_tokens[sv]]

    # --- statistiques
    word_items = [it for it in vocab if it['kind'] == 'word']
    covered = sum(counts.get(it['id'], 0) for it in word_items)
    stats = dict(tokens=total, lemmas=len(lemma_count), roots=len(set(r for r in lemma_root.values() if r)),
                 covered=covered, words=len(word_items))
    print('Mots du corpus : %d — vocabulaire : %d éléments (%d mots pleins) — couverture : %.1f %%' % (
        total, len(vocab), len(word_items), 100 * covered / total))

    os.makedirs(OUT, exist_ok=True)
    head = '/* Fichier généré par tools/build_data.py — ne pas modifier à la main. */\n'
    with open(os.path.join(OUT, 'vocab.js'), 'w', encoding='utf-8') as f:
        f.write(head)
        f.write('window.IQRA = window.IQRA || {};\n')
        f.write('IQRA.stats = %s;\n' % json.dumps(stats, ensure_ascii=False))
        f.write('IQRA.vocab = [\n%s\n];\n' % ',\n'.join(json.dumps(d, ensure_ascii=False) for d in out_vocab))
    with open(os.path.join(OUT, 'quran.js'), 'w', encoding='utf-8') as f:
        f.write(head)
        f.write('window.IQRA = window.IQRA || {};\n')
        f.write('IQRA.surahs = %s;\n' % json.dumps(SURAH_NAMES, ensure_ascii=False))
        f.write('IQRA.reader = [\n%s\n];\n' % ',\n'.join(json.dumps(p, ensure_ascii=False) for p in out_reader))
        f.write('IQRA.verses = {\n%s\n};\n' % ',\n'.join(
            '%s:%s' % (json.dumps(k), json.dumps(v, ensure_ascii=False)) for k, v in out_verses.items()))
    print('Écrit :', os.path.relpath(OUT, ROOT), '(vocab.js, quran.js)')


if __name__ == '__main__':
    main()
