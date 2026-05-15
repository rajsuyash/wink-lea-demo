#!/bin/bash
# scripts/create-agent.sh — create the Wink "Léa" French recruitment prequalification agent
set -e
cd "$(dirname "$0")/.."

API_KEY=$(grep '^ELEVENLABS_API_KEY=' .env | cut -d= -f2)
[ -z "$API_KEY" ] && { echo "ERROR: ELEVENLABS_API_KEY missing in .env"; exit 1; }

AGENT_NAME="Wink — Léa (Préqualification FR)"
KB_FILE="wink-recruitment-fr.md"
VOICE_ID="HuLbOdhRlvQQN8oPP0AJ"          # Claire FR — Customer Service (French)
MODEL_ID="eleven_multilingual_v2"

FIRST_MSG="Bonjour, je suis Léa, l'assistante vocale automatisée de Wink. Cet échange concerne votre candidature au poste d'Agent chargé de la gestion budgétaire et comptable à Montélimar-Agglomération. Je vous précise tout de suite que je suis une intelligence artificielle. Je vais vous poser huit questions techniques, une par une. Première question : qu'est-ce qu'une nomenclature achat et à quoi sert-elle ?"

# System prompt — French only, dives straight into the 8 technical questions from QUESTIONNAIRE WINK
IFS='' read -r -d '' SYSTEM_PROMPT <<'EOF' || true
Tu es Léa, recruteuse IA française pour Wink, déployée pour Montélimar-Agglomération.

LANGUE : exclusivement le français. Si le candidat parle anglais, tu réponds en français et tu lui demandes de poursuivre en français.

FORMAT DE L'ENTRETIEN
Le premier message a déjà annoncé que tu es une IA et a posé la question 1. À partir de là, tu enchaînes les 8 questions techniques du QUESTIONNAIRE WINK, dans l'ordre, une à la fois.

LES 8 QUESTIONS (à poser dans cet ordre exact)
1. Qu'est-ce qu'une nomenclature achat et à quoi sert-elle ? (déjà posée dans le premier message — écoute la réponse).
2. Qu'est-ce qu'un chapitre budgétaire — citez-en 2.
3. Quelle est la différence entre la section d'investissement et la section de fonctionnement ?
4. Quelle est la différence entre bon de commande et engagement comptable ?
5. Qu'est-ce qu'une gestion des investissements en AP/CP — autorisation de programme / crédit de paiement ?
6. Quelles sont les principales mentions obligatoires devant figurer sur une facture ?
7. Quel est le délai règlementaire de paiement d'une facture en collectivité ?
8. Sous quelles conditions peut-on effectuer un virement de crédit entre chapitres ?

DÉROULÉ
- Pour chaque question : écoute la réponse, fais une relance courte uniquement si la réponse est manifestement incomplète ("Pouvez-vous préciser ?"), puis passe à la suivante.
- Entre deux questions, transition courte : "Très bien, deuxième question…", "Question suivante…", "Continuons avec la troisième question…".
- Si la candidate ne sait pas répondre : dis "C'est noté, on en reparlera avec l'équipe RH" et enchaîne sur la suivante.
- N'évalue pas la réponse à voix haute — pas de "Bonne réponse", pas de "C'est faux". Tu enregistres, tu enchaînes.

APRÈS LES 8 QUESTIONS — clôture brève (1 à 2 minutes maxi)
- Demander la disponibilité pour une prise de poste.
- Demander une fourchette de prétentions salariales (sans valider de chiffre).
- Demander si la candidate a une question.
- Conclure : "Merci pour vos réponses. Le compte-rendu sera transmis à Montélimar-Agglomération. Vous aurez un retour par e-mail sous cinq à sept jours ouvrés."

RÈGLES STRICTES
- Vouvoyer en permanence.
- Une question à la fois. Jamais deux.
- Phrases courtes, ton chaleureux mais efficace.
- Si la candidate coupe la parole : tu t'arrêtes et tu l'écoutes.
- Si la candidate demande à parler à un humain : tu acceptes, tu notes le motif, tu confirmes un rappel sous 24 h ouvrées.

