// I collegamenti tra esperienza, corpo e cervello sono possibilità generali, non test individuali.
export const biologySources = {
  networks: { name: 'Adolphs e colleghi · Reti delle emozioni', description: 'Studio e rassegna sulle reti cerebrali, testo completo', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5949245/' },
  bodyPatterns: { name: 'Siegel e colleghi · Corpo ed emozioni', description: 'Meta-analisi sulle risposte fisiologiche, testo completo', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5876074/' },
  positiveBrain: { name: 'Review · Neuroscienze delle emozioni positive', description: 'Revisione sistematica, testo completo', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7111451/' },
  rewardBrain: { name: 'Review · Circuiti della ricompensa', description: 'Rassegna scientifica, testo completo', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6234277/' },
  socialBrain: { name: 'Review · Elaborazione dello stress sociale', description: 'Rassegna scientifica, testo completo', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11905293/' },
  depressionBrain: { name: 'Review · Reti cerebrali e depressione', description: 'Rassegna scientifica, testo completo', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4780432/' },
  apathyBrain: { name: 'Review · Circuiti della motivazione', description: 'Rassegna scientifica, testo completo', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6200857/' },
  selfBrain: { name: 'Studio · Autovalutazione e reti cerebrali', description: 'Studio scientifico, testo completo', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4350482/' },
  lonelinessBrain: { name: 'Review · Neurobiologia della solitudine', description: 'Revisione sistematica, testo completo', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8258736/' },
  disgustBrain: { name: 'Review · Disgusto, paura e insula', description: 'Rassegna scientifica, testo completo', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2895912/' },
  stressBrain: { name: 'Review · Stress e attenzione', description: 'Rassegna scientifica, testo completo', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5756532/' },
  fatigueBrain: { name: 'Review · Reti della fatica mentale', description: 'Revisione sistematica, testo completo', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12421237/' },
};

const explanation = (preview, text, sourceKeys) => ({ preview, paragraphs: [text], sourceKeys });

export const emotionBiology = {
  abbandono: {
    body: explanation('Tensione o agitazione possono accompagnare il rifiuto.', 'Un’esperienza di rifiuto può accompagnarsi a tensione, stanchezza o agitazione. I segnali dipendono dalla persona e dal contesto: non esiste un ormone che dimostri che qualcuno si senta abbandonato.', ['socialPain', 'bodyPatterns']),
    brain: explanation('Il cervello valuta il significato sociale della situazione.', 'Negli studi sul rifiuto sociale partecipano reti che comprendono corteccia prefrontale e insula, insieme ad altre aree. Questi risultati riguardano gruppi di persone: non permettono di leggere il vissuto di un singolo individuo.', ['socialBrain', 'networks']),
  },
  depressione: {
    body: explanation('Sonno, appetito ed energia possono cambiare.', 'In una depressione clinica possono cambiare sonno, appetito ed energia, ma non tutte le persone mostrano gli stessi segnali. Non c’è un singolo ormone o un esame del corpo che, da solo, dia la diagnosi.', ['depression', 'bodyPatterns']),
    brain: explanation('Reti per emozione e motivazione, senza una “zona della depressione”.', 'La ricerca sulla depressione studia connessioni tra corteccia prefrontale, amigdala e striato ventrale, coinvolte nell’elaborazione delle emozioni e della motivazione. Sono risultati di ricerca, non una scansione che spiega ogni caso individuale.', ['depressionBrain', 'networks']),
  },
  disperazione: {
    body: explanation('Lo sconforto può coincidere con stress o spossatezza.', 'Quando lo sconforto è intenso, alcune persone notano tensione, cambiamenti del sonno o poca energia. Non esiste una “molecola della disperazione”: corpo, storia personale e situazione si influenzano a vicenda.', ['depression', 'bodyPatterns']),
    brain: explanation('Dare significato al futuro coinvolge più reti.', 'Corteccia prefrontale e reti che elaborano emozioni e motivazione possono partecipare al modo in cui valutiamo ciò che accade. Gli studi clinici sulla depressione non possono essere usati per attribuire una causa cerebrale a un momento di sconforto.', ['networks', 'depressionBrain']),
  },
  dolore: {
    body: explanation('Una perdita può incidere anche su sonno e appetito.', 'Il dolore emotivo può accompagnarsi a stanchezza e cambiamenti del sonno o dell’appetito. Il fatto che si senta nel corpo non significa che dolore emotivo e dolore fisico siano identici.', ['grief', 'bodyPatterns']),
    brain: explanation('Reti che elaborano perdita, contatto e sensazioni corporee.', 'Nel rifiuto sociale, studi di gruppo osservano la partecipazione di regioni come insula e corteccia prefrontale. La perdita è più ampia del solo rifiuto e non può essere ridotta a un’unica area del cervello.', ['socialBrain', 'networks']),
  },
  apatia: {
    body: explanation('Poca iniziativa e poca energia non coincidono sempre.', 'Nell’apatia può ridursi la spinta ad avviare un’azione; nella fatica può essere soprattutto difficile sostenerla fisicamente. Le esperienze possono intrecciarsi, senza un segnale corporeo che le separi da solo.', ['apathy', 'fatigue']),
    brain: explanation('Le reti della motivazione sono oggetto di studio.', 'In condizioni cliniche associate all’apatia si studiano connessioni tra corteccia frontale e striato ventrale. Questo non significa che un giorno di scarsa motivazione riveli un’alterazione di quelle aree.', ['apathyBrain', 'networks']),
  },
  terrore: {
    body: explanation('La risposta rapida di allerta può essere intensa.', 'Il sistema nervoso simpatico può accelerare il battito e modificare respiro e sudorazione. Adrenalina e noradrenalina partecipano alla risposta allo stress, ma sintomi simili possono avere anche altre cause.', ['panic', 'sympathetic', 'adrenaline', 'noradrenaline']),
    brain: explanation('Valutazione della minaccia e risposte del corpo collaborano.', 'Amigdala, ipotalamo e corteccia prefrontale possono partecipare a valutare uno stimolo e coordinare le risposte di allerta. Nessuna di queste regioni è, da sola, il “centro del terrore”.', ['networks', 'panic']),
  },
  solitudine: {
    body: explanation('Il peso della solitudine può farsi sentire in modi diversi.', 'Per alcune persone la solitudine si accompagna a stress o sonno peggiore; altre non notano cambiamenti fisici. Non si può dedurre quanto qualcuno si senta solo da un valore ormonale.', ['loneliness', 'connection', 'bodyPatterns']),
    brain: explanation('Reti che elaborano relazioni e segnali sociali.', 'Gli studi sulla solitudine esaminano reti che includono corteccia prefrontale, insula e amigdala. Le associazioni osservate nei gruppi non spiegano da sole perché una persona si senta sola.', ['lonelinessBrain', 'networks']),
  },
  'bassa-autostima': {
    body: explanation('Una valutazione sociale può essere vissuta come stressante.', 'Critiche o confronti possono accompagnarsi a tensione o agitazione, ma non tutti reagiscono così. L’autostima non si misura dal battito o da una quantità fissa di cortisolo.', ['selfEsteem', 'bodyPatterns']),
    brain: explanation('Come integriamo le informazioni su di noi.', 'Nelle ricerche sull’autovalutazione partecipano reti della corteccia prefrontale e altre regioni che elaborano feedback sociali. Nessuna regione contiene “il valore” di una persona.', ['selfBrain', 'networks']),
  },
  'poca-energia': {
    body: explanation('Sonno, attività, salute e stress possono incidere.', 'La fatica può avere componenti fisiche e mentali, e può comparire dopo poco sonno, sforzo o stress. Può anche avere cause mediche: per questo un’etichetta emotiva non basta a spiegarla.', ['fatigue']),
    brain: explanation('Fatica mentale e motivazione coinvolgono reti diverse.', 'Gli studi sulla fatica mentale osservano reti distribuite legate ad attenzione e motivazione. Questi risultati non permettono di stabilire da una sensazione se la causa sia psicologica o fisica.', ['fatigueBrain', 'networks']),
  },
  'molta-autostima': {
    body: explanation('Non esiste una postura o un ormone della fiducia in sé.', 'La fiducia può accompagnarsi a meno tensione in alcune situazioni, ma non ha una firma fisica obbligata. Osserva come ti senti e agisci, senza usare il corpo come un test dell’autostima.', ['selfEsteem', 'bodyPatterns']),
    brain: explanation('Valutazioni di sé e feedback sociali coinvolgono più regioni.', 'Studi sull’autovalutazione coinvolgono la corteccia prefrontale e reti connesse al feedback sociale. La fiducia in sé non si trova in un unico punto del cervello.', ['selfBrain', 'networks']),
  },
  calma: {
    body: explanation('Respirazione e tensione possono cambiare.', 'In un momento calmo alcune persone notano un respiro più regolare o meno tensione. Il sistema nervoso autonomo regola molte funzioni corporee, ma non esiste un battito “giusto” che provi la calma.', ['calm', 'bodyPatterns']),
    brain: explanation('Attenzione ed elaborazione delle sensazioni collaborano.', 'La calma non corrisponde allo spegnimento dell’amigdala. Reti della corteccia prefrontale e dell’insula partecipano all’attenzione e alla regolazione dell’esperienza, con configurazioni variabili.', ['networks', 'positiveBrain']),
  },
  confusione: {
    body: explanation('Lo stress può rendere più difficile concentrarsi.', 'Quando molte richieste si sovrappongono, possono comparire tensione o stanchezza. Non c’è un segnale corporeo che distingua da solo la confusione emotiva da altre cause: un disorientamento improvviso è una questione medica urgente.', ['stressNHS', 'suddenConfusion']),
    brain: explanation('Attenzione e decisione coinvolgono reti distribuite.', 'La corteccia prefrontale partecipa a mantenere l’attenzione e organizzare le informazioni; lo stress può influenzare questi processi. Non vuol dire che ogni momento di indecisione dipenda da una specifica alterazione cerebrale.', ['stressBrain', 'networks']),
  },
  disgusto: {
    body: explanation('Nausea e impulso ad allontanarsi sono possibili.', 'Il disgusto può accompagnarsi a repulsione o nausea e a un desiderio di distanza. La risposta del corpo cambia con la situazione; non è identica in tutte le persone.', ['disgustResearch', 'bodyPatterns']),
    brain: explanation('L’insula partecipa, insieme ad altre aree.', 'In alcuni studi su stimoli disgustosi compare l’attività dell’insula, una regione coinvolta anche in molte altre esperienze. Non è un interruttore esclusivo del disgusto.', ['disgustBrain', 'networks']),
  },
  felicita: {
    body: explanation('Il benessere non ha un’unica formula chimica.', 'Un momento felice può accompagnarsi a energia o rilassamento, a seconda del contesto. Nessun singolo ormone o neurotrasmettitore misura la felicità di una persona.', ['bodyPatterns', 'positive']),
    brain: explanation('Le reti della ricompensa e dell’emozione interagiscono.', 'Studi sulle emozioni positive coinvolgono, tra le altre aree, corteccia prefrontale e striato ventrale. La dopamina partecipa anche a motivazione e apprendimento da ricompense: non è un indicatore diretto della felicità.', ['positiveBrain', 'rewardBrain']),
  },
  ira: {
    body: explanation('Tensione e attivazione possono aumentare.', 'La rabbia può accompagnarsi a muscoli tesi, respiro diverso o battito più rapido. Il sistema nervoso simpatico e l’adrenalina possono partecipare alla risposta di allerta, ma non sono specifici della rabbia.', ['anger', 'sympathetic', 'bodyPatterns']),
    brain: explanation('Valutare un limite e scegliere una risposta.', 'Reti che comprendono amigdala e corteccia prefrontale partecipano all’elaborazione degli stimoli e alla regolazione della risposta. Non c’è un singolo “centro della rabbia”.', ['networks']),
  },
  tristezza: {
    body: explanation('Energia, sonno e appetito possono variare.', 'In un periodo di umore basso alcune persone si sentono stanche o notano cambiamenti nel sonno. Una giornata triste non presenta necessariamente questi segnali e non ha una firma ormonale unica.', ['lowMood', 'bodyPatterns']),
    brain: explanation('Emozione, memoria e contesto vengono integrati.', 'Amigdala e corteccia prefrontale partecipano, insieme a molte altre aree, a elaborare eventi emotivamente importanti. La tristezza non è contenuta in una regione isolata.', ['networks']),
  },
  'molta-energia': {
    body: explanation('Attività e bisogno di sonno sono indizi da osservare.', 'Sentirsi energici può accompagnare una buona notte di riposo o un’attività coinvolgente. Se l’energia cambia molto insieme al sonno o al comportamento, il contesto e la durata contano più del singolo valore nel diario.', ['fatigue', 'bipolar']),
    brain: explanation('Motivazione e ricompensa coinvolgono più circuiti.', 'Lo striato ventrale e aree della corteccia prefrontale partecipano alla motivazione e alla valutazione delle ricompense; anche la dopamina è uno dei messaggeri di questi processi. Nessuno di questi elementi distingue, da solo, una giornata vivace da una condizione clinica.', ['rewardBrain', 'networks']),
  },
  spensieratezza: {
    body: explanation('Leggerezza può voler dire meno tensione, ma non sempre.', 'La spensieratezza può coincidere con rilassamento o vivacità. Non richiede un particolare battito né una sostanza chimica unica: le risposte variano.', ['calm', 'bodyPatterns']),
    brain: explanation('Attenzione e ricompensa possono lavorare insieme.', 'Esperienze piacevoli coinvolgono reti che comprendono corteccia prefrontale e striato ventrale. La spensieratezza non si riduce a una regione cerebrale o a una quantità di dopamina.', ['positiveBrain', 'rewardBrain']),
  },
};
