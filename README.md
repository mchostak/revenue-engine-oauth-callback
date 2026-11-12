# Retorno OAuth do Mercado Livre

Página estática para publicação no GitHub Pages, solicitada pelo titular em
2026-11-09 depois que o DevCenter rejeitou a URI com localhost. Não contém segredo,
backend hospedado, dependências, chamadas de API, analytics ou armazenamento no navegador.

No fluxo `auth-connect`, o JavaScript remove a query da barra e encaminha o retorno
por navegação de página ao receptor temporário em `http://127.0.0.1:8765/oauth/callback`.
O destino é fixo; a query nunca define host, porta ou destino externo. Somente um
state no formato `relocal1.` seguido do nonce de 43 caracteres ativa esse fluxo.
O receptor local valida state/PKCE, troca o código uma vez e salva os tokens.
Ele redireciona a uma página sem query e encerra; URLs de requisição não são logadas.

Links do modo manual continuam oferecendo cópia para `auth-finish` como alternativa.
Client Secret, access token, refresh token e verifier PKCE permanecem na máquina local.
O state e o PKCE são validados pelo programa local, não por esta página estática.
O servidor de hospedagem recebe a requisição de retorno com query, como em qualquer
callback HTTPS; o código de uso único é protegido pelo PKCE. Não publicar um verifier
ou credenciais nesta página.

Publique `index.html`, `return-plan.js`, `callback.js`, `style.css` e `.nojekyll` em um
repositório público separado. Não alterar a visibilidade do projeto principal.
GitHub Pages em repositório público é disponibilizado no GitHub Free, sujeito às
condições do serviço: [documentação oficial](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

Testes de encaminhamento: `node test-callback.cjs` (cinco casos, sem dependências).
Para prévia local, na raiz deste repositório: `python3 -m http.server 8767 --bind 127.0.0.1`.
Use somente códigos fictícios nos testes. Configure no DevCenter exatamente a URL
HTTPS publicada, com a mesma barra final. O DevCenter continua retornando à página
HTTPS; o receptor local é uma segunda etapa executada por essa página. O programa
`auth-connect` e o navegador precisam estar na mesma máquina.
