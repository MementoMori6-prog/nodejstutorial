const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { runExtraction } = require('./extractPayslips');

const HOST = '0.0.0.0';
const PORT = 3210;
const PAGE_PATH = path.join(__dirname, '..', 'public', 'index.html');

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function tryOpenBrowser(url) {
  const platform = process.platform;
  const commands = {
    win32: ['cmd', ['/c', 'start', '', url]],
    darwin: ['open', [url]],
    linux: ['xdg-open', [url]],
  };

  const entry = commands[platform];
  if (!entry) return;

  const [cmd, args] = entry;
  const child = spawn(cmd, args, { stdio: 'ignore', detached: true });
  child.on('error', () => {});
  child.unref();
}

function createServer() {
  return http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
      const html = fs.readFileSync(PAGE_PATH, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
      return;
    }

    if (req.method === 'POST' && req.url === '/extract') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        try {
          const { inputPath, outputPath } = JSON.parse(body);

          if (!inputPath || !outputPath) {
            sendJson(res, 400, { error: 'Compila sia il percorso input che output.' });
            return;
          }

          const result = runExtraction(inputPath, outputPath);
          sendJson(res, 200, {
            message: 'Elaborazione completata con successo.',
            outputPath: result.outputPath,
            processedFiles: result.processedFiles,
          });
        } catch (error) {
          sendJson(res, 400, { error: error.message });
        }
      });
      return;
    }

    sendJson(res, 404, { error: 'Endpoint non trovato.' });
  });
}

function startGui() {
  const server = createServer();
  server.listen(PORT, HOST, () => {
    const url = `http://${HOST}:${PORT}`;
    console.log(`GUI disponibile su ${url}`);
    console.log('Premi CTRL+C per chiudere.');
    tryOpenBrowser(url);
  });
}

if (require.main === module) {
  startGui();
}

module.exports = { createServer, startGui };
