# ⚖️ Regras de Negócio e Governança

## 1. Princípios de Execução Autônoma
1. **Confirmação para Ações Destrutivas**: Qualquer operação com risco de perda permanente de dados (exclusão de banco, drop de tabela, parada de servidor em produção) requer confirmação explícita.
2. **Idempotência**: Todos os scripts e automações gerados devem ser idempotentes (poder rodar mais de uma vez sem corromper estado).
3. **Validação de Entradas**: Nenhuma carga externa (webhook, input de usuário, payload de mensageria) pode ser processada sem sanitização contra injeção de código ou payloads malformados.
4. **Respeito aos Limites de Tokens**: Consultas a contexto devem ser pontuais e objetivas. Não injetar documentos de mais de 500 linhas sem segmentação.

## 2. Padrões de Tolerância a Falhas
- Tentativas automáticas (Retry com backoff exponencial) para falhas de rede em APIs externas (Supabase, WhatsApp, n8n).
- Fallback para modelos menores e mais econômicos quando a tarefa for apenas de formatação ou extração direta.
