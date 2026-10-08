import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const manualPath = fileURLToPath(new URL('../knowledge/manuale_nesso.txt', import.meta.url));
const collectionName = 'nesso_manual_v1';
const embeddingModel = 'gemini-embedding-001';
const embeddingSize = 768;

export function splitManual(text) {
  const pattern = /^\[(DOC-\d{2})\] ([^\n]+)$/gm;
  const matches = [...text.matchAll(pattern)];
  return matches.map((match, index) => {
    const content = text.slice(match.index, matches[index + 1]?.index ?? text.length).trim();
    return { id: match[1], title: match[2].trim(), content };
  }).filter((section) => section.content.length > 80);
}

async function getCollection(create = false) {
  // Il client JavaScript comunica con il server Chroma locale sulla porta 8000.
  const { ChromaClient } = await import('chromadb');
  const client = new ChromaClient({ host: 'localhost', port: 8000, ssl: false });
  try {
    await client.heartbeat();
    return create
      ? await client.getOrCreateCollection({ name: collectionName, embeddingFunction: null })
      : await client.getCollection({ name: collectionName, embeddingFunction: null });
  } catch (error) {
    throw new Error(`ChromaDB non è pronto sulla porta 8000 o il manuale non è indicizzato: ${error.message}`);
  }
}

async function embed(text, taskType, title) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'incolla_qui_la_tua_chiave') {
    throw new Error('Manca GEMINI_API_KEY nel file .env.');
  }
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${embeddingModel}:embedContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    signal: AbortSignal.timeout(30000),
    body: JSON.stringify({
      model: `models/${embeddingModel}`,
      content: { parts: [{ text }] },
      embedContentConfig: {
        taskType,
        outputDimensionality: embeddingSize,
        ...(title ? { title } : {}),
      },
    }),
  });
  if (!response.ok) {
    throw new Error(response.status === 429
      ? 'Limite gratuito degli embedding raggiunto. Riprova più tardi o verifica le quote nel tuo progetto Google.'
      : `Servizio embedding non disponibile (HTTP ${response.status}).`);
  }
  const data = await response.json();
  const values = data.embedding?.values ?? data.embeddings?.[0]?.values;
  if (!Array.isArray(values) || values.length < embeddingSize || values.slice(0, embeddingSize).some((n) => !Number.isFinite(n))) {
    const length = Array.isArray(values) ? values.length : 'assente';
    throw new Error(`Embedding non valido ricevuto da Gemini (dimensioni: ${length}; campi: ${Object.keys(data).join(', ') || 'nessuno'}).`);
  }
  // gemini-embedding-001 può restituire il vettore completo (3072 dimensioni).
  // I primi 768 valori sono utili per la ricerca, previa normalizzazione L2.
  const reduced = values.slice(0, embeddingSize);
  const norm = Math.hypot(...reduced);
  if (!Number.isFinite(norm) || norm === 0) throw new Error('Embedding di Gemini senza valori utilizzabili.');
  return reduced.map((value) => value / norm);
}

export async function indexManual() {
  const sections = splitManual(await readFile(manualPath, 'utf8'));
  if (sections.length < 5) throw new Error('Il manuale non contiene abbastanza sezioni indicizzabili.');
  const collection = await getCollection(true);
  const embeddings = [];
  for (const section of sections) {
    embeddings.push(await embed(section.content, 'RETRIEVAL_DOCUMENT', section.title));
  }
  await collection.upsert({
    ids: sections.map(({ id }) => id),
    documents: sections.map(({ content }) => content),
    metadatas: sections.map(({ id, title }) => ({ source: 'manuale_nesso.txt', section: id, title })),
    embeddings,
  });
  return sections.length;
}

export async function searchManual(question) {
  if (typeof question !== 'string' || !question.trim() || question.length > 2000) {
    throw new Error('Domanda non valida per la ricerca nel manuale.');
  }
  const collection = await getCollection();
  const vector = await embed(question.trim(), 'RETRIEVAL_QUERY');
  const result = await collection.query({
    queryEmbeddings: [vector],
    nResults: 3,
    include: ['documents', 'metadatas', 'distances'],
  });
  return (result.ids?.[0] || []).map((id, index) => ({
    id,
    title: result.metadatas?.[0]?.[index]?.title || id,
    source: result.metadatas?.[0]?.[index]?.source || 'manuale_nesso.txt',
    text: result.documents?.[0]?.[index] || '',
    distance: result.distances?.[0]?.[index] ?? null,
  })).filter((item) => item.text);
}
