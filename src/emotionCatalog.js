// Le schede sono psicoeducazione generale: non interpretano né diagnosticano l'utente.
import { biologySources, emotionBiology } from './emotionBiology.js';

export const extraSources = {
  ...biologySources,
  depression: { name: 'NIMH · Depressione', description: 'Scheda del National Institute of Mental Health', url: 'https://www.nimh.nih.gov/health/publications/depression' },
  grief: { name: 'NHS · Lutto e perdita', description: 'Guida del servizio sanitario britannico', url: 'https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/grief-bereavement-loss/' },
  loneliness: { name: 'NHS · Solitudine', description: 'Guida del servizio sanitario britannico', url: 'https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/feeling-lonely/' },
  connection: { name: 'OMS · Connessione sociale', description: 'Rapporto della Commissione sulla connessione sociale', url: 'https://www.who.int/groups/commission-on-social-connection/report' },
  selfEsteem: { name: 'NHS · Autostima', description: 'Guida del servizio sanitario britannico', url: 'https://www.nhs.uk/mental-health/self-help/tips-and-support/raise-low-self-esteem/' },
  fatigue: { name: 'MedlinePlus · Stanchezza', description: 'Informazione sanitaria della National Library of Medicine', url: 'https://medlineplus.gov/fatigue.html' },
  apathy: { name: 'Cleveland Clinic · Apatia', description: 'Articolo con revisione medica', url: 'https://my.clevelandclinic.org/health/symptoms/24824-apathy' },
  panic: { name: 'NIMH · Disturbo di panico', description: 'Scheda del National Institute of Mental Health', url: 'https://www.nimh.nih.gov/health/publications/panic-disorder-when-fear-overwhelms' },
  fear: { name: 'NHS · Ansia, paura e panico', description: 'Guida del servizio sanitario britannico', url: 'https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/anxiety-fear-panic/' },
  anger: { name: 'NHS · Rabbia', description: 'Guida del servizio sanitario britannico', url: 'https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/anger/' },
  lowMood: { name: 'NHS · Umore basso e tristezza', description: 'Guida del servizio sanitario britannico', url: 'https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/low-mood-sadness-depression/' },
  socialPain: { name: 'Leary · Risposte al rifiuto sociale', description: 'Review scientifica indicizzata su PubMed Central', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4734881/' },
  disgust: { name: 'APA · Disgusto', description: 'Dizionario dell’American Psychological Association', url: 'https://dictionary.apa.org/disgust' },
  disgustResearch: { name: 'Curtis e colleghi · Disgusto e protezione', description: 'Review scientifica indicizzata su PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/21199843/' },
  positive: { name: 'Fredrickson · Emozioni positive', description: 'Articolo scientifico indicizzato su PubMed Central', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3156001/' },
  happiness: { name: 'NHS · Benessere e felicità', description: 'Guida del servizio sanitario britannico', url: 'https://www.nhs.uk/mental-health/self-help/tips-and-support/how-to-be-happier/' },
  calm: { name: 'NHS · Meditazione e calma', description: 'Guida Every Mind Matters', url: 'https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/how-to-meditate-for-beginners/' },
  stressNHS: { name: 'NHS · Stress', description: 'Guida del servizio sanitario britannico', url: 'https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/stress/' },
  bipolar: { name: 'NIMH · Disturbo bipolare', description: 'Scheda del National Institute of Mental Health', url: 'https://www.nimh.nih.gov/health/publications/bipolar-disorder' },
  suddenConfusion: { name: 'NHS · Confusione improvvisa', description: 'Guida del servizio sanitario britannico', url: 'https://www.nhs.uk/symptoms/confusion/' },
};

const card = (id, title, preview, paragraph, sourceKeys) => ({ id, title, preview, paragraphs: [paragraph], sourceKeys });

const emotionCatalogBase = [
  {
    id: 'abbandono', title: 'Abbandono', aliases: ['sentirsi abbandonati', 'rifiuto', 'rinuncia', 'rassegnazione'],
    lede: 'La sensazione di essere lasciati soli, esclusi o non scelti può fare molto male. Rinuncia e rassegnazione sono vissuti diversi, anche se a volte si intrecciano con questo sentimento.',
    sections: [
      card('significato', 'Che cosa può significare', 'Un legame o un bisogno di vicinanza percepito come minacciato.', 'Una separazione, un rifiuto o anche l’incertezza in una relazione possono toccare il bisogno di sentirsi accolti. Sentirsi abbandonati non prova, da solo, che l’altra persona abbia voluto abbandonarti.', ['socialPain']),
      card('vissuto', 'Come può manifestarsi', 'Tristezza, paura, rabbia o chiusura.', 'Le reazioni al rifiuto sono diverse: si può cercare più contatto, prendere le distanze o fare fatica a fidarsi. Dare un nome a ciò che è successo e a ciò che si teme può aiutare a distinguere fatti e interpretazioni.', ['socialPain', 'grief']),
      card('supporto', 'Quando parlarne con qualcuno', 'Se il dolore resta intenso o limita le relazioni.', 'Se questo vissuto torna spesso, fa soffrire molto o rende difficili le relazioni quotidiane, confrontarsi con un professionista può aiutare a comprenderlo nel proprio contesto.', ['socialPain', 'lowMood']),
    ],
  },
  {
    id: 'depressione', title: 'Depressione', aliases: ['umore depresso', 'abbattimento psicologico'],
    lede: '“Mi sento depresso” può descrivere un periodo difficile. La depressione come condizione clinica richiede una valutazione professionale.',
    sections: [
      card('distinzione', 'Umore basso o depressione?', 'Una giornata difficile non basta per una diagnosi.', 'Tristezza e umore basso possono comparire in molti momenti della vita. Una depressione clinica coinvolge sintomi persistenti, come umore depresso o perdita di interesse, che interferiscono con le attività quotidiane. Non si può stabilire da una singola emozione registrata.', ['depression', 'lowMood']),
      card('segnali', 'Quali segnali osservare', 'Interesse, energia, sonno e concentrazione.', 'In alcune persone possono comparire perdita di interesse, affaticamento, cambiamenti del sonno o dell’appetito e difficoltà di concentrazione. Le cause possono essere diverse; anche condizioni fisiche o farmaci possono contribuire.', ['depression']),
      card('supporto', 'Quando chiedere una valutazione', 'Se i sintomi persistono o la vita quotidiana ne risente.', 'Se ti riconosci in più segnali che durano e rendono difficili studio, lavoro o relazioni, rivolgiti al medico o a un professionista della salute mentale. Se temi di farti del male o non sei al sicuro, cerca subito aiuto presso i servizi di emergenza locali o una persona vicina.', ['depression']),
    ],
  },
  {
    id: 'disperazione', title: 'Disperazione', aliases: ['sconforto', 'senza speranza'],
    lede: 'Quando sembra difficile immaginare che le cose possano cambiare. Merita ascolto anche se dura da poco.',
    sections: [
      card('significato', 'Che cosa stai nominando', 'Un senso intenso di mancanza di possibilità.', 'La disperazione può accompagnare perdite, stress o un periodo di umore molto basso. Descrive il tuo vissuto in quel momento; da sola non spiega la causa né determina il futuro.', ['depression', 'grief']),
      card('segnali', 'Che cosa può accompagnarla', 'Isolamento, stanchezza o perdita di interesse.', 'La sensazione che nulla migliorerà può comparire insieme a difficoltà di concentrazione, poca energia o ritiro dalle attività. Se è intensa o ricorrente, vale la pena parlarne senza aspettare che peggiori.', ['depression']),
      card('supporto', 'Cercare sostegno adesso', 'Non serve affrontarla da soli.', 'Può essere utile contattare una persona fidata e un professionista. Se pensi di farti del male, hai un piano o non ti senti al sicuro, contatta subito i servizi di emergenza locali e resta con una persona di fiducia.', ['depression']),
    ],
  },
  {
    id: 'dolore', title: 'Dolore emotivo', aliases: ['dolore', 'sofferenza', 'lutto'],
    lede: 'Qui parliamo del dolore legato a una perdita, a un rifiuto o a un’esperienza difficile; il dolore fisico richiede una valutazione diversa.',
    sections: [
      card('significato', 'Che cosa può esserci dietro', 'Una perdita può avere molte forme.', 'Il dolore emotivo può seguire la morte di qualcuno, una separazione o la perdita di un progetto importante. Ogni esperienza di perdita è diversa; non esiste un ordine obbligato delle emozioni.', ['grief']),
      card('vissuto', 'Come può farsi sentire', 'Emozioni e segnali fisici possono mescolarsi.', 'Tristezza, rabbia, senso di colpa e stanchezza possono alternarsi. Anche sonno e appetito possono cambiare: questo non basta a stabilire una causa unica per ciò che provi.', ['grief']),
      card('supporto', 'Quando chiedere sostegno', 'Se il dolore è travolgente o limita la vita.', 'Se il dolore resta difficile da affrontare o senti di non riuscire a gestire la quotidianità, parlare con un professionista può aiutare. Per un dolore fisico nuovo o intenso, rivolgiti a un medico.', ['grief']),
    ],
  },
  {
    id: 'apatia', title: 'Apatia', aliases: ['indifferenza', 'mancanza di motivazione'],
    lede: 'La sensazione di avere poca iniziativa o poco interesse. Non significa essere pigri.',
    sections: [
      card('significato', 'Che cos’è l’apatia', 'Motivazione e iniziativa possono diminuire.', 'Il termine descrive una riduzione della motivazione, dell’iniziativa o dell’interesse rispetto a prima. Può avere contesti e cause diversi: una scheda non può identificarli nella singola persona.', ['apathy']),
      card('differenze', 'Che cosa osservare', 'Da quanto tempo succede e cosa è cambiato.', 'Può essere utile distinguere tra “vorrei farlo ma sono troppo stanco” e “non sento la spinta a farlo”. Sonno, energia, umore e salute fisica possono dare informazioni utili da riferire a un professionista.', ['apathy', 'fatigue']),
      card('supporto', 'Quando approfondire', 'Se è nuova, persistente o limita le attività.', 'Se noti un cambiamento importante che continua nel tempo, o smetti di prenderti cura di te o delle cose essenziali, confrontati con un medico o un professionista della salute mentale.', ['apathy']),
    ],
  },
  {
    id: 'terrore', title: 'Terrore', aliases: ['paura incontrollabile', 'paura intensa', 'panico'],
    lede: 'Una paura molto intensa, che può arrivare all’improvviso o in risposta a una situazione. Non significa automaticamente avere un disturbo di panico.',
    sections: [
      card('significato', 'Paura intensa e panico', 'Una risposta di allerta che può sembrare travolgente.', 'Un episodio di forte paura può accompagnarsi alla sensazione di perdere il controllo. Un attacco di panico e un disturbo di panico non sono la stessa cosa: la valutazione dipende anche dal contesto e dalla ricorrenza.', ['panic', 'fear']),
      card('corpo', 'Che cosa può accadere nel corpo', 'Battito, respiro, sudorazione e tremore.', 'La risposta di allerta può coinvolgere il sistema nervoso simpatico. Alcune persone sentono il cuore accelerare, il respiro cambiare o le mani tremare. Sintomi fisici nuovi o insoliti meritano una valutazione medica.', ['panic', 'fear', 'sympathetic']),
      card('supporto', 'Quando cercare aiuto', 'Se si ripete, limita la vita o temi un pericolo reale.', 'Se la paura torna spesso o ti porta a evitare luoghi e attività, parla con un professionista. Se sei in pericolo immediato, o hai sintomi fisici intensi e non sai da cosa dipendono, chiama i servizi di emergenza locali.', ['panic', 'fear']),
    ],
  },
  {
    id: 'solitudine', title: 'Solitudine', aliases: ['isolamento', 'sentirsi soli'],
    lede: 'Si può essere soli senza sentirsi soli, e sentirsi soli anche in mezzo ad altre persone.',
    sections: [
      card('distinzione', 'Solitudine e isolamento', 'Una sensazione e una situazione non coincidono sempre.', 'La solitudine riguarda la qualità delle connessioni così come le percepisci; l’isolamento descrive una riduzione dei contatti sociali. Non sono la stessa cosa e possono richiedere risposte diverse.', ['connection', 'loneliness']),
      card('contesto', 'Quando può farsi sentire', 'Traslochi, cambiamenti o relazioni poco soddisfacenti.', 'Anche un periodo con molte persone intorno può lasciare un senso di distanza. Vale la pena chiedersi quali contatti ti fanno sentire visto e quali momenti sono più difficili.', ['loneliness', 'connection']),
      card('supporto', 'Come cercare connessione', 'Un contatto reale, anche piccolo, può essere un inizio.', 'Parlare con qualcuno di fidato, cercare un gruppo o un’attività condivisa può aiutare a creare connessioni. Se la solitudine pesa molto o si accompagna ad altri segnali di sofferenza, chiedi supporto professionale.', ['loneliness', 'connection']),
    ],
  },
  {
    id: 'bassa-autostima', title: 'Bassa autostima', aliases: ['poca autostima', 'insicurezza'],
    lede: 'Un giudizio di sé spesso severo, che può influenzare il modo in cui si affrontano le situazioni.',
    sections: [
      card('significato', 'Che cos’è l’autostima', 'Il modo in cui ti valuti.', 'L’autostima riguarda come ti senti rispetto a te stesso. Una bassa autostima può portare a dare molto peso agli errori e a sottovalutare capacità e risorse.', ['selfEsteem']),
      card('effetti', 'Come può incidere', 'Evitare sfide e contatti può rafforzare i dubbi.', 'Per paura di sbagliare si possono evitare situazioni nuove o sociali. Questo può dare sollievo sul momento, ma nel tempo può mantenere le convinzioni negative su di sé.', ['selfEsteem']),
      card('supporto', 'Come iniziare a esplorarla', 'Osservare il dialogo interiore senza trasformarlo in un verdetto.', 'Può aiutare riconoscere una critica automatica e chiedersi quali prove la sostengono. Se l’autostima limita le tue scelte o si accompagna a forte sofferenza, un professionista può aiutarti.', ['selfEsteem']),
    ],
  },
  {
    id: 'poca-energia', title: 'Poca energia', aliases: ['stanchezza', 'fatica', 'spossatezza'],
    lede: 'Un segnale che può avere cause fisiche, emotive o entrambe. Non attribuirlo automaticamente all’umore.',
    sections: [
      card('significato', 'Stanchezza o poca energia', 'Il corpo e la mente possono chiedere una pausa.', 'La fatica può comparire dopo poco sonno, sforzo o stress. Può anche accompagnare una condizione medica o psicologica; non è una diagnosi in sé.', ['fatigue']),
      card('osservare', 'Che cosa annotare', 'Durata, sonno e momenti della giornata.', 'Nel diario può essere utile annotare quando compare, quanto dura, come dormi e se limita attività abituali. Cercare uno schema può aiutarti a parlarne con un professionista.', ['fatigue']),
      card('supporto', 'Quando parlarne con un medico', 'Soprattutto se persiste o cambia la quotidianità.', 'Se la stanchezza dura settimane, non migliora con il riposo o impedisce attività normali, chiedi una valutazione medica per esplorare le possibili cause.', ['fatigue']),
    ],
  },
  {
    id: 'molta-autostima', title: 'Molta autostima', aliases: ['sicurezza in sé', 'fiducia in sé', 'considerazione di sé'],
    lede: 'Sentirsi capaci e degni di rispetto, anche quando non tutto riesce alla perfezione.',
    sections: [
      card('significato', 'Fiducia in sé', 'Un giudizio di sé che lascia spazio agli errori.', 'L’autostima è il modo in cui ti valuti. Sentire fiducia nelle tue capacità può aiutarti ad affrontare qualcosa di nuovo senza dover dimostrare di essere impeccabile.', ['selfEsteem']),
      card('esperienza', 'Come la riconosci', 'Libertà di provare, scegliere e mettere limiti.', 'Puoi notarla quando riconosci ciò che sai fare e accetti ciò che stai ancora imparando. Non richiede di sentirsi superiori agli altri, né di sentirsi sicuri ogni giorno.', ['selfEsteem']),
      card('diario', 'Una domanda per il diario', 'Che cosa ti ha fatto sentire capace oggi?', 'Annotare un episodio concreto può aiutarti a ricordare le tue risorse nei giorni più difficili. Se la fiducia cambia molto, osserva il contesto invece di giudicare l’intera persona da un singolo giorno.', ['selfEsteem']),
    ],
  },
  {
    id: 'calma', title: 'Calma', aliases: ['pace', 'senso di pace', 'tranquillità'],
    lede: 'Uno stato in cui senti più spazio per fermarti, osservare e rispondere con meno fretta.',
    sections: [
      card('significato', 'Che cosa chiami calma', 'Può essere quiete del corpo, della mente o entrambe.', 'La calma non significa assenza di pensieri o problemi. Può essere un momento in cui lo stress si fa meno invadente e riesci a prestare attenzione a ciò che succede.', ['calm', 'stressNHS']),
      card('corpo', 'Che cosa potresti notare', 'Respiro, tensione e ritmo personale.', 'Alcune persone riconoscono la calma da un respiro più regolare o da meno tensione; altre dal modo in cui riescono a concentrarsi. Non esiste un segnale fisico uguale per tutti.', ['calm', 'stressNHS']),
      card('diario', 'Quando torna più facilmente', 'Osservare le condizioni che ti aiutano.', 'Nel diario puoi segnare che cosa c’era intorno a te: riposo, compagnia, movimento o una pausa. Non serve trasformare ogni momento calmo in un obiettivo da raggiungere.', ['calm']),
    ],
  },
  {
    id: 'confusione', title: 'Confusione', aliases: ['incertezza', 'non so come mi sento'],
    lede: 'Qui intendiamo la difficoltà a capire o nominare ciò che senti, non un disorientamento improvviso.',
    sections: [
      card('significato', 'Più cose insieme', 'Non sempre un’esperienza ha un solo nome.', 'Durante periodi di stress o cambiamento si possono provare emozioni diverse nello stesso momento e fare fatica a scegliere una parola. Va bene iniziare descrivendo una situazione, senza forzare un’etichetta.', ['stressNHS', 'grief']),
      card('osservare', 'Da dove partire', 'Fatti, pensieri e sensazioni.', 'Puoi chiederti cosa è successo, quali pensieri sono arrivati e cosa hai notato nel corpo. Sono indizi per raccontare meglio la tua esperienza, non un test che produce una diagnosi.', ['stressNHS']),
      card('supporto', 'Quando serve una valutazione', 'Se la confusione è improvvisa o altera l’orientamento.', 'Se intendi un’improvvisa difficoltà a riconoscere luoghi o persone, a parlare o a capire ciò che accade, non trattarla come una semplice emozione: cerca assistenza medica urgente.', ['suddenConfusion']),
    ],
  },
  {
    id: 'disgusto', title: 'Disgusto', aliases: ['repulsione', 'disprezzo'],
    lede: 'Una reazione di rifiuto verso qualcosa che percepisci come sgradevole. “Disprezzo” si usa in contesti sociali, ma non è un sinonimo preciso di disgusto.',
    sections: [
      card('significato', 'Che cos’è il disgusto', 'Una spinta ad allontanarsi.', 'Il disgusto è un’emozione spesso associata all’evitare qualcosa che appare contaminante o repellente. Nel linguaggio comune lo usiamo anche per descrivere un rifiuto morale o sociale: il contesto cambia il significato.', ['disgust', 'disgustResearch']),
      card('corpo', 'Che cosa potresti sentire', 'Repulsione, nausea o desiderio di distanza.', 'A volte il disgusto si accompagna a una sensazione allo stomaco o all’impulso di allontanarsi. Non ogni persona reagisce allo stesso modo, e sentire disgusto non rende automaticamente pericolosa una situazione.', ['disgustResearch']),
      card('riflessione', 'Che cosa ti sta segnalando', 'Distinguere la reazione dal giudizio.', 'Può essere utile chiederti quale stimolo l’ha attivato e se vuoi davvero agire sulla prima impressione. Se la reazione diventa così intensa da limitare la vita quotidiana, un professionista può aiutarti a comprenderla.', ['disgust', 'disgustResearch']),
    ],
  },
  {
    id: 'felicita', title: 'Felicità', aliases: ['felicita', 'gioia', 'allegria', 'ilarità'],
    lede: 'Un’esperienza piacevole che può essere breve o accompagnare una soddisfazione più ampia. Non deve essere costante per essere reale.',
    sections: [
      card('significato', 'Gioia e benessere', 'Momento piacevole o valutazione più ampia della vita.', 'Un momento di gioia e il sentirsi soddisfatti della propria vita sono esperienze collegate, ma non identiche. Si può stare bene oggi e attraversare comunque difficoltà in altri ambiti.', ['happiness', 'positive']),
      card('esperienza', 'Come può presentarsi', 'Interesse, leggerezza o voglia di condividere.', 'Le emozioni positive possono accompagnare il gioco, la curiosità, un risultato o una relazione. Non c’è un modo obbligato di mostrarle: la felicità non si misura dal sorriso.', ['positive']),
      card('diario', 'Conservare il contesto', 'Che cosa è successo e con chi eri?', 'Annotare un momento felice può aiutarti a vedere quali attività o legami contano per te. Non serve inseguire la felicità a ogni costo o confrontare i giorni tra loro.', ['happiness', 'positive']),
    ],
  },
  {
    id: 'ira', title: 'Ira', aliases: ['rabbia', 'collera', 'furia'],
    lede: 'La rabbia è un’emozione comune. Conta anche come la riconosci e che cosa scegli di farne.',
    sections: [
      card('significato', 'Che cosa può comunicarci', 'Una frustrazione, un limite o un’ingiustizia percepita.', 'La rabbia può emergere quando qualcosa ci sembra ingiusto, ci ostacola o supera un limite importante. Provarla non equivale ad agire in modo aggressivo.', ['anger']),
      card('corpo', 'I segnali di attivazione', 'Tensione, calore o battito più rapido.', 'Alcune persone notano muscoli tesi, respiro diverso o difficoltà a concentrarsi. Riconoscere i primi segnali può dare il tempo di scegliere come rispondere.', ['anger']),
      card('supporto', 'Quando cercare aiuto', 'Se senti di perdere il controllo o qualcuno rischia di farsi male.', 'Se la rabbia porta spesso a minacce, violenza o danni alle relazioni, chiedi aiuto professionale. Se c’è un pericolo immediato per te o per altri, contatta i servizi di emergenza locali.', ['anger']),
    ],
  },
  {
    id: 'tristezza', title: 'Tristezza', aliases: ['malinconia', 'essere tristi'],
    lede: 'Un’emozione che può seguire una delusione, una perdita o un periodo faticoso. Sentirsi tristi non significa automaticamente essere depressi.',
    sections: [
      card('significato', 'Che cosa stai vivendo', 'Una risposta possibile a ciò che conta per te.', 'La tristezza può apparire dopo qualcosa che manca, finisce o non va come speravi. Può anche essere difficile indicare subito una causa precisa.', ['lowMood', 'grief']),
      card('segnali', 'Come può cambiare la giornata', 'Energia, interesse e relazioni.', 'Un umore basso può influire sulla voglia di fare, sulla fiducia in sé e sul modo di stare con gli altri. Osserva la durata e l’impatto sulla vita più che cercare una spiegazione unica.', ['lowMood']),
      card('supporto', 'Quando parlarne', 'Se non passa o rende difficile la quotidianità.', 'Se la tristezza persiste, cresce o interferisce con le attività, chiedi un confronto a un professionista. Un solo giorno triste non equivale a una diagnosi di depressione.', ['lowMood', 'depression']),
    ],
  },
  {
    id: 'molta-energia', title: 'Molta energia', aliases: ['energico', 'pieno di energia', 'attivo'],
    lede: 'Sentirsi vitali può essere piacevole. È utile osservare anche il sonno, il ritmo e come prendi decisioni.',
    sections: [
      card('significato', 'Vitalità nella giornata', 'Più slancio per attività e relazioni.', 'L’energia può cambiare con il riposo, il contesto e ciò che stai facendo. Una giornata molto attiva, da sola, non indica una condizione clinica.', ['positive', 'fatigue']),
      card('osservare', 'Che cosa annotare', 'Sonno, durata e scelte.', 'Nel diario puoi segnare se questa energia ti fa stare bene, quanto dormi e se riesci a fermarti quando vuoi. Il confronto con il tuo ritmo abituale è più utile di un numero isolato.', ['fatigue', 'bipolar']),
      card('supporto', 'Quando vale la pena parlarne', 'Se il cambiamento è marcato e si accompagna ad altri segnali.', 'Se dormi molto meno senza sentirti stanco, i pensieri corrono, agisci impulsivamente o chi ti conosce nota un cambiamento importante, chiedi una valutazione professionale. Questi segnali non bastano da soli per una diagnosi.', ['bipolar']),
    ],
  },
  {
    id: 'spensieratezza', title: 'Spensieratezza', aliases: ['leggerezza', 'senza pensieri'],
    lede: 'Un momento in cui i pensieri pesano meno e puoi dedicarti a qualcosa di piacevole.',
    sections: [
      card('significato', 'Che cosa senti', 'Una pausa dal carico quotidiano.', 'La spensieratezza può somigliare a gioco, curiosità o libertà di stare nel presente. Non significa che i problemi siano spariti o che tu non prenda sul serio le tue responsabilità.', ['positive', 'happiness']),
      card('esperienza', 'Dove compare', 'Attività, persone e tempi che ti fanno respirare.', 'Può arrivare in compagnia, durante un’attività creativa o in un momento tranquillo. Le emozioni piacevoli hanno sfumature diverse: non occorre chiamarle tutte “felicità”.', ['positive', 'happiness']),
      card('diario', 'Una traccia da conservare', 'Che cosa ha reso possibile quel momento?', 'Se ti va, annota il contesto e ciò che hai apprezzato. Il diario può aiutarti a ricordare spazi di leggerezza anche nei periodi più impegnativi.', ['happiness']),
    ],
  },
];

const positiveSupport = {
  'molta-autostima': card('aiuto', 'Quando cercare un confronto', 'La fiducia in sé non richiede una valutazione.', 'Sentirti sicuro di te è un’esperienza positiva. Se però il cambiamento è improvviso e marcato, dormi molto meno, agisci in modo impulsivo o ne derivano difficoltà, un professionista può aiutarti a capire l’insieme dei segnali.', ['selfEsteem', 'bipolar']),
  calma: card('aiuto', 'Quando cercare un confronto', 'La calma, da sola, non è motivo di preoccupazione.', 'Non serve un parere professionale perché ti senti calmo. Se il tuo umore cambia in modo molto forte e ricorrente, o questa calma si alterna a sofferenza che limita la tua vita, può essere utile parlarne con qualcuno di qualificato.', ['lowMood', 'bipolar']),
  felicita: card('aiuto', 'Quando cercare un confronto', 'Essere felici non è un sintomo.', 'Un momento di gioia non richiede una valutazione. Se l’umore cambia in modo insolito e molto marcato, insieme a poco sonno, impulsività o conseguenze negative, chiedere un confronto può aiutare a capire il contesto.', ['happiness', 'bipolar']),
  spensieratezza: card('aiuto', 'Quando cercare un confronto', 'La leggerezza può essere parte del benessere.', 'Non serve rivolgersi a un professionista per sentirsi spensierati. Se però noti cambi d’umore molto forti e ripetuti, oppure questa sensazione accompagna scelte che ti mettono in difficoltà, parlarne può essere utile.', ['happiness', 'bipolar']),
};

export const emotionCatalog = emotionCatalogBase.map((topic) => {
  const biology = emotionBiology[topic.id];
  const originalMind = topic.sections[0];
  const originalSupport = topic.sections[topic.sections.length - 1];
  return {
    ...topic,
    sections: [
      { ...originalMind, id: 'mente', title: 'Che cosa succede nella mente' },
      { ...biology.body, id: 'corpo', title: 'Che cosa succede nel corpo' },
      { ...biology.brain, id: 'cervello', title: 'Quali parti del cervello partecipano' },
      { ...(positiveSupport[topic.id] || originalSupport), id: 'aiuto', title: 'Quando cercare un confronto' },
    ],
  };
});
