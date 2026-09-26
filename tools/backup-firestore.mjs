// Backup do banco do Grimório (Firestore) em um arquivo JSON.
// Usa a API pública do Firestore com a mesma chave do site: só lê o que as regras deixam qualquer um ler
// (mundos e campanhas). A lista de editores (config/editors) é privada e não entra no backup.
// Uso: node tools/backup-firestore.mjs <arquivo-de-saída.json>
import { readFileSync, writeFileSync } from 'node:fs';

const cfgText = readFileSync(new URL('../grimorio/firebase-config.js', import.meta.url), 'utf8');
const pick = k => (cfgText.match(new RegExp(k + '\\s*:\\s*"([^"]+)"')) || [])[1];
const PROJECT = pick('projectId'), KEY = pick('apiKey');
if (!PROJECT || !KEY) { console.error('Não achei projectId/apiKey em grimorio/firebase-config.js'); process.exit(1); }
const BASE = process.env.FIRESTORE_BASE || 'https://firestore.googleapis.com/v1';
const ROOT = `${BASE}/projects/${PROJECT}/databases/(default)/documents`;

// converte o formato de valores da API REST para JSON comum
function val(v) {
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue' in v) return null;
  if ('timestampValue' in v) return v.timestampValue;
  if ('mapValue' in v) return fields(v.mapValue.fields || {});
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(val);
  if ('referenceValue' in v) return v.referenceValue;
  if ('geoPointValue' in v) return v.geoPointValue;
  if ('bytesValue' in v) return v.bytesValue;
  return null;
}
const fields = f => Object.fromEntries(Object.entries(f).map(([k, v]) => [k, val(v)]));

async function list(path) {
  const out = []; let token = '';
  do {
    const url = `${ROOT}/${path}?key=${KEY}&pageSize=300${token ? '&pageToken=' + encodeURIComponent(token) : ''}`;
    let res;
    for (let i = 0; i < 3; i++) { res = await fetch(url); if (res.ok || res.status < 500) break; await new Promise(r => setTimeout(r, 2000 * (i + 1))); }
    if (!res.ok) throw new Error(`Falha ao ler ${path}: HTTP ${res.status} ${await res.text()}`);
    const body = await res.json();
    for (const d of body.documents || []) out.push({ id: d.name.split('/').pop(), ...fields(d.fields || {}) });
    token = body.nextPageToken || '';
  } while (token);
  return out;
}

const backup = { app: 'grimorio', version: 2, kind: 'backup-firestore', exportedAt: new Date().toISOString(), worlds: [], campaigns: [] };
for (const w of await list('worlds')) {
  const e = { world: w };
  for (const k of ['places', 'lore', 'map']) e[k] = await list(`worlds/${w.id}/${k}`);
  backup.worlds.push(e);
}
for (const c of await list('campaigns')) {
  const e = { campaign: c };
  for (const k of ['npcs', 'sessions', 'notes', 'placeNotes']) e[k] = await list(`campaigns/${c.id}/${k}`);
  backup.campaigns.push(e);
}
if (!backup.worlds.length && !backup.campaigns.length) {
  console.error('O banco veio vazio. O backup não foi salvo, para não substituir backups bons.');
  process.exit(1);
}
writeFileSync(process.argv[2] || 'backup.json', JSON.stringify(backup));
const n = backup.worlds.reduce((t, e) => t + e.places.length + e.lore.length, 0) + backup.campaigns.reduce((t, e) => t + e.npcs.length + e.sessions.length + e.notes.length, 0);
console.log(`Backup ok: ${backup.worlds.length} mundo(s), ${backup.campaigns.length} campanha(s), ${n} registros.`);
