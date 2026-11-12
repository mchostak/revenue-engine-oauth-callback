"use strict";

(() => {
  const LOCAL_RETURN = "http://127.0.0.1:8765/oauth/callback";
  const AUTOMATIC_STATE = /^relocal1\.[A-Za-z0-9_-]{43}$/;

  function planReturn(href) {
    let original;
    try { original = new URL(href); } catch { return { kind: "invalid" }; }
    const codes = original.searchParams.getAll("code");
    const states = original.searchParams.getAll("state");
    const errors = original.searchParams.getAll("error");
    if (original.hash || original.href.length > 16384) return { kind: "invalid" };
    if (!codes.length && !states.length && !errors.length) return { kind: "empty" };
    if (states.length !== 1 || !states[0] || codes.length > 1 || errors.length > 1) return { kind: "invalid" };
    const automatic = AUTOMATIC_STATE.test(states[0]);
    if (states[0].startsWith("relocal1.") && !automatic) return { kind: "invalid" };
    if (automatic && [...original.searchParams.keys()].some(k => !["code", "state", "error", "error_description"].includes(k))) {
      return { kind: "invalid" };
    }
    if (errors.length) {
      if (codes.length || !errors[0]) return { kind: "invalid" };
      if (!automatic) return { kind: "error" };
    } else if (codes.length !== 1 || !codes[0]) {
      return { kind: "invalid" };
    }
    if (!automatic) return { kind: "manual", returnURL: original.href };
    const target = new URL(LOCAL_RETURN);
    target.searchParams.set("state", states[0]);
    target.searchParams.set(errors.length ? "error" : "code", errors.length ? errors[0] : codes[0]);
    return { kind: "automatic", target: target.href };
  }

  const api = Object.freeze({ planReturn, LOCAL_RETURN });
  if (typeof module !== "undefined") module.exports = api;
  if (typeof window !== "undefined") window.RevenueOAuthReturn = api;
})();
