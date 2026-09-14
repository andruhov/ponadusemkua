# Миколаїв понад усе

Сайт ГО «Миколаїв понад усе» / NGO “Mykolaiv First”: хто ми, фотозвіти, банки Monobank, реквізити.

Жива тестова сторінка: https://andruhov.github.io/ponadusemkua/

## Що правити без коду

Усі написи й реквізити — у `content/`. Деталі: [`content/README.md`](content/README.md).

| Файл | Що змінювати |
|---|---|
| `content/strings.jsonc` | Тексти українською й англійською |
| `content/donate.jsonc` | Банки, картки, крипта, PDF |
| `content/socials.jsonc` | Посилання на соцмережі |
| `content/gallery-captions.txt` | Підписи фото |

Фото кладіть у `public/work/` (сітка) і `public/slideshow/` (перший екран). PDF — у `public/pdf/`.

## Локально

```bash
npm ci
npm run dev
```

Сайт на `http://127.0.0.1:8080/`. Англійська версія: `/en`.

```bash
npm test
npm run typecheck
npm run build
```

## GitHub Pages

Живий сайт: https://andruhov.github.io/ponadusemkua/

Джерело в Settings — **GitHub Actions**. Кожен пуш у `main` проганяє тести, збирає сайт у `docs/` і викладає його workflow `.github/workflows/pages.yml`. Каталог `docs/` у git не тримається.

Джерело фото, PDF і іконок — `public/`. Після змін зробіть пуш у `main`; комітити зібраний HTML не потрібно. Якщо збірка в Actions червона, попередня версія сайту лишається живою.
