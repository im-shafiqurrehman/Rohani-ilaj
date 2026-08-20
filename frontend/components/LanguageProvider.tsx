"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { DEFAULT_LANG, Lang, LANGS, dirFor, tFor } from "@/lib/i18n";

const STORAGE_KEY = "rohani-lang";

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: ReturnType<typeof tFor>;
}>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: tFor(DEFAULT_LANG),
});

export const useLang = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // The pre-paint script has already set lang/dir on <html>, so read from the
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    const current = document.documentElement.getAttribute("lang");
    if (current && LANGS.includes(current as Lang)) {
      setLangState(current as Lang);
    }
  }, []);

  const setLang = useCallback((next: Lang) => {
    if (!LANGS.includes(next)) return;
    setLangState(next);
    // Direction is a document-level concern: Urdu is RTL, English is LTR, and
    // every logical property in the stylesheet keys off this.
    document.documentElement.setAttribute("lang", next);
    document.documentElement.setAttribute("dir", dirFor(next));
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private browsing — the choice just won't persist */
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: tFor(lang) }}>
      {children}
    </LanguageContext.Provider>
  );
}