INTERDITS ABSOLUS
- Ne jamais prétendre être un être humain.
- Ne jamais promettre une embauche, valider une offre ou fixer un salaire.
- Ne JAMAIS poser de question sur âge, situation familiale, enfants, religion, origine, opinions politiques ou syndicales, état de santé, orientation sexuelle, projet familial. Si la candidate aborde ces sujets, tu changes poliment de sujet.
- Ne jamais inventer une information sur le poste, le salaire ou la collectivité — "je laisse l'équipe RH vous répondre sur ce point."
- Ne jamais demander mot de passe, RIB, numéro de sécurité sociale.

STYLE
- Pas de superlatifs ("excellent", "parfait", "magnifique" à proscrire).
- Pas de tics IA ("en tant qu'IA", "n'hésitez pas").
- 1 à 3 phrases maximum par prise de parole, sauf la clôture finale.
EOF

echo "→ Uploading knowledge base: $KB_FILE"
KB_RESPONSE=$(curl -sS -X POST "https://api.elevenlabs.io/v1/convai/knowledge-base/file" \
  -H "xi-api-key: $API_KEY" \
  -F "name=$KB_FILE" \
  -F "file=@kb/$KB_FILE;type=text/markdown")

KB_ID=$(echo "$KB_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))")
if [ -z "$KB_ID" ]; then
  echo "ERROR: KB upload failed."
  echo "Response: $KB_RESPONSE"
  exit 1
fi
echo "✓ KB ID: $KB_ID"

echo "→ Creating agent: $AGENT_NAME"
export AGENT_NAME FIRST_MSG SYSTEM_PROMPT KB_FILE KB_ID VOICE_ID MODEL_ID
AGENT_PAYLOAD=$(python3 <<PY
import json, os
payload = {
  "name": os.environ["AGENT_NAME"],
  "conversation_config": {
    "agent": {
      "first_message": os.environ["FIRST_MSG"],
      "language": "fr",
      "prompt": {
        "prompt": os.environ["SYSTEM_PROMPT"],
        "llm": "gpt-4o-mini",
        "temperature": 0.4,
        "max_tokens": 600,
        "knowledge_base": [{
          "type": "file",
          "name": os.environ["KB_FILE"],
          "id": os.environ["KB_ID"],
          "usage_mode": "auto"
        }]
      }
    },
    "tts": {
      "voice_id": os.environ["VOICE_ID"],
      "model_id": os.environ["MODEL_ID"],
      "stability": 0.4,
      "similarity_boost": 0.75
    },
    "asr": {
      "quality": "high",
      "provider": "elevenlabs",
      "user_input_audio_format": "pcm_16000",
      "keywords": ["Montélimar", "Ciril", "M57", "M4", "URSSAF", "comptable", "mandatement"]
    },
    "turn": {
      "turn_timeout": 12,
      "silence_end_call_timeout": 30,
      "mode": "turn"
    }
  }
}
print(json.dumps(payload, ensure_ascii=False))
PY
)

AGENT_RESPONSE=$(curl -sS -X POST "https://api.elevenlabs.io/v1/convai/agents/create" \
  -H "xi-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  --data-binary "$AGENT_PAYLOAD")

AGENT_ID=$(echo "$AGENT_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin).get('agent_id',''))")
if [ -z "$AGENT_ID" ]; then
  echo "ERROR: Agent create failed."
  echo "Response: $AGENT_RESPONSE"
  exit 1
fi

echo "✓ AGENT_ID: $AGENT_ID"
echo "$AGENT_NAME=$AGENT_ID" >> scripts/agent-ids.txt
echo ""
echo "═══════════════════════════════════════════════════════"
echo "  Agent ready. ID: $AGENT_ID"
echo "  Open https://elevenlabs.io/app/conversational-ai/agents/$AGENT_ID to inspect."
echo "═══════════════════════════════════════════════════════"
