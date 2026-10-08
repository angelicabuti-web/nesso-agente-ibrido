import React, { useEffect, useRef, useState } from 'react';
import Diary from './Diary.jsx';
import Learn from './Learn.jsx';

const diaryStorageKey = 'nesso-diary-v1';

function readDiaryRecords() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(diaryStorageKey) || '{}');
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {};
    return Object.fromEntries(Object.entries(saved).filter(([day, entry]) =>
      /^\d{4}-\d{2}-\d{2}$/.test(day) && entry && typeof entry === 'object' && !Array.isArray(entry)
    ).map(([day, entry]) => [day, {
      emotions: Array.isArray(entry.emotions) ? entry.emotions.filter((value) => typeof value === 'string').slice(0, 20) : [],
      mood: Number.isInteger(entry.mood) && entry.mood >= 1 && entry.mood <= 5 ? entry.mood : null,
      stress: Number.isInteger(entry.stress) && entry.stress >= 1 && entry.stress <= 5 ? entry.stress : null,
      anxiety: Number.isInteger(entry.anxiety) && entry.anxiety >= 1 && entry.anxiety <= 5 ? entry.anxiety : null,
      note: typeof entry.note === 'string' ? entry.note.slice(0, 2000) : '',
    }]));
  } catch {
    return {};
  }
}

function plainReply(value) {
  return value.replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/(^|\s)\*([^*\n]+)\*(?=\s|$)/gm, '$1$2')
    .replace(/^\s*\*\s+/gm, '• ');
}

const choices = [
  {
    id: 'talk',
    number: '01',
    title: 'Ho bisogno di parlare',
    description: 'Uno spazio per raccontare ciò che stai vivendo, con i tuoi tempi.',
    info: 'Apre una conversazione libera con Nesso. Questa demo universitaria usa soltanto situazioni inventate: non inserire informazioni personali reali.',
  },
  {
    id: 'learn',
    number: '02',
    title: 'Vorrei capire come mi sento',
    description: 'Esplora le emozioni e trova spiegazioni chiare e documentate.',
    info: 'Ti aiuta a cercare informazioni sulle emozioni, sul corpo e sulla mente. Le spiegazioni saranno accompagnate dalle fonti.',
  },
  {
    id: 'journal',
    number: '03',
    title: 'Qual è il mio stato d’animo oggi?',
    description: 'Registra come ti senti e osserva il tuo percorso nel tempo.',
    info: 'Registra emozioni, umore, stress e ansia; aggiungi una nota se vuoi. Potrai rivedere i giorni in un calendario e nei grafici.',
  },
];

