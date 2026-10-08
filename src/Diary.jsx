import React, { useState } from 'react';
import DiaryChart from './DiaryChart.jsx';
import './diary.css';

const difficultStates = [
  'Abbandono', 'Abbattimento', 'Disperazione', 'Dolore', 'Apatia',
  'Terrore', 'Solitudine', 'Ansia', 'Bassa autostima', 'Poca energia',
];
const otherStates = [
  'Autostima', 'Calma', 'Confusione', 'Disgusto', 'Felicità',
  'Ira', 'Tristezza', 'Molta energia', 'Spensieratezza',
];
const measures = [
  { id: 'mood', label: 'Umore', low: 'Molto basso', high: 'Molto alto' },
  { id: 'stress', label: 'Stress', low: 'Per niente', high: 'Molto' },
  { id: 'anxiety', label: 'Ansia', low: 'Per niente', high: 'Molto' },
];

function dayKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function startOfWeek(date) {
  const first = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  first.setDate(first.getDate() - ((first.getDay() + 6) % 7));
  return first;
}

function daysForPeriod(anchor, monthly) {
  const first = monthly ? startOfWeek(new Date(anchor.getFullYear(), anchor.getMonth(), 1)) : startOfWeek(anchor);
  const count = monthly ? Math.ceil((new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0).getDate() + ((new Date(anchor.getFullYear(), anchor.getMonth(), 1).getDay() + 6) % 7)) / 7) * 7 : 7;
  return Array.from({ length: count }, (_, index) => new Date(first.getFullYear(), first.getMonth(), first.getDate() + index));
}

const emptyDraft = () => ({ emotions: [], mood: null, stress: null, anxiety: null, note: '' });

function EmotionGroup({ title, items, selected, onToggle }) {
  return (
    <fieldset className="emotion-group">
      <legend>{title}</legend>
      <div className="emotion-options">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            className={`emotion-chip ${selected.includes(item) ? 'selected' : ''}`}
            aria-pressed={selected.includes(item)}
            onClick={() => onToggle(item)}
          >{item}{selected.includes(item) && <span aria-hidden="true"> ✓</span>}</button>
        ))}
      </div>
    </fieldset>
  );
}

