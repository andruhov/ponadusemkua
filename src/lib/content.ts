export type Locale = "uk" | "en";

type Text = { uk: string; en: string };

function tMap<T extends Record<string, Text>>(dict: T, locale: Locale) {
  const out = {} as { [K in keyof T]: string };
  for (const key of Object.keys(dict) as (keyof T)[]) {
    out[key] = dict[key][locale];
  }
  return out;
}

const name = {
  org: { uk: "ГО «Миколаїв понад усе»", en: "NGO “Mykolaiv First”" },
  short: { uk: "Миколаїв понад усе", en: "Mykolaiv First" },
} satisfies Record<string, Text>;

const hero = {
  kicker: {
    uk: "Громадська організація волонтерів",
    en: "A volunteer group from Mykolaiv, Ukraine",
  },
  lede: {
    uk: "Допомагаємо цивільним і переселенцям. Закуповуємо спорядження для військових, які захищають нашу країну.",
    en: "We help civilians and displaced people survive the war, and we buy life-saving equipment for those who defend the city.",
  },
  heroCta: { uk: "Підтримати", en: "Donate" },
  heroWork: { uk: "Наша робота", en: "Our work" },
} satisfies Record<string, Text>;

const about = {
  aboutTitle: { uk: "Хто ми", en: "Who we are" },
  aboutP1: {
    uk: "«Миколаїв понад усе» — громадське об’єднання миколаївських волонтерів. Ми допомагаємо цивільним та переселенцям, а також купуємо необхідне спорядження для військових, які захищають нашу країну.",
    en: "“Mykolaiv First” (Миколаїв понад усе) is a local group of volunteers from Mykolaiv, Ukraine. We help people who remain in the Mykolaiv region to survive the hardships of war. We also provide much needed equipment to the defenders of the city.",
  },
  aboutP2: {
    uk: "Все це ми робимо завдяки матеріальній підтримці від небайдужих людей з України та інших куточків світу. Завдяки вам. Ми не впораємось без вас.",
    en: "Mykolaiv sits near the southern front. The city was shelled for a long time with artillery and missiles, including banned cluster munitions. Ukrainian forces pushed the occupiers back beyond the Dnipro — but civilians and soldiers still need support: vests, helmets, medical kits, and the logistics that keep aid moving.",
  },
  quote: {
    uk: "Ваші пожертви можуть буквально врятувати комусь життя.",
    en: "Your donations can — and will — save lives. Literally.",
  },
} satisfies Record<string, Text>;

const work = {
  workTitle: { uk: "Наша робота", en: "Our work" },
  workLead: {
    uk: "Фотозвіти з виїздів і передач допомоги. Підпис під знімком відкриває відповідний допис у Telegram.",
    en: "Photo reports from our deliveries. Each caption opens the matching Telegram post.",
  },
  emptyGallery: {
    uk: "Покладіть фотографії у папку work — і тут з’явиться сітка.",
    en: "Add photographs to the work folder and they will appear here.",
  },
  seeMore: { uk: "Дивитися більше", en: "See more" },
} satisfies Record<string, Text>;

export const socials = [
  { id: "telegram", label: "Telegram", href: "https://t.me/PonaduseMkUa" },
  { id: "x", label: "X", href: "https://twitter.com/ponadusemkua" },
  { id: "facebook", label: "Facebook", href: "https://www.facebook.com/PonaduseMkUa" },
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/ponadusemkua" },
  { id: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@ponadusemkua" },
  { id: "mastodon", label: "Mastodon", href: "https://mastodon.social/@ponadusemkua" },
] as const;

const socialCopy = {
  socialTitle: { uk: "Соцмережі", en: "Social" },
  socialLead: {
    uk: "Звіти по зборах і закупівлях ми викладаємо на наших сторінках. Підпишіться, щоб не пропустити важливе.",
    en: "Most posts are in Ukrainian; automatic translation should help. This is where we publish purchase reports.",
  },
  thanks: {
    uk: "Дякуємо всім, хто допомагає та підтримує.",
    en: "Thank you for your help and support.",
  },
} satisfies Record<string, Text>;

export const jars = [
  {
    id: "military",
    href: "https://send.monobank.ua/jar/rnLJ4edAw",
    title: { uk: "Військовий збір", en: "Military fund" },
    text: {
      uk: "Термінові запити від військових: спорядження, медицина, техніка.",
      en: "Urgent requests from Ukrainian soldiers: gear, medicine, equipment.",
    },
  },
  {
    id: "nets",
    href: "https://send.monobank.ua/jar/4uqZoMUH2g",
    title: { uk: "Маскувальні сітки", en: "Camouflage nets" },
    text: {
      uk: "Матеріали для сіток, які плетуть наші волонтерки.",
      en: "Materials for the camouflage nets our volunteers weave.",
    },
  },
  {
    id: "warehouse",
    href: "https://send.monobank.ua/jar/4qggc3HihU",
    title: { uk: "Оренда складу", en: "Warehouse rent" },
    text: {
      uk: "Склад, з якого ми розподіляємо гуманітарну допомогу.",
      en: "Storage from which we sort and distribute humanitarian aid.",
    },
  },
  {
    id: "fuel",
    href: "https://send.monobank.ua/jar/2h1pHxeRVW",
    title: { uk: "Пальне і логістика", en: "Fuel and logistics" },
    text: {
      uk: "Пальне для волонтерських автівок та інші витрати на доставку.",
      en: "Fuel for volunteer vehicles and other delivery costs.",
    },
  },
  {
    id: "civilians",
    href: "https://send.monobank.ua/jar/29Z7ZfHdMe",
    title: { uk: "Допомога цивільним", en: "Help for civilians" },
    text: {
      uk: "Їжа та необхідне для мешканців області і переселенців.",
      en: "Food and essentials for locals and internally displaced people.",
    },
  },
] as const;

const jarsCopy = {
  jarsTitle: { uk: "На що збираємо зараз", en: "What we are raising now" },
  jarsLead: {
    uk: "Звіти по зборах і закупівлях викладаємо в соцмережах. Відкрийте банку, щоб допомогти конкретному напрямку.",
    en: "We publish reports on our social pages. Open a jar to support a specific need.",
  },
  openJar: { uk: "Відкрити банку", en: "Open jar" },
} satisfies Record<string, Text>;

export const cards = [
  { label: { uk: "Monobank", en: "Monobank" }, value: "4441 1111 3551 7120" },
  { label: { uk: "ПриватБанк", en: "PrivatBank" }, value: "5363 5420 9315 6314" },
  { label: { uk: "PayPal", en: "PayPal" }, value: "pangik@proton.me" },
  { label: { uk: "WISE", en: "WISE" }, value: "pangik@proton.me" },
] as const;

export const bankPdfs = [
  { code: "USD", href: "/pdf/USD.pdf" },
  { code: "EUR", href: "/pdf/EUR.pdf" },
  { code: "UAH", href: "/pdf/UAH.pdf" },
] as const;

export const cryptoWallets = [
  { label: { uk: "Bitcoin", en: "Bitcoin" }, value: "bc1q4wr2h4a004k9ecx78e52gcmt4ay0ru3754apct" },
  {
    label: { uk: "Ethereum (ERC-20)", en: "Ethereum (ERC-20 tokens)" },
    value: "0x944cb6f880e6ba6311469287d187ed6130796a25",
  },
  {
    label: { uk: "TRON (TRC-20)", en: "TRON (TRC-20 tokens)" },
    value: "TZ1sXaZf3cW9epXpGPSc2J7Q277qodp3qU",
  },
  {
    label: { uk: "Solana", en: "Solana" },
    value: "CjMwthqp4d7pMKRCzLon7t3bem3xx1UHF8D3KV9C5TFS",
  },
  {
    label: { uk: "Binance (будь-яка крипта)", en: "Binance (any crypto)" },
    value: "pangik@proton.me",
  },
] as const;

export const monero =
  "48KzDUcSkgQ7yoyF1L365SfoL2FCCnRDz8HiccmzuUfZXjmfSnzuDSZH7JnekficJTBjgtUi4WYs5XnDXEY2uR1SEQaoF5g";

const donateCopy = {
  donateTitle: { uk: "Реквізити", en: "How to help" },
  donateLead: {
    uk: "Картки, банківські рахунки або крипта — оберіть зручний спосіб.",
    en: "Cards, bank wire, or crypto — use whichever is easiest.",
  },
  tabCards: { uk: "Картки", en: "Cards" },
  tabBank: { uk: "Рахунки", en: "Bank" },
  tabCrypto: { uk: "Крипта", en: "Crypto" },
  tabAnon: { uk: "Анонімно", en: "Anonymous" },
  bankLead: {
    uk: "Реквізити рахунків у PDF — USD, EUR і гривня.",
    en: "Bank details as PDF — USD, EUR and hryvnia.",
  },
  downloadPdf: { uk: "Завантажити", en: "Download" },
  cryptoLead: {
    uk: "Натисніть рядок, щоб скопіювати адресу.",
    en: "Tap a row to copy the address.",
  },
  anonLead: {
    uk: "Monero — для переказів без публічної історії.",
    en: "Monero — for transfers without a public history.",
  },
} satisfies Record<string, Text>;

const chrome = {
  navAbout: { uk: "Про нас", en: "About" },
  navWork: { uk: "Робота", en: "Work" },
  navJars: { uk: "Збори", en: "Funds" },
  navDonate: { uk: "Реквізити", en: "Details" },
  menu: { uk: "Меню", en: "Menu" },
  close: { uk: "Закрити", en: "Close" },
  prev: { uk: "Попереднє фото", en: "Previous photo" },
  next: { uk: "Наступне фото", en: "Next photo" },
  pause: { uk: "Пауза", en: "Pause" },
  play: { uk: "Відтворити", en: "Play" },
  closePhoto: { uk: "Закрити фото", en: "Close photo" },
  copy: { uk: "Копіювати", en: "Copy" },
  copied: { uk: "Скопійовано", en: "Copied" },
  langUk: { uk: "UKR", en: "UKR" },
  langEn: { uk: "ENG", en: "ENG" },
  skip: { uk: "До змісту", en: "Skip to content" },
} satisfies Record<string, Text>;

const strings = {
  ...name,
  ...hero,
  ...about,
  ...work,
  ...socialCopy,
  ...jarsCopy,
  ...donateCopy,
  ...chrome,
};

export function t(locale: Locale) {
  return tMap(strings, locale);
}
