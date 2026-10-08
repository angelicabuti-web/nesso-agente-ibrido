import 'dotenv/config';
import http from 'node:http';
import { answerTeam } from './team.js';
import { searchManual } from './rag.js';
import { analyzeTickets } from './data.js';

const port = 8787;
const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
const configured = apiKey && apiKey !== 'incolla_qui_la_tua_chiave';

const instructions = `Sei Nesso, un assistente IA per il benessere emotivo di persone adulte.
Questa è una dimostrazione educativa con storie e personaggi inventati. Non invitare l'utente a inserire dettagli personali reali.
Rispondi nella lingua dell'utente come in una conversazione naturale, vicina e intelligente: sii attento ai dettagli, diretto, curioso e sincero, con parole semplici. Puoi essere affettuoso quando il momento lo richiede, senza usare un tono terapeutico solenne o scrivere in modo poetico. Fai riferimento a un dettaglio concreto del messaggio, riconosci la difficoltà senza presumere di sapere esattamente cosa prova la persona, e lascia spazio al suo racconto. Evita lusinghe, frasi consolatorie generiche e formule ripetute come "mi dispiace tantissimo", "sei incredibilmente forte" o "è del tutto normale". Non dare automaticamente ragione: se una conclusione non è sostenuta dai fatti, proponi con tatto un'altra possibilità, distinguendo osservazioni e ipotesi.
Adatta la risposta all'intento. Al primo messaggio in cui la persona si confida senza chiedere consigli, usa di norma due o tre frasi brevi (circa 30-50 parole): riconosci il punto centrale e, se aiuta, fai una sola domanda aperta. Non costruire scene poetiche, non parafrasare tutta la storia e non aggiungere spiegazioni generali non richieste. Se la persona vuole continuare a raccontare, lascia spazio senza forzare una domanda a ogni turno. Quando risponde con poche parole (per esempio "sì", "boh", "non so") e sembra voler continuare, non attribuire significati profondi a quelle parole e non chiudere il dialogo con una sola constatazione: riprendi un dettaglio già detto e poni una domanda semplice e concreta, oppure offri due direzioni tra cui scegliere. Non fare più di una domanda per messaggio e lascia sempre libertà di non rispondere. Se chiede un consiglio, offri uno o due passi realistici e specifici per ciò che ha raccontato, senza trasformare tutto in un elenco di esercizi; quando utile, chiedi quale passo sembra più praticabile. Se chiede informazioni, spiega con chiarezza ciò che è noto e segnala l'incertezza. Puoi essere più articolato quando la richiesta lo richiede. Tieni conto dei messaggi precedenti e non ripetere la stessa rassicurazione.
Esempio di ritmo, da non copiare letteralmente: se qualcuno dice "boh, non so" dopo aver raccontato che le sere sono difficili, una risposta possibile è "Va bene anche non saperlo. Partiamo da una cosa semplice: qual è la parte più difficile della serata per te?".
Non fingere di essere una persona, un amico esclusivo, uno psicologo o un medico. Non promettere segretezza assoluta o disponibilità garantita. Non formulare diagnosi, non prescrivere farmaci e non presentare ipotesi psicologiche come certezze. Se la persona chiede informazioni, distingui fatti generali dalla sua situazione personale e suggerisci un confronto professionale quando opportuno.
Se emerge un rischio immediato per sé o altri, dai priorità alla sicurezza: incoraggia a contattare subito i servizi di emergenza locali e una persona reale fidata. Evita dettagli che facilitino il danno. Non giudicare né colpevolizzare.`;

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 32_000) {
      const error = new Error('Payload troppo grande');
      error.status = 413;
      error.clientError = true;
      throw error;
    }
  }
  try {
    return JSON.parse(body);
  } catch {
    const error = new Error('Richiesta non valida');
    error.status = 400;
    error.clientError = true;
    throw error;
  }
}

function validMessages(value) {
  return Array.isArray(value) && value.length > 0 && value.length <= 20
    && value.every((item) => item && (item.role === 'user' || item.role === 'assistant')
      && typeof item.content === 'string' && item.content.trim().length > 0 && item.content.length <= 4000)
    && value.at(-1).role === 'user';
}

async function callTeamModel(body) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    signal: AbortSignal.timeout(45000),
    body: JSON.stringify({
      ...body,
      generationConfig: {
        ...body.generationConfig,
        ...(model.startsWith('gemini-3') ? { thinkingConfig: { thinkingLevel: 'low' } } : {}),
      },
    }),
  });
  if (response.status === 429) {
    const error = new Error('È stato raggiunto il limite gratuito della demo. Riprova più tardi.');
    error.status = 429;
    throw error;
  }
  if (!response.ok) {
    console.error(`Nesso team: Gemini HTTP ${response.status}`);
    throw new Error('Il servizio IA non è disponibile al momento. Riprova tra poco.');
  }
  return response.json();
}

const server = http.createServer(async (req, res) => {
  if (req.url !== '/api/chat') {
    send(res, 404, { error: 'Pagina non trovata.' });
    return;
  }
  if (req.method !== 'POST') {
    send(res, 405, { error: 'Metodo non consentito.' });
    return;
  }
  if (!req.headers['content-type']?.startsWith('application/json')) {
    send(res, 415, { error: 'Invia i messaggi in formato JSON.' });
    return;
  }
  if (!configured) {
    send(res, 503, { error: 'La demo IA non è ancora configurata. Aggiungi GEMINI_API_KEY nel file .env del progetto.' });
    return;
  }

  try {
    const payload = await readBody(req);
    if (!validMessages(payload.messages)) {
      send(res, 400, { error: 'Messaggi non validi. Riprova con un testo più breve.' });
      return;
    }
    if (payload.mode !== undefined && payload.mode !== 'personal' && payload.mode !== 'team') {
      send(res, 400, { error: 'Modalità della chat non valida.' });
      return;
    }
    if (payload.mode === 'team') {
      const result = await answerTeam(payload.messages, callTeamModel, searchManual, analyzeTickets);
      send(res, 200, result);
      return;
    }
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      signal: AbortSignal.timeout(45000),
      body: JSON.stringify({
        system_instruction: { parts: [{ text: instructions }] },
        contents: payload.messages.map(({ role, content }) => ({
          role: role === 'assistant' ? 'model' : 'user',
          parts: [{ text: content }],
        })),
        generationConfig: {
          maxOutputTokens: 4096,
          ...(model.startsWith('gemini-3') ? { thinkingConfig: { thinkingLevel: 'low' } } : {}),
        },
      }),
    });
    if (response.status === 429) {
      send(res, 429, { error: 'È stato raggiunto il limite gratuito della demo. Riprova più tardi.' });
      return;
    }
    if (!response.ok) {
      console.error(`Nesso: Gemini HTTP ${response.status}`);
      send(res, 502, { error: 'Il servizio IA non è disponibile al momento. Riprova tra poco.' });
      return;
    }
    const data = await response.json();
    const candidate = data.candidates?.[0];
    const reply = candidate?.content?.parts?.filter((part) => !part.thought)
      .map((part) => part.text || '').join('').trim();
    if (!reply) {
      const finishReason = candidate?.finishReason || 'UNKNOWN';
      console.error(`Nesso: risposta Gemini vuota (${finishReason})`);
      send(res, 502, { error: 'La risposta si è interrotta. Premi Riprova.' });
      return;
    }
    send(res, 200, { reply });
  } catch (error) {
    if (error.clientError) {
      send(res, error.status, { error: error.message });
      return;
    }
    if (error.status === 429) {
      send(res, 429, { error: error.message });
      return;
    }
    if (error.message?.includes('ChromaDB non è pronto')) {
      send(res, 503, { error: 'Il manuale non è disponibile. Avvia ChromaDB e verifica che sia stato indicizzato.' });
      return;
    }
    if (error.message?.includes('modulo dati')) {
      send(res, 503, { error: error.message });
      return;
    }
    console.error(`Nesso: richiesta non completata (${error?.name || 'Error'})`);
    send(res, 502, { error: payloadError(error) });
  }
});

function payloadError(error) {
  const safeMessages = [
    'Il modello non ha scelto uno strumento. Riprova.',
    'La ricerca nel manuale non ha ricevuto una domanda valida. Riprova.',
    'La risposta del team si è interrotta. Riprova.',
    'Il servizio IA non è disponibile al momento. Riprova tra poco.',
  ];
  return safeMessages.includes(error.message)
    ? error.message
    : 'Non riesco a rispondere adesso. Riprova tra poco; se è urgente, apri Ho bisogno di aiuto da una persona.';
}

server.listen(port, '127.0.0.1', () => {
  console.log(`Nesso API pronta su http://127.0.0.1:${port}`);
});
