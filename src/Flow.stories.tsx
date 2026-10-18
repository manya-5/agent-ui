import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useRef, useState } from "react";
import { PlanPreview } from "./components/PlanPreview";
import { ApprovalStep } from "./components/ApprovalStep";
import { TaskProgress, type TaskStep } from "./components/TaskProgress";
import { followUpPlan } from "./fixtures";

/**
 * The three components together: preview the plan, approve the one step
 * that can't be undone, then watch it run. Everything here is simulated.
 */
function AgentFlow() {
  const [stage, setStage] = useState<"plan" | "approve" | "run" | "cancelled">("plan");
  const [steps, setSteps] = useState<TaskStep[]>([]);
  const timer = useRef<number>();

  const durations: Record<string, number> = { read: 1400, draft: 2600, tasks: 1500, send: 1100 };

  function start(ids: string[]) {
    const kept = followUpPlan.filter((s) => ids.includes(s.id));
    setSteps(followUpPlan.map((s) => ({ id: s.id, title: s.title, status: kept.includes(s) ? "pending" : "skipped" })));
    setStage(ids.includes("send") ? "approve" : "run");
  }

  function reset() {
    window.clearTimeout(timer.current);
    setStage("plan");
    setSteps([]);
  }

  // Advance one step at a time while running.
  useEffect(() => {
    if (stage !== "run") return;
    const current = steps.find((s) => s.status === "running");
    const next = steps.find((s) => s.status === "pending");
    if (!current && next) {
      setSteps((prev) => prev.map((s) => (s.id === next.id ? { ...s, status: "running" } : s)));
      return;
    }
    if (current) {
      const ms = durations[current.id] ?? 1200;
      timer.current = window.setTimeout(() => {
        setSteps((prev) => prev.map((s) => (s.id === current.id ? { ...s, status: "done", durationMs: ms } : s)));
      }, ms);
      return () => window.clearTimeout(timer.current);
    }
  }, [stage, steps]);

  const done = (id: string) => steps.find((s) => s.id === id)?.status === "done";
  const changes = [
    done("draft") ? "Drafted 3 follow-ups" : null,
    done("tasks") ? "added 5 cards to the board" : null,
    done("send") ? "sent the emails" : null,
  ].filter(Boolean);

  return (
    <div style={{ display: "grid", gap: 16, justifyItems: "center" }}>
      {stage === "plan" && (
        <PlanPreview
          title="Follow up on this week's design reviews"
          summary="I'll read the notes, draft a follow-up for each person, and add the action items to your board. Switch off anything you'd rather do yourself."
          steps={followUpPlan}
          onRun={start}
          onCancel={() => setStage("cancelled")}
        />
      )}
      {stage === "approve" && (
        <ApprovalStep
          action="Send 3 follow-up emails"
          description="This is the only step that reaches other people. Everything else stays in your account."
          details={[
            { label: "To", value: "Priya, Sam, Jordan" },
            { label: "From", value: "Your work account" },
          ]}
          risk="medium"
          reversible={false}
          onApprove={() => setTimeout(() => setStage("run"), 500)}
          onReject={() => {
            setSteps((prev) => prev.map((s) => (s.id === "send" ? { ...s, status: "skipped" } : s)));
            setTimeout(() => setStage("run"), 500);
          }}
        />
      )}
      {stage === "run" && (
        <TaskProgress
          title="Follow up on this week's design reviews"
          steps={steps}
          onStop={() => {
            window.clearTimeout(timer.current);
            setSteps((prev) => prev.map((s) => (s.status === "pending" || s.status === "running" ? { ...s, status: "skipped" } : s)));
          }}
          report={{
            changed: changes.length ? changes.join(", ") + "." : "Nothing.",
            unchanged: done("send") ? undefined : "Nothing was sent.",
            undo: done("send") ? "Sent emails can't be unsent." : done("draft") ? "The drafts are in your Drafts folder. Delete them any time." : undefined,
          }}
        />
      )}
      {stage === "cancelled" && <p style={{ fontSize: 14 }}>Cancelled. Nothing was changed.</p>}
      {stage !== "plan" && (
        <button type="button" className="aui-btn aui-btn--quiet" onClick={reset}>Start over</button>
      )}
    </div>
  );
}

const meta: Meta = {
  title: "Flow",
  parameters: { layout: "centered" },
};
export default meta;

export const PlanApproveRun: StoryObj = {
  name: "Plan, approve, run",
  render: () => <AgentFlow />,
};

export const AllThree: StoryObj = {
  name: "All three",
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start", justifyContent: "center", padding: 24 }}>
      <PlanPreview title="Follow up on this week's design reviews" steps={followUpPlan} />
      <div style={{ display: "grid", gap: 24 }}>
        <ApprovalStep
          action="Send 3 follow-up emails"
          details={[
            { label: "To", value: "Priya, Sam, Jordan" },
            { label: "From", value: "Your work account" },
          ]}
          reversible={false}
        />
        <TaskProgress
          title="Follow up on this week's design reviews"
          steps={[
            { id: "read", title: "Read this week's meeting notes", status: "done", durationMs: 2100 },
            { id: "draft", title: "Draft a follow-up for each attendee", status: "running", durationMs: 4300 },
            { id: "tasks", title: "Add action items to the team board", status: "pending" },
          ]}
          onStop={() => {}}
        />
      </div>
    </div>
  ),
};
