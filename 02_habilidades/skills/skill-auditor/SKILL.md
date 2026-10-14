---
name: "skill-auditor"
description: "Audita código e arquitetura de forma independente (Claudex pattern) procurando vulnerabilidades, desvios de regra e bugs"
version: "1.0.0"
layer: "02_habilidades"
role: "Security & Quality Auditor"
parameters:
  - source_code: "Código produzido pelo skill-coder"
  - original_spec: "Especificação original do skill-architect"
---

# 🛡️ Skill: Quality & Security Auditor (Claudex Pattern)

## 🎯 Objetivo
Executar revisão técnica adversarial. O auditor assume que o código contém falhas até que cada item do checklist seja rigorosamente verificado.

## 📋 Checklist de Auditoria Rigorosa
1. [ ] **Aderência aos Requisitos**: O código atende 100% da especificação do arquiteto?
2. [ ] **Vulnerabilidades de Segurança**: Há riscos de injeção (SQL/NoSQL/Command), exposição de chaves privadas ou quebra de autenticação?
3. [ ] **Idempotência & Resiliência**: Se a mesma requisição/webhook for disparada duas vezes, o sistema se comporta corretamente?
4. [ ] **Memory Leaks & Performance**: Existem conexões abertas não finalizadas ou loops não limitados?
5. [ ] **Parecer Formal**: Retornar status binário (`APROVADO` ou `REPROVADO_COM_AJUSTES`), listando pontualmente os arquivos e linhas a corrigir.

## ⚖️ Critério de Veto
Se o auditor encontrar qualquer falha crítica, a tarefa é devolvida imediatamente ao `skill-coder` com instruções corretivas, sem intervenção humana prematura.
