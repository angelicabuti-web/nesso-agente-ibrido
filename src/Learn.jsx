import React, { useRef, useState } from 'react';
import { emotionCatalog, extraSources } from './emotionCatalog.js';
import './learn.css';

const sources = {
  ...extraSources,
  stress: { name: 'NIMH · Stress e ansia', description: 'Scheda del National Institute of Mental Health', url: 'https://www.nimh.nih.gov/health/publications/so-stressed-out-fact-sheet' },
  anxiety: { name: 'NIMH · Disturbo d’ansia generalizzata', description: 'Scheda del National Institute of Mental Health', url: 'https://www.nimh.nih.gov/health/publications/generalized-anxiety-disorder-gad' },
  adrenaline: { name: 'Cleveland Clinic · Adrenalina', description: 'Articolo con revisione medica', url: 'https://my.clevelandclinic.org/health/articles/22611-epinephrine-adrenaline' },
  physiology: { name: 'Herman e colleghi · Risposta allo stress', description: 'Review scientifica, testo completo su PubMed Central', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4867107/' },
  sympathetic: { name: 'Cleveland Clinic · Sistema nervoso simpatico', description: 'Articolo con revisione medica', url: 'https://my.clevelandclinic.org/health/body/23262-sympathetic-nervous-system-sns-fight-or-flight' },
  noradrenaline: { name: 'Cleveland Clinic · Noradrenalina', description: 'Articolo con revisione medica', url: 'https://my.clevelandclinic.org/health/articles/22610-norepinephrine-noradrenaline' },
  amygdala: { name: 'Cleveland Clinic · Amigdala', description: 'Articolo con revisione medica', url: 'https://my.clevelandclinic.org/health/body/24894-amygdala' },
  hypothalamus: { name: 'Cleveland Clinic · Ipotalamo', description: 'Articolo con revisione medica', url: 'https://my.clevelandclinic.org/health/body/22566-hypothalamus' },
  dopamine: { name: 'Cleveland Clinic · Dopamina', description: 'Articolo con revisione medica', url: 'https://my.clevelandclinic.org/health/articles/22581-dopamine' },
};

const glossary = {
  disturbo: {
    title: 'Disturbo (in salute mentale)',
    definition: 'È un termine clinico per una condizione valutata da un professionista sulla base di diversi elementi, fra cui durata, intensità e impatto dei sintomi. Un’emozione o una giornata difficile, da sole, non stabiliscono una diagnosi.',
    sourceKey: 'anxiety',
  },
  'sistema nervoso simpatico': {
    title: 'Sistema nervoso simpatico',
    definition: 'È una parte del sistema nervoso che regola automaticamente alcune funzioni del corpo. Nelle situazioni di stress può prepararlo all’azione, per esempio facendo aumentare il battito cardiaco.',
    sourceKey: 'sympathetic',
  },
  adrenalina: {
    title: 'Adrenalina',
    definition: 'È una sostanza che il corpo usa per trasmettere segnali. Quando viene rilasciata come ormone dalle ghiandole surrenali, contribuisce a una risposta rapida allo stress, per esempio aumentando il battito.',
    sourceKey: 'adrenaline',
  },
  noradrenalina: {
    title: 'Noradrenalina',
    definition: 'È un messaggero chimico usato dai nervi e anche un ormone. Partecipa alla risposta di allerta del corpo, insieme ad altri segnali come l’adrenalina.',
    sourceKey: 'noradrenaline',
  },
  'asse ipotalamo-ipofisi-surrene': {
    title: 'Asse ipotalamo-ipofisi-surrene',
    definition: 'È una catena di comunicazione: l’ipotalamo invia un segnale all’ipofisi, che a sua volta stimola le ghiandole surrenali. È uno dei sistemi con cui il corpo regola la risposta allo stress, compresa la produzione di cortisolo.',
    sourceKey: 'physiology',
  },
  cortisolo: {
    title: 'Cortisolo',
    definition: 'È un ormone prodotto dalle ghiandole surrenali che partecipa, tra le altre funzioni, alla risposta allo stress. La sua presenza è normale e non permette da sola di capire come si sente una persona.',
    sourceKey: 'physiology',
  },
  amigdala: {
    title: 'Amigdala',
    definition: 'È una piccola struttura presente in entrambi i lati del cervello. Partecipa all’elaborazione delle emozioni, all’apprendimento e al riconoscimento di stimoli che possono essere importanti o minacciosi.',
    sourceKey: 'amygdala',
  },
  ipotalamo: {
    title: 'Ipotalamo',
    definition: 'È una regione profonda del cervello che aiuta a regolare funzioni come temperatura, fame e sonno. Mette in comunicazione il sistema nervoso con quello ormonale e partecipa anche alle risposte allo stress.',
    sourceKey: 'hypothalamus',
  },
  'corteccia prefrontale': {
    title: 'Corteccia prefrontale',
    definition: 'È una parte della zona frontale del cervello coinvolta, insieme ad altre aree, nell’attenzione, nella valutazione delle situazioni e nella regolazione delle risposte. Non lavora da sola.',
    sourceKey: 'networks',
  },
  insula: {
    title: 'Insula',
    definition: 'È una regione del cervello che partecipa a integrare segnali del corpo e informazioni importanti per l’esperienza emotiva. Non appartiene a una sola emozione.',
    sourceKey: 'networks',
  },
  'striato ventrale': {
    title: 'Striato ventrale',
    definition: 'È una parte di una rete che partecipa a motivazione, apprendimento e valutazione delle ricompense. Non è un “misuratore di felicità”.',
    sourceKey: 'rewardBrain',
  },
  'sistema nervoso autonomo': {
    title: 'Sistema nervoso autonomo',
    definition: 'Regola molte funzioni che non controlliamo volontariamente, come battito e digestione. Il sistema simpatico è una delle sue componenti.',
    sourceKey: 'sympathetic',
  },
  neurotrasmettitore: {
    title: 'Neurotrasmettitore',
    definition: 'È un messaggero chimico che permette alle cellule nervose di comunicare. Una singola sostanza non spiega da sola un’emozione.',
    sourceKey: 'noradrenaline',
  },
  dopamina: {
    title: 'Dopamina',
    definition: 'È un messaggero chimico coinvolto in movimento, motivazione e apprendimento da ricompense. Non è una misura diretta della felicità.',
    sourceKey: 'dopamine',
  },
};

const glossaryTerms = Object.keys(glossary).sort((a, b) => b.length - a.length);
const glossaryPattern = new RegExp(`(${glossaryTerms.join('|')})`, 'giu');

const sections = [
  {
    id: 'mente', title: 'Che cosa succede nella mente', preview: 'Preoccupazioni, attenzione e pensieri rivolti al futuro.',
    paragraphs: [
      'L’ansia può presentarsi quando anticipiamo qualcosa di incerto o percepito come difficile. L’attenzione può concentrarsi su ciò che potrebbe andare storto; alcune persone avvertono irrequietezza o fanno fatica a rilassarsi.',
      'Provare ansia ogni tanto è comune e, da solo, non indica un disturbo. Conta anche quanto dura e quanto incide sulla tua vita.',
    ], sourceKeys: ['stress', 'anxiety'],
  },
  {
    id: 'corpo', title: 'Che cosa succede nel corpo', preview: 'Battito, respiro e risposta fisiologica allo stress.',
    paragraphs: [
      'Quando il corpo si prepara a reagire a una situazione percepita come minacciosa, il sistema nervoso simpatico può aumentare il battito cardiaco e rendere il respiro più rapido. Adrenalina e noradrenalina partecipano alla risposta immediata.',
      'Un’altra via, chiamata asse ipotalamo-ipofisi-surrene, può contribuire alla risposta allo stress attraverso il cortisolo. Non tutte le persone sperimentano gli stessi segnali e questi meccanismi non spiegano, da soli, ogni episodio di ansia.',
    ], sourceKeys: ['adrenaline', 'physiology'],
  },
  {
    id: 'cervello', title: 'Quali parti del cervello partecipano', preview: 'Circuiti che valutano gli stimoli e regolano la risposta.',
    paragraphs: [
      'Non c’è un unico “centro dell’ansia”. L’amigdala partecipa all’elaborazione di stimoli rilevanti, anche quando sembrano minacciosi; l’ipotalamo contribuisce a coordinare alcune risposte fisiche allo stress.',
      'Queste aree interagiscono con altre regioni e con il resto del corpo. La spiegazione dei circuiti è una semplificazione utile per orientarsi, non una lettura del cervello della singola persona.',
    ], sourceKeys: ['physiology', 'adrenaline'],
  },
  {
    id: 'aiuto', title: 'Quando cercare un confronto', preview: 'Segnali che meritano attenzione e possibilità di supporto.',
    paragraphs: [
      'Se l’ansia non passa, porta a evitare situazioni o interferisce con studio, lavoro, relazioni o sonno, può essere utile parlarne con un professionista della salute mentale o con il medico di base.',
      'Una scheda informativa può aiutarti a formulare domande, ma non può stabilire se hai un disturbo né sostituire una valutazione personale.',
    ], sourceKeys: ['stress', 'anxiety'],
  },
];

const anxietyTopic = {
  id: 'ansia', title: 'Ansia', aliases: ['nervosismo', 'preoccupazione'], sections,
  lede: 'Un’emozione che può accompagnare l’incertezza o una situazione percepita come minacciosa. Si può provare ansia anche senza un pericolo immediato.',
};
const topics = [anxietyTopic, ...emotionCatalog];
const difficultTopicIds = new Set(['abbandono', 'depressione', 'disperazione', 'dolore', 'apatia', 'terrore', 'solitudine', 'ansia', 'bassa-autostima', 'poca-energia']);

function normalizeEmotion(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('it-IT').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

function TopicCard({ section }) {
  const [activeTerm, setActiveTerm] = useState(null);
  const termButtonRef = useRef(null);

  function renderParagraph(paragraph, index) {
    return paragraph.split(glossaryPattern).map((part, pieceIndex) => {
      const key = part.toLocaleLowerCase('it-IT');
      if (!glossary[key]) return part;
      const isActive = activeTerm?.key === key && activeTerm.index === index;
      return (
        <button
          className="glossary-term"
          type="button"
          key={`${index}-${pieceIndex}`}
          aria-label={`${part}: apri definizione`}
          aria-expanded={isActive}
          onClick={(event) => {
            termButtonRef.current = event.currentTarget;
            setActiveTerm(isActive ? null : { key, index });
          }}
        >{part}</button>
      );
    });
  }

  return (
    <details className="topic-card">
      <summary>
        <span className="topic-card-summary">
          <span className="topic-card-title">{section.title}</span>
          <span className="topic-card-preview">{section.preview}</span>
        </span>
        <span className="topic-card-toggle" aria-hidden="true">+</span>
      </summary>
      <div className="topic-card-content">
        {section.paragraphs.map((paragraph, index) => (
          <React.Fragment key={`${section.id}-${index}`}>
            <p>{renderParagraph(paragraph, index)}</p>
            {activeTerm?.index === index && (
              <aside className="glossary-definition" aria-label={`Definizione: ${glossary[activeTerm.key].title}`}>
                <div className="glossary-definition-heading">
                  <div><span className="glossary-eyebrow">Mini dizionario</span><h4>{glossary[activeTerm.key].title}</h4></div>
                  <button type="button" className="glossary-close" aria-label="Chiudi definizione" onClick={() => {
                    setActiveTerm(null);
                    termButtonRef.current?.focus();
                  }}>×</button>
                </div>
                <p>{glossary[activeTerm.key].definition}</p>
                <a href={sources[glossary[activeTerm.key].sourceKey].url} target="_blank" rel="noopener noreferrer">
                  Leggi la fonte: {sources[glossary[activeTerm.key].sourceKey].name} ↗
                </a>
              </aside>
            )}
          </React.Fragment>
        ))}
        <div className="topic-card-sources">
          <h4>Fonti per questa scheda</h4>
          <ul>
            {section.sourceKeys.map((key) => (
              <li key={key}>
                <a href={sources[key].url} target="_blank" rel="noopener noreferrer">
                  <span>{sources[key].name}</span><span aria-hidden="true">↗</span>
                </a>
                <small>{sources[key].description}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </details>
  );
}

function EmotionArticle({ topic, onTalk }) {
  return (
    <article className="emotion-article" aria-labelledby="article-title">
      <div className="article-topline"><span>Scheda informativa</span><span>Chapsy · Capire cosa sento</span></div>
      <h2 id="article-title" tabIndex={-1}>{topic.title}</h2>
      <p className="article-lede">{topic.lede}</p>
      <p className="article-hint">Apri una scheda per approfondire. Puoi toccare i termini evidenziati per leggerne una definizione semplice e la relativa fonte.</p>
      <div className="article-grid">{topic.sections.map((section) => <TopicCard key={`${topic.id}-${section.id}`} section={section} />)}</div>
      <p className="article-disclaimer">Queste sono possibilità generali: circuiti cerebrali e segnali del corpo variano e non identificano da soli ciò che prova una persona. Una singola emozione, piacevole o difficile, non costituisce una diagnosi.</p>
      <div className="article-conversation">
        <p>Vuoi raccontare come la vivi tu?</p>
        <button type="button" onClick={onTalk}>Parliamone ↗</button>
      </div>
    </article>
  );
}

export default function Learn({ onBack, onTalk }) {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState('');
  const catalogRef = useRef(null);
  const normalized = normalizeEmotion(searched);
  const selectedTopic = normalized && topics.find((topic) =>
    [topic.title, ...topic.aliases].some((label) => normalizeEmotion(label) === normalized)
  );

  function search(event) {
    event.preventDefault();
    setSearched(query.trim());
    if (catalogRef.current) catalogRef.current.open = false;
    requestAnimationFrame(() => document.querySelector('#article-title, #empty-title')?.focus());
  }

  function chooseTopic(topic) {
    setQuery(topic.title);
    setSearched(topic.title);
    if (catalogRef.current) catalogRef.current.open = false;
    requestAnimationFrame(() => document.querySelector('#article-title, #empty-title')?.focus());
  }

  return (
    <section className="learn-page" aria-labelledby="learn-title">
      <button className="back-button" onClick={onBack}>← Torna alla home</button>
      <div className="learn-intro">
        <p className="eyebrow">Capire cosa sento</p>
        <h1 id="learn-title">Descrivi con una parola l’emozione che vuoi capire.</h1>
        <form className="emotion-search" role="search" onSubmit={search}>
          <label className="sr-only" htmlFor="emotion-query">Emozione da cercare</label>
          <input id="emotion-query" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Per esempio: ansia, solitudine, calma" />
          <button type="submit" disabled={!query.trim()}>Cerca</button>
        </form>
      </div>
      <details className="emotion-catalog" ref={catalogRef}>
        <summary>Esplora tutte le voci <span>{topics.length}</span></summary>
        <div className="emotion-catalog-content">
          <h2>Vissuti e difficoltà</h2>
          <div className="emotion-catalog-list">
            {topics.filter((topic) => difficultTopicIds.has(topic.id)).map((topic) => (
              <button type="button" key={topic.id} onClick={() => chooseTopic(topic)}>{topic.title}</button>
            ))}
          </div>
          <h2>Emozioni e stati di energia</h2>
          <div className="emotion-catalog-list">
            {topics.filter((topic) => !difficultTopicIds.has(topic.id)).map((topic) => (
              <button type="button" key={topic.id} onClick={() => chooseTopic(topic)}>{topic.title}</button>
            ))}
          </div>
        </div>
      </details>
      {selectedTopic && <EmotionArticle key={selectedTopic.id} topic={selectedTopic} onTalk={onTalk} />}
      {searched && !selectedTopic && (
        <div className="learn-empty" role="status">
          <h2 id="empty-title" tabIndex={-1}>Non abbiamo ancora una scheda per questa ricerca.</h2>
          <p>Prova un’altra parola oppure apri “Esplora tutte le voci” per vedere gli argomenti disponibili.</p>
        </div>
      )}
    </section>
  );
}
