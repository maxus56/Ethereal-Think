import React from "react";
import { PlanStep, PlanSubstep } from "@/contexts/AppStateContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

interface PlanStepCardProps {
  step: PlanStep;
  onToggleSubstep?: (stepNumber: number, substepId: string) => void;
}

const PlanStepCard: React.FC<PlanStepCardProps> = ({ step, onToggleSubstep }) => {
  const { t } = useLanguage();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400";
      case "completed":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400";
      default:
        return "bg-slate-100 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return t("statusActive");
      case "completed":
        return t("statusCompleted");
      default:
        return t("statusUpcoming");
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 mb-6 group">
      <div className="flex items-start gap-4">
        {/* Step number badge */}
        <div className="flex-shrink-0 w-8 h-8 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
          {step.number}
        </div>

        <div className="flex-1 space-y-4">
          {/* Header area */}
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold leading-tight">{step.title}</h3>
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider",
                getStatusColor(step.status)
              )}>
                {getStatusLabel(step.status)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed italic opacity-80">
              {step.description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {step.tags.map((tag, idx) => (
              <span 
                key={idx} 
                className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-md text-[11px] font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Substeps */}
          <div className="space-y-3 pt-2">
            {step.substeps.map((substep) => (
              <button
                key={substep.id}
                onClick={() => onToggleSubstep?.(step.number, substep.id)}
                className="flex items-start gap-3 w-full text-left group/btn p-1 -m-1 rounded-lg hover:bg-muted/50 transition-colors"
                aria-label={`Toggle task ${substep.id}`}
              >
                <div className="flex-shrink-0 w-8 text-xs font-bold text-muted-foreground pt-1.5 leading-none">
                  {substep.id}
                </div>
                
                <div className="flex-shrink-0 pt-0.5">
                  {substep.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-50" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-slate-300 group-hover/btn:border-purple-400 transition-colors" />
                  )}
                </div>

                <span className={cn(
                  "text-[14px] leading-relaxed transition-all",
                  substep.completed ? "text-muted-foreground line-through opacity-60" : "text-foreground"
                )}>
                  {substep.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanStepCard;
