import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  HelpCircle,
  MessageSquare,
  Settings,
  User,
  BarChart3,
  Search,
  ArrowUpRight,
  Mail,
  Copy,
  Check,
} from "lucide-react";

type SettingsSection =
  | "account"
  | "settings"
  | "usage"
  | "billing"
  | "feedback"
  | "get-help";

const SECTIONS: Array<{
  id: SettingsSection;
  label: string;
  icon: React.ElementType;
}> = [
  { id: "account", label: "Account", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "usage", label: "Usage", icon: BarChart3 },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
  { id: "get-help", label: "Get help", icon: HelpCircle },
];

function FieldRow({
  title,
  description,
  right,
  testId,
}: {
  title: string;
  description?: string;
  right: React.ReactNode;
  testId: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 rounded-xl border p-4 shadow-sm",
        "border-border/80 bg-background/70",
        "dark:border-border/70 dark:bg-card/60"
      )}
      data-testid={testId}
    >
      <div className="min-w-0">
        <div className="text-sm font-semibold text-foreground truncate">{title}</div>
        {description ? (
          <div className="mt-1 text-xs text-muted-foreground/90 leading-relaxed">
            {description}
          </div>
        ) : null}
      </div>
      <div className="shrink-0">{right}</div>
    </div>
  );
}

