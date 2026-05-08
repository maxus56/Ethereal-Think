import NavLink from "./NavLink";
import { useLanguage } from "@/i18n/LanguageContext";
import { Sparkles, Route, User } from "lucide-react";

const BottomNav = () => {
  const { t } = useLanguage();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-lg items-center justify-around py-1">
        <NavLink
          to="/"
          icon={<Sparkles className="h-5 w-5" />}
          label={t("generator")}
        />
        <NavLink
          to="/steps"
          icon={<Route className="h-5 w-5" />}
          label={t("steps")}
        />
        <NavLink
          to="/account"
          icon={<User className="h-5 w-5" />}
          label={t("account")}
        />
      </div>
    </nav>
  );
};

export default BottomNav;
