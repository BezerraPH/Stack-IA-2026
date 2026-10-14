/**
 * Ingestor de Documentos (Padrão NotebookLM -> Obsidian)
 * 
 * Transforma conteúdos brutos (textos longos, transcrições de reuniões/vídeos)
 * em notas atômicas em Markdown com metadados estruturados e links wiki.
 */

const fs = require('fs');
const path = require('path');

function ingestRawDocument(title, rawContent, category = 'geral') {
  const timestamp = new Date().toISOString().split('T')[0];
  const safeFilename = title.toLowerCase().replace(/[^a-z0-9]/g, '_') + '.md';
  const targetDir = path.join(__dirname, 'vault_obsidian', 'notas_de_referencia');

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Gera nota atômica sintetizada
  const atomicNote = `---
title: "${title}"
data_ingestao: "${timestamp}"
categoria: "${category}"
processado_por: "ingestor_notebooklm_pipeline"
tags:
  - segundo_cerebro
  - referencia
  - ${category}
---

# 📖 ${title}

## ⚡ Digest & Pontos Principais
${rawContent.slice(0, 500)}...

## 🔗 Relações no Segundo Cérebro
- [[00_mapa_de_contexto]]
- [[01_arquitetura_do_sistema]]

## 📝 Conteúdo na Íntegra (Higienizado)
${rawContent}
`;

  const targetPath = path.join(targetDir, safeFilename);
  fs.writeFileSync(targetPath, atomicNote, 'utf8');
  console.log(`[Ingestor] Nota gerada com sucesso: ${targetPath}`);
  return targetPath;
}

// Execução direta de teste se rodado pelo terminal
if (require.main === module) {
  ingestRawDocument(
    "Tutorial de Webhooks Resilientes com n8n",
    "Webhooks devem ser configurados no n8n com nós de resposta imediata HTTP 200, seguidos de fluxo assíncrono para gravação no banco Supabase e envio de mensagem de confirmação via Evolution API.",
    "automacao"
  );
}

module.exports = { ingestRawDocument };
