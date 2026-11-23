// ============================================================
//  EDIT EVERYTHING HERE ❤
//  All text, photos, music and video paths live in this one file.
//  Photos are in /public/images, music in /public/audio, video in /public/video
// ============================================================

const img = (name) => `/images/${name}.jpg`

export const proposalData = {
  // ---------- Opening (replaces the lock screen) ----------
  intro: {
    terminalTitle: 'aji@heart: ~/the-developer-and-the-bda',
    // Typed line by line like a real terminal. type: 'cmd' | 'out' | 'warn' | 'ok'
    lines: [
      { type: 'cmd', text: 'git log --author="Aji" --oneline' },
      { type: 'out', text: 'a1f3c09  responsibilities, work, repeat' },
      { type: 'out', text: 'b72e1d4  office aipoyaka kuda... night 11 varaku' },
      { type: 'out', text: 'c9d04aa  new joinee: "Thumpsup batch" ammayi' },
      { type: 'out', text: 'd5e88f1  2 months of silence...' },
      { type: 'out', text: 'e0b7f2c  first conversation ❤' },
      { type: 'cmd', text: 'npm run feelings' },
      { type: 'warn', text: '⚠ warning: heart rate exceeds safe limit' },
      { type: 'ok', text: '✔ compiled — 1 dependency found: Mahi' },
    ],
    holdText: 'Naa heart ni konchem sepu pattuko',
    holdSubtext: 'Press & hold the heart ❤',
    holdingText: 'Alaage pattuko...',
  },

  // ---------- Hero ----------
  hero: {
    eyebrow: 'A true story, episode one',
    title: ['The Developer', '&', 'The BDA'],
    subtitle: 'A slow-burn story, coded just for you.',
    sketch: img('mahi-sketch'),
    sketchCaption: 'Ee portrait lo prathi geetha... nee peru. mahi.',
  },

  // ---------- Media ----------
  media: {
    // SONG — put your Prabhas love song at public/audio/bgm.mp3 (exact name).
    // It starts when she presses the heart, and the pill at the top shows the name with a mute button.
    bgm: '/audio/bgm.mp3',
    bgmVolume: 0.4,
    bgmStartAt: 0, // seconds — skip a long intro, e.g. 12 starts the song at 0:12
    songTitle: '', // shown in the music pill, e.g. 'Ee Raathale'
    songFrom: '', // the film, e.g. 'Radhe Shyam'
    // VIDEO — use ONE of these two:
    //  1) put your file at public/video/proposal.mp4 (exact name), or
    //  2) paste a YouTube (unlisted is fine) / Google Drive / Vimeo link in videoLink — the link wins if both are set.
    video: '/video/proposal.mp4',
    videoLink: '',
    videoOrientation: 'portrait', // 'portrait' (phone video) or 'landscape' — only used for links & the placeholder
    videoPoster: img('us-smiling'), // picture shown before she presses play
    showVideoPage: true, // true = the video page is always in the site (shows "coming soon" until the video is added)
  },

  // ---------- Story ----------
  chapters: [
    {
      id: 1,
      label: 'Chapter One',
      title: 'Aa Abbayi',
      image: img('aji-solo'),
      caption: 'The Developer',
      text: [
        'Chinnapati nunchi responsibilities mosthu, work tappa inko prapancham teliyani oka abbayi.',
        'Office aipoyaka kuda night 11 varaku future kosam kastapaduthu, tana life eppudu oka serious reality anukunevadu. Evarithonu peddaga kalavani aa abbayi, life meeda chiraku vachinappudalla tanaki tane dhairyam cheppukovadaniki stories rasukunevadu.',
      ],
    },
    {
      id: 2,
      label: 'Chapter Two',
      title: "The 'Thumpsup Batch' Ammayi",
      image: img('mahi-office-glasses'),
      caption: 'The BDA ✨',
      text: [
        'Ade office lo join aina oka ammayi.',
        "Andari mundu chala silent ga, tana prashanthathani, tana privacy ni kapadukuntu tana sontha comfort zone lo unde 'Thumpsup batch' ammayi. Two months paatu asalu peddaga matladukoni aa iddaru, okaroju anukokunda matladukovadam start chesaru.",
      ],
    },
    {
      id: 3,
      label: 'Chapter Three',
      title: 'Aji & BDA',
      type: 'compare',
      before: img('us-serious'),
      after: img('us-smiling'),
      beforeLabel: 'Office lo: Serious Developer',
      afterLabel: 'Nee pakkana: ☺️',
      text: [
        'Akkadi nunchi aa abbayi prapancham mellaga maripoindi.',
        "Office lo andariki chala strong ga kanipinche aa developer, aame mundu matram chinnapilladila navvadam modalupettadu. Night time teliyakunda saage chattings, sarada godavalu, 'Aji', 'BDA' ane pilupulu... rojantha entha alasipoyina, mood entha balekapoyina, aame tho okka five minutes matladithe chalu aa alasata antha mayamaipoyedi.",
      ],
      chat: [
        { from: 'her', text: 'Aji 😤', time: '11:42 PM' },
        { from: 'me', text: 'Cheppu BDA 😌', time: '11:42 PM' },
        { from: 'her', text: 'Inka padukoledha?', time: '11:43 PM' },
        { from: 'me', text: 'Neetho 5 mins matladithe chalu, alasata antha poyindi ❤', time: '11:43 PM' },
      ],
    },
    {
      id: 4,
      label: 'Chapter Four',
      title: 'The Real Story',
      type: 'quote',
      quote:
        'Innallu tana santhosham kosam fictional stories rasukunna aa writer ki, ippudu fictional characters tho pani ledu. Endukante tana real life lone oka andamaina, prashanthamaina katha modalaindi.',
      reveal: 'Aa kathaki tanu pettina peru...',
      name: 'Mahi',
    },
  ],

  // ---------- Childhood (shown after Chapter Two, before Chapter Three) ----------
  childhood: {
    label: 'Konni yellala mundu',
    title: 'Chinnappudu',
    line: 'Manam kalavakamundhe, iddari photos lo okate common point: chethilo puvvulu 🌸',
    him: { image: img('aji-kid'), caption: 'Chinni Aji' },
    her: [
      { image: img('mahi-baby-flowers'), caption: 'Chinni Mahi' },
      { image: img('mahi-baby-hat'), caption: 'Aa cap 🥹' },
      { image: img('mahi-kid-blue'), caption: 'Blue dress lo' },
    ],
  },
  whatIf: {
    label: 'Oka chinna kala',
    title: 'Appude kalisi unte...',
    image: img('us-kids-whatif'),
    caption: 'Aji & Mahi, chinnappudu',
    text: 'Chinnappudu manam kalavaledu. Kani kalisi unte, aa roju naa chethilo unna puvvulu neeke ichevadini.',
  },

  // ---------- Her gallery ----------
  gallery: {
    eyebrow: 'Nuvvu',
    heading: 'Every frame, my favourite view',
    items: [
      { image: img('mahi-green-smile'), caption: 'Ee navvu chalu — rojantha alasata mayam.' },
      { image: img('mahi-lavender-silver'), caption: 'Lavender lo nuvvu… ippudu naa favourite colour 💜' },
      { image: img('mahi-office-chair'), caption: 'Office lo naa favourite view.' },
      { image: img('mahi-lavender-halfsaree'), caption: 'Simple ga unna, special ga untavu.' },
      { image: img('mahi-selfie'), caption: 'Ee selfie ki nenu pedda fan.' },
      { image: img('mahi-green-full'), caption: 'Rooftop, sunset, and you.' },
      { image: img('mahi-lavender-pattu'), caption: 'Pattu cheera lo, pure grace.' },
      { image: img('mahi-closeup'), caption: 'Aa kallu… enough said.' },
      { image: img('mahi-green-portrait'), caption: 'Silent ga, prashanthamga… nee style.' },
    ],
  },

  // ---------- Framed collages ----------
  frames: {
    eyebrow: 'Framed, forever',
    heading: 'Nee kosam chesina chinna frames',
    items: [
      { image: img('frame-heart'), caption: 'In the shape of my heart' },
      { image: img('frame-polaroid'), caption: 'Fairy lights & you' },
      { image: img('frame-gold'), caption: 'Golden memories' },
      { image: img('frame-wood'), caption: 'A classic, like you' },
    ],
  },

  // ---------- Video ----------
  videoSection: {
    eyebrow: 'A message',
    heading: 'Something I wanted to tell you directly...',
    subtext: 'Press play. Just you and me for a minute.',
    comingSoonTitle: 'Video coming soon ❤',
    comingSoonText: 'Nee kosam oka special video ready avtondi...',
  },

  // ---------- Love letter ----------
  letter: {
    envelopeText: 'Nee kosam oka letter',
    envelopeHint: 'Tap the seal to open ❤',
    greeting: 'Mahi,',
    paragraphs: [
      'Nenu right situation kosam wait chestunna ani cheppa kadha... idhe aa moment.',
      'Ninnu enduku inthala ishtapadutunnano telusa? Nuvvu na life lo ki rakamundu na days anni kevalam work, responsibilities, tensions thone nindipoyi undevi. Kani nuvvu vachaka, naku nijamaina peace ante ento telisindi.',
      'Nuvvu andarila kadu. Nee honesty, natho matladetappudu nuvvu chupinche aa comfort, matalatho panilekundane nannu ardam chesukune nee manastatvam... ivanni nannu neeku chala daggara chesayi. Rojantha entha stress lo unna, neetho matladithe vache aa relief naku inkekkada dorakadu.',
      "Ika nee meeda nakunna care gurinchi cheppalante... neeku nee privacy, nee peace, nee freedom entha mukhyamo naku baga telusu. Vatini eppudu disturb cheyakunda, ninnu kantiki reppala kapadukovalani undi. Nuvvu nee comfort zone daati bayata prapanchanni chudalanukunnappudu, nee cheyi pattukuni eppudu nee venake nilabade person ga nenu undalanukuntunnanu. Neeku ye kashtam vachina, 'nenu unnanu' ani dhairyam cheppe thoduga undalanukuntunnanu.",
      'Ee kotha intlo na life lo oka kotha chapter start avtundi. Aa chapter lo nuvvu na pakkana unte na life complete avtundi.',
    ],
    loveLine: 'I love you, Mahi.',
    signoff: '— Nee Developer, Aji',
  },

  // ---------- The question ----------
  proposal: {
    heading: 'Mahi, ee developer life lo partner ga untava?',
    subtext: 'Ippude answer cheppalani elanti pressure ledu, neeku kavalsinantha time teesuko...',
    yesButton: 'Yes, I will ❤',
    thinkButton: 'Let me think... ☺️',
    thinkModal: 'Neeku kavalsinantha time teesuko... kani ippudu okkasari phone pakkana petti, naa vaipu chusi oka chinna smile ivvu ☺️',
    thinkModalClose: 'Okay ☺️',

    // The "No" button runs away from the mouse / finger. Each escape shows the next line.
    noButton: 'No 🙈',
    noLines: [
      'No 🙈',
      'Sure aa? 🥺',
      'Pakka na? 😳',
      'Malli alochinchu 🤔',
      'Catch me if you can 😜',
      'Ayyo, missed 😂',
      'Inka try chestava? 🙃',
      'Impossible madam 😌',
      'Developer code idi, bug ledu 😎',
      'Yes button pakkane undi 👉',
      'Na heart oppukodu 💔',
      'Last chance... kidding 😆',
    ],
    // Little toasts that pop up after a few tries
    noToasts: {
      3: 'Aa button ki kallu unnayi Mahi 👀',
      6: 'Nenu code chesanu, adi neeku dorakadu 😌',
      10: 'Ok ok... "Yes" ki answer ivvu inka 💖',
      15: 'Neeku patience ekkuva ani telusu, kani idi infinite loop 😂',
    },
  },

  // ---------- Page navigation (one screen per part of the story) ----------
  pages: {
    hero: { next: 'Begin our story' },
    chapter1: { next: 'Next chapter' },
    chapter2: { next: 'Konchem venakki velladam' },
    childhood: { next: 'Appude kalisi unte?' },
    whatIf: { next: 'Tarvatha emaindi?' },
    chapter3: { next: 'The real story' },
    chapter4: { next: 'Nee photos chudu' },
    gallery: { next: 'Konni frames...' },
    frames: { next: 'Oka chinna video' },
    video: { next: 'Nee kosam oka letter' },
    letter: { next: 'Oka question...' },
    back: 'Back',
  },

  // ---------- Her answer ----------
  notify: {
    // Telegram alerts (opened / question / think / tried No / YES). Needs TELEGRAM_BOT_TOKEN and
    // TELEGRAM_CHAT_ID set in Vercel — see README "Know when she answers".
    enabled: true,
    // WhatsApp button on the final screen. Your number with country code, digits only, e.g. '919876543210'.
    // Leave '' to hide the button.
    whatsappNumber: '916309357023',
    whatsappButton: 'Send him my answer 💌',
    whatsappMessage: 'YES ❤️ I saw your website. Naku kuda nuvvu ante chala ishtam.',
  },

  // ---------- Final screen ----------
  finale: {
    photo: img('us-smiling'),
    line1: 'I love you, Mahi.',
    line2: 'Now put the phone down and look at me.',
    signoff: 'The Developer ❤ The BDA',
  },
}
