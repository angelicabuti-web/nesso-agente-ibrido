"""Genera ticket interamente sintetici per la demo Nesso, con anomalie deliberate.

Uso: python scripts/genera_dati_demo.py
Nessun dato personale o clinico viene letto o prodotto.
"""

import csv
import random
from collections import Counter
from datetime import date, timedelta
from pathlib import Path


SEED = 20261008
N_BASE = 1600
OUT = Path(__file__).resolve().parents[1] / "data" / "richieste_supporto_nesso.csv"
FIELDNAMES = [
    "ticket_id", "data_apertura", "campus", "area_prodotto", "canale",
    "categoria", "stato", "prima_risposta_ore", "risoluzione_ore", "soddisfazione",
]


def main():
    rng = random.Random(SEED)
    start = date(2026, 1, 1)
    end = date(2026, 9, 30)
    days = (end - start).days + 1
    dates = [start + timedelta(days=i) for i in range(days)]
    weights = [1.6 if d.month in (2, 6, 7, 9) else 1.0 for d in dates]
    areas = ["Chat IA", "Schede", "Diario", "Supporto umano", "Account"]
    categories = {
        "Chat IA": ["Risposta non disponibile", "Come funziona", "Limiti IA"],
        "Schede": ["Fonte da verificare", "Termine da chiarire", "Navigazione"],
        "Diario": ["Salvataggio", "Eliminazione", "Grafico"],
        "Supporto umano": ["Informazioni risorse", "Link non raggiungibile"],
        "Account": ["Accesso", "Informazioni privacy"],
    }
    rows = []
    for index in range(1, N_BASE + 1):
        opened = rng.choices(dates, weights=weights, k=1)[0]
        area = rng.choices(areas, weights=[35, 19, 25, 11, 10], k=1)[0]
        status = rng.choices(["risolta", "in_lavorazione", "aperta"], weights=[78, 13, 9], k=1)[0]
        first_response = round(max(0.25, rng.lognormvariate(2.5, 0.75)), 1)
        resolution = round(first_response + rng.uniform(2, 95), 1) if status == "risolta" else ""
        satisfaction = rng.choices([1, 2, 3, 4, 5], weights=[3, 6, 18, 42, 31], k=1)[0] if status == "risolta" and rng.random() < 0.7 else ""
        rows.append({
            "ticket_id": f"T{index:05d}",
            "data_apertura": opened.isoformat(),
            "campus": rng.choice(["Bologna", "Milano", "Roma", "Torino"]),
            "area_prodotto": area,
            "canale": rng.choices(["app", "web", "email"], weights=[55, 30, 15], k=1)[0],
            "categoria": rng.choice(categories[area]),
            "stato": status,
            "prima_risposta_ore": first_response,
            "risoluzione_ore": resolution,
            "soddisfazione": satisfaction,
        })

    # Modifiche su righe distinte: il motore dati deve documentare la pulizia.
    samples = rng.sample(range(N_BASE), 100)
    for i in samples[:18]:
        rows[i]["data_apertura"] = date.fromisoformat(rows[i]["data_apertura"]).strftime("%d/%m/%Y")
    for i in samples[18:30]:
        rows[i]["data_apertura"] = "31/02/2026"
    for i in samples[30:48]:
        rows[i]["prima_risposta_ore"] = ""
    for i in samples[48:64]:
        rows[i]["prima_risposta_ore"] = "-3"
    for i in samples[64:75]:
        rows[i]["prima_risposta_ore"] = "9999"
    for i in samples[75:88]:
        rows[i]["area_prodotto"] = f" {rows[i]['area_prodotto'].upper()} "
    for i in samples[88:100]:
        rows[i]["canale"] = rows[i]["canale"].upper()
    for i in rng.sample(range(N_BASE), 14):
        if rows[i]["stato"] == "risolta":
            rows[i]["risoluzione_ore"] = "9999"

    # Duplicati veri: la stessa richiesta riappare identica in un export sporco.
    rows.extend(row.copy() for row in rng.sample(rows, 20))
    rng.shuffle(rows)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(rows)
    assert len(rows) == 1620
    assert len(Counter(row["ticket_id"] for row in rows)) == 1600
    print(f"Creati {len(rows)} ticket sintetici in {OUT.name} (20 duplicati).")


if __name__ == "__main__":
    main()
