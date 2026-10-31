/* ==========================================================================
   KIDS VS IPPA — dialogue lines. Add / edit freely.
   `damage` = how much patience the dialogue drains (1–20).
   `special: 'laptop'` triggers the Computer-vs-Laptop negotiation.
   ========================================================================== */
export const DIALOGUES = [
  // ── Required lines ──────────────────────────────────────────────────────
  { id: 'poyi', text: 'Poyi padikkada', damage: 10 },
  { id: 'half-mark', text: '39½ alle? Aa baaki ½ mark evide poyi?', damage: 16 },
  { id: 'full-aplus', text: 'Full A+ Alle? 😀', damage: 12 },
  { id: 'laptop', text: 'Full A+ kittiya Computer aahno Laptop aahno? 😂', damage: 8, special: 'laptop' },

  // ── Additional lines ────────────────────────────────────────────────────
  { id: 'friend', text: 'Ninte friendinu ethra mark kitti?', damage: 14 },
  { id: 'exam-when', text: 'Exam eppo aanu? Appo ippo thottu padichu thudanganam!', damage: 13 },
  { id: 'phone-paripadi', text: 'Phone-il entha paripadi? Padikkan onnum ille?', damage: 12 },
  { id: 'forty', text: '40-il 40 kittiyalum ini next exam-ilum 40 venam!', damage: 18 },
  { id: 'result', text: 'Result vannittu namukku samsaarikkaam.', damage: 15 },
  { id: 'phone-order', text: 'Padichittu phone edukk! Phone eduthittu padikkanda!', damage: 11 },
  { id: 'book', text: 'Book thuranno? Athu mathi, first step complete.', damage: 7 },
  { id: 'sleep', text: 'Padikkan irunnittu urakkam varunnath engane?', damage: 10 },
  { id: 'aplus-satisfaction', text: 'A+ kittiyal santhosham. Full A+ kittiyal mathram samadhanam.', damage: 14 },
  { id: 'prayam', text: 'Njan ninte prayathil…', damage: 9 },
  { id: 'tv', text: 'TV off cheyyu. Exam-il TV-il ninnum questions varilla!', damage: 9 },
  { id: 'looking-book', text: 'Nee padikkunnundo, atho book nokki irikkunnathaano?', damage: 13 },
  { id: 'next-time', text: 'Nalla mark kittiyal next time athilum nannayi cheyyanam!', damage: 12 },
  { id: 'last-minute', text: 'Last minute padippu venda… last minute vare wait cheyyukayum venda!', damage: 13 },
  { id: 'charge', text: 'Enthayalum phone charge cheyyan marakkilla alle!', damage: 8 },
];

// Fictional "reward negotiation" outcomes for the computer-vs-laptop special.
export const NEGOTIATION_REPLIES = {
  computer: [
    'Computer? Fine. First: Full A+ in the NEXT exam too.',
    'Computer approved… pending a Full A+ in every subject. Including the ½ mark.',
  ],
  laptop: [
    'Laptop? Interesting. Counter-offer: Full A+ again, then we talk.',
    'Laptop request received. Estimated delivery: after Full A+, subject to ½ mark audit.',
  ],
};
