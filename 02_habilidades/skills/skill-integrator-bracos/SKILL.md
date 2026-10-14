---
name: "skill-integrator-bracos"
description: "Conecta os agentes a ferramentas externas do mundo real (n8n, Evolution API / WhatsApp, Supabase, Vercel e Terminal)"
version: "1.0.0"
layer: "02_habilidades"
role: "DevOps & Integration Specialist"
parameters:
  - service_type: "n8n | supabase | evolution_api | vercel | terminal"
  - action_payload: "Configurações de conexão e chamadas"
---

# 🦾 Skill: Integrator & Braços Operacionais

## 🎯 Objetivo
Permitir que os agentes saiam da caixa de texto e executem ações práticas no mundo real: disparar webhooks, criar tabelas no banco de dados, enviar mensagens de teste no WhatsApp e executar testes automatizados via CLI.

## 📋 Checklist de Operação
1. [ ] Verificar se os serviços ou containers necessários estão ativos (via `docker-compose` ou variáveis de ambiente).
2. [ ] Testar a conexão (Healthcheck) antes de disparar operações de mutação.
3. [ ] Em caso de falha de conexão, registrar log claro com status code e mensagem descritiva.
4. [ ] Retornar o link ou resultado da execução para validação do usuário.
