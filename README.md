# Retorno OAuth do Mercado Livre

Página estática para publicação no GitHub Pages, solicitada pelo titular em
2026-11-09 depois que o DevCenter rejeitou a URI com localhost. Não contém segredo,
backend, dependências, chamadas de API, analytics ou armazenamento no navegador.

O JavaScript remove a query da barra de endereço e oferece cópia da URL original
para o prompt local de `auth-finish`. Código e state são exibidos somente na sessão
da página; Client Secret, access token e refresh token permanecem na máquina local.
O state e o PKCE são validados pelo programa local, não por esta página estática.
O servidor de hospedagem recebe a requisição de retorno com query, como em qualquer
callback HTTPS; o código de uso único é protegido pelo PKCE. Não publicar um verifier
ou credenciais nesta página.

Publique apenas `index.html`, `callback.js`, `style.css` e `.nojekyll` em um
repositório público separado. Não alterar a visibilidade do projeto principal.
GitHub Pages em repositório público é disponibilizado no GitHub Free, sujeito às
condições do serviço: [documentação oficial](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

Para testar localmente: `python3 -m http.server 8767 --bind 127.0.0.1 --directory apps/dropship-callback`.
Use somente códigos fictícios nos testes. Configure no DevCenter exatamente a URL
HTTPS publicada, com a mesma barra final; não use o servidor HTTP local no OAuth real.