export default function Diary({ onBack, onTalk, records, setRecords, savedLocally }) {
  const today = dayKey(new Date());
  const [selectedDay, setSelectedDay] = useState(today);
  const [anchor, setAnchor] = useState(new Date());
  const [monthly, setMonthly] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const visibleDays = daysForPeriod(anchor, monthly);
  const chartDays = monthly ? visibleDays.filter((date) => date.getMonth() === anchor.getMonth()) : visibleDays;
  const nextPeriod = monthly
    ? new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1)
    : new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() + 7);
  const canGoNext = dayKey(monthly ? nextPeriod : startOfWeek(nextPeriod)) <= today;
  const record = records[selectedDay];
  const canSave = draft.emotions.length > 0 || draft.mood !== null || draft.stress !== null || draft.anxiety !== null || draft.note.trim().length > 0;

  function movePeriod(direction) {
    if (direction > 0 && !canGoNext) return;
    const next = monthly
      ? new Date(anchor.getFullYear(), anchor.getMonth() + direction, 1)
      : new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() + 7 * direction);
    const periodEnd = monthly
      ? new Date(next.getFullYear(), next.getMonth() + 1, 0)
      : new Date(startOfWeek(next).getFullYear(), startOfWeek(next).getMonth(), startOfWeek(next).getDate() + 6);
    setAnchor(next);
    setSelectedDay(dayKey(periodEnd) > today ? today : dayKey(periodEnd));
    setEditing(false);
  }

  function openEntry() {
    setDraft(record ? { ...record, emotions: [...record.emotions] } : emptyDraft());
    setEditing(true);
  }

  function toggleEmotion(emotion) {
    setDraft((previous) => ({
      ...previous,
      emotions: previous.emotions.includes(emotion)
        ? previous.emotions.filter((item) => item !== emotion)
        : [...previous.emotions, emotion],
    }));
  }

  function saveEntry(event) {
    event.preventDefault();
    if (!canSave) return;
    setRecords((previous) => ({ ...previous, [selectedDay]: { ...draft, note: draft.note.trim() } }));
    setEditing(false);
  }

  function deleteEntry() {
    if (!window.confirm('Eliminare la registrazione di questo giorno?')) return;
    setRecords((previous) => {
      const next = { ...previous };
      delete next[selectedDay];
      return next;
    });
  }

  function clearDiary() {
    if (!window.confirm('Eliminare tutte le registrazioni del diario da questo browser?')) return;
    setRecords({});
    setEditing(false);
  }

  const privacyMessage = savedLocally
    ? 'Demo: usa solo esempi inventati. Le registrazioni sono salvate in questo browser e non vengono inviate alla chat IA. Puoi cancellarle qui sotto.'
    : 'Questo browser non permette il salvataggio: le registrazioni scompariranno ricaricando la pagina.';

  return (
    <section className="diary-page" aria-labelledby="diary-title">
      <button className="back-button" onClick={onBack}>← Torna alla home</button>
      <h1 id="diary-title" className="sr-only">Calendario del diario</h1>

      <div className="calendar-panel">
        <div className="calendar-toolbar">
          <div>
            <p className="calendar-kicker">Il tuo percorso</p>
            <h2>{new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric' }).format(anchor)}</h2>
          </div>
          <div className="calendar-controls">
            <button type="button" onClick={() => movePeriod(-1)} aria-label={monthly ? 'Mese precedente' : 'Settimana precedente'}>‹</button>
            <button type="button" onClick={() => movePeriod(1)} disabled={!canGoNext} aria-label={monthly ? 'Mese successivo' : 'Settimana successiva'}>›</button>
            <button type="button" className="calendar-toggle" onClick={() => setMonthly(!monthly)} aria-pressed={monthly} aria-label={monthly ? 'Mostra la settimana' : 'Mostra il mese'} title={monthly ? 'Mostra la settimana' : 'Mostra il mese'}>▦</button>
          </div>
        </div>
        <div className="calendar-grid" role="group" aria-label="Seleziona un giorno">
          {visibleDays.map((date) => {
            const key = dayKey(date);
            return (
              <button
                key={key}
                type="button"
                className={`calendar-day ${key === selectedDay ? 'active' : ''} ${key === today ? 'today' : ''} ${monthly && date.getMonth() !== anchor.getMonth() ? 'outside-month' : ''}`}
                aria-label={new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date)}
                aria-pressed={key === selectedDay}
                disabled={key > today}
                onClick={() => { setSelectedDay(key); setEditing(false); }}
              >
                <span className="weekday">{key === today ? 'OGGI' : new Intl.DateTimeFormat('it-IT', { weekday: 'short' }).format(date).replace('.', '').toUpperCase()}</span>
                <span className="day-number">{date.getDate()}</span>
                <span className={`day-dot ${records[key] ? 'filled' : ''}`} aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>

      {!editing ? (
        <div className="diary-start">
          {record && (
            <div className="record-summary">
              <h2>La tua giornata</h2>
              {record.emotions.length > 0 && <p>{record.emotions.join(' · ')}</p>}
              <div className="record-measures">
                {measures.filter(({ id }) => record[id] !== null).map(({ id, label }) => <span key={id}>{label}: {record[id]}/5</span>)}
              </div>
              {record.note && <p className="record-note">{record.note}</p>}
              {record.mood !== null && record.mood <= 2 && (
                <div className="diary-talk-invite">
                  <p>Oggi hai indicato un umore basso. Ti va di raccontarmi cosa c’è dietro?</p>
                  <button type="button" onClick={onTalk}>Apri la conversazione ↗</button>
                </div>
              )}
              <button type="button" className="diary-delete" onClick={deleteEntry}>Elimina questa registrazione</button>
            </div>
          )}
          <button type="button" className="diary-primary" onClick={openEntry}>{record ? 'Modifica la registrazione' : 'Registra il tuo umore'} <span aria-hidden="true">↗</span></button>
          <p className="diary-privacy">{privacyMessage}</p>
        </div>
      ) : (
        <form className="diary-form" onSubmit={saveEntry}>
          <h2>Come ti senti oggi?</h2>
          <p>Puoi selezionare più emozioni e compilare solo ciò che vuoi.</p>
          <EmotionGroup title="Stati difficili" items={difficultStates} selected={draft.emotions} onToggle={toggleEmotion} />
          <EmotionGroup title="Altre emozioni e sensazioni" items={otherStates} selected={draft.emotions} onToggle={toggleEmotion} />
          <div className="measures">
            {measures.map(({ id, label, low, high }) => (
              <fieldset key={id} className="measure-group">
                <legend>{label}</legend>
                <div className="scale-buttons">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button key={value} type="button" className={draft[id] === value ? 'selected' : ''} aria-label={`${label}: ${value} su 5`} aria-pressed={draft[id] === value} onClick={() => setDraft((previous) => ({ ...previous, [id]: value }))}>{value}</button>
                  ))}
                </div>
                <div className="scale-captions"><span>{low}</span><span>{high}</span></div>
              </fieldset>
            ))}
          </div>
          <label className="note-label" htmlFor="diary-note">Vuoi aggiungere una nota? <span>Facoltativo</span></label>
          <textarea id="diary-note" value={draft.note} onChange={(event) => setDraft((previous) => ({ ...previous, note: event.target.value }))} placeholder="Scrivi liberamente..." rows="4" maxLength="2000" />
          <div className="diary-actions">
            <button type="button" className="diary-cancel" onClick={() => setEditing(false)}>Annulla</button>
            <button type="submit" className="diary-primary" disabled={!canSave}>Salva la giornata</button>
          </div>
          <p className="diary-privacy">{privacyMessage}</p>
        </form>
      )}
      <DiaryChart days={chartDays} records={records} monthly={monthly} />
      {Object.keys(records).length > 0 && <button type="button" className="diary-clear" onClick={clearDiary}>Cancella tutte le registrazioni del diario</button>}
    </section>
  );
}
