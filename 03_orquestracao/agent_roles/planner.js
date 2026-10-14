/**
 * Agente Planejador (Planner / Architect)
 * Camada 3: Orquestração
 */

const skillLoader = require('../../02_habilidades/skill_loader');
const fs = require('fs');
const path = require('path');

class PlannerAgent {
  constructor() {
    this.role = "Planner & Architect";
    this.skill = skillLoader.getSkill('skill-architect');
  }

  async execute(taskInput, memoryContext = null) {
    const startTime = Date.now();

    // Carrega o contexto da Memória (Camada 1) se não fornecido
    if (!memoryContext) {
      const memoryPath = path.join(__dirname, '../../01_memoria/vault_obsidian/00_mapa_de_contexto.md');
      if (fs.existsSync(memoryPath)) {
        memoryContext = fs.readFileSync(memoryPath, 'utf8');
      }
    }

    // Calcula tokens simulados/estimados de entrada
    const inputTokenCount = Math.round((taskInput.length + (memoryContext ? memoryContext.length : 0) + this.skill.instructions.length) / 3.8);

    // Gera a especificação técnica estruturada
    const spec = {
      title: `Arquitetura Técnica: ${taskInput.title || 'Tarefa Orquestrada'}`,
      objective: taskInput.objective,
      techStack: taskInput.techStack || ["Node.js", "Express", "SQLite/Postgres"],
      dataEntities: taskInput.entities || ["User", "Session", "Transaction"],
      endpoints: [
        { method: "POST", path: "/api/v1/auth/session", desc: "Autenticação segura e emissão de token" },
        { method: "POST", path: "/api/v1/webhooks/ingress", desc: "Recepção com verificação HMAC e idempotência" },
        { method: "GET", path: "/api/v1/health", desc: "Healthcheck da aplicação" }
      ],
      securityRequirements: [
        "Sanitização preventiva de payloads",
        "Assinatura HMAC com segredo compartilhado",
        "Header de Idempotency-Key obrigatório em mutações"
      ],
      stepByStepPlan: [
        "1. Criar middleware de validação e verificação de assinatura",
        "2. Implementar repositório com suporte a idempotência",
        "3. Criar rotas da API com tratamento rigoroso de exceções",
        "4. Submeter para auditoria independente (Claudex pattern)"
      ]
    };

    const outputString = JSON.stringify(spec, null, 2);
    const outputTokenCount = Math.round(outputString.length / 3.8);
    const durationMs = Date.now() - startTime + Math.floor(Math.random() * 200 + 150);

    return {
      agent: this.role,
      stage: "planejamento",
      status: "CONCLUIDO",
      tokensInput: inputTokenCount,
      tokensOutput: outputTokenCount,
      durationMs,
      specification: spec,
      rawOutput: outputString
    };
  }
}

module.exports = new PlannerAgent();
