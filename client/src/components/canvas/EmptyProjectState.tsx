import { Project } from "@/types/project";
import { Plus } from "lucide-react";

export function EmptyProjectState({
  onCreateProject,
  onCreateFromTemplate
}: {
  onCreateProject: () => void;
  onCreateFromTemplate: (template: string) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-4xl mb-4">📊</div>
      <h2 className="text-lg font-medium text-foreground mb-2">
        Start your first analysis project
      </h2>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        Create a project to organize your AI-powered analysis — competitor research,
        UX audits, landing page reviews, and more.
      </p>
      <button
        onClick={onCreateProject}
        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Create First Project
      </button>

      {/* Template shortcuts */}
      <div className="mt-8">
        <p className="text-xs text-muted-foreground mb-3">or try a template</p>
        <div className="grid grid-cols-2 gap-2 max-w-sm">
          {[
            { icon: "🔍", name: "Competitor Analysis" },
            { icon: "📱", name: "Onboarding Audit" },
            { icon: "🌐", name: "Landing Page Diagnosis" },
            { icon: "📊", name: "Full UX Audit" },
            { icon: "💰", name: "Pricing Research" },
            { icon: "🔄", name: "My Product Check" },
          ].map(t => (
            <button
              key={t.name}
              onClick={() => onCreateFromTemplate(t.name)}
              className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors border border-transparent hover:border-border"
            >
              <span>{t.icon}</span>
              <span>{t.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}