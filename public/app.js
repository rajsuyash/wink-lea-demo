/* =========================================================
   Wink — Léa Demo (shared by index.html and embed.html)
   ElevenLabs ConvAI client wiring + UI state machine
   ========================================================= */

const AGENT_ID = "agent_0501krnt98g6fz0aga8j16gtxbwv";
const EMBED_MODE = !!window.WINK_EMBED_MODE;

// === DOM refs (some may be null in embed mode) ===
const modal = document.getElementById("interview-modal");
const statusDot = document.getElementById("status-dot");
const statusLabel = document.getElementById("modal-status");
const liveStatus = document.getElementById("live-status");
const transcriptEl = document.getElementById("transcript");
const orb = document.getElementById("orb");
const btnStart = document.getElementById("btn-start");
const btnStartLabel = document.getElementById("btn-start-label");
const btnMute = document.getElementById("btn-mute");
const btnEnd = document.getElementById("btn-end");
const btnText = document.getElementById("btn-text");
const textFallback = document.getElementById("text-fallback");
const textInput = document.getElementById("text-input");

// === Runtime state ===
let conversation = null;
let starting = false;       // synchronous guard — prevents race on rapid clicks
let muted = false;
let textMode = false;

// === Stage controller ===
function setStage(name) {
  document.querySelectorAll(".stage").forEach(s => {
    s.classList.toggle("active", s.dataset.stage === name);
  });
}
function setStatus(label, mode) {
  if (statusLabel) statusLabel.textContent = label;
  if (liveStatus) liveStatus.textContent = label;
  if (statusDot) statusDot.className = "modal-status-dot" + (mode ? " " + mode : "");
}
function setOrbMode(mode) {
  if (!orb) return;
  orb.classList.remove("speaking", "listening");
  if (mode) orb.classList.add(mode);
}
function appendTranscript(who, text) {
  if (!transcriptEl) return;
  const empty = transcriptEl.querySelector(".transcript-empty");
  if (empty) empty.remove();
  const line = document.createElement("div");
  line.className = "transcript-line";
  const whoEl = document.createElement("span");
  whoEl.className = "transcript-who " + who;
  whoEl.textContent = who === "agent" ? "Léa" : "Vous";
  const txt = document.createElement("span");
  txt.className = "transcript-text";
  txt.textContent = text;
  line.appendChild(whoEl);
  line.appendChild(txt);
  transcriptEl.appendChild(line);
  transcriptEl.scrollTop = transcriptEl.scrollHeight;
}
function resetTranscript() {
  if (transcriptEl) {
    transcriptEl.innerHTML = '<p class="transcript-empty">La transcription apparaît ici en direct.</p>';
  }
}

// === Modal open/close (standalone page only) ===
function openModal() {
  if (!modal) return;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  setStage("brief");
  setStatus("Prêt à démarrer");
}
function closeModal() {
  if (conversation) {
    try { conversation.endSession(); } catch (e) { /* noop */ }
  }
  if (modal) {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }
  document.body.style.overflow = "";
  setStage("brief");
  resetTranscript();
  starting = false;
  conversation = null;
  muted = false;
  if (btnMute) btnMute.setAttribute("aria-pressed", "false");
  setOrbMode(null);
}

if (!EMBED_MODE) {
  document.querySelectorAll("[data-open-interview]").forEach(b => b.addEventListener("click", openModal));
  document.querySelectorAll("[data-close-interview]").forEach(b => b.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("open")) closeModal();
  });
}

// === Permission helpers ===
async function requestMic() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(t => t.stop());
    return true;
  } catch (err) {
    return false;
  }
}

// === Start interview ===
if (btnStart) {
  btnStart.addEventListener("click", async () => {
    if (conversation || starting) return;
    starting = true;
    btnStart.disabled = true;
    if (btnStartLabel) btnStartLabel.textContent = "Connexion…";

    const ok = await requestMic();
    if (!ok) {
      btnStart.disabled = false;
      if (btnStartLabel) btnStartLabel.textContent = "Autoriser le micro et démarrer";
      starting = false;
      setStatus("Micro refusé — autorisez l'accès et réessayez", "error");
      return;
    }

    setStage("live");
    setStatus("Connexion à Léa…", "connecting");
    setOrbMode(null);

    try {
      if (!window.ElevenLabsClient || !window.ElevenLabsClient.Conversation) {
        throw new Error("SDK ElevenLabs non chargé.");
      }
      conversation = await window.ElevenLabsClient.Conversation.startSession({
        agentId: AGENT_ID,
        connectionType: "websocket",
        onConnect: () => {
          starting = false;
          setStatus("En ligne avec Léa", "live");
        },
        onDisconnect: () => {
          starting = false;
          setOrbMode(null);
          setStatus("Entretien terminé");
          setStage("end");
        },
        onError: (err) => {
          starting = false;
          console.error("Wink Léa error:", err);
          setStatus("Erreur de connexion — réessayer ?", "error");
          setOrbMode(null);
        },
        onModeChange: ({ mode }) => {
          if (mode === "speaking") {
            setOrbMode("speaking");
            setStatus("Léa parle…", "live");
          } else if (mode === "listening") {
            setOrbMode("listening");
            setStatus("À l'écoute…", "live");
          } else {
            setOrbMode(null);
          }
        },
        onMessage: ({ source, message }) => {
          if (!message) return;
          appendTranscript(source === "ai" ? "agent" : "user", message);
        },
        onStatusChange: ({ status }) => {
          if (status === "connecting") setStatus("Connexion à Léa…", "connecting");
          if (status === "connected") setStatus("En ligne avec Léa", "live");
          if (status === "disconnected") {
            setStatus("Entretien terminé");
            setOrbMode(null);
          }
        }
      });
    } catch (err) {
      console.error("Failed to start session:", err);
      starting = false;
      btnStart.disabled = false;
      if (btnStartLabel) btnStartLabel.textContent = "Autoriser le micro et démarrer";
      setStatus("Démarrage impossible — réessayer ?", "error");
      setStage("brief");
    }
  });
}

// === Mute toggle ===
if (btnMute) {
  btnMute.addEventListener("click", () => {
    if (!conversation) return;
    muted = !muted;
    btnMute.setAttribute("aria-pressed", muted ? "true" : "false");
    const label = btnMute.querySelector(".ctrl-label");
    if (label) label.textContent = muted ? "Réactiver" : "Micro";
    try {
      if (typeof conversation.setMicMuted === "function") {
        conversation.setMicMuted(muted);
      } else if (typeof conversation.changeInputVolume === "function") {
        conversation.changeInputVolume(muted ? 0 : 1);
      }
    } catch (e) {
      console.warn("Mute API unavailable:", e);
    }
  });
}

// === End interview ===
if (btnEnd) {
  btnEnd.addEventListener("click", () => {
    if (conversation) {
      try { conversation.endSession(); } catch (e) { /* noop */ }
    }
    setOrbMode(null);
    setStage("end");
    setStatus("Entretien terminé");
  });
}

// === Text fallback ===
if (btnText) {
  btnText.addEventListener("click", () => {
    textMode = !textMode;
    if (textFallback) textFallback.hidden = !textMode;
    if (textMode && textInput) textInput.focus();
  });
}
if (textFallback) {
  textFallback.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = textInput.value.trim();
    if (!value || !conversation) return;
    try {
      if (typeof conversation.sendUserMessage !== "function") {
        console.warn("SDK version does not support text input.");
        return;
      }
      conversation.sendUserMessage(value);
      appendTranscript("user", value);
      textInput.value = "";
    } catch (err) {
      console.warn("Text fallback failed:", err);
    }
  });
}
