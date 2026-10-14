/**
 * Orquestrador Estilo Maestri
 * Camada 3: Orquestração Multi-Agente
 * 
 * Coordena o fluxo entre Planejador, Codificador e Auditor com feedback loop contínuo.
 */

const plannerAgent = require('./agent_roles/planner');
const coderAgent = require('./agent_roles/coder');
const auditorAgent = require('./agent_roles/auditor');
const pipelineConfig = require('./pipeline_config.json');

class MaestriOrchestrator {
  constructor() {
    this.config = pipelineConfig;
  }

  async runPipeline(task) {
    const pipelineStartTime = Date.now();
    const timeline = [];
    let totalTokensInput = 0;
    let totalTokensOutput = 0;

    // Etapa 1: Planejamento / Arquitetura (Camada 2: skill-architect)
    console.log(`[Maestri] 🚀 Iniciando Etapa 1: Planejamento Arquitetural...`);
    const planResult = await plannerAgent.execute(task);
    totalTokensInput += planResult.tokensInput;
    totalTokensOutput += planResult.tokensOutput;
    timeline.push(planResult);

    // Etapa 2: Codificação (Camada 2: skill-coder)
    console.log(`[Maestri] 💻 Iniciando Etapa 2: Codificação Sênior...`);
    let codeResult = await coderAgent.execute(planResult.specification);
    totalTokensInput += codeResult.tokensInput;
    totalTokensOutput += codeResult.tokensOutput;
    timeline.push(codeResult);

    // Etapa 3: Auditoria Independente (Claudex Pattern / Camada 2: skill-auditor)
    console.log(`[Maestri] 🛡️ Iniciando Etapa 3: Auditoria Cruzada de Segurança...`);
    let auditResult = await auditorAgent.audit(planResult.specification, codeResult.codeArtifact);
    totalTokensInput += auditResult.tokensInput;
    totalTokensOutput += auditResult.tokensOutput;
    timeline.push(auditResult);

    let feedbackLoops = 0;
    // Feedback loop se o auditor reprovar
    while (auditResult.verdict.decision !== "APROVADO" && feedbackLoops < this.config.cross_review_policy.max_audit_loops) {
      feedbackLoops++;
      console.log(`[Maestri] ⚠️ Auditoria reprovou (Loop ${feedbackLoops}). Devolvendo ao Coder...`);
      codeResult = await coderAgent.execute(planResult.specification, auditResult.verdict);
      totalTokensInput += codeResult.tokensInput;
      totalTokensOutput += codeResult.tokensOutput;
      timeline.push(codeResult);

      auditResult = await auditorAgent.audit(planResult.specification, codeResult.codeArtifact, feedbackLoops);
      totalTokensInput += auditResult.tokensInput;
      totalTokensOutput += auditResult.tokensOutput;
      timeline.push(auditResult);
    }

    const totalDurationMs = Date.now() - pipelineStartTime;

    // Cálculo de custo estimado baseado nos pesos dos modelos
    const estimatedCostUsd = (
      (planResult.tokensInput * 3.0 / 1e6) + (planResult.tokensOutput * 15.0 / 1e6) +
      (codeResult.tokensInput * 0.5 / 1e6) + (codeResult.tokensOutput * 2.0 / 1e6) +
      (auditResult.tokensInput * 1.5 / 1e6) + (auditResult.tokensOutput * 7.5 / 1e6)
    );

    return {
      success: auditResult.verdict.decision === "APROVADO",
      taskTitle: task.title,
      totalDurationMs,
      totalTokensInput,
      totalTokensOutput,
      totalTokens: totalTokensInput + totalTokensOutput,
      estimatedCostUsd: Number(estimatedCostUsd.toFixed(6)),
      feedbackLoops,
      finalScore: auditResult.verdict.score,
      timeline,
      finalCode: codeResult.codeArtifact,
      finalPlan: planResult.specification
    };
  }
}

module.exports = new MaestriOrchestrator();
