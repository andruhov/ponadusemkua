# Миколаїв понад усе

Сайт ГО «Миколаїв понад усе» / NGO “Mykolaiv First”: хто ми, фотозвіти, банки Monobank, реквізити.

Жива сторінка: https://andruhov.github.io/ponadusemkua/

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

Сайт зараз віддається **з кореня гілки** (`index.html` у корені репозиторію). `npm run build` кладе готові сторінки і в корінь, і в `docs/` (гілка `docs/` у git не тримається).

Джерело фото завжди `public/`. Кореневі `work/`, `slideshow/`, `pdf/` — копії для Pages, їх оновлює збірка.

Є також workflow `.github/workflows/pages.yml`, якщо колись перемкнете Pages на GitHub Actions. Поки Source = гілка / root, живий сайт залежить від HTML у корені.
