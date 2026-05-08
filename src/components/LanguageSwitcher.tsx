import { useLanguage } from "@/i18n/LanguageContext";
import { SUPPORTED_LANGUAGES } from "@/i18n/translations";
import { useState, useRef, useEffect } from "react";
import { Languages, ChevronDown } from "lucide-react";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
      >
        <Languages className="h-4 w-4" />
        <span>{currentLang?.nativeName || language}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 max-h-80 w-56 overflow-y-auto rounded-lg border border-border bg-background shadow-lg">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code); setOpen(false); }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors ${
                language === lang.code ? "bg-accent font-medium" : ""
              }`}
            >
              <span>{lang.nativeName}</span>
              <span className="ml-auto text-xs text-muted-foreground">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