export function SettingsModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [active, setActive] = useState<SettingsSection>("settings");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return SECTIONS;
    return SECTIONS.filter((s) => s.label.toLowerCase().includes(q));
  }, [search]);

  const headerLabel = useMemo(() => {
    return SECTIONS.find((s) => s.id === active)?.label ?? "Settings";
  }, [active]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "p-0 overflow-hidden max-w-[980px] w-[calc(100vw-2rem)]",
          "rounded-3xl border border-border/80",
          "bg-[linear-gradient(180deg,rgba(255,252,248,0.96),rgba(250,244,236,0.94))]",
          "dark:bg-[linear-gradient(180deg,rgba(18,18,21,0.84),rgba(26,26,30,0.84))]",
          "backdrop-blur-xl shadow-2xl"
        )}
        data-testid="modal-settings"
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/80 bg-[rgba(250,244,236,0.72)] dark:bg-card/50">
          <DialogTitle className="text-base font-semibold tracking-tight text-foreground">
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
          {/* Left */}
          <div className="border-r border-border/80 bg-[rgba(250,244,236,0.60)] dark:bg-card/40">
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-muted-foreground/80" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  className={cn(
                    "pl-9 bg-background/70 border-border/70",
                    "placeholder:text-muted-foreground/70",
                    "focus:bg-background",
                    "dark:bg-background/10 dark:border-border/70 dark:text-foreground",
                    "dark:placeholder:text-muted-foreground/60"
                  )}
                  data-testid="input-settings-search"
                />
              </div>
            </div>

            <div className="px-2 pb-4">
              <div className="flex flex-col gap-1">
                {filtered.map((s) => {
                  const Icon = s.icon;
                  const isActive = active === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActive(s.id)}
                      className={cn(
                        "group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                        isActive
                          ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                          : "text-muted-foreground/90 hover:text-foreground hover:bg-muted/40 dark:hover:bg-muted/20"
                      )}
                      data-testid={`button-settings-section-${s.id}`}
                    >
                      <div
                        className={cn(
                          "h-9 w-9 rounded-xl flex items-center justify-center border shadow-sm",
                          isActive
                            ? "bg-primary/10 border-primary/25"
                            : "bg-background/70 border-border/70 dark:bg-background/10 dark:border-border/70"
                        )}
                      >
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div className="flex-1 text-left font-medium">{s.label}</div>
                      <ArrowUpRight
                        className={cn(
                          "w-4 h-4 opacity-0 transition-all",
                          isActive ? "opacity-70" : "group-hover:opacity-40"
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="bg-[rgba(255,252,248,0.64)] dark:bg-card/30">
            <div className="px-6 py-5 border-b border-border/80 bg-[rgba(255,252,248,0.40)]">
              <div className="text-sm text-muted-foreground/90">{headerLabel}</div>
              <div
                className="mt-1 text-lg font-semibold tracking-tight text-foreground"
                data-testid="text-settings-section-title"
              >
                {headerLabel}
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {active === "account" && (
                <div className="space-y-4" data-testid="panel-settings-account">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <FieldRow
                      title="Name"
                      description="Used across your workspace and shared projects."
                      right={
                        <Input
                          defaultValue="Felix"
                          className={cn(
                            "w-56",
                            "bg-background/70 border-border/70",
                            "dark:bg-background/10 dark:text-foreground dark:border-border/70"
                          )}
                          data-testid="input-account-name"
                        />
                      }
                      testId="row-account-name"
                    />
                    <FieldRow
                      title="Email"
                      description="For notifications and billing receipts."
                      right={
                        <Input
                          defaultValue="felix@company.com"
                          className={cn(
                            "w-56",
                            "bg-background/70 border-border/70",
                            "dark:bg-background/10 dark:text-foreground dark:border-border/70"
                          )}
                          data-testid="input-account-email"
                        />
                      }
                      testId="row-account-email"
                    />
                  </div>

                  <FieldRow
                    title="Workspace ID"
                    description="Share with support when troubleshooting."
                    right={
                      <Button
                        variant="secondary"
                        className={cn(
                          "gap-2",
                          "border-border/70",
                          "dark:bg-background/10 dark:text-foreground dark:border-border/70"
                        )}
                        onClick={() => {
                          navigator.clipboard.writeText("WKSP-84F2-11C");
                          setCopied(true);
                          setTimeout(() => setCopied(false), 1200);
                        }}
                        data-testid="button-account-copy-workspace-id"
                      >
                        {copied ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        WKSP-84F2-11C
                      </Button>
                    }
                    testId="row-account-workspace"
                  />

                  <div className="rounded-2xl border border-border/80 bg-muted/20 dark:bg-muted/10 p-4">
                    <div className="text-sm font-semibold text-foreground">Security</div>
                    <div className="mt-1 text-xs text-muted-foreground/90">
                      Password and sign-in options are mocked for prototype.
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        className={cn(
                          "border-border/70",
                          "dark:bg-background/10 dark:text-foreground dark:border-border/70"
                        )}
                        data-testid="button-account-change-password"
                      >
                        Change password
                      </Button>
                      <Button
                        variant="secondary"
                        className={cn(
                          "border-border/70",
                          "dark:bg-background/10 dark:text-foreground dark:border-border/70"
                        )}
                        data-testid="button-account-signout-all"
                      >
                        Sign out all devices
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {active === "settings" && (
                <div className="space-y-4" data-testid="panel-settings-settings">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <FieldRow
                      title="Language"
                      description="Display language for the app UI."
                      right={
                        <Button
                          variant="secondary"
                          className={cn(
                            "w-56 justify-between",
                            "border-border/70",
                            "dark:bg-background/10 dark:text-foreground dark:border-border/70"
                          )}
                          data-testid="button-settings-language"
                        >
                          English
                          <span className="text-muted-foreground/80">▾</span>
                        </Button>
                      }
                      testId="row-settings-language"
                    />
                    <FieldRow
                      title="Theme"
                      description="Follow your current Light/Dark preference."
                      right={
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: "light", label: "Light" },
                            { id: "dark", label: "Dark" },
                            { id: "system", label: "System" },
                          ].map((t) => (
                            <button
                              key={t.id}
                              className={cn(
                                "rounded-xl border p-2 text-xs font-medium transition-all",
                                "border-border/70 bg-background/70",
                                "hover:bg-muted/30",
                                "dark:bg-background/10 dark:border-border/70",
                                t.id === "system" && "ring-1 ring-primary/25"
                              )}
                              data-testid={`button-settings-theme-${t.id}`}
                            >
                              <div className="h-10 rounded-lg bg-muted/30 shadow-inner dark:bg-muted/20" />
                              <div className="mt-2 text-muted-foreground/90">{t.label}</div>
                            </button>
                          ))}
                        </div>
                      }
                      testId="row-settings-theme"
                    />
                  </div>

                  <div className="rounded-2xl border border-border/70 bg-background/60 dark:bg-card/50 p-4">
                    <div className="text-sm font-semibold text-foreground">Communication</div>
                    <div className="mt-4 space-y-3">
                      <FieldRow
                        title="Receive exclusive content"
                        description="Get feature updates, example projects, and guides."
                        right={
                          <Switch
                            defaultChecked
                            data-testid="switch-settings-exclusive"
                          />
                        }
                        testId="row-settings-exclusive"
                      />
                      <FieldRow
                        title="Email when queued task starts"
                        description="A reminder when processing begins."
                        right={
                          <Switch data-testid="switch-settings-queue" />
                        }
                        testId="row-settings-queue"
                      />
                    </div>
                  </div>

                  <FieldRow
                    title="Manage cookies"
                    description="Control analytics and performance cookies."
                    right={
                      <Button
                        variant="secondary"
                        className={cn(
                          "border-border/70",
                          "dark:bg-background/10 dark:text-foreground dark:border-border/70"
                        )}
                        data-testid="button-settings-cookies"
                      >
                        Manage
                      </Button>
                    }
                    testId="row-settings-cookies"
                  />
                </div>
              )}

              {active === "usage" && (
                <div className="space-y-4" data-testid="panel-settings-usage">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {[
                      { k: "Runs", v: "128", sub: "Last 30 days" },
                      { k: "Tokens", v: "1.2M", sub: "Estimated" },
                      { k: "Storage", v: "2.4 GB", sub: "Files + exports" },
                    ].map((m) => (
                      <div
                        key={m.k}
                        className="rounded-2xl border border-border/70 bg-background/60 dark:bg-card/50 p-4 shadow-sm"
                        data-testid={`card-usage-${m.k.toLowerCase()}`}
                      >
                        <div className="text-xs text-muted-foreground/90">{m.k}</div>
                        <div className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                          {m.v}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground/90">
                          {m.sub}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-border/80 bg-muted/20 dark:bg-muted/10 p-4">
                    <div className="text-sm font-semibold text-foreground">Usage tips</div>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground/90">
                      <li className="flex items-start gap-2" data-testid="text-usage-tip-1">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/60" />
                        Pin frequent prompts to your Library for faster workflows.
                      </li>
                      <li className="flex items-start gap-2" data-testid="text-usage-tip-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/60" />
                        Use @ mentions in chat to insert standard templates.
                      </li>
                      <li className="flex items-start gap-2" data-testid="text-usage-tip-3">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/60" />
                        Export results from Files for sharing.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {active === "billing" && (
                <div className="space-y-4" data-testid="panel-settings-billing">
                  <div className="rounded-2xl border border-border/70 bg-background/60 dark:bg-card/50 p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-foreground">Current plan</div>
                        <div className="mt-1 text-xs text-muted-foreground/90">
                          Prototype plan · Renews monthly
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        className={cn(
                          "border-border/70",
                          "dark:bg-background/10 dark:text-foreground dark:border-border/70"
                        )}
                        data-testid="button-billing-manage"
                      >
                        Manage plan
                      </Button>
                    </div>
                    <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
                      {[
                        { k: "Next invoice", v: "$29" },
                        { k: "Renews", v: "Feb 12" },
                        { k: "Payment", v: "Visa •• 4242" },
                      ].map((x) => (
                        <div
                          key={x.k}
                          className="rounded-xl border border-border/70 bg-muted/20 dark:bg-muted/10 p-3"
                          data-testid={`card-billing-${x.k.replaceAll(" ", "-").toLowerCase()}`}
                        >
                          <div className="text-[10px] text-muted-foreground/80 uppercase tracking-wider">
                            {x.k}
                          </div>
                          <div className="mt-1 text-sm font-semibold text-foreground">{x.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <FieldRow
                    title="Billing emails"
                    description="Receipts and invoices will be sent here."
                    right={
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground/80" />
                        <span className="text-sm text-foreground" data-testid="text-billing-email">
                          felix@company.com
                        </span>
                      </div>
                    }
                    testId="row-billing-email"
                  />
                </div>
              )}

              {active === "feedback" && (
                <div className="space-y-4" data-testid="panel-settings-feedback">
                  <div className="rounded-2xl border border-border/70 bg-background/60 dark:bg-card/50 p-4 shadow-sm">
                    <div className="text-sm font-semibold text-foreground">Send feedback</div>
                    <div className="mt-1 text-xs text-muted-foreground/90">
                      Tell us what to improve. We\"ll keep it lightweight for now.
                    </div>
                    <div className="mt-4 space-y-3">
                      <Input
                        placeholder="Subject"
                        className={cn(
                          "bg-background/70 border-border/70",
                          "placeholder:text-muted-foreground/70",
                          "dark:bg-background/10 dark:text-foreground dark:border-border/70",
                          "dark:placeholder:text-muted-foreground/60"
                        )}
                        data-testid="input-feedback-subject"
                      />
                      <textarea
                        className={cn(
                          "w-full min-h-[120px] rounded-xl border p-3 text-sm outline-none",
                          "border-border/70 bg-background/70",
                          "placeholder:text-muted-foreground/70",
                          "focus:ring-2 focus:ring-primary/20",
                          "dark:border-border/70 dark:bg-background/10 dark:text-foreground",
                          "dark:placeholder:text-muted-foreground/60"
                        )}
                        placeholder="Your message"
                        data-testid="input-feedback-message"
                      />
                      <div className="flex justify-end">
                        <Button data-testid="button-feedback-send">Send</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {active === "get-help" && (
                <div className="space-y-4" data-testid="panel-settings-help">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {[{
                      title: "Help center",
                      desc: "Browse guides and troubleshooting steps.",
                      action: "Open",
                    }, {
                      title: "Contact support",
                      desc: "Email us and include your workspace ID.",
                      action: "Email",
                    }].map((c) => (
                      <div
                        key={c.title}
                        className="rounded-2xl border border-border/70 bg-background/60 dark:bg-card/50 p-4 shadow-sm"
                        data-testid={`card-help-${c.title.replaceAll(" ", "-").toLowerCase()}`}
                      >
                        <div className="text-sm font-semibold text-foreground">{c.title}</div>
                        <div className="mt-1 text-xs text-muted-foreground/90">
                          {c.desc}
                        </div>
                        <div className="mt-4">
                          <Button
                            variant="secondary"
                            className={cn(
                              "border-border/70",
                              "dark:bg-background/10 dark:text-foreground dark:border-border/70"
                            )}
                            data-testid={`button-help-${c.action.toLowerCase()}`}
                          >
                            {c.action}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
