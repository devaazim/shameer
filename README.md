# SHAMEER KT — Interactive Portfolio

React + Vite, plain CSS, no animation libraries.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # serve the production build
```

Needs Node 18+.

## Where to edit things

| What | File |
| --- | --- |
| Hero / About portrait path, About heading + paragraph, nav, guestbook on/off | `src/data/site.js` |
| The two Thought → Marriage photos (blank on purpose) | `src/data/site.js` (`THOUGHT_PHOTO`, `MARRIAGE_PHOTO`) |
| Timeline milestones and dates | `src/data/timeline.js` |
| Gallery categories and photos | `src/data/gallery.js` |
| Kids vs Ippa dialogues | `src/data/dialogues.js` |
| Awards | `src/data/awards.js` |
| Shameer OS bars, Finance metrics, work tasks, terminal commands | `src/data/stats.js` |

## Adding photos

1. Copy images into `public/images/gallery/`.
2. Add an entry to the right category in `src/data/gallery.js`
   (`{ src: '/images/gallery/nikkah-1.jpg', title: '', caption: '', alt: '' }`).
3. The **first** image of Nikkah / Marriage / First, Second, Third Child is used automatically
   by the matching timeline card. Nothing else to change.

For the two blank frames above the gallery, drop `thought-photo.jpg` and `marriage-photo.jpg`
into `public/images/` and set the two constants in `src/data/site.js`.

## The portrait

`public/images/shameer-portrait.png` is a transparent cutout made from the supplied poster
(`reference/original-poster.jpg`). To use a different cutout, replace the file and update
`PORTRAIT_ASPECT` in `src/data/site.js` (width ÷ height of the new image).

## Fonts

`index.html` loads Anton + Inter from Google Fonts. Offline, the site falls back to Impact /
Arial Narrow / system sans. Self-host the fonts if it must work without internet.

## Guestbook

Entries are saved in the visitor's own browser (`localStorage`) only. They are not shared with other
visitors or devices. Public messages would need a backend. Set `SHOW_GUESTBOOK = false` in
`src/data/site.js` to remove it.

## Secrets

Type `porotta` anywhere (outside a text box) on desktop. On touch screens, tap the footer's
"SHAMEER KT" 5 times. Also: click the porotta art, the 100/100 target and the Loan Recovery metric.

## Cursor & mouse effects

`src/components/CursorFX.jsx` (styles at the end of `src/styles/funny.css`): custom cursor with a trailing ring,
"VIEW" bubble on photos, magnetic buttons, 3D tilt on gallery photos / OS modules / finance metrics, hero
spotlight and sparkle trail, and a spark burst on every click or tap. It only runs for a mouse and is skipped
for reduced-motion. Remove `<CursorFX />` in `src/App.jsx` to turn it off.

## Colours and background

The accent colour lives in the `--gold*` / `--a-rgb` tokens at the top of `src/styles/base.css` (the names are
historical; the accent is now teal). Each playful section re-maps them locally under "SECTION ACCENTS" at the end of
`src/styles/funny.css` (porotta + awards amber, finance emerald, full marks coral, work machine violet, Kids vs Ippa blue,
guestbook + ending pink). The animated background is `src/components/AuroraBG.jsx` (drifting colour clouds + dust that
shift hue as you scroll and lean toward the mouse). Remove `<AuroraBG />` in `src/App.jsx` to turn it off.

## Hero → About animation

A tiny scroll (`TRIGGER`, 18px, in `src/components/HeroAbout.jsx`) starts the whole portrait flight, which then plays by
itself over `DURATION` (1.5 s). Scrolling back to the very top plays it in reverse. Change those two numbers to taste.
