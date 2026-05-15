# Wink — Léa : démo agent vocal IA de préqualification

Démo client pour Montélimar-Agglomération. Léa est une assistante vocale IA en
français qui mène un entretien de préqualification téléphonique de 6 à 10 minutes
avec un candidat, pose les 8 questions techniques du questionnaire Wink, et
transmet un compte-rendu structuré à l'équipe RH.

Stack : HTML + CSS + JS vanilla, ElevenLabs Conversational AI SDK
(`@elevenlabs/client`), agent multilingual voice Elia FR.

---

## Quick demo (local)

```bash
cd public
python3 -m http.server 8788
open http://localhost:8788/
```

Cliquez le bouton flottant « Démarrer un entretien IA », autorisez votre micro,
et Léa démarre.

---

## Project layout

```
HugoVoiceAgent/
├── .env                          # ELEVENLABS_API_KEY (gitignored)
├── kb/
│   └── wink-recruitment-fr.md    # Knowledge base (CV + job spec + 8 questions)
├── scripts/
│   ├── create-agent.sh           # Idempotent agent creator (KB upload + agent)
│   └── agent-ids.txt             # Logged on each run (gitignored)
├── public/
│   ├── index.html                # Standalone branded landing + interview modal
│   ├── embed.html                # Iframe-only modal (used by widget.js)
│   ├── widget.js                 # Drop-in for Webflow / any external site
│   ├── styles.css                # Wink dark-navy + #1677FF design system
│   └── app.js                    # ConvAI SDK wiring (shared by index + embed)
└── README.md
```

---

## Configuration

### Environment

The agent was created via API and is publicly callable from the browser. The
client never uses the API key — it connects to ElevenLabs via WebSocket using
just the `agent_id`.

| Item | Value |
|---|---|
| Agent ID | `agent_0501krnt98g6fz0aga8j16gtxbwv` |
| Voice | `HuLbOdhRlvQQN8oPP0AJ` (Claire FR — Customer Service) |
| Model | `eleven_multilingual_v2` |
| Language | `fr` |
| Stability / Similarity | `0.4 / 0.75` |
| LLM | `gpt-4o-mini` (temperature 0.4) |
| KB | `wink-recruitment-fr.md` (1500 mots, CV + 8 questions) |
| Auth | Public (no signed URL needed) |

To inspect/edit the agent in the ElevenLabs dashboard :
`https://elevenlabs.io/app/conversational-ai/agents/agent_0501krnt98g6fz0aga8j16gtxbwv`

---

## Recreating the agent (from scratch)

If you need to recreate the agent (new account, KB rewrite, voice swap) :

```bash
# 1. Drop the Wink API key in .env
echo "ELEVENLABS_API_KEY=sk_..." > .env

# 2. Run the creator
bash scripts/create-agent.sh
```

The script :
1. Uploads `kb/wink-recruitment-fr.md` to the ElevenLabs knowledge base.
2. Creates the agent with the embedded French system prompt + KB attached.
3. Logs the new `agent_id` into `scripts/agent-ids.txt`.

After running, **update `AGENT_ID` in `public/app.js`** to the new ID, and run a
quick PATCH to make it public :

```bash
API_KEY=$(grep '^ELEVENLABS_API_KEY=' .env | cut -d= -f2)
AGENT_ID="<new agent_id>"
curl -X PATCH "https://api.elevenlabs.io/v1/convai/agents/$AGENT_ID" \
  -H "xi-api-key: $API_KEY" -H "Content-Type: application/json" \
  -d '{"platform_settings":{"auth":{"enable_auth":false,"allowlist":[]}}}'
```

---

## Deploying for the demo

The simplest path is any static host: Hostinger, Netlify, Vercel, GitHub Pages.

### Option A — Hostinger (manual)

Upload the contents of `public/` to `public_html/wink/` :

```
public_html/wink/
├── index.html
├── embed.html
├── widget.js
├── styles.css
└── app.js
```

The agent will be reachable at `https://yourdomain.com/wink/`.

### Option B — Netlify (drag and drop)

```bash
cd public
npx netlify deploy --dir=. --prod
```

### Option C — Vercel

```bash
cd public
npx vercel --prod
```

---

## Embedding in the Wink Webflow site

Once `public/` is hosted somewhere (say `https://demo.wink.ai`), drop **one line**
into Webflow → Project Settings → Custom Code → Footer :

```html
<script src="https://demo.wink.ai/widget.js" data-host="https://demo.wink.ai" defer></script>
```

A floating "Démarrer un entretien IA" button appears bottom-right on every page.
Click opens a full-screen iframe of `embed.html` with the live agent.

### Configurable options

| Attribute | Default | Description |
|---|---|---|
| `data-host` | (required) | Origin where `embed.html` lives |
| `data-label` | `Démarrer un entretien IA` | Button text |
| `data-position` | `bottom-right` | `bottom-right` or `bottom-left` |

Or call programmatically :

```html
<script src="https://demo.wink.ai/widget.js" defer></script>
<script>
  WinkLea.init({
    host: "https://demo.wink.ai",
    label: "Parler à Léa",
    position: "bottom-right"
  });
</script>
```

Open or close the widget from your own code :

