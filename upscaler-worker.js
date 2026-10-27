/**
 * MINAMI AI Upscale – Cloudflare Worker
 *
 * Settings (Cloudflare dashboard → your Worker → Settings → Variables and Secrets):
 *   REPLICATE_API_TOKEN  (Secret)  your Replicate API token
 *   FIREBASE_PROJECT_ID  (Text)    creoverse-stock
 *   ALLOWED_ORIGIN       (Text)    your website, e.g. https://yoursite.com  (use * only for testing)
 *   USAGE                (KV, optional) KV namespace to cap PRO usage per day
 *   DAILY_PRO_CAP        (Text, optional) default 200 images per PRO user per day (needs USAGE KV)
 */

const MODEL_VERSION = '42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b'; // nightmareai/real-esrgan
const JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
const MAX_DATA_URL = 2_500_000;   // max request image size (characters)
const MAX_SCALE = 8;

export default {
  async fetch(req, env) {
    const cors = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Vary': 'Origin'
    };
    const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

    try {
      // 1) who is the user?
      const idToken = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
      if (!idToken) return json({ error: 'Please log in' }, 401);
      let uid;
      try { uid = await verifyFirebaseToken(idToken, env.FIREBASE_PROJECT_ID); }
      catch (e) { return json({ error: 'Login expired, refresh the page' }, 401); }

      // 2) is the user PRO?
      if (!(await isPro(uid, idToken, env.FIREBASE_PROJECT_ID))) return json({ error: 'PRO subscription required' }, 403);

      // 3) validate input
      const body = await req.json().catch(() => ({}));
      const image = body.image;
      const scale = Math.max(2, Math.min(MAX_SCALE, Math.round(+body.scale || 4)));
      if (typeof image !== 'string' || !image.startsWith('data:image/') || image.length > MAX_DATA_URL) return json({ error: 'Invalid or too large image' }, 400);

      // 4) optional daily cap for PRO users (protects your Replicate bill)
      if (env.USAGE) {
        const cap = +env.DAILY_PRO_CAP || 200;
        const key = `u:${uid}:${new Date().toISOString().slice(0, 10)}`;
        const n = +(await env.USAGE.get(key)) || 0;
        if (n >= cap) return json({ error: 'Daily AI limit reached, try tomorrow' }, 429);
        await env.USAGE.put(key, String(n + 1), { expirationTtl: 172800 });
      }

      // 5) run Real-ESRGAN on Replicate
      let pred = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + env.REPLICATE_API_TOKEN, 'Content-Type': 'application/json', Prefer: 'wait=60' },
        body: JSON.stringify({ version: MODEL_VERSION, input: { image, scale, face_enhance: false } })
      }).then(r => r.json());

      const t0 = Date.now();
      while (pred && (pred.status === 'starting' || pred.status === 'processing') && Date.now() - t0 < 110000) {
        await new Promise(r => setTimeout(r, 1500));
        pred = await fetch(pred.urls.get, { headers: { Authorization: 'Bearer ' + env.REPLICATE_API_TOKEN } }).then(r => r.json());
      }
      if (!pred || pred.status !== 'succeeded' || !pred.output) return json({ error: 'AI could not process this image' }, 502);

      // 6) send the image back
      const out = await fetch(Array.isArray(pred.output) ? pred.output[0] : pred.output);
      if (!out.ok) return json({ error: 'Could not fetch AI result' }, 502);
      return new Response(out.body, { headers: { ...cors, 'Content-Type': out.headers.get('Content-Type') || 'image/png' } });
    } catch (e) {
      return json({ error: 'Server error' }, 500);
    }
  }
};

/* ---------- Firebase ID token verification (RS256) ---------- */
const b64uToBytes = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=')), c => c.charCodeAt(0));
const b64uToJson = s => JSON.parse(new TextDecoder().decode(b64uToBytes(s)));

async function verifyFirebaseToken(token, projectId) {
  const [h, p, sig] = token.split('.');
  if (!h || !p || !sig) throw new Error('bad token');
  const header = b64uToJson(h), payload = b64uToJson(p);
  if (header.alg !== 'RS256') throw new Error('bad alg');
  const jwks = await fetch(JWKS_URL, { cf: { cacheTtl: 3600, cacheEverything: true } }).then(r => r.json());
  const jwk = jwks.keys.find(k => k.kid === header.kid);
  if (!jwk) throw new Error('unknown key');
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64uToBytes(sig), new TextEncoder().encode(h + '.' + p));
  const now = Date.now() / 1000;
  if (!ok || payload.aud !== projectId || payload.iss !== 'https://securetoken.google.com/' + projectId || payload.exp < now || payload.iat > now + 300 || !payload.sub) throw new Error('invalid token');
  return payload.sub;
}

/* ---------- PRO check: subscriptions/{uid} in Firestore (read with the user's own token) ---------- */
async function isPro(uid, idToken, projectId) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/subscriptions/${uid}`;
  const r = await fetch(url, { headers: { Authorization: 'Bearer ' + idToken } });
  if (!r.ok) return false;
  const f = (await r.json()).fields || {};
  const status = f.status && f.status.stringValue;
  const exp = f.expiresAt && (f.expiresAt.integerValue ?? f.expiresAt.doubleValue);
  return status === 'active' && +exp > Date.now();
}