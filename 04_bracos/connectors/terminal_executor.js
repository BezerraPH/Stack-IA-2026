/**
 * Conector de Terminal & CLI
 * Camada 4: Braços
 * 
 * Permite que a IA execute testes, scripts e comandos reais no sistema com segurança.
 */

const { exec } = require('child_process');

class TerminalExecutor {
  constructor() {
    this.blockedCommands = ['rm -rf /', 'format', 'mkfs', 'drop database'];
  }

  async runCommand(command, cwd = process.cwd()) {
    const startTime = Date.now();

    // Verificação de segurança
    const isDangerous = this.blockedCommands.some(bad => command.toLowerCase().includes(bad));
    if (isDangerous) {
      return {
        success: false,
        error: "COMANDO_BLOQUEADO: Comando identificado como de alto risco para o sistema.",
        durationMs: 0
      };
    }

    return new Promise((resolve) => {
      exec(command, { cwd, timeout: 30000 }, (error, stdout, stderr) => {
        const durationMs = Date.now() - startTime;
        if (error) {
          resolve({
            success: false,
            exitCode: error.code || 1,
            stdout: stdout ? stdout.trim() : "",
            stderr: stderr ? stderr.trim() : error.message,
            durationMs
          });
        } else {
          resolve({
            success: true,
            exitCode: 0,
            stdout: stdout ? stdout.trim() : "",
            stderr: stderr ? stderr.trim() : "",
            durationMs
          });
        }
      });
    });
  }
}

module.exports = new TerminalExecutor();
