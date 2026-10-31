/* ==========================================================================
   GALLERY — add your real photos here.

   HOW TO ADD PHOTOS
   1. Copy image files into  /public/images/gallery/   (any sub-folder is fine).
   2. Add an entry to the matching category's `images` array below:
        { src: '/images/gallery/nikkah-1.jpg', title: 'Nikkah day', caption: 'Optional caption', alt: 'Describe the photo' }
   3. The FIRST entry of each category is automatically used for the matching
      timeline mini card. Nothing else to edit.

   While a category's `images` array is empty, tasteful numbered placeholders
   are shown instead (no broken images, no failed network requests).
   ========================================================================== */
export const GALLERY_CATEGORIES = [
  { id: 'family', label: 'Family', hue: 38, images: [
  { src: '/images/gallery/f1.jpeg', title: 'Family', caption: '', alt: '' },
    { src: '/images/gallery/f2.jpeg', title: 'Family', caption: '', alt: '' },
      { src: '/images/gallery/f3.jpeg', title: 'Family', caption: '', alt: '' },
        { src: '/images/gallery/f4.jpeg', title: 'Family', caption: '', alt: '' },
              { src: '/images/gallery/f5.jpeg', title: '', caption: '', alt: '' },
  ] },
  { id: 'nikkah', label: 'Nikkah', hue: 160, images: [
    { src: '/images/gallery/n1.jpeg', title: 'Nikkah day', caption: '', alt: 'Shameer at the nikkah' },
      { src: '/images/gallery/n2.jpeg', title: 'Nikkah day', caption: '', alt: 'Shameer at the nikkah' },
        { src: '/images/gallery/n3.jpeg', title: 'Nikkah day', caption: '', alt: 'Shameer at the nikkah' },
          { src: '/images/gallery/n4.jpeg', title: 'Nikkah day', caption: '', alt: 'Shameer at the nikkah' },
  ] },
  { id: 'marriage', label: 'Marriage', hue: 340, images: [
  { src: '/images/gallery/w2.jpeg', title: '', caption: '', alt: '' },
    { src: '/images/gallery/w1.jpeg', title: '', caption: '', alt: '' },
      { src: '/images/gallery/w3.jpeg', title: '', caption: '', alt: '' },
        { src: '/images/gallery/w4.jpeg', title: '', caption: '', alt: '' },
  ] },
  { id: 'first-child', label: 'First Child', hue: 205, images: [
  { src: '/images/gallery/11.jpeg', title: '', caption: '', alt: '' },
    { src: '/images/gallery/12.jpeg', title: '', caption: '', alt: '' },
      { src: '/images/gallery/13.jpeg', title: '', caption: '', alt: '' },
        { src: '/images/gallery/14.jpeg', title: '', caption: '', alt: '' },
              { src: '/images/gallery/15.jpeg', title: '', caption: '', alt: '' },
  ] },
  { id: 'second-child', label: 'Second Child', hue: 275, images: [
  { src: '/images/gallery/21.jpeg', title: '', caption: '', alt: '' },
      { src: '/images/gallery/22.jpeg', title: '', caption: '', alt: '' },
      { src: '/images/gallery/23.jpeg', title: '', caption: '', alt: '' },
        { src: '/images/gallery/24.jpeg', title: '', caption: '', alt: '' },
  ] },
  { id: 'third-child', label: 'Third Child', hue: 18, images: [
  { src: '/images/gallery/31.jpeg', title: '', caption: '', alt: '' },
    { src: '/images/gallery/32.jpeg', title: '', caption: '', alt: '' },
      { src: '/images/gallery/33.jpeg', title: '', caption: '', alt: '' },
        { src: '/images/gallery/34.jpeg', title: '', caption: '', alt: '' },
  ] },
  { id: 'others', label: 'Others', hue: 95, images: [
  { src: '/images/gallery/o1.jpeg', title: '', caption: '', alt: '' },
    { src: '/images/gallery/o2.jpeg', title: '', caption: '', alt: '' },
      { src: '/images/gallery/o3.jpeg', title: '', caption: '', alt: '' },
        { src: '/images/gallery/o4.jpeg', title: '', caption: '', alt: '' },
  ] },
];

const PLACEHOLDER_COUNT = 4;

export function getCategory(id) {
  return GALLERY_CATEGORIES.find((c) => c.id === id) || GALLERY_CATEGORIES[0];
}

/** Items to show for a category — real images, or numbered placeholders if none yet. */
export function getCategoryItems(id) {
  const cat = getCategory(id);
  if (cat.images.length) {
    return cat.images.map((img, i) => ({
      ...img,
      key: `${cat.id}-${i}`,
      hue: cat.hue,
      title: img.title || `${cat.label} · Photo ${i + 1}`,
      alt: img.alt || img.title || `${cat.label} photo ${i + 1}`,
      placeholder: false,
    }));
  }
  return Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => ({
    key: `${cat.id}-ph-${i}`,
    hue: cat.hue,
    title: `${cat.label} · Photo ${i + 1}`,
    alt: `Placeholder for ${cat.label} photo ${i + 1}`,
    caption: 'Photo coming soon',
    placeholder: true,
  }));
}

/** The first image (or placeholder) of a category — used by timeline mini cards. */
export function getFirstImage(id) {
  return getCategoryItems(id)[0];
}