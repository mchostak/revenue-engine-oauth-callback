"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { planReturn } = require("./return-plan.js");
const base = "https://mchostak.github.io/revenue-engine-oauth-callback/";
const state = "relocal1." + "A".repeat(43);
const returned = params => base + "?" + new URLSearchParams(params);

test("automatic return has a fixed loopback target and preserves the state/code", () => {
  const plan = planReturn(returned({ code: "test-code-only", state }));
  assert.equal(plan.kind, "automatic");
  const url = new URL(plan.target);
  assert.equal(url.origin, "http://127.0.0.1:8765");
  assert.equal(url.pathname, "/oauth/callback");
  assert.equal(url.searchParams.get("code"), "test-code-only");
  assert.equal(url.searchParams.get("state"), state);
});

test("query cannot select an external host, port or return endpoint", () => {
  for (const key of ["target", "port", "redirect_uri", "next"]) {
    assert.equal(planReturn(returned({ code: "test-code-only", state, [key]: "https://attacker.invalid/" })).kind, "invalid");
  }
  for (const bad of ["relocal1.8765." + "A".repeat(43), state + "@attacker.invalid", "relocal1.short"]) {
    assert.equal(planReturn(returned({ code: "test-code-only", state: bad })).kind, "invalid");
  }
});

test("duplicates, missing code/state and fragments never forward", () => {
  const valid = returned({ code: "test-code-only", state });
  for (const url of [valid + "&code=other", valid + "&state=other", valid + "#fragment",
                    returned({ state }), returned({ code: "test-code-only" }), returned({ state, code: "" })]) {
    assert.equal(planReturn(url).kind, "invalid");
  }
});

test("denial is handed to the receiver without a code or error description", () => {
  const plan = planReturn(returned({ error: "access_denied", error_description: "not-forwarded", state }));
  const url = new URL(plan.target);
  assert.equal(url.searchParams.get("error"), "access_denied");
  assert.equal(url.searchParams.has("code"), false);
  assert.equal(url.searchParams.has("error_description"), false);
});

test("manual links remain available and a plain visit does nothing", () => {
  const url = returned({ code: "test-code-only", state: "old-manual-state" });
  assert.equal(planReturn(url).kind, "manual");
  assert.equal(planReturn(url).returnURL, url);
  assert.equal(planReturn(base).kind, "empty");
});
