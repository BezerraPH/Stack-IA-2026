# 📊 Dicionário de Dados e Contratos

## 1. Entidade: BenchmarkRun (Execução de Teste)
Armazena os resultados de cada teste comparativo entre o método tradicional e a metodologia 2026.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String (UUID) | Identificador único do teste |
| `timestamp` | ISO8601 String | Data e hora da execução |
| `scenario_name` | String | Nome do caso de teste (ex: "Criar Micro-SaaS") |
| `approach` | Enum ("tradicional", "stack_2026") | Metodologia empregada |
| `tokens_input` | Integer | Total de tokens enviados como prompt |
| `tokens_output` | Integer | Total de tokens gerados pela IA |
| `execution_time_ms` | Integer | Latência total em milissegundos |
| `estimated_cost_usd` | Float | Custo calculado em dólares |
| `precision_score` | Float (0-100) | Nota de aderência estrita aos requisitos |
| `human_interventions` | Integer | Quantas vezes o humano precisou corrigir a IA |
| `code_quality_score` | Float (0-100) | Nota da análise estática de código |
| `bottlenecks_detected` | Array<String> | Gargalos identificados na execução |

## 2. Entidade: SkillMetadata
| Campo | Tipo | Descrição |
|---|---|---|
| `name` | String | Nome identificador da habilidade (ex: "skill-coder") |
| `version` | String | Versão semântica |
| `required_tools` | Array<String> | Ferramentas necessárias no ambiente |
| `estimated_tokens` | Integer | Média de tokens consumidos na execução |