```js
WinkLea.open();
WinkLea.close();
```

---

## Customising the interview

### Change the questions

Edit `kb/wink-recruitment-fr.md` — specifically the section titled
**« Les 8 questions techniques à poser ».** Rerun `scripts/create-agent.sh`
to re-upload the KB.

### Swap the candidate / job

Two parts to update :

1. **KB** — replace the "Le client", "Le poste", "Le candidat connu" sections in
   `kb/wink-recruitment-fr.md`.
2. **Pre-call brief** — update the 3 `.brief-card` blocks in `public/index.html`
   and `public/embed.html` (candidate name, poste, durée).

Then rerun the creator script.

### Change the voice

Find a French-capable voice (filter by `language: fr` on the
ElevenLabs Voice Library), copy its `voice_id`, then PATCH the agent :

```bash
API_KEY=$(grep '^ELEVENLABS_API_KEY=' .env | cut -d= -f2)
AGENT_ID="agent_0501krnt98g6fz0aga8j16gtxbwv"
curl -X PATCH "https://api.elevenlabs.io/v1/convai/agents/$AGENT_ID" \
  -H "xi-api-key: $API_KEY" -H "Content-Type: application/json" \
  -d '{"conversation_config":{"tts":{"voice_id":"NEW_VOICE_ID","model_id":"eleven_multilingual_v2","stability":0.4,"similarity_boost":0.75}}}'
```

If the voice is from the public Voice Library and not yet in your account, add
it first :

```bash
curl -X POST "https://api.elevenlabs.io/v1/voices/add/PUBLIC_OWNER_ID/VOICE_ID" \
  -H "xi-api-key: $API_KEY" -H "Content-Type: application/json" \
  -d '{"new_name":"Display name"}'
```

---

## Demo flow (what the client sees)

1. Land on `index.html` — Wink-branded hero, the 4-step process, the compliance
   grid, and the floating launcher.
2. Click "Démarrer un entretien IA" → modal opens with pre-call brief
   (candidate the candidate, poste agent comptable, ~8 minutes).
3. Click "Autoriser le micro et démarrer" → browser asks for mic permission,
   then connects to Léa.
4. Léa opens : "Bonjour, je suis Léa, l'assistante vocale automatisée de Wink…"
   Discloses AI status, names the employer, asks if it's a good time.
5. Léa walks the candidate through identity, experience, 8 technical questions,
   availability, salary, mobility.
6. Either party clicks "Terminer" — confirmation screen "Compte-rendu transmis…".

---

## Browser compatibility

- Chrome / Edge / Brave : full support.
- Safari 17+ / Firefox 120+ : full support (WebRTC + getUserMedia).
- Mobile : iOS Safari 17+, Chrome Android. Mic permission must be granted on first tap.
- The widget requires HTTPS in production (browser policy on `getUserMedia`).
  `localhost` is exempt.

---

## Hardening for production

Before client launch, lock down the agent so the public `agent_id` cannot be
called from arbitrary origins (otherwise anyone with the page open could replay
the agent ID from their own site and burn ConvAI minutes on the Wink workspace):

```bash
API_KEY=$(grep '^ELEVENLABS_API_KEY=' .env | cut -d= -f2)
AGENT_ID="agent_0501krnt98g6fz0aga8j16gtxbwv"
curl -X PATCH "https://api.elevenlabs.io/v1/convai/agents/$AGENT_ID" \
  -H "xi-api-key: $API_KEY" -H "Content-Type: application/json" \
  -d '{"platform_settings":{"auth":{"enable_auth":false,"allowlist":[
    {"hostname":"wink.ai"},
    {"hostname":"demo.wink.ai"}
  ]}}}'
```

Add every origin that will host `embed.html` or `index.html`. `localhost` is
already permitted by ElevenLabs by default for dev testing.

---

## Compliance notes (RGPD + AI Act)

The agent is configured to :

- Disclose its AI nature in the first sentence (AI Act art. 50).
- Skip protected categories of questions (age, état civil, religion, santé…).
- Defer salary / hiring decisions to a human (no autonomous decision-making).
- Refuse to collect a RIB, SSN, or password.

Audio + transcript retention is governed by the ElevenLabs workspace policy.
Conversations can be deleted from the dashboard or via the `/v1/convai/conversations/{id}` DELETE endpoint.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| "SDK ElevenLabs non chargé" | `lib.iife.js` failed to load — check CDN, then refresh |
| Mic permission denied | Browser blocked it — clear site permissions and reload |
| Léa never connects | Confirm the agent has `enable_auth: false` (see Recreating section) |
| Léa speaks English | Verify `language: "fr"` is set on the agent (`GET /v1/convai/agents/<id>`) |
| Voice sounds wrong | Stability too high — try 0.4. Model wrong — must be `eleven_multilingual_v2` |
| Mobile iframe scrolls weirdly | The embed.html overrides max-height — already handled, but verify `viewport-fit=cover` is present |

---

## Credits

- ElevenLabs ConvAI (voice + LLM orchestration)
- Voice : Elia FR (public library, contributor `29c181bc…cbd086e`)
- Visual identity inspired by wink.ai (dark navy + electric `#1677FF`)