function App() {
  const [activeInfo, setActiveInfo] = useState(null);
  const [activePage, setActivePage] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [draft, setDraft] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [teamMessages, setTeamMessages] = useState([]);
  const [chatPending, setChatPending] = useState(false);
  const [chatError, setChatError] = useState('');
  const [diaryRecords, setDiaryRecords] = useState(readDiaryRecords);
  const [diarySavedLocally, setDiarySavedLocally] = useState(true);
  const helpCloseRef = useRef(null);
  const previousFocusRef = useRef(null);
  const isTeam = activePage === 'team';
  const displayedMessages = isTeam ? teamMessages : chatMessages;

  useEffect(() => {
    try {
      window.localStorage.setItem(diaryStorageKey, JSON.stringify(diaryRecords));
      setDiarySavedLocally(true);
    } catch {
      setDiarySavedLocally(false);
    }
  }, [diaryRecords]);

  useEffect(() => {
    if (!showHelp) return undefined;
    previousFocusRef.current = document.activeElement;
    helpCloseRef.current?.focus();
    function handleHelpKeys(event) {
      if (event.key === 'Escape') setShowHelp(false);
      if (event.key !== 'Tab') return;
      const controls = [...document.querySelectorAll('.help-dialog a[href], .help-dialog button:not([disabled])')];
      if (!controls.length) return;
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', handleHelpKeys);
    return () => {
      document.removeEventListener('keydown', handleHelpKeys);
      previousFocusRef.current?.focus();
    };
  }, [showHelp]);

  async function askNesso(messages, mode = isTeam ? 'team' : 'personal') {
    setChatError('');
    setChatPending(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, messages: messages.slice(-20).map(({ role, content }) => ({ role, content })) }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || typeof result.reply !== 'string') throw new Error(result.error || 'Risposta non disponibile. Controlla che il server della chat sia avviato.');
      const appendReply = (items) => [...items, {
        role: 'assistant', content: result.reply,
        sources: Array.isArray(result.sources) ? result.sources : [],
        charts: Array.isArray(result.charts) ? result.charts : [],
      }];
      if (mode === 'team') setTeamMessages(appendReply);
      else setChatMessages(appendReply);
    } catch (error) {
      setChatError(error.message === 'Failed to fetch'
        ? 'Il server della chat non risponde. Controlla che sia avviato e riprova.'
        : error.message);
    } finally {
      setChatPending(false);
    }
  }

  function sendDraft(event) {
    event.preventDefault();
    const message = draft.trim();
    if (!message || chatPending) return;
    const next = [...displayedMessages, { role: 'user', content: message }];
    if (isTeam) setTeamMessages(next);
    else setChatMessages(next);
    setDraft('');
    askNesso(next, isTeam ? 'team' : 'personal');
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <button className="wordmark" onClick={() => setActivePage(null)} aria-label="Nesso, torna alla home">nesso<span aria-hidden="true">.</span></button>
        <div className="header-actions">
          <span className="header-note">Il tuo spazio, ogni giorno</span>
          <button type="button" className="team-link" onClick={() => { setActivePage('team'); setChatError(''); setDraft(''); }}>Area team ↗</button>
        </div>
      </header>

      <main className="main-content">
        {(activePage === 'talk' || isTeam) ? (
          <section className={`chat-page ${isTeam ? 'team-page' : ''}`} aria-labelledby="chat-title">
            <button className="back-button" onClick={() => setActivePage(null)}>← Torna alla home</button>
            {isTeam && <p className="eyebrow team-eyebrow">Area team · demo aziendale</p>}
            <h1 id="chat-title">{isTeam ? 'Chiedi a Nesso.' : 'Raccontami che succede.'}</h1>
            {isTeam && <div className="team-intro">
              <p>Consulta le procedure e analizza i ticket sintetici del prototipo. Nesso sceglie il manuale o i dati e mostra le fonti e i grafici usati per rispondere.</p>
              <button type="button" onClick={() => setDraft('Quali dati del diario restano nel browser?')}>Prova: privacy del diario ↗</button>
              <button type="button" onClick={() => setDraft('Quali aree del prodotto generano più ticket?')}>Prova: ticket per area ↗</button>
            </div>}
            {displayedMessages.length > 0 && (
              <div className="chat-messages" aria-live="polite">
                {displayedMessages.map((message, index) => (
                  <div className={`chat-bubble ${message.role === 'user' ? 'my-message' : 'assistant-message'}`} key={index}>
                    <span className="chat-speaker">{message.role === 'user' ? 'Tu' : 'Nesso · IA'}</span>
                    <p>{isTeam && message.role === 'assistant' ? plainReply(message.content) : message.content}</p>
                    {isTeam && message.charts?.map((chart, chartIndex) => (
                      <figure className="team-chart" key={chartIndex}>
                        <img src={chart.image} alt={`Grafico: ${chart.title}. ${chart.summary.points.map((point) => `${point.label}: ${point.value}`).join('; ')}`} />
                        <figcaption>{chart.title} · {chart.summary.period.from}–{chart.summary.period.to} · {chart.summary.valid_rows} ticket validi · dati sintetici</figcaption>
                        <details><summary>Come sono stati puliti i dati?</summary><p>{chart.summary.note} Duplicati eliminati: {chart.summary.cleaning.duplicati_eliminati}; date non valide: {chart.summary.cleaning.date_non_valide}; tempi di prima risposta mancanti o anomali: {chart.summary.cleaning.prima_risposta_mancante}.</p></details>
                      </figure>
                    ))}
                    {isTeam && message.sources?.length > 0 && <details className="chat-sources">
                      <summary>Sezioni consultate ({message.sources.length})</summary>
                      <ul>{message.sources.map((source) => <li key={source.id}>
                        <strong>{source.id} · {source.title}</strong>
                        <p>{source.text}</p>
                      </li>)}</ul>
                    </details>}
                  </div>
                ))}
                {chatPending && <p className="chat-typing" role="status">Nesso sta scrivendo…</p>}
              </div>
            )}
            <form className="chat-composer" onSubmit={sendDraft}>
              <label className="sr-only" htmlFor="chat-input">Scrivi il tuo messaggio</label>
              <textarea
                id="chat-input"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form.requestSubmit();
                  }
                }}
                placeholder={isTeam ? 'Chiedi del manuale o dei ticket...' : 'Scrivi qui...'}
                rows="1"
                maxLength="4000"
              />
              <button type="submit" disabled={!draft.trim() || chatPending} aria-label="Invia messaggio">↑</button>
            </form>
            {chatError && (
              <div className="chat-error" role="alert">
                <span>{chatError}</span>
                <button type="button" disabled={chatPending} onClick={() => askNesso(displayedMessages, isTeam ? 'team' : 'personal')}>Riprova</button>
              </div>
            )}
            <button type="button" className="chat-human-link" onClick={() => setShowHelp(true)}>Ho bisogno di aiuto da una persona ↗</button>
            <p className="chat-notice"><strong>Demo universitaria · usa solo esempi inventati.</strong> Il testo viene inviato a Google Gemini; nel piano gratuito può essere usato per migliorare i suoi prodotti. La cronologia visibile si azzera ricaricando la pagina. Nesso è un’IA e non offre terapia né assistenza di emergenza.</p>
          </section>
        ) : activePage === 'journal' ? (
          <Diary onBack={() => setActivePage(null)} onTalk={() => setActivePage('talk')} records={diaryRecords} setRecords={setDiaryRecords} savedLocally={diarySavedLocally} />
        ) : activePage === 'learn' ? (
          <Learn onBack={() => setActivePage(null)} onTalk={() => setActivePage('talk')} />
        ) : (
          <>
            <section className="intro" aria-labelledby="home-title">
              <p className="eyebrow">Un momento per te</p>
              <h1 id="home-title">Come posso aiutarti <em>oggi?</em></h1>
              <p>Scegli da dove cominciare. Puoi sempre cambiare strada.</p>
            </section>

            <section className="choices" aria-label="Scegli come iniziare">
              {choices.map((choice) => (
                <article className={`choice-card ${choice.id}`} key={choice.id}>
                  <div className="card-heading">
                    <span className="choice-number">{choice.number}</span>
                    <button
                      type="button"
                      className="info-button"
                      aria-label={`Come funziona: ${choice.title}`}
                      aria-expanded={activeInfo === choice.id}
                      aria-controls={`info-${choice.id}`}
                      onClick={() => setActiveInfo(activeInfo === choice.id ? null : choice.id)}
                    >i</button>
                  </div>
                  <h2>{choice.title}</h2>
                  <p>{choice.description}</p>
                  {activeInfo === choice.id && <p id={`info-${choice.id}`} className="info-text">{choice.info}</p>}
                  <button type="button" className="card-action" onClick={() => { setActivePage(choice.id); setChatError(''); setDraft(''); }}>
                    Inizia <span aria-hidden="true">↗</span>
                  </button>
                </article>
              ))}
            </section>
          </>
        )}
      </main>

      <footer className="site-footer">
        <p>Nesso è un prototipo universitario basato sull’IA e non sostituisce un professionista.</p>
        <button type="button" onClick={() => setShowHelp(true)}>Ho bisogno di aiuto da una persona ↗</button>
      </footer>

      {showHelp && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowHelp(false); }}>
          <section className="help-dialog" role="dialog" aria-modal="true" aria-labelledby="help-title">
            <button type="button" className="close-button" ref={helpCloseRef} aria-label="Chiudi supporto umano" onClick={() => setShowHelp(false)}>×</button>
            <p className="eyebrow">Supporto umano</p>
            <h2 id="help-title">Se hai bisogno di una persona.</h2>
            <p className="help-intro">Nesso può aiutarti a mettere in parole ciò che senti, ma è un’IA: nessun professionista segue questa chat e non può intervenire in un’emergenza.</p>

            <div className="help-option">
              <h3>Vorrei parlarne con qualcuno</h3>
              <p>Puoi contattare una persona di cui ti fidi. Se cerchi ascolto telefonico in Italia, i volontari di <strong>Telefono Amico Italia</strong> rispondono al numero nazionale <strong>02 2327 2327</strong>. Non è un servizio di emergenza né una terapia; la chiamata ha il costo previsto dal tuo operatore per un numero fisso.</p>
              <a className="help-call" href="tel:+390223272327">Chiama Telefono Amico ↗</a>
              <a className="help-source" href="https://www.telefonoamico.it/cosa-facciamo/come-contattarci/" target="_blank" rel="noopener noreferrer">Fonte: Telefono Amico Italia ↗</a>
              <p className="help-followup">Per un confronto professionale, puoi rivolgerti al medico di base o al Centro di Salute Mentale della tua ASL.</p>
              <a className="help-source" href="https://www.salute.gov.it/new/it/tema/salute-mentale/la-rete-dei-servizi-la-salute-mentale/" target="_blank" rel="noopener noreferrer">Fonte: Ministero della Salute ↗</a>
            </div>
            <div className="help-option">
              <h3>Sei in pericolo immediato?</h3>
              <p>In Italia chiama il <strong>112</strong> per i servizi di emergenza. Vale in tutte le regioni italiane. Se possibile, avvisa anche una persona vicina.</p>
              <a className="help-call" href="tel:112">Chiama il 112 ↗</a>
              <a className="help-source" href="https://europa.eu/youreurope/citizens/travel/security-and-emergencies/emergency/index_en.htm" target="_blank" rel="noopener noreferrer">Fonte: Unione Europea ↗</a>
            </div>
            <div className="help-option">
              <h3>Stai vivendo violenza o stalking?</h3>
              <p>In Italia il <strong>1522</strong> è un servizio pubblico gratuito, attivo 24 ore su 24, che offre ascolto e orientamento alle vittime. Se c’è pericolo immediato, chiama il 112.</p>
              <a className="help-call" href="tel:1522">Chiama il 1522 ↗</a>
              <a className="help-source" href="https://www.pariopportunita.gov.it/it/numeri-utili/1522-numero-antiviolenza-e-antistalking/" target="_blank" rel="noopener noreferrer">Fonte: Dipartimento per le Pari Opportunità ↗</a>
            </div>
            <p className="help-location">I riferimenti sono per chi si trova in Italia. Se sei altrove, cerca i servizi del luogo in cui ti trovi.</p>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
