import { useEffect, useState } from 'react';
import { useReveal } from '../hooks/useReveal.js';

/**
 * OPTIONAL GUESTBOOK (set SHOW_GUESTBOOK = false in src/data/site.js to remove it).
 * Entries live ONLY in this visitor's browser (localStorage). They are NOT published,
 * NOT shared with other visitors, and NOT sent to any server.
 * To make it public you would need a backend (see README → "Public guestbook").
 */
const KEY = 'shameer-kt-guestbook-v1';
const TITLES = ['Chief Porotta Officer', 'Minister of Full Marks', 'Head of Loan Recovery (Pending)', 'Director of Unnecessary Questions'];

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((e) => e && typeof e.name === 'string' && typeof e.message === 'string') : [];
  } catch {
    return [];
  }
}
function save(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

export default function Guestbook() {
  const ref = useReveal();
  const [entries, setEntries] = useState(() => load());
  const [form, setForm] = useState({ name: '', message: '', title: '' });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    setSaved(save(entries));
  }, [entries]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const message = form.message.trim();
    const title = form.title.trim();
    const errs = {};
    if (!name) errs.name = 'Please add a name or nickname.';
    else if (name.length > 30) errs.name = 'Keep it under 30 characters.';
    if (!message) errs.message = 'Please write a short message or memory.';
    else if (message.length > 280) errs.message = 'Keep it under 280 characters.';
    if (title.length > 40) errs.title = 'Keep the title under 40 characters.';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setEntries((prev) => [{ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name, message, title, at: Date.now() }, ...prev].slice(0, 50));
    setForm({ name: '', message: '', title: '' });
  };

  const remove = (id) => setEntries((prev) => prev.filter((x) => x.id !== id));

  return (
    <section id="guestbook" className="sec guest-sec" aria-labelledby="gb-h">
      <div className="guest" ref={ref}>
        <div className="sec-head reveal">
          <p className="eyebrow">OPTIONAL · SAVED ON THIS DEVICE ONLY</p>
          <h2 id="gb-h" className="sec-title">GUESTBOOK</h2>
          <p className="notice">
            Entries are stored <b>only in this browser</b> on this device. They are not published, and other visitors cannot see them.
          </p>
        </div>

        <div className="guest-grid reveal" style={{ '--d': '120ms' }}>
          <form className="guest-form" onSubmit={submit} noValidate>
            <div className="field">
              <label htmlFor="gb-name">Name or nickname</label>
              <input id="gb-name" value={form.name} onChange={set('name')} maxLength={40} autoComplete="nickname" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'gb-name-e' : undefined} />
              {errors.name && <p id="gb-name-e" className="err">{errors.name}</p>}
            </div>
            <div className="field">
              <label htmlFor="gb-msg">Short message or memory</label>
              <textarea id="gb-msg" rows={4} value={form.message} onChange={set('message')} maxLength={300} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'gb-msg-e' : undefined} />
              <span className="count">{form.message.trim().length}/280</span>
              {errors.message && <p id="gb-msg-e" className="err">{errors.message}</p>}
            </div>
            <div className="field">
              <label htmlFor="gb-title">A funny title for Shameer <span className="opt">(optional)</span></label>
              <input id="gb-title" list="gb-titles" value={form.title} onChange={set('title')} maxLength={50} aria-invalid={!!errors.title} aria-describedby={errors.title ? 'gb-title-e' : undefined} />
              <datalist id="gb-titles">
                {TITLES.map((t) => <option key={t} value={t} />)}
              </datalist>
              {errors.title && <p id="gb-title-e" className="err">{errors.title}</p>}
            </div>
            <button type="submit" className="btn btn-gold">SIGN THE GUESTBOOK</button>
            {!saved && <p className="err">Browser storage is unavailable — entries will disappear when you leave this page.</p>}
          </form>

          <div className="guest-list" aria-live="polite">
            {entries.length === 0 && <p className="empty">No entries yet. Yours could be the first (on this device).</p>}
            {entries.map((en) => (
              <article key={en.id} className="g-entry">
                <header>
                  <b>{en.name}</b>
                  {en.title && <span className="g-title">“{en.title}”</span>}
                </header>
                <p>{en.message}</p>
                <button type="button" className="g-del" onClick={() => remove(en.id)} aria-label={`Remove entry from ${en.name}`}>
                  Remove
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
