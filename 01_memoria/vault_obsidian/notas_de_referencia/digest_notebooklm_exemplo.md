# 🧪 Exemplo de Síntese de Fonte Externa (Padrão NotebookLM)

## Fonte Original:
- Documento técnico: *Manual de Integração com Gateways de Pagamento e Webhooks Resilientes (68 páginas)*
- Digest gerado pelo fluxo de ingestão:

### 1. Resumo Executivo
Gateways de pagamento modernos enviam eventos via webhook com garantia *at-least-once*. Isso significa que eventos duplicados podem chegar ao sistema. Todo receptor DEVE implementar idempotência através do cabeçalho `Idempotency-Key` ou armazenando os `event_id` processados.

### 2. Regras de Ouro Extraídas
1. Retornar HTTP 200 imediatamente após enfileirar o evento.
2. Não executar processamento síncrono pesado dentro do handler do webhook.
3. Verificar a assinatura HMAC do payload usando o segredo compartilhado antes de ler o corpo da requisição.
4. Manter log auditável com timestamp e status de cada tentativa de processamento.
