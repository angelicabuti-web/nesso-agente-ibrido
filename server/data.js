import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const python = process.env.NESSO_PYTHON || (process.platform === 'win32'
  ? join(root, '.venv', 'Scripts', 'python.exe') : 'python3');
const script = join(root, 'scripts', 'analizza_ticket.py');

export function analyzeTickets({ metric, dimension }) {
  return new Promise((resolve, reject) => {
    const child = spawn(python, [script], { cwd: root, stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, MPLCONFIGDIR: join(root, '.matplotlib-cache') } });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => child.kill(), 30000);
    child.on('error', (error) => { clearTimeout(timer); reject(error); });
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
      if (stdout.length > 2_000_000) child.kill();
    });
    child.stderr.on('data', (chunk) => { stderr = (stderr + chunk).slice(-2000); });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code !== 0) {
        console.error(`Nesso dati: Python ${code}: ${stderr.slice(-350)}`);
        reject(new Error('Il modulo dati Python non è pronto. Verifica pandas e matplotlib nell’ambiente .venv.'));
        return;
      }
      try {
        const result = JSON.parse(stdout);
        if (!result.chart?.startsWith('data:image/png;base64,')) throw new Error('Grafico mancante');
        resolve(result);
      } catch {
        reject(new Error('Il modulo dati ha restituito una risposta non valida.'));
      }
    });
    child.stdin.end(JSON.stringify({ metric, dimension }));
  });
}
