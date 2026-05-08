import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useAppState, type SavedIdea, type SavedPlan } from "@/contexts/AppStateContext";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import IdeaCard from "@/components/IdeaCard";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Lightbulb, Bookmark, Route as RouteIcon, Bell, Moon, LogOut,
  ChevronRight, X, Trash2,
} from "lucide-react";

type ModalView = null | "ideas" | "plans";

const AccountPage = () => {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const {
    darkMode, notifications, savedIdeas, savedPlans,
    ideasCreated, plansCreated,
    toggleDarkMode, toggleNotifications,
    removeIdea, removePlan, saveIdea,
  } = useAppState();
  const [modalView, setModalView] = useState<ModalView>(null);
  const navigate = useNavigate();
  const { language } = useLanguage();

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600">
              <Lightbulb className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-lg font-bold">{t("appTitle")}</span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="mb-4 font-display text-2xl font-bold">{t("accountTitle")}</h1>

        {/* Profile card */}
        <Card className="mb-6">
          <CardContent className="flex flex-col items-center py-8">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-stone-300 to-stone-400 text-2xl font-bold text-white">
              {initial}
            </div>
            <p className="text-lg font-semibold">{user?.name}</p>
            <div className="mt-4 flex gap-8 text-center">
              <div>
                <p className="text-xl font-bold">{ideasCreated}</p>
                <p className="text-xs text-muted-foreground">{t("ideasCreated")}</p>
              </div>
              <div>
                <p className="text-xl font-bold">{plansCreated}</p>
                <p className="text-xs text-muted-foreground">{t("plansCreated")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">{t("accountSettings")}</h2>
        <Card>
          <CardContent className="divide-y divide-border p-0">
            {/* Saved Ideas */}
            <button
              onClick={() => setModalView("ideas")}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-sm hover:bg-accent transition-colors"
            >
              <Bookmark className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-left">{t("savedIdeas")}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>

            {/* Saved Plans */}
            <button
              onClick={() => setModalView("plans")}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-sm hover:bg-accent transition-colors"
            >
              <RouteIcon className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-left">{t("savedPlans")}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>

            {/* Notifications */}
            <div className="flex items-center gap-3 px-4 py-3.5 text-sm">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1">{t("notifications")}</span>
              <Switch checked={notifications} onCheckedChange={toggleNotifications} />
            </div>

            {/* Dark theme */}
            <div className="flex items-center gap-3 px-4 py-3.5 text-sm">
              <Moon className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1">{t("darkTheme")}</span>
              <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
            </div>

            {/* Logout */}
            <button
              onClick={signOut}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-sm text-destructive hover:bg-accent transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>{t("logout")}</span>
            </button>
          </CardContent>
        </Card>

        {/* Version */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Ethereal Think v2.4.0 • {t("version")}
        </p>
      </main>

      {/* Modal for saved items */}
      {modalView && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
          <div className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-background p-5 animate-fade-in">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">
                {modalView === "ideas" ? t("savedIdeas") : t("savedPlans")}
              </h3>
              <button
                onClick={() => setModalView(null)}
                className="rounded-full p-1 hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalView === "ideas" && (
              savedIdeas.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">{t("noSavedIdeas")}</p>
              ) : (
                <div className="space-y-4">
                  {savedIdeas.map((item) => (
                    <IdeaCard
                      key={item.id}
                      idea={item}
                      isSaved={true}
                      onSave={() => {
                        removeIdea(item.id);
                        toast.info(language === "ru" ? "Удалено" : "Removed");
                      }}
                      onShare={async (idea) => {
                        try {
                          if (navigator.share) {
                            await navigator.share({ title: idea.title, text: idea.description, url: window.location.href });
                          } else {
                            await navigator.clipboard.writeText(`${idea.title}\n${idea.description}`);
                            toast.success(language === "ru" ? "Текст скопирован" : "Text copied");
                          }
                        } catch (e) {}
                      }}
                      onCopy={async (idea) => {
                        await navigator.clipboard.writeText(`${idea.title}\n${idea.description}`);
                        toast.success(language === "ru" ? "Ссылка скопирована" : "Link copied");
                      }}
                      onExplore={(idea) => {
                        setModalView(null);
                        navigate("/steps", { state: { idea: `${idea.title}: ${idea.description}` } });
                      }}
                    />
                  ))}
                </div>
              )
            )}

            {modalView === "plans" && (
              savedPlans.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">{t("noSavedPlans")}</p>
              ) : (
                <div className="space-y-2">
                  {savedPlans.map((item) => (
                    <div key={item.id} className="rounded-lg border p-3">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <p className="text-sm font-medium">{item.idea}</p>
                        <button
                          onClick={() => removePlan(item.id)}
                          className="shrink-0 rounded p-1 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                        {typeof item.plan === "string" 
                          ? item.plan 
                          : item.plan.projectTitle + " (" + item.plan.steps.length + " steps)"}
                      </p>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
