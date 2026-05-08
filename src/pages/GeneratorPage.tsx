import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useAppState, type SavedIdea } from "@/contexts/AppStateContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import IdeaCard from "@/components/IdeaCard";
import { generateIdeas, getMuseOfWeek } from "@/lib/ai";
import { Sparkles, Lightbulb } from "lucide-react";
import { toast } from "sonner";

const GeneratorPage = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    saveIdea, 
    removeIdea, 
    incrementIdeas, 
    currentIdeas, 
    setCurrentIdeas,
    savedIdeas 
  } = useAppState();
  
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const muse = getMuseOfWeek();

  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("greeting");
    if (hour < 18) return language === "ru" ? "Добрый день" : "Good afternoon";
    return language === "ru" ? "Добрый вечер" : "Good evening";
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setCurrentIdeas([]);
    setStatus("");
    try {
      const result = await generateIdeas(topic, language, (msg) => setStatus(msg));
      setCurrentIdeas(result);
      incrementIdeas();
    } catch (err: any) {
      toast.error(err.message || "Failed to generate ideas");
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  const handleToggleSave = (idea: SavedIdea) => {
    const isSaved = savedIdeas.some((i) => i.id === idea.id);
    if (isSaved) {
      removeIdea(idea.id);
      toast.info(language === "ru" ? "Удалено из сохраненных" : "Removed from saved");
    } else {
      saveIdea(idea);
      toast.success(language === "ru" ? "Идея сохранена!" : "Idea saved!");
    }
  };

  const handleShare = async (idea: SavedIdea) => {
    const shareData = {
      title: idea.title,
      text: `${idea.title}: ${idea.description}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}`);
        toast.success(language === "ru" ? "Текст скопирован для отправки" : "Text copied to share");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const handleCopy = async (idea: SavedIdea) => {
    try {
      await navigator.clipboard.writeText(`${idea.title}\n${idea.description}`);
      toast.success(language === "ru" ? "Ссылка скопирована!" : "Link copied!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const handleExplore = (idea: SavedIdea) => {
    navigate("/steps", { state: { idea: `${idea.title}: ${idea.description}` } });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
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
        <p className="mb-1 text-sm text-muted-foreground">
          {t("breadcrumbWorkspace")} / {t("generator")}
        </p>

        <h1 className="mb-1 font-display text-2xl font-bold">
          {getGreetingTime()}, {user?.name || "User"}!
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          {t("greetingSubtext")}
        </p>

        <Card className="mb-6 border-muted/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{t("seedIdea")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder={t("inputPlaceholderGenerator")}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              disabled={loading}
              className="bg-muted/30"
            />
            <Button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="w-full gap-2 font-bold shadow-md shadow-primary/20"
              size="lg"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {loading ? t("generating") : t("generate")}
            </Button>
            {loading && status && (
              <p className="animate-pulse text-center text-[13px] font-medium text-purple-600 dark:text-purple-400">
                {status}
              </p>
            )}
          </CardContent>
        </Card>

        {currentIdeas.length === 0 && !loading && (
          <div className="mb-6 rounded-xl bg-gradient-to-r from-orange-50 via-pink-50 to-purple-50 dark:from-orange-950/20 dark:via-pink-950/20 dark:to-purple-950/20 p-5 border border-orange-100/50 dark:border-orange-900/20">
            <p className="mb-1 text-[10px] font-bold tracking-widest text-orange-600 dark:text-orange-400 uppercase">
              {t("museOfWeek")}
            </p>
            <p className="font-display text-lg font-bold text-foreground">{muse}</p>
          </div>
        )}

        {currentIdeas.length > 0 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
              {language === "ru" ? "Сгенерированные идеи" : "Generated Ideas"}
            </h2>
            {currentIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                isSaved={savedIdeas.some((i) => i.id === idea.id)}
                onSave={handleToggleSave}
                onShare={handleShare}
                onCopy={handleCopy}
                onExplore={handleExplore}
              />
            ))}
          </div>
        )}

        {currentIdeas.length === 0 && !loading && (
          <p className="text-center text-sm text-muted-foreground py-10 opacity-60">
            {t("generatorHint")}
          </p>
        )}
      </main>
    </div>
  );
};

export default GeneratorPage;
