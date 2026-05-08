import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Link, Bookmark, ChevronRight, type LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { type SavedIdea } from "@/contexts/AppStateContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

interface IdeaCardProps {
  idea: SavedIdea;
  isSaved?: boolean;
  onSave?: (idea: SavedIdea) => void;
  onShare?: (idea: SavedIdea) => void;
  onCopy?: (idea: SavedIdea) => void;
  onExplore?: (idea: SavedIdea) => void;
  className?: string;
}

const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  isSaved,
  onSave,
  onShare,
  onCopy,
  onExplore,
  className,
}) => {
  const { t } = useLanguage();
  
  // Resolve icon dynamically
  const IconComponent = (Icons as any)[idea.icon] || Icons.Lightbulb;

  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-lg border-muted/40 bg-card/50 backdrop-blur-sm", className)}>
      <CardContent className="p-5 flex flex-col gap-4">
        {/* Header: Icon + Category + Tag */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <IconComponent className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 leading-none">
              {idea.category} • {idea.tag}
            </p>
          </div>
        </div>

        {/* Title and Action Buttons */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-display text-lg font-bold leading-tight text-foreground">
              {idea.title}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                onClick={() => onShare?.(idea)}
                title={t("share" as any) || "Share"}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                onClick={() => onCopy?.(idea)}
                title={t("copyLink" as any) || "Copy Link"}
              >
                <Link className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 transition-colors",
                  isSaved 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                )}
                onClick={() => onSave?.(idea)}
                title={t("saveIdea")}
              >
                <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
              </Button>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {idea.description}
        </p>

        {/* Explore Button */}
        <Button
          variant="link"
          className="p-0 h-auto self-start text-foreground font-bold hover:no-underline group"
          onClick={() => onExplore?.(idea)}
        >
          {t("exploreConcept" as any) || "Explore concept"}
          <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default IdeaCard;
