import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAppState, type StructuredPlan } from "@/contexts/AppStateContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import PlanStepCard from "@/components/PlanStepCard";
import { generatePlan } from "@/lib/ai";
import { Route, Bookmark, Lightbulb, Sparkles } from "lucide-react";
import { toast } from "sonner";

const StepsPage = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const { savePlan, incrementPlans } = useAppState();
  const [idea, setIdea] = useState("");
  const [plan, setPlan] = useState<StructuredPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const stateIdea = (location.state as any)?.idea;
    if (stateIdea) {
      setIdea(stateIdea);
    }
  }, [location.state]);

  const handleCreatePlan = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    setPlan(null);
    setStatus("");
    try {
      const result = await generatePlan(idea, language, (msg) => setStatus(msg));
      setPlan(result);
      incrementPlans();
    } catch (err: any) {
      toast.error(err.message || "Failed to create plan");
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  const handleToggleSubstep = (stepNumber: number, substepId: string) => {
    if (!plan) return;
    
    const newSteps = plan.steps.map(step => {
      if (step.number === stepNumber) {
        const newSubsteps = step.substeps.map(ss => {
          if (ss.id === substepId) {
            return { ...ss, completed: !ss.completed };
          }
          return ss;
        });
        
        // If all substeps are completed, mark phase as completed
        // If some are done, mark as active
        const allDone = newSubsteps.every(ss => ss.completed);
        const anyDone = newSubsteps.some(ss => ss.completed);
        
        return { 
          ...step, 
          substeps: newSubsteps,
          status: allDone ? "completed" : (anyDone ? "active" : step.status)
        };
      }
      return step;
    });

    setPlan({ ...plan, steps: newSteps as any });
  };

  const handleSavePlan = () => {
    if (!plan) return;
    savePlan({
      id: crypto.randomUUID(),
      idea,
      plan,
      savedAt: new Date().toISOString(),
    });
    toast.success(language === "ru" ? "План сохранён!" : "Plan saved!");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 shadow-md shadow-purple-200 dark:shadow-none">
              <Lightbulb className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">{t("appTitle")}</span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        {/* Input area */}
        <div className="mb-10 text-center space-y-2">
          <h2 className="text-3xl font-display font-bold tracking-tight">Nexus Core</h2>
          <p className="text-muted-foreground">{t("strategyTitle")}</p>
        </div>

        <Card className="mb-12 border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden">
          <CardContent className="p-0">
            <textarea
              className="flex min-h-[120px] w-full border-none bg-transparent px-6 py-4 text-base focus-visible:outline-none placeholder:text-muted-foreground/60 resize-none"
              placeholder={t("inputPlaceholderSteps")}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              disabled={loading}
            />
            <div className="px-6 pb-6 pt-2">
              <Button
                onClick={handleCreatePlan}
                disabled={loading || !idea.trim()}
                className="w-full gap-2 h-12 text-base font-bold rounded-xl shadow-lg shadow-primary/25"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                ) : (
                  <Sparkles className="h-5 w-5" />
                )}
                {loading ? t("generating") : t("createPlan")}
              </Button>
              {loading && status && (
                <p className="mt-4 animate-pulse text-center text-[13px] font-medium text-purple-600 dark:text-purple-400">
                  {status}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Generated plan output */}
        {plan && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-end justify-between mb-2 px-1">
              <h2 className="text-2xl font-display font-bold max-w-[70%]">
                {plan.projectTitle}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSavePlan}
                className="gap-2 rounded-lg border-border/50 hover:bg-white dark:hover:bg-slate-800"
              >
                <Bookmark className="h-4 w-4" />
                {t("savePlan")}
              </Button>
            </div>

            <div className="space-y-4">
              {plan.steps.map((step) => (
                <PlanStepCard 
                  key={step.number} 
                  step={step} 
                  onToggleSubstep={handleToggleSubstep}
                />
              ))}
            </div>
          </div>
        )}

        {/* Hint */}
        {!plan && !loading && (
          <div className="text-center py-20 opacity-40">
            <Route className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p className="text-sm font-medium">{t("stepsHint")}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default StepsPage;
