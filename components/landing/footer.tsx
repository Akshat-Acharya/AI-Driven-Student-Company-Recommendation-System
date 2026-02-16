import { Bot } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent">
            <Bot className="h-3 w-3 text-primary-foreground" />
          </div>
          <span className="font-heading text-sm font-semibold">RecruitAI</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Built with AI. Designed for humans.
        </p>
      </div>
    </footer>
  );
}
