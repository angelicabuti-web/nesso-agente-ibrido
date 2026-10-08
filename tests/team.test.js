import test from 'node:test';
import assert from 'node:assert/strict';
import { answerTeam } from '../server/team.js';

test('consulta il manuale e rimanda a Gemini la risposta della funzione con id e firma', async () => {
  const requests = [];
  const modelContent = {
    role: 'model',
    parts: [{ functionCall: { name: 'search_manual', id: 'call-1', args: { question: 'privacy diario' } }, thoughtSignature: 'opaque-signature' }],
  };
  const callModel = async (request) => {
    requests.push(request);
    return requests.length === 1
      ? { candidates: [{ content: modelContent }] }
      : { candidates: [{ content: { parts: [{ text: 'Il diario resta nel browser [DOC-03].' }] } }] };
  };
  let searched = '';
  const search = async (question) => {
    searched = question;
    return [{ id: 'DOC-03', title: 'DATI E PRIVACY', text: 'Il diario resta nel browser.' }];
  };
  const result = await answerTeam([{ role: 'user', content: 'Dove resta il diario?' }], callModel, search);
  assert.equal(searched, 'privacy diario');
  assert.equal(requests[0].toolConfig.functionCallingConfig.mode, 'ANY');
  assert.equal(requests[1].contents.at(-2), modelContent);
  assert.deepEqual(requests[1].contents.at(-1).parts[0].functionResponse, {
    name: 'search_manual', id: 'call-1',
    response: { sections: [{ id: 'DOC-03', title: 'DATI E PRIVACY', text: 'Il diario resta nel browser.' }] },
  });
  assert.equal(result.reply, 'Il diario resta nel browser [DOC-03].');
  assert.equal(result.sources[0].id, 'DOC-03');
});

test('sceglie il modulo dati e restituisce grafico e risultati calcolati', async () => {
  const calls = [];
  const request = { role: 'model', parts: [{ functionCall: { name: 'analyze_tickets', id: 'chart-1', args: { metric: 'count', dimension: 'area' } } }] };
  const callModel = async (body) => {
    calls.push(body);
    return { candidates: [{ content: calls.length === 1 ? request : { parts: [{ text: 'La Chat IA ha 500 ticket sintetici.' }] } }] };
  };
  const analyze = async (args) => {
    assert.deepEqual(args, { metric: 'count', dimension: 'area' });
    return { metric_label: 'Ticket', dimension_label: 'Area', points: [{ label: 'Chat IA', value: 500 }], chart: 'data:image/png;base64,AAA' };
  };
  const result = await answerTeam([{ role: 'user', content: 'Quale area?' }], callModel, async () => { throw new Error('Wrong route'); }, analyze);
  assert.equal(calls[1].contents.at(-1).parts[0].functionResponse.name, 'analyze_tickets');
  assert.equal(calls[1].contents.at(-1).parts[0].functionResponse.response.chart, undefined);
  assert.equal(result.charts[0].image, 'data:image/png;base64,AAA');
});
