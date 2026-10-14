# 🏛️ Arquitetura do Sistema

## 1. Visão Geral em Camadas
O sistema adota uma arquitetura desacoplada onde cada camada possui responsabilidade estrita:

```
[ Usuário / Gatilho Externo ]
          │
          ▼
┌────────────────────────┐
│  04. Braços (Execução) │ <── CLI, Webhooks, APIs (n8n / WhatsApp / Supabase)
└────────────────────────┘
          ▲
          │ Orquestração de Chamadas
┌────────────────────────┐
│  03. Orquestração      │ <── Pipeline de IAs (Planner -> Coder -> Auditor)
└────────────────────────┘
          ▲
          │ Carrega Procedimentos
┌────────────────────────┐
│  02. Habilidades       │ <── Skills modulares padronizadas (YAML + Markdown)
└────────────────────────┘
          ▲
          │ Consulta de Contexto
┌────────────────────────┐
│  01. Memória           │ <── Obsidian Vault, Mapas de Contexto & Notas Atômicas
└────────────────────────┘
```

## 2. Padrões de Comunicação
- **Protocolo Inter-Agentes**: Mensagens estruturadas em JSON com schema estrito (status, artifact, critique, next_action).
- **Isolamento de Código**: Módulos são autocontidos em diretórios com interfaces claras.
- **Auditoria Cruzada (Claudex Pattern)**: O código gerado por um agente NÃO pode ser aprovado pelo próprio agente gerador. Requer obrigatoriamente um agente revisor independente com checklist de segurança e conformidade.
