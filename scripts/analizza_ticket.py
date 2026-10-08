"""Analisi controllata dei ticket sintetici. Legge una richiesta JSON da stdin.

Dipendenze: pandas, matplotlib. Nessun codice generato dal modello viene eseguito.
"""

import base64
import io
import json
import sys
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd


CSV = Path(__file__).resolve().parents[1] / "data" / "richieste_supporto_nesso.csv"
DIMENSIONS = {
    "month": "Mese",
    "area": "Area del prodotto",
    "campus": "Campus fittizio",
    "channel": "Canale",
    "status": "Stato",
    "category": "Categoria",
}
METRICS = {
    "count": ("Ticket", None),
    "mean_first_response": ("Prima risposta media (ore)", "prima_risposta_ore"),
    "mean_resolution": ("Risoluzione media (ore)", "risoluzione_ore"),
    "mean_satisfaction": ("Soddisfazione media (1–5)", "soddisfazione"),
}
COLUMNS = {"area": "area_prodotto", "campus": "campus", "channel": "canale", "status": "stato", "category": "categoria"}
AREAS = {value.casefold(): value for value in ["Chat IA", "Schede", "Diario", "Supporto umano", "Account"]}


def clean_data():
    original = pd.read_csv(CSV, dtype=str, keep_default_na=False)
    records = original.drop_duplicates("ticket_id", keep="first").copy()
    for column in COLUMNS.values():
        records[column] = records[column].str.strip()
    records["area_prodotto"] = records["area_prodotto"].map(lambda value: AREAS.get(value.casefold(), value))
    for column in ("canale", "stato"):
        records[column] = records[column].str.lower()

    iso = pd.to_datetime(records["data_apertura"], format="%Y-%m-%d", errors="coerce")
    local = pd.to_datetime(records["data_apertura"], format="%d/%m/%Y", errors="coerce")
    records["date"] = iso.fillna(local)
    for column, maximum in (("prima_risposta_ore", 240), ("risoluzione_ore", 720)):
        values = pd.to_numeric(records[column], errors="coerce")
        records[column] = values.where(values.ge(0) & values.le(maximum))
    satisfaction = pd.to_numeric(records["soddisfazione"], errors="coerce")
    records["soddisfazione"] = satisfaction.where(satisfaction.ge(1) & satisfaction.le(5))
    records.loc[records["stato"] != "risolta", "risoluzione_ore"] = float("nan")
    quality = {
        "righe_originali": len(original),
        "duplicati_eliminati": len(original) - len(records),
        "date_non_valide": int(records["date"].isna().sum()),
        "prima_risposta_negativa_o_fuori_scala": int(pd.to_numeric(original.drop_duplicates("ticket_id")["prima_risposta_ore"], errors="coerce").pipe(lambda s: (s.lt(0) | s.gt(240))).sum()),
        "risoluzione_negativa_o_fuori_scala": int(pd.to_numeric(original.drop_duplicates("ticket_id")["risoluzione_ore"], errors="coerce").pipe(lambda s: (s.lt(0) | s.gt(720))).sum()),
        "prima_risposta_mancante": int(records["prima_risposta_ore"].isna().sum()),
    }
    return records, quality


def make_chart(labels, values, metric, dimension, n):
    plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 10})
    fig, ax = plt.subplots(figsize=(8.5, max(3.3, len(labels) * .47 + 1.4)), dpi=115)
    fig.patch.set_facecolor("#ffffff")
    ax.set_facecolor("#ffffff")
    positions = list(range(len(labels)))
    ax.barh(positions, values, color="#648d82", height=.67)
    ax.set_yticks(positions, labels=labels)
    ax.invert_yaxis()
    ax.set_xlabel(METRICS[metric][0], color="#18384c")
    ax.set_title(f"{METRICS[metric][0]} per {DIMENSIONS[dimension].lower()}", loc="left", color="#18384c", weight="bold", pad=16)
    ax.spines[:].set_visible(False)
    ax.xaxis.grid(True, color="#e4ebed")
    ax.set_axisbelow(True)
    ax.tick_params(length=0, colors="#18384c")
    ax.set_xlim(0, max(values) * 1.22 if max(values) else 1)
    for position, value in zip(positions, values):
        label = str(int(value)) if metric == "count" else f"{value:.1f}"
        ax.text(value + max(values) * .025, position, label, va="center", color="#18384c", fontsize=9)
    fig.text(.12, .015, f"Dati sintetici · {n} ticket validi per la metrica", fontsize=8, color="#526a79")
    fig.tight_layout(rect=(0, .04, 1, 1))
    output = io.BytesIO()
    fig.savefig(output, format="png", facecolor="white")
    plt.close(fig)
    return "data:image/png;base64," + base64.b64encode(output.getvalue()).decode("ascii")


def analyze(request):
    metric = request.get("metric", "count")
    dimension = request.get("dimension", "month")
    if metric not in METRICS or dimension not in DIMENSIONS:
        raise ValueError("Metrica o dimensione non supportata")
    records, quality = clean_data()
    dated = records[records["date"].notna()].copy()
    start = dated["date"].min().date().isoformat()
    end = dated["date"].max().date().isoformat()
    if dimension == "month":
        dated["group"] = dated["date"].dt.strftime("%Y-%m")
    else:
        dated["group"] = dated[COLUMNS[dimension]]
    column = METRICS[metric][1]
    if metric == "mean_resolution":
        dated = dated[dated["stato"] == "risolta"]
    if column:
        dated = dated[dated[column].notna()]
        grouped = dated.groupby("group")[column].mean()
    else:
        grouped = dated.groupby("group").size()
    if dimension == "month":
        grouped = grouped.sort_index()
    else:
        grouped = grouped.sort_values(ascending=False).head(12)
    if grouped.empty:
        raise ValueError("Nessun ticket valido per questa analisi")
    labels = [str(label) for label in grouped.index]
    values = [round(float(value), 2) for value in grouped.values]
    chart = make_chart(labels, values, metric, dimension, len(dated))
    return {
        "metric": metric, "dimension": dimension, "metric_label": METRICS[metric][0],
        "dimension_label": DIMENSIONS[dimension], "period": {"from": start, "to": end},
        "valid_rows": len(dated), "cleaning": quality,
        "points": [{"label": label, "value": value} for label, value in zip(labels, values)],
        "chart": chart,
        "note": "Ticket sintetici; sono esclusi i duplicati e le date non valide. Per le medie sono esclusi i valori assenti e fuori scala. La risoluzione media considera soltanto ticket risolti.",
    }


def main():
    try:
        request = json.loads(sys.stdin.read())
        print(json.dumps(analyze(request), ensure_ascii=False))
    except (ValueError, OSError, KeyError) as error:
        print(json.dumps({"error": str(error)}, ensure_ascii=False))
        sys.exit(1)


if __name__ == "__main__":
    main()
