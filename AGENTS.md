# Миколаїв понад усе

Інструкції для будь-якого агента, який працює з цим репозиторієм.

Лендінг ГО «Миколаїв понад усе» / NGO “Mykolaiv First”: хто ми, фотозвіти, банки Monobank, реквізити.

Живий сайт: https://andruhov.github.io/ponadusemkua/

## Стек

Vite 8, React 19, TanStack Start/Router, Tailwind v4. Статичний деплой на GitHub Pages через Actions (`.github/workflows/pages.yml`). Коли `GITHUB_PAGES=1`, Vite `base` — `/ponadusemkua/`.

## Що правити

| Що змінюється | Де |
|---|---|
| Тексти (UK/EN), реквізити, банки, соцмережі | `content/` — див. `content/README.md` |
| Фото сітки «Наша робота» | `public/work/` + `content/gallery-captions.txt` |
| Слайди першого екрана | `public/slideshow/` |
| PDF рахунків | `public/pdf/` |

У сітці показуються перші `WORK_GALLERY_LIMIT` файлів з `public/work/` (зараз 18). Зайві файли можна лишати в каталозі.

**Не стискайте й не змінюйте розмір фото** — цим займається замовник.

Маршрути: `/` (українська), `/en` (англійська), `/eng` — редірект на `/en`.

## Команди

```bash
npm ci
npm run dev          # http://127.0.0.1:8080/
npm test
npm run typecheck
npm run build        # збирає в docs/ (у git не комітити)
```

На Windows викликайте `npm.cmd`, не `npm`. Vite стартує через `scripts/with-app-env.mjs` (локальний `node` + `vite.js`), не через `vite.cmd`.

## Деплой

Source у GitHub Pages — **GitHub Actions**. Пуш у `main` проганяє тести, typecheck і збірку, потім викладає `docs/`. Каталог `docs/` і зібраний HTML у корені репозиторію не тримаються.

Джерело статичних файлів — `public/`. Після змін потрібен пуш; комітити зібраний сайт не треба.

## Перевірка UI

Якщо змінюєте те, що бачить відвідувач (верстка, маршрути, контент на сторінці), перевірте українську й англійську версії. Playwright локально може бути не встановлений — тоді дивіться зібраний HTML у `docs/` після `npm run build`.
