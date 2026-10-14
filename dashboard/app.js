/**
 * STACK IA 2026 - Client-Side Controller
 * Manipulação de abas, consumo da API REST e renderização interativa dos benchmarks.
 */

let currentTestCases = [];
let currentHistory = [];
let selectedCaseId = null;

// =========================================================================
// INICIALIZAÇÃO
// =========================================================================
document.addEventListener('DOMContentLoaded', async () => {
  await loadInitialData();
});

async function loadInitialData() {
  try {
    const [casesRes, historyRes, vaultRes, skillsRes] = await Promise.all([
      fetch('/api/test-cases'),
      fetch('/api/benchmark-history'),
      fetch('/api/vault-files'),
      fetch('/api/skills')
    ]);

    currentTestCases = await casesRes.json();
    currentHistory = await historyRes.json();
    const vaultFiles = await vaultRes.json();
    const skills = await skillsRes.json();

    renderTestCaseSelector();
    renderArtifactsSidebar(vaultFiles, skills);

    if (currentTestCases.length > 0) {
      selectTestCase(currentTestCases[0].id);
    }
  } catch (err) {
    console.error("Erro ao carregar dados iniciais:", err);
  }
}

// =========================================================================
// NAVEGAÇÃO ENTRE ABAS
// =========================================================================
function switchTab(tabId) {
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });

  document.querySelectorAll('.tab-content').forEach(section => {
    section.classList.toggle('active', section.id === tabId);
  });
}

// =========================================================================
// RENDERIZADOR DO SELETOR DE CASOS DE TESTE
// =========================================================================
function renderTestCaseSelector() {
  const container = document.getElementById('testCasePills');
  if (!container) return;

  container.innerHTML = currentTestCases.map(tc => `
    <button class="case-pill ${tc.id === selectedCaseId ? 'active' : ''}" 
            onclick="selectTestCase('${tc.id}')">
      ${tc.title}
    </button>
  `).join('');
}

function selectTestCase(caseId) {
  selectedCaseId = caseId;
  renderTestCaseSelector();

  // Encontra o registro de benchmark mais recente para esse caso
  const record = currentHistory.find(h => h.testCase.id === caseId);

  if (record) {
    updateDashboardWithRecord(record);
  } else {
    clearDashboardData();
  }
}

// =========================================================================
// ATUALIZAÇÃO DO DASHBOARD COM DADOS REAIS DE BENCHMARK
// =========================================================================
function updateDashboardWithRecord(record) {
  const evalData = record.evaluation.comparison;
  const runA = record.runA;
  const runB = record.runB;

  // 1. KPIs
  // Precisão
  document.getElementById('kpiPrecisionTrad').textContent = `${runA.precisionScore}%`;
  document.getElementById('kpiPrecisionStack').textContent = `${runB.precisionScore}%`;
  document.getElementById('kpiPrecisionBadge').textContent = `+${evalData.precisionScore.gainPoints}%`;
  document.getElementById('barPrecision').style.width = `${runB.precisionScore}%`;

  // Custo
  document.getElementById('kpiCostTrad').textContent = `$${runA.estimatedCostUsd.toFixed(4)}`;
  document.getElementById('kpiCostStack').textContent = `$${runB.estimatedCostUsd.toFixed(4)}`;
  document.getElementById('kpiCostBadge').textContent = `${evalData.costUsd.savingsPct}%`;
  document.getElementById('barCost').style.width = `${Math.min(100, Math.max(10, evalData.costUsd.savingsPct))}%`;

  // Intervenções Humanas
  document.getElementById('kpiHumanTrad').textContent = `${runA.humanInterventions} vezes`;
  document.getElementById('kpiHumanStack').textContent = `${runB.humanInterventions} (Zero)`;
  document.getElementById('kpiHumanBadge').textContent = `${evalData.humanInterventions.interventionsAvoided} evitadas`;

  // 2. Coluna Esquerda: Abordagem Tradicional
  document.getElementById('tradTokens').textContent = `${runA.totalTokens.toLocaleString()} tokens`;
  document.getElementById('tradDuration').textContent = `${(runA.durationMs / 1000).toFixed(2)}s`;
  document.getElementById('tradScore').textContent = `${runA.precisionScore}%`;

  const flawsList = document.getElementById('tradFlawsList');
  if (runA.flawsDetected) {
    flawsList.innerHTML = runA.flawsDetected.map(f => `<li>${f}</li>`).join('');
  } else {
    flawsList.innerHTML = '<li>Omissão de validações estritas e idempotência.</li>';
  }

  document.getElementById('tradCodeSnippet').textContent = runA.codeGenerated || "// Nenhum código disponível";

  // 3. Coluna Direita: Stack 2026
  document.getElementById('stackTokens').textContent = `${runB.totalTokens.toLocaleString()} tokens`;
  document.getElementById('stackDuration').textContent = `${(runB.durationMs / 1000).toFixed(2)}s`;
  document.getElementById('stackScore').textContent = `${runB.precisionScore}%`;

  // Linha do tempo da orquestração
  const stagesContainer = document.getElementById('orchestrationStages');
  if (runB.timeline && runB.timeline.length > 0) {
    stagesContainer.innerHTML = runB.timeline.map(st => `
      <div class="stage-item">
        <span class="stage-role">🔹 ${st.agent}</span>
        <span class="stage-meta">${st.tokensInput + st.tokensOutput} tokens · ${(st.durationMs / 1000).toFixed(2)}s · <strong style="color: #34d399">${st.status}</strong></span>
      </div>
    `).join('');
  } else {
    stagesContainer.innerHTML = '<div class="stage-item"><span>Pipeline multi-agente concluído</span></div>';
  }

  document.getElementById('stackCodeSnippet').textContent = runB.codeGenerated || "// Código da Stack 2026";
}

