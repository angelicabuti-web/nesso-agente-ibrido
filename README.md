# Nesso — progetto finale, agente ibrido

Nesso è il prototipo di una piattaforma fittizia di benessere per studenti universitari. La base attuale comprende React, Node, conversazione di prova, schede informative e diario con calendario e grafico. La conversazione attuale usa la Gemini API. È destinata soltanto a una dimostrazione con situazioni e personaggi inventati; non è un servizio di salute mentale per utenti reali.

**Stato del progetto:** versione intermedia. Sono presenti il manuale aziendale `knowledge/manuale_nesso.txt`, il CSV sintetico `data/richieste_supporto_nesso.csv` (1.620 righe, di cui 20 duplicati intenzionali), la ricerca RAG e l'analisi pandas nella chat dell'**Area team**. Gemini sceglie uno o entrambi gli strumenti tramite function calling; l'analisi genera un grafico nel messaggio. Restano da completare le verifiche d'integrazione sul PC, il repository e la presentazione. Le registrazioni del diario nel browser restano separate dal CSV dimostrativo.

Scenario aziendale: il team che gestisce Nesso deve rispondere rapidamente a domande su procedure e servizi e analizzare l'andamento delle richieste di supporto senza utilizzare dati di persone reali. L'agente finale userà una sola chat per interrogare documenti testuali o dati strutturati in base alla domanda. Le altre sezioni mostrano il prodotto che il team gestisce.

Il dataset è stato creato dal generatore riproducibile `scripts/genera_dati_demo.py` con solo la libreria standard Python. Per rigenerarlo: `python scripts/genera_dati_demo.py` dalla radice del progetto. Comprende date non valide o in formati diversi, valori mancanti, etichette incoerenti, tempi fuori scala e duplicati per verificare la pulizia dei dati. Il manuale descrive campi e regole di analisi. I campus e i ticket sono inventati: non inferire informazioni sulla salute mentale di nessuno da queste righe.

## Avvio su Windows

Richiede Node.js 18+ e npm. Chiudi i terminali dell'altro progetto prima di avviare Nesso, perché questa versione usa le stesse porte locali. Nella cartella `E:\chapsy-corso`:

1. Installa i pacchetti con `npm.cmd install` nel terminale PowerShell di VS Code.
2. Crea `.env` accanto a `package.json` copiando `.env.example`. Inserisci la chiave ottenuta da Google AI Studio dopo `GEMINI_API_KEY=`. La riga `GEMINI_MODEL=gemini-3.5-flash-lite` sceglie il modello indicato per la demo.
3. Avvia il server con `npm.cmd run server`.
4. Apri un **secondo** terminale nella stessa cartella e avvia l'interfaccia con `npm.cmd run dev`. Apri l'indirizzo locale mostrato da Vite.

Per controllare la compilazione: `npm.cmd run build`. Il server ascolta solo su `127.0.0.1:8787`; Vite inoltra le richieste `/api` dal browser al server. La chiave resta nel file `.env` sul computer e non va inserita nel browser, condivisa o caricata su GitHub. `.gitignore` esclude `.env`.

## Ricerca nel manuale con ChromaDB

Su Windows x64, il comando `chroma` installato dal pacchetto npm può arrestarsi con l'errore “Only ARM64 is supported”. Per avviare il server usa invece il pacchetto Python di Chroma in un ambiente isolato. Nella radice del progetto, dopo aver verificato che `py --version` mostri Python 3.9 o successivo:

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install chromadb==1.5.9
.\.venv\Scripts\chroma.exe run --path .\chroma_data
```

Mantieni aperto il terminale del server ChromaDB, che ascolta su `localhost:8000` e conserva l'indice in `chroma_data/`. Con il server attivo, esegui una volta `npm.cmd run index:knowledge` in un altro terminale. Lo script crea gli embedding delle dieci sezioni del manuale tramite Gemini, le inserisce in ChromaDB e stampa i titoli trovati da una domanda di verifica. Se modifichi il manuale, ripeti l'indicizzazione. `.venv/` e `chroma_data/` sono esclusi da Git. Per una sessione futura, basta riavviare ChromaDB, senza reinstallare né reindicizzare se il manuale non è cambiato.

## Analisi Python del CSV e grafico

Nello stesso ambiente `.venv` già creato per ChromaDB, installa le librerie dal terminale PowerShell nella radice del progetto:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements-data.txt
```

