// Lê a planilha da TimelineJS de Ethrü e grava data/linha-do-tempo.json (no mesmo formato que o app usa).
// Só reescreve o arquivo se as eras ou os eventos mudaram.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const FONTES = {
  ethru: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQHD428pa4oqo41M77PMC4QSwPNp1sKxdv0os-PjkyURgTCnHuJYyFZ-lFEVY3AbMXO8u-Fy06iVQ_A/pub?output=csv'
};
const ARQ = new URL('../data/linha-do-tempo.json', import.meta.url);

const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const yearNum = y => { const m = String(y ?? '').match(/-?\d+/); return m ? +m[0] : null; };
function parseCSV(t) {
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"') { if (t[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && t[i + 1] === '\n') i++; row.push(cur); rows.push(row); row = []; cur = ''; }
    else cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows;
}
function timelineFromCSV(text) {
  const [head, ...rows] = parseCSV(text); if (!head) return null;
  const col = n => head.findIndex(h => norm(h) === norm(n));
  const C = {y: col('Year'), ey: col('End Year'), dd: col('Display Date'), h: col('Headline'), t: col('Text'), m: col('Media'), mc: col('Media Credit'), cap: col('Media Caption'), ty: col('Type'), g: col('Group')};
  if (C.y < 0 || C.h < 0) return null;
  const tl = {title: '', eras: [], events: []};
  for (const r of rows) {
    const g = i => i >= 0 ? (r[i] || '').trim() : '';
    const y = yearNum(g(C.y)); if (y == null && !g(C.h)) continue;
    const ey = yearNum(g(C.ey)) ?? y, type = norm(g(C.ty));
    const it = {year: y, endYear: ey, display: g(C.dd), headline: g(C.h), text: g(C.t), media: g(C.m), credit: g(C.mc), caption: g(C.cap), group: g(C.g)};
    if (type === 'title') tl.title = it.headline; else if (type === 'era') tl.eras.push(it); else tl.events.push(it);
  }
  const byYear = (a, b) => a.year - b.year || a.endYear - b.endYear;
  tl.eras.sort(byYear); tl.events.sort(byYear);
  return tl;
}

const atual = existsSync(ARQ) ? JSON.parse(readFileSync(ARQ, 'utf8')) : {};
const novo = {...atual};
for (const [mundo, url] of Object.entries(FONTES)) {
  const res = await fetch(url, {redirect: 'follow'});
  if (!res.ok) throw new Error(`Falha ao ler a planilha de ${mundo}: HTTP ${res.status}`);
  const tl = timelineFromCSV(await res.text());
  if (!tl || (!tl.eras.length && !tl.events.length)) throw new Error(`A planilha de ${mundo} veio vazia ou num formato inesperado; nada foi alterado.`);
  novo[mundo] = {...tl, url: 'repositório'};
  console.log(`${mundo}: ${tl.eras.length} eras, ${tl.events.length} eventos`);
}
const sem = o => JSON.stringify(o);
if (sem(novo) === sem(atual)) console.log('Nada mudou na linha do tempo.');
else { writeFileSync(ARQ, JSON.stringify(novo, null, 1) + '\n'); console.log('data/linha-do-tempo.json atualizado.'); }
