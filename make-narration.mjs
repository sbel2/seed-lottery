// Generates the narration clips for index.html with ElevenLabs.
//
//   $env:ELEVENLABS_API_KEY = "..."          (PowerShell)
//   node make-narration.mjs                  generate any missing clips into audio/
//   node make-narration.mjs --dry            just print the lines, no API calls
//   node make-narration.mjs --force          regenerate every clip
//
// Optional: $env:ELEVENLABS_VOICE_ID (default: VOICE below, "Liam").
//
// It runs the page's own simulation (<script id="core"> and <script id="lines">) so the spoken
// numbers match the page exactly. Each clip is saved as audio/<hash of the line>.mp3; the page
// plays a clip if it exists for the line on screen and falls back to the browser's voice if not.

// Voice and pace. Brian: nPczCjzI2devNBz1zQrb · Liam: TX3LPaxmHKxFdv7VOQHJ · Will: bIHbv24MWmeRgasZH58o · Chris: iP95p4xoKVk53GoZ742B
const VOICE = 'TX3LPaxmHKxFdv7VOQHJ', SPEED = 1.0;   // speed: 0.7 to 1.2

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const grab = id => {
  const m = html.match(new RegExp('<script id="' + id + '">([\\s\\S]*?)</script>'));
  if (!m) throw new Error('index.html has no <script id="' + id + '">');
  return m[1];
};

const ctx = vm.createContext({});
const lines = vm.runInContext(grab('core') + '\n' + grab('lines') + `
;(() => {
  const Wd = makeWorld(), curves = [];
  for (let i = 0; i < N; i++) curves.push(runCurve(Wd, i));
  return Object.values(LINES(computeStats(curves, Wd.order1))).map(t => ({ text: t, hash: lineHash(t) }));
})()`, ctx);

const dry = process.argv.includes('--dry'), force = process.argv.includes('--force');
const outDir = path.join(dir, 'audio');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'lines.json'), JSON.stringify(lines, null, 2));

if (dry) {
  lines.forEach((l, i) => console.log(String(i + 1).padStart(2) + '  ' + l.hash + '  ' + l.text));
  console.log('\n' + lines.length + ' lines, ' + lines.reduce((s, l) => s + l.text.length, 0) + ' characters.');
  process.exit(0);
}

// Key: the environment, or a line ELEVENLABS_API_KEY=sk_... in a .env file next to this script.
let key = (process.env.ELEVENLABS_API_KEY || '').trim();
const envFile = path.join(dir, '.env');
if (!key && fs.existsSync(envFile)) { const m = fs.readFileSync(envFile, 'utf8').match(/^\s*ELEVENLABS_API_KEY\s*=\s*["']?([^"'\s]+)/m); if (m) key = m[1]; }
if (!key) { console.error('No key. Either run  $env:ELEVENLABS_API_KEY = "sk_..."  in this same PowerShell window,\nor put  ELEVENLABS_API_KEY=sk_...  in seed-lottery/.env'); process.exit(1); }
const envVoice = fs.existsSync(envFile) && fs.readFileSync(envFile, 'utf8').match(/^\s*ELEVENLABS_VOICE_ID\s*=\s*["']?([^"'\s]+)/m);
const voice = process.env.ELEVENLABS_VOICE_ID || (envVoice && envVoice[1]) || VOICE;
if (/^paste_/.test(key)) { console.error('Replace paste_your_key_here in seed-lottery/.env with your ElevenLabs key.'); process.exit(1); }

// Spoken form only: subtitles keep the numerals, the voice gets words it can't misread.
const SAY = [[/\b2020\b/g, 'twenty twenty'], [/\b2,100\b/g, 'two thousand one hundred']];
const speak = t => t && SAY.reduce((s, [re, w]) => s.replace(re, w), t);

// audio/trims.js holds where the speech starts and ends in each clip (window.TRIMS = { hash: [startSec, endSec] }),
// measured from the audio by measure-trims.html. The page uses it to skip ElevenLabs' padding silence even when opened
// as a file. A regenerated clip's entry is dropped here; re-measure afterwards (see README).
const trimFile = path.join(outDir, 'trims.js');
const trims = {};
if (fs.existsSync(trimFile)) { try { Object.assign(trims, JSON.parse(fs.readFileSync(trimFile, 'utf8').replace(/^[^{]*/, '').replace(/;\s*$/, ''))); } catch (e) {} }
const saveTrims = () => {
  const keep = {}; lines.forEach(l => { if (trims[l.hash]) keep[l.hash] = trims[l.hash]; });
  fs.writeFileSync(trimFile, 'window.TRIMS = ' + JSON.stringify(keep) + ';\n');
};

let made = 0;
for (let i = 0; i < lines.length; i++) {
  const { text, hash } = lines[i], file = path.join(outDir, hash + '.mp3');
  if (!force && fs.existsSync(file)) { console.log('have  ' + text); continue; }
  const res = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voice + '?output_format=mp3_44100_128', {
    method: 'POST',
    headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify({
      text: speak(text),
      model_id: 'eleven_multilingual_v2',
      previous_text: i > 0 ? speak(lines[i - 1].text) : undefined,
      next_text: i < lines.length - 1 ? speak(lines[i + 1].text) : undefined,
      voice_settings: { stability: 0.35, similarity_boost: 0.8, style: 0.6, use_speaker_boost: true, speed: SPEED },
    }),
  });
  if (!res.ok) {
    const body = (await res.text()).slice(0, 400);
    console.error('\nElevenLabs error ' + res.status + ': ' + body);
    if (/missing_permissions/.test(body)) console.error('-> This key is restricted. In ElevenLabs > Developers > API keys, edit the key and set "Text to Speech" to Access.');
    else if (res.status === 401) console.error('-> Key rejected. Copy it again (no quotes or spaces), or the free tier may be blocked ("unusual activity", often from a VPN).');
    else if (res.status === 402 || /quota/.test(body)) console.error('-> Out of credits. The whole script is about 600 characters.');
    else if (res.status === 404) console.error('-> Voice not found. Unset ELEVENLABS_VOICE_ID or use a voice in your library.');
    console.error('Clips made so far are kept; run again to continue.');
    process.exit(1);
  }
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  delete trims[hash]; saveTrims(); made++; console.log('made  ' + text);
}
saveTrims();
console.log('\nDone: ' + made + ' new clip(s) in ' + outDir);
