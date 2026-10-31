/* ==========================================================================
   SITE CONFIG — the easiest place to edit text and key images.
   ========================================================================== */

// ── MAIN PORTRAIT ───────────────────────────────────────────────────────────
// Transparent-background cutout used by the hero → About "flying" animation.
// To use a better cutout, replace the file in /public/images/ (same name),
// or change this path. Keep the same aspect ratio (≈ 962 × 902) for best results.
export const PORTRAIT_SRC = '/images/shameer-portrait.png';
export const PORTRAIT_ALT = 'Portrait of Shameer KT in a black three-piece suit';
export const PORTRAIT_ASPECT = 962 / 902; // width / height of the portrait image (must match the file)

// ── THOUGHT → MARRIAGE PHOTOS (exactly two, intentionally blank for now) ───
// 1) Put your "thinking" photo in /public/images/thought-photo.jpg
//    then set:  export const THOUGHT_PHOTO = '/images/thought-photo.jpg';
// 2) Put your marriage photo in /public/images/marriage-photo.jpg
//    then set:  export const MARRIAGE_PHOTO = '/images/marriage-photo.jpg';
// While these are '' the frames stay blank (on purpose, not broken).
export const THOUGHT_PHOTO = '/images/gallery/w4.jpeg';
export const MARRIAGE_PHOTO = '/images/gallery/n1.jpeg';

// ── ABOUT ───────────────────────────────────────────────────────────────────
export const ABOUT_HEADING = 'ABOUT THE LEGEND.';
// Replace the placeholder below with the real About paragraph.
export const ABOUT_PARAGRAPH = `
Born in 1979, his journey began long before his success. At just 12 years old, he was already taking on family responsibilities.

Years of dedication and hard work brought him to where he stands today — an accountant in Jeddah.

A master of numbers, a problem solver by nature, and a comedian when nobody expects it.

Beside him stands his lovely wife, NAEEMA, his lifelong partner and greatest blessing.
`

// ── NAVIGATION ──────────────────────────────────────────────────────────────
export const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'highlights', label: 'Highlights' },
  { id: 'awards', label: 'Awards' },
];

// Which DOM section ids count as which nav item (used for the active highlight).
// `null` means "no nav item is highlighted".
export const SECTION_MAP = [
  { id: 'home', nav: 'home' },
  { id: 'about', nav: 'about' },
  { id: 'timeline', nav: 'timeline' },
  { id: 'thought', nav: 'timeline' },
  { id: 'gallery', nav: 'gallery' },
  { id: 'highlights', nav: 'highlights' },
  { id: 'awards', nav: 'awards' },
  { id: 'terminal', nav: null },
  { id: 'guestbook', nav: null },
  { id: 'ending', nav: null },
];

// Sub-sections grouped under "Highlights".
export const HIGHLIGHT_LINKS = [
  { id: 'porotta', label: 'Porotta' },
  { id: 'finance', label: 'Finance™' },
  { id: 'full-marks', label: 'Full Marks' },
  { id: 'work-machine', label: 'Work Machine' },
  { id: 'kids-vs-ippa', label: 'Kids vs Ippa' },
  { id: 'shameer-os', label: 'Shameer OS™' },
];

// ── OPTIONAL FEATURES ───────────────────────────────────────────────────────
// Set to false to remove the guestbook section entirely.
export const SHOW_GUESTBOOK = true;