La funzione `analyze_tickets` esegue `scripts/analizza_ticket.py` con parametri controllati dal server Node: pandas legge il CSV, rimuove i 20 duplicati, interpreta date ISO e italiane, normalizza alcune etichette ed esclude date impossibili e tempi negativi/fuori scala secondo `[DOC-08]`. Matplotlib produce un grafico PNG, visualizzato sotto la risposta con periodo, metrica, righe valide e dettagli sulla pulizia. Il codice del modello non viene eseguito come Python o SQL. Il grafico non usa alcun dato del diario personale.

Prova nell'Area team: **«Quali aree del prodotto generano più ticket?»** e **«Qual è il tempo medio di prima risposta per mese?»**. Per una domanda mista, prova **«Qual è la regola per le risposte entro 48 ore e qual è il tempo medio di prima risposta per mese?»**. Il modello può chiamare sia RAG sia il modulo dati, citando le sezioni del manuale e mostrando il grafico. Per una verifica senza Gemini, dalla radice del progetto:

```powershell
'{"metric":"count","dimension":"area"}' | .\.venv\Scripts\python.exe scripts\analizza_ticket.py
```

Questo comando stampa JSON e un'immagine codificata in base64: è normale che l'output sia lungo.

Apri **Area team** dal pulsante in alto nella home. La stessa interfaccia di chat usa una cronologia separata dalla conversazione personale. Il modello sceglie `search_manual`, `analyze_tickets` o entrambe le funzioni; Node cerca in ChromaDB o avvia Python. Le sezioni realmente consultate sono espandibili sotto la risposta e il grafico contiene i risultati calcolati. Il server Node (`npm.cmd run server`), ChromaDB e Vite (`npm.cmd run dev`) devono essere avviati in tre terminali. Per il manuale: “Quali dati del diario restano nel browser?”.

Per verificare il protocollo di chiamata alle funzioni senza usare l'API: `node --test tests/team.test.js`.

L'indicizzazione richiede la chiave Gemini in `.env`, una connessione e una quota disponibile per `gemini-embedding-001`. Se l'account non dispone della quota, lo script mostra l'errore e potremo adattare il metodo di embedding. Documentazione: [ChromaDB locale](https://docs.trychroma.com/docs/cli/run), [client JavaScript](https://docs.trychroma.com/reference/typescript/client), [Gemini embedding](https://ai.google.dev/api/embeddings).

## Limiti della demo

- Il piano gratuito di Gemini può utilizzare input e output per migliorare i prodotti Google. Usa **solo frasi inventate**, anche nelle prove del professore. La disponibilità e le quote del piano gratuito dipendono dal progetto e dal modello in Google AI Studio.
- La cronologia della chat resta nella memoria della pagina e scompare al ricaricamento. I messaggi della chat vengono comunque inviati a Google per generare risposte; l'azzeramento della pagina non cancella dati gestiti dal fornitore.
- Le registrazioni del diario sono salvate nel browser del dispositivo e restano dopo il ricaricamento. Non vengono inviate alla chat IA. Si possono eliminare singolarmente o tutte dall'interfaccia. Il salvataggio locale non è cifrato né adatto a informazioni personali reali, soprattutto su un dispositivo condiviso. Cancellare i dati del browser può rimuovere il diario.
- La chat segue istruzioni sul tono e sui limiti, e l'API applica i propri filtri, ma non è un sistema clinico o un rilevatore affidabile di situazioni di emergenza. Il percorso **Ho bisogno di aiuto da una persona** è sempre raggiungibile dalla chat e dal fondo delle pagine: indica il 112 per le emergenze in Italia, Telefono Amico Italia per l'ascolto non urgente, il 1522 per violenza e stalking, e il medico di base o il Centro di Salute Mentale territoriale per un confronto professionale. Le fonti sono cliccabili. I numeri valgono solo per chi si trova in Italia. Non rileva automaticamente le crisi, non mette in contatto con psicologi e non fornisce assistenza. Verificare i riferimenti prima di un eventuale uso pubblico. Non utilizzare il prototipo per diagnosi, terapie o crisi reali.
- Le schede informative espongono 19 voci, ciascuna organizzata in mente, corpo, cervello e quando cercare un confronto, con fonti consultabili e termini spiegati. Richiedono una revisione professionale prima di un uso reale.

## Colori

- Blu `#1F6FA6`: conversazione.
- Viola `#74658F`: sezione informativa.
- Verde `#648D82`: diario e calendario.
- Bianco freddo `#F2F6F8`, blu inchiostro `#18384C`, perla `#DDE4E6`.
