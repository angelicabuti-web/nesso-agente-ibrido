import React from 'react';

const series = [
  { id: 'mood', label: 'Umore', color: '#367a6b' },
  { id: 'stress', label: 'Stress', color: '#2c6a96' },
  { id: 'anxiety', label: 'Ansia', color: '#74658f' },
];

const width = 740;
const height = 230;
const left = 42;
const right = 19;
const top = 18;
const bottom = 37;

function dayKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function pointPosition(index, value, count) {
  return {
    x: left + (index * (width - left - right)) / Math.max(count - 1, 1),
    y: top + ((5 - value) * (height - top - bottom)) / 4,
  };
}

export default function DiaryChart({ days, records, monthly }) {
  const plotted = series.map((item) => ({
    ...item,
    points: days.flatMap((date, index) => {
      const value = records[dayKey(date)]?.[item.id];
      return Number.isInteger(value) && value >= 1 && value <= 5
        ? [{ ...pointPosition(index, value, days.length), date, value }]
        : [];
    }),
  }));
  const hasValues = plotted.some((item) => item.points.length > 0);
  const labelledDays = monthly
    ? [0, 7, 14, 21, days.length - 1].filter((index, position, items) => index < days.length && items.indexOf(index) === position)
    : days.map((_, index) => index);
  const description = plotted.map((item) => {
    const values = item.points.map((point) => `${point.date.getDate()} ${new Intl.DateTimeFormat('it-IT', { month: 'long' }).format(point.date)}: ${point.value} su 5`);
    return `${item.label}: ${values.length ? values.join(', ') : 'nessun valore'}`;
  }).join('; ');

  return (
    <section className="diary-chart" aria-labelledby="diary-chart-title">
      <div className="diary-chart-heading">
        <div>
          <p className="calendar-kicker">Uno sguardo nel tempo</p>
          <h2 id="diary-chart-title">Andamento {monthly ? 'del mese' : 'della settimana'}</h2>
        </div>
        <span className="diary-chart-period">{monthly ? 'Vista mensile' : 'Vista settimanale'}</span>
      </div>
      {hasValues ? (
        <>
          <div className="diary-chart-scroll">
            <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Valori da 1 a 5. ${description}`}>
              {[1, 2, 3, 4, 5].map((value) => {
                const y = pointPosition(0, value, days.length).y;
                return (
                  <g key={value}>
                    <line className="diary-chart-gridline" x1={left} y1={y} x2={width - right} y2={y} />
                    <text className="diary-chart-axis" x={left - 15} y={y + 4} textAnchor="middle">{value}</text>
                  </g>
                );
              })}
              {labelledDays.map((index) => {
                const date = days[index];
                const x = pointPosition(index, 1, days.length).x;
                const label = monthly
                  ? String(date.getDate())
                  : new Intl.DateTimeFormat('it-IT', { weekday: 'short' }).format(date).replace('.', '').toUpperCase();
                return <text key={dayKey(date)} className="diary-chart-axis" x={x} y={height - 9} textAnchor="middle">{label}</text>;
              })}
              {plotted.map((item) => (
                <g key={item.id}>
                  {item.points.length > 1 && (
                    <polyline
                      fill="none"
                      stroke={item.color}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={item.points.map(({ x, y }) => `${x},${y}`).join(' ')}
                    />
                  )}
                  {item.points.map((point) => (
                    <circle key={dayKey(point.date)} cx={point.x} cy={point.y} r="4.5" fill="#fff" stroke={item.color} strokeWidth="2.5">
                      <title>{item.label}, {new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long' }).format(point.date)}: {point.value} su 5</title>
                    </circle>
                  ))}
                </g>
              ))}
            </svg>
          </div>
          <div className="diary-chart-legend">
            {plotted.map((item) => <span key={item.id}><i style={{ background: item.color }} aria-hidden="true" />{item.label}</span>)}
          </div>
          <p className="diary-chart-help">Le linee collegano solo i giorni registrati. Un valore alto indica umore più alto, oppure stress e ansia più intensi. Tocca un giorno nel calendario per rivedere la nota.</p>
        </>
      ) : (
        <p className="diary-chart-empty">Il grafico apparirà qui quando registrerai un valore di umore, stress o ansia.</p>
      )}
    </section>
  );
}
