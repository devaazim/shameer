import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);

/** Tiny notification system: toast('message', { icon, tone, duration }) — max 3 visible. */
export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const idRef = useRef(0);
  const timers = useRef(new Map());

  const push = useCallback((message, opts = {}) => {
    const id = ++idRef.current;
    setItems((prev) => [...prev.slice(-2), { id, message, icon: opts.icon, tone: opts.tone || '' }]);
    const t = setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
      timers.current.delete(id);
    }, opts.duration || 3800);
    timers.current.set(id, t);
  }, []);

  useEffect(() => {
    const map = timers.current;
    return () => map.forEach(clearTimeout);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {items.map((i) => (
          <div key={i.id} className={`toast ${i.tone}`}>
            {i.icon && (
              <span className="toast-ic" aria-hidden="true">
                {i.icon}
              </span>
            )}
            <span>{i.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
