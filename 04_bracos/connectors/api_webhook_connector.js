/**
 * Conector de Webhooks & APIs Externas (n8n & WhatsApp / Evolution API)
 * Camada 4: Braços
 */

const http = require('http');
const https = require('https');

class ApiWebhookConnector {
  /**
   * Dispara um webhook com payload estruturado e timeout configurável
   */
  async triggerWebhook(url, payload, headers = {}) {
    const startTime = Date.now();
    const dataString = JSON.stringify(payload);

    return new Promise((resolve) => {
      try {
        const parsedUrl = new URL(url);
        const client = parsedUrl.protocol === 'https:' ? https : http;

        const reqOptions = {
          hostname: parsedUrl.hostname,
          port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
          path: parsedUrl.pathname + parsedUrl.search,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(dataString),
            ...headers
          },
          timeout: 10000
        };

        const req = client.request(reqOptions, (res) => {
          let responseBody = '';
          res.on('data', (chunk) => { responseBody += chunk; });
          res.on('end', () => {
            const durationMs = Date.now() - startTime;
            resolve({
              success: res.statusCode >= 200 && res.statusCode < 300,
              statusCode: res.statusCode,
              responseBody,
              durationMs
            });
          });
        });

        req.on('error', (err) => {
          resolve({
            success: false,
            error: err.message,
            durationMs: Date.now() - startTime
          });
        });

        req.on('timeout', () => {
          req.destroy();
          resolve({
            success: false,
            error: "TIMEOUT: O webhook não respondeu em 10 segundos",
            durationMs: Date.now() - startTime
          });
        });

        req.write(dataString);
        req.end();
      } catch (err) {
        resolve({
          success: false,
          error: `URL inválida ou erro na requisição: ${err.message}`,
          durationMs: Date.now() - startTime
        });
      }
    });
  }

  /**
   * Envio de mensagem simulado ou real via WhatsApp (Evolution API)
   */
  async sendWhatsAppMessage(evolutionUrl, apiKey, instanceName, number, text) {
    const endpoint = `${evolutionUrl}/message/sendText/${instanceName}`;
    const payload = {
      number,
      options: { delay: 1200, presence: "composing" },
      textMessage: { text }
    };
    return this.triggerWebhook(endpoint, payload, { 'apikey': apiKey });
  }
}

module.exports = new ApiWebhookConnector();
