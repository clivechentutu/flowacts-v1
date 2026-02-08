# AI Chat Two-Zone Collapsible Layout — Replit Instruction (v6)

> **This replaces Doc 26-v5.** Refined the "Two-Zone" concept with **Result Penetration** logic. The goal is to keep the chat clean while ensuring critical insights are never hidden inside collapsed sections.

---

## Problem with v5 (Previous Iteration)

While v5 introduced the collapsible card concept, it had a critical flaw: **Over-collapsing**. When a step collapsed, its key findings (Insights) were hidden, forcing the user to expand it again to see "what was found."

## Solution: Two-Zone Layout with Result Penetration

We maintain the **Two-Zone** structure but enhance the `ExecutionCard` to allow high-value content (Insights) to "penetrate" the collapsed state.

| Zone | Component | Behavior |
|------|-----------|----------|
| **Zone 1** | **IntentPlanCard** | **Static Anchor**. Shows intent + plan. Never collapses, never grows. |
| **Zone 2** | **ExecutionCard** | **Dynamic Accordion**. Active step expanded. Done steps collapsed BUT **retain key insights visible**. |

---

## Data Model Updates

We need to explicitly track `intentSummary` and ensure `TaskPlanStep` can hold a summary result.

```ts
interface TaskPlanStep {
  id: string;
  label: string;
  status: "done" | "active" | "pending";
  agentRole: "scout" | "capturer" | "analyst" | "comparator" | "reporter";
  // NEW: A short summary of the result, e.g., "Found 3 pricing tiers"
  resultSummary?: string; 
}

interface ChatMessage {
  // ... existing fields
  intentSummary?: string; // For Zone 1 header
  taskPlanStepId?: string; // Links message to a specific step
  isInsight?: boolean; // NEW: Marks message as high-value (should penetrate collapse)
}
```

---

## Component 1: IntentPlanCard (Zone 1)

This card anchors the conversation. It confirms understanding and shows the roadmap.

**Design Specs:**
- **Container**: `rounded-xl border border-border/15 bg-muted/5`
- **Header**: Shows `intentSummary` (e.g., "I'll analyze the signup flow for competitor.com.")
- **Body**: Compact list of steps.
  - **Done**: `text-muted-foreground/40 line-through`
  - **Active**: `text-blue-400 font-medium`
  - **Pending**: `text-muted-foreground/25`
- **Footer**: Minimal progress bar.

```jsx
function IntentPlanCard({ intentSummary, steps }) {
  // ... implementation similar to v5, ensuring compact layout
}
```

---

## Component 2: ExecutionCard (Zone 2 — The Core)

This is where the magic happens. It manages the accordion logic and result penetration.

**Behavior Rules:**
1. **Active Step**: Always **EXPANDED**. Shows full L3 logs (streaming).
2. **Done Step**: Generally **COLLAPSED**, BUT...
   - If the step produced an **Insight** (L1), show a **Summary Snippet** in the collapsed header or immediately below it.
   - If no Insight, just show the checkmark and label.

**Visual Structure of a Step (Collapsed vs Expanded):**

```jsx
// Pseudo-code for a Step Item
<div className="border-b border-border/5 last:border-0">
  
  {/* Header: Always visible. Click to toggle. */}
  <button onClick={toggle} className="flex items-center w-full py-2 px-3 hover:bg-muted/5">
    <StatusIcon status={step.status} />
    <span className="font-medium text-sm ml-2">{step.label}</span>
    
    {/* RESULT PENETRATION: Show summary if collapsed */}
    {!isExpanded && step.resultSummary && (
      <span className="ml-auto text-xs text-muted-foreground truncate max-w-[200px]">
        {step.resultSummary}
      </span>
    )}
  </button>

  {/* Body: Visible only if expanded */}
  {isExpanded && (
    <div className="px-3 pb-3 pl-8 space-y-1">
      {/* Stream of L3 logs */}
      {logs.map(log => <LogLine key={log.id} content={log.content} />)}
      
      {/* Insights are highlighted here too */}
      {insights.map(insight => <InsightCard key={insight.id} content={insight.content} />)}
    </div>
  )}

  {/* PENETRATION ZONE: Visible if collapsed BUT has insights */}
  {!isExpanded && hasInsights && (
    <div className="px-3 pb-2 pl-8">
      {/* Render a compact version of the insight */}
      <div className="text-xs text-foreground/80 bg-muted/10 p-1.5 rounded border-l-2 border-blue-400/50">
        💡 {insights[0].content} {/* Show first/key insight */}
      </div>
    </div>
  )}
</div>
```

### Key Visual Details

1. **Agent Identity**:
   - Use **Color Coding** in the step header (e.g., Blue for Scout, Orange for Analyst).
   - Icon + Label should be colored when active, muted when done.

2. **Streaming Animation**:
   - For the **Active Step**, add a subtle pulse or spinner to indicate "working".
   - `animate-pulse` on the status dot is sufficient.

3. **Insight Styling**:
   - Insights inside the expanded view should look like **Cards** (as in v4).
   - Insights in the "Penetration Zone" (collapsed view) should be **Compact** — single line or short block, distinct from logs.

---

## Component 3: ResultHighlight (Optional / Post-Execution)

Once the entire task is done, we might want to show a "Final Deliverable" card outside the `ExecutionCard`.

- **Trigger**: When `status === 'done'` for the whole task.
- **Content**: A summary report or a link to the generated artifact (Canvas).
- **Style**: High emphasis, distinct from the gray/muted execution logs.

---

## Implementation Checklist

1. [ ] **Update Data Model**: Add `resultSummary` to `TaskPlanStep`.
2. [ ] **Refactor Chat Interface**: Split the monolithic message list into `IntentPlanCard` + `ExecutionCard`.
3. [ ] **Implement Accordion Logic**:
   - Auto-expand active step.
   - Auto-collapse previous step.
   - Allow manual toggle.
4. [ ] **Implement Result Penetration**:
   - Logic to extract "Key Insight" from a completed step.
   - Render compact insight view in collapsed state.
5. [ ] **Polish Visuals**:
   - Ensure transitions are smooth (height animation).
   - Check color contrast for Agent identities.

---

## Example Scenario

**User**: "Analyze competitor.com pricing."

**UI State 1 (Planning)**:
- `IntentPlanCard` appears: "I'll analyze pricing..." + 3 steps.
- `ExecutionCard` appears: Step 1 (Active) expanded, logs streaming.

**UI State 2 (Step 1 Done, Step 2 Active)**:
- Step 1 collapses.
- **Penetration**: Step 1 shows "Found 3 tiers: Free, Pro, Enterprise" in its collapsed footer.
- Step 2 expands, logs streaming.

**UI State 3 (Done)**:
- All steps collapsed.
- `ResultHighlight` appears: "Analysis Complete. View Report."
