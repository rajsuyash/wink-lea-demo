# Knowledge Base

The real knowledge base file (`wink-recruitment-fr.md`) contains
candidate-identifiable information and is **excluded from this public repository**
(see `.gitignore`).

To recreate the agent from scratch:

1. Drop your own knowledge base markdown at `kb/wink-recruitment-fr.md`.
2. Follow the structure documented in the project README under
   "Customising the interview".
3. Run `bash scripts/create-agent.sh` from the project root.

The live agent already has the production KB attached on ElevenLabs side —
this folder only matters when you want to rebuild or fork the demo.