function clearDashboardData() {
  document.getElementById('kpiPrecisionTrad').textContent = '--';
  document.getElementById('kpiPrecisionStack').textContent = '--';
  document.getElementById('kpiCostTrad').textContent = '--';
  document.getElementById('kpiCostStack').textContent = '--';
  document.getElementById('kpiHumanTrad').textContent = '--';
  document.getElementById('kpiHumanStack').textContent = '--';
  document.getElementById('tradTokens').textContent = '--';
  document.getElementById('stackTokens').textContent = '--';
  document.getElementById('tradDuration').textContent = '--';
  document.getElementById('stackDuration').textContent = '--';
  document.getElementById('tradScore').textContent = '--';
  document.getElementById('stackScore').textContent = '--';
  document.getElementById('tradFlawsList').innerHTML = '<li>Execute o benchmark para coletar métricas.</li>';
  document.getElementById('tradCodeSnippet').textContent = '// Execute o benchmark primeiro.';
  document.getElementById('stackCodeSnippet').textContent = '// Execute o benchmark primeiro.';
  document.getElementById('orchestrationStages').innerHTML = '';
}

// =========================================================================
// EXECUÇÃO DO BENCHMARK VIA API
// =========================================================================
async function runAllBenchmarks() {
  const btn = document.getElementById('btnRunAll');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span class="btn-icon">⏳</span><span>Executando Testes A/B...</span>`;

  try {
    const res = await fetch('/api/run-benchmark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testCaseId: selectedCaseId })
    });
    const data = await res.json();

    if (data.success) {
      // Recarrega o histórico atualizado
      const historyRes = await fetch('/api/benchmark-history');
      currentHistory = await historyRes.json();
      selectTestCase(selectedCaseId);
    }
  } catch (err) {
    alert(`Erro ao rodar benchmark: ${err.message}`);
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

// =========================================================================
// TAB DE ARTEFATOS E VAULT DO OBSIDIAN
// =========================================================================
function renderArtifactsSidebar(vaultFiles, skills) {
  const vaultList = document.getElementById('vaultFilesList');
  const skillsList = document.getElementById('skillsFilesList');

  if (vaultList && vaultFiles) {
    vaultList.innerHTML = vaultFiles.map(file => `
      <button class="file-tree-btn" onclick="viewVaultFile('${file.path}', '${encodeURIComponent(file.preview)}')">
        📄 ${file.name}
      </button>
    `).join('');
  }

  if (skillsList && skills) {
    skillsList.innerHTML = skills.map(skill => `
      <button class="file-tree-btn" onclick="viewSkillFile('${skill.id}', '${encodeURIComponent(skill.instructions)}')">
        ⚙️ ${skill.id}
      </button>
    `).join('');
  }
}

function viewVaultFile(filePath, encodedPreview) {
  const preview = decodeURIComponent(encodedPreview);
  document.getElementById('activeArtifactTitle').textContent = `01_memoria/vault_obsidian/${filePath}`;
  document.getElementById('activeArtifactBadge').textContent = 'Vault Markdown';
  document.getElementById('activeArtifactContent').textContent = preview;

  document.querySelectorAll('.file-tree-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.includes(filePath.split('/').pop()));
  });
}

function viewSkillFile(skillId, encodedInstructions) {
  const instructions = decodeURIComponent(encodedInstructions);
  document.getElementById('activeArtifactTitle').textContent = `02_habilidades/skills/${skillId}/SKILL.md`;
  document.getElementById('activeArtifactBadge').textContent = 'Skill Manual';
  document.getElementById('activeArtifactContent').textContent = instructions;

  document.querySelectorAll('.file-tree-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.includes(skillId));
  });
}
