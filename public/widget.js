/* =========================================================
   Wink Léa — Webflow drop-in widget
   Usage in Webflow → Project Settings → Custom Code → Footer:
     <script src="https://YOUR-HOST/widget.js" defer></script>
     <script>WinkLea.init({ host: "https://YOUR-HOST" });</script>

   Or pass options via data attributes on the script tag itself:
     <script src="https://YOUR-HOST/widget.js"
             data-host="https://YOUR-HOST"
             data-label="Démarrer un entretien IA"
             data-position="bottom-right" defer></script>
   ========================================================= */

(function () {
  "use strict";
  if (window.WinkLea) return;

  const VERSION = "1.0.0";
  const DEFAULTS = {
    host: null,           // base URL where /embed.html lives — REQUIRED
    label: "Démarrer un entretien IA",
    position: "bottom-right",  // bottom-right | bottom-left
    zIndex: 999999,
    primary: "#1677FF",
    accent: "#6B5BFF",
    background: "#0A0A14"
  };

  const SCRIPT_TAG = document.currentScript;

  function readDataAttrs(el) {
    if (!el) return {};
    return {
      host: el.getAttribute("data-host") || undefined,
      label: el.getAttribute("data-label") || undefined,
      position: el.getAttribute("data-position") || undefined
    };
  }

  function merge(...objs) {
    const out = {};
    for (const o of objs) {
      if (!o) continue;
      for (const k in o) if (o[k] !== undefined) out[k] = o[k];
    }
    return out;
  }

  let config = merge(DEFAULTS, readDataAttrs(SCRIPT_TAG));
  let launcher = null;
  let iframe = null;
  let backdrop = null;
  let isOpen = false;

  function injectStyles() {
    if (document.getElementById("wink-lea-styles")) return;
    const css = `
      .wink-lea-launcher {
        position: fixed;
        ${config.position === "bottom-left" ? "left: 24px;" : "right: 24px;"}
        bottom: 24px;
        z-index: ${config.zIndex};
        display: inline-flex; align-items: center; gap: 12px;
        padding: 10px 20px 10px 10px;
        background: ${config.background};
        color: #fff;
        border: 1px solid rgba(255,255,255,0.14);
        border-radius: 999px;
        box-shadow: 0 20px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(22,119,255,0.18);
        font-family: "Montserrat", "Inter", -apple-system, sans-serif;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: transform .2s ease, box-shadow .2s ease;
      }
      .wink-lea-launcher:hover { transform: translateY(-3px); box-shadow: 0 24px 56px rgba(22,119,255,0.4); }
      .wink-lea-orb {
        position: relative;
        width: 40px; height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, ${config.primary}, ${config.accent});
        display: inline-flex; align-items: center; justify-content: center;
        color: white;
        flex: 0 0 40px;
      }
      .wink-lea-orb svg { width: 18px; height: 18px; }
      .wink-lea-ring {
        position: absolute; inset: 0; border-radius: 50%;
        border: 2px solid ${config.primary};
        animation: winkLeaRing 2.4s ease-out infinite;
        pointer-events: none;
      }
      .wink-lea-ring-2 { animation-delay: 1.2s; }
      @keyframes winkLeaRing {
        0% { transform: scale(1); opacity: 0.7; }
        100% { transform: scale(1.9); opacity: 0; }
      }
      .wink-lea-shell {
        position: fixed; inset: 0;
        z-index: ${config.zIndex + 1};
        display: none;
        background: rgba(5, 5, 10, 0.85);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        animation: winkLeaFade .25s ease;
      }
      .wink-lea-shell.open { display: block; }
      @keyframes winkLeaFade { from { opacity: 0; } to { opacity: 1; } }
      .wink-lea-iframe {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border: 0;
        background: transparent;
      }
      @media (max-width: 520px) {
        .wink-lea-launcher .wink-lea-label { display: none; }
        .wink-lea-launcher { padding: 6px; }
      }
    `;
    const style = document.createElement("style");
    style.id = "wink-lea-styles";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function buildLauncher() {
    if (launcher) return launcher;
    launcher = document.createElement("button");
    launcher.type = "button";
    launcher.className = "wink-lea-launcher";
    launcher.setAttribute("aria-label", config.label);
    launcher.innerHTML = `
      <span class="wink-lea-orb">
        <span class="wink-lea-ring"></span>
        <span class="wink-lea-ring wink-lea-ring-2"></span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
      </span>
      <span class="wink-lea-label">${escapeHtml(config.label)}</span>
    `;
    launcher.addEventListener("click", openWidget);
    document.body.appendChild(launcher);
    return launcher;
  }

  function buildShell() {
    if (backdrop) return backdrop;
    backdrop = document.createElement("div");
    backdrop.className = "wink-lea-shell";
    iframe = document.createElement("iframe");
    iframe.className = "wink-lea-iframe";
    iframe.allow = "microphone";
    iframe.title = "Wink — Entretien avec Léa";
    backdrop.appendChild(iframe);
    document.body.appendChild(backdrop);
    return backdrop;
  }

  function openWidget() {
    if (!config.host) {
      console.error("[WinkLea] Missing `host` config. Set data-host on the script tag or call WinkLea.init({ host: 'https://...' }).");
      return;
    }
    if (isOpen) return;
    buildShell();
    iframe.src = config.host.replace(/\/$/, "") + "/embed.html";
    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
    isOpen = true;
  }

  function closeWidget() {
    if (!isOpen || !backdrop) return;
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
    if (iframe) iframe.src = "about:blank";
    isOpen = false;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  window.addEventListener("message", (e) => {
    if (!e || !e.data || e.data.type !== "wink:close") return;
    if (!iframe || !iframe.contentWindow || e.source !== iframe.contentWindow) return;
    try {
      const expected = new URL(config.host).origin;
      if (e.origin !== expected) return;
    } catch (_) { return; }
    closeWidget();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) closeWidget();
  });

  function init(opts) {
    config = merge(DEFAULTS, readDataAttrs(SCRIPT_TAG), opts || {});
    injectStyles();
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", buildLauncher);
    } else {
      buildLauncher();
    }
  }

  window.WinkLea = {
    init,
    open: openWidget,
    close: closeWidget,
    version: VERSION
  };

  // Auto-init if data-host attribute is set
  if (SCRIPT_TAG && SCRIPT_TAG.getAttribute("data-host")) {
    init({});
  }
})();
