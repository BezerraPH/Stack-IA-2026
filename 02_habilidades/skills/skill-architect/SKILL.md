---
name: "skill-architect"
description: "Analisa requisitos brutos do usuário e gera especificação técnica detalhada e sem ambiguidades"
version: "1.0.0"
layer: "02_habilidades"
role: "Planner / Software Architect"
parameters:
  - user_goal: "Descrição do que o usuário deseja construir ou resolver"
  - tech_stack: "Restrições de tecnologia"
---

# 📐 Skill: Software Architect & Planner

## 🎯 Objetivo
Transformar uma ideia informal ou requisito de negócio em um plano de implementação técnico, determinístico, com diagrama de arquitetura e divisão em etapas atômicas.

## 📋 Checklist de Execução Obrigatório
1. [ ] Consultar o mapa de contexto e dicionário de dados em `01_memoria/vault_obsidian/`.
2. [ ] Definir o modelo de dados e entidades principais.
3. [ ] Mapear as rotas de API, webhooks e contratos de entrada/saída.
4. [ ] Identificar possíveis riscos de segurança, gargalos de rede e requisitos de idempotência.
5. [ ] Gerar documento de especificação técnica sem escrever o código final.

## 🚫 Guardrails (O que NÃO fazer)
- NÃO comece a escrever código de produção nesta etapa.
- NÃO invente dependências externas não homologadas.
- NÃO passe para a próxima etapa sem checklist de validação aprovado.
