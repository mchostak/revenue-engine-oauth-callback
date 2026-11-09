"use strict";

(() => {
  const original = new URL(window.location.href);
  const codes = original.searchParams.getAll("code");
  const states = original.searchParams.getAll("state");
  const errors = original.searchParams.getAll("error");
  const hasReturn = codes.length || states.length || errors.length;
  if (!hasReturn) return;

  // Clear credentials from the visible URL before any subsequent navigation.
  // No requests, third-party scripts, analytics or browser storage are used.
  const safeURL = original.origin + original.pathname;
  window.history.replaceState(null, "", safeURL);
  const title = document.getElementById("title");
  const message = document.getElementById("message");
  const badge = document.getElementById("badge");
  if (errors.length) {
    title.textContent = "A autorização não foi concluída.";
    message.textContent = "Volte ao terminal, execute auth-start novamente e confira as permissões da sua aplicação.";
    badge.textContent = "Nova tentativa necessária";
    return;
  }
  if (codes.length !== 1 || states.length !== 1 || !codes[0] || !states[0] || original.hash) {
    title.textContent = "O retorno está incompleto.";
    message.textContent = "Inicie uma nova autorização pelo programa local. O retorno precisa conter um código e um state.";
    badge.textContent = "Retorno inválido";
    return;
  }
  title.textContent = "Autorização recebida.";
  message.textContent = "Falta um passo: leve este retorno ao terminal para concluir a conexão na sua máquina.";
  badge.textContent = "Continue no terminal";
  const section = document.getElementById("received");
  const textarea = document.getElementById("return-url");
  textarea.value = original.href;
  section.hidden = false;
  document.getElementById("copy").addEventListener("click", async () => {
    const status = document.getElementById("copy-status");
    try {
      await navigator.clipboard.writeText(textarea.value);
      status.textContent = "Retorno copiado. Cole no prompt oculto de auth-finish.";
    } catch {
      textarea.focus();
      textarea.select();
      status.textContent = "Copie o texto selecionado com Ctrl+C ou Cmd+C e cole no terminal.";
    }
  });
})();
