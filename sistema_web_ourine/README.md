# Sistema Web Ourine — protótipo de gestão de serviços

Projeto acadêmico desenvolvido a partir do levantamento de processos da joalheria Ourine.

## Como executar
1. Extraia o arquivo ZIP.
2. Abra `index.html` em um navegador atualizado.
3. Para publicar no GitHub Pages, envie os três arquivos (`index.html`, `styles.css` e `app.js`) para a raiz de um repositório e habilite Pages nas configurações do repositório.

## Funcionalidades implementadas
- Painel com totais, pedidos em andamento, prontos e prazos vencidos.
- Cadastro, consulta, filtro, alteração de status e exclusão de Ordens de Serviço.
- Quadro de acompanhamento da produção.
- Registro de pesagem inicial/final, diferença calculada e conferência de medidas/acabamento.
- Registro de terceirização, profissional, envio e retorno.
- Registro de atrasos, retrabalhos e outras ocorrências.
- Exportação e importação de backup em JSON.
- Layout responsivo para computador e celular.

## Limitações importantes
Esta entrega é um **protótipo funcional front-end**. Os dados são armazenados no `localStorage` do navegador. Portanto:
- os dados ficam no dispositivo e navegador em que foram cadastrados;
- não há sincronização entre funcionários ou computadores;
- limpar os dados do navegador pode apagar os registros;
- não existe autenticação real nem controle de permissões;
- não use dados pessoais ou comerciais reais nesta versão de demonstração.

O GitHub Pages hospeda arquivos estáticos e não fornece, por si só, banco de dados ou autenticação segura. Para uso real simultâneo pela equipe da Ourine, será necessário integrar um backend e banco de dados, implementar autenticação, regras de acesso, backups e política de privacidade.

## Cuidados para apresentação acadêmica
Use registros fictícios para demonstrar o protótipo. Não inclua nomes, telefones, endereços ou dados identificáveis dos clientes nas capturas de tela ou no repositório público. Confirme com a organização a autorização para publicar imagens, marca e informações internas.

## Estrutura
- `index.html` — estrutura das telas
- `styles.css` — identidade visual e responsividade
- `app.js` — funcionalidades e armazenamento local


## Identidade visual e imagens
A interface utiliza o logotipo fotografado do cartão institucional e imagens reais da fachada e do ambiente interno da Ourine, fornecidas para este projeto. As fotografias do caderno de controle, da ordem de serviço em branco e dos instrumentos de medição devem ser usadas como evidências no relatório acadêmico, não como conteúdo público da tela inicial. Antes de publicar imagens, confirme a autorização da empresa e evite expor dados pessoais, números de telefone, nomes de clientes ou informações operacionais.
