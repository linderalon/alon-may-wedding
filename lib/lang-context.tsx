"use client";

import * as React from "react";
import { translations, type Lang } from "./translations";

type AnyTranslation = typeof translations[Lang];

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: AnyTranslation;
  dir: "ltr" | "rtl";
}

const LangContext = React.createContext<LangCtx>({
  lang:    "en",
  setLang: () => {},
  t:       translations.en,
  dir:     "ltr",
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>("en");

  React.useEffect(() => {
    const stored = localStorage.getItem("wedding-lang") as Lang | null;
    if (stored === "en" || stored === "he") setLangState(stored);
  }, []);

  // keep the document direction in sync with the active language, on every
  // change (initial restore from storage included, not just explicit picks)
  React.useEffect(() => {
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = React.useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("wedding-lang", l);
  }, []);

  const value: LangCtx = {
    lang,
    setLang,
    t:   translations[lang],
    dir: lang === "he" ? "rtl" : "ltr",
  };

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLangContext() {
  return React.useContext(LangContext);
}
