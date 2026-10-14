/**
 * Servidor Web & API para o Dashboard de Benchmarks da Stack 2026
 * Não requer dependências externas pesadas (usa HTTP nativo do Node.js).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const benchmarkEngine = require('./05_benchmark/benchmark_engine');
const skillLoader = require('./02_habilidades/skill_loader');
const testCases = require('./05_benchmark/test_cases.json');

const PORT = process.env.PORT || 3000;
const DASHBOARD_DIR = path.join(__dirname, 'dashboard');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // CORS headers para flexibilidade
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ==========================================
  // ROTAS DA API REST
  // ==========================================

  // 1. Obter Casos de Teste
  if (pathname === '/api/test-cases' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(testCases));
    return;
  }

  // 2. Obter Histórico de Benchmarks
  if (pathname === '/api/benchmark-history' && req.method === 'GET') {
    const historyPath = path.join(__dirname, '05_benchmark', 'benchmark_history.json');
    let history = [];
    if (fs.existsSync(historyPath)) {
      try {
        history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
      } catch (e) {
        history = [];
      }
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(history));
    return;
  }

  // 3. Disparar Execução de Benchmark
  if (pathname === '/api/run-benchmark' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        let params = {};
        if (body) {
          try { params = JSON.parse(body); } catch (e) {}
        }
        const testCaseId = params.testCaseId || null;
        console.log(`[API] 🚀 Disparando benchmark para: ${testCaseId || 'TODOS OS CASOS'}`);
        const result = await benchmarkEngine.runBenchmark(testCaseId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, result }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 4. Listar Habilidades da Camada 2
  if (pathname === '/api/skills' && req.method === 'GET') {
    const skills = skillLoader.listSkills();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(skills));
    return;
  }

  // 5. Listar Arquivos do Vault (Camada 1)
  if (pathname === '/api/vault-files' && req.method === 'GET') {
    const vaultDir = path.join(__dirname, '01_memoria', 'vault_obsidian');
    const files = [];

    function scanDir(dir, prefix = '') {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = path.join(prefix, entry.name);
        if (entry.isDirectory()) {
          scanDir(fullPath, relPath);
        } else if (entry.name.endsWith('.md')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          files.push({
            name: entry.name,
            path: relPath.replace(/\\/g, '/'),
            size: fs.statSync(fullPath).size,
            preview: content.slice(0, 300)
          });
        }
      }
    }

    scanDir(vaultDir);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(files));
    return;
  }

  // ==========================================
  // SERVINDO ARQUIVOS ESTÁTICOS DO DASHBOARD
  // ==========================================
  let filePath = path.join(DASHBOARD_DIR, pathname === '/' ? 'index.html' : pathname);
  const ext = path.extname(filePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    // Fallback para index.html se não for arquivo físico
    const indexPath = path.join(DASHBOARD_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(indexPath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Porta ${PORT} já está em uso.`);
  } else {
    console.error('Erro no servidor:', err);
  }
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

server.listen(PORT, () => {
  console.log(`\n=============================================================`);
  console.log(`🚀 Painel de Avaliação da Stack IA 2026 Ativo!`);
  console.log(`🌐 Acesse no seu navegador: http://localhost:${PORT}`);
  console.log(`=============================================================\n`);
});

