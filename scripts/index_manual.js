import 'dotenv/config';
import { indexManual, searchManual } from '../server/rag.js';

try {
  const count = await indexManual();
  console.log(`Indicizzate ${count} sezioni del manuale in ChromaDB.`);
  const matches = await searchManual('Quali dati del diario restano nel browser?');
  console.log('Verifica ricerca:', matches.map(({ id, title }) => `${id} ${title}`).join(' · '));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
