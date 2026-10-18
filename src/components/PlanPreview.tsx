import { useId, useMemo, useState } from "react";

export type StepEffect = "read" | "write" | "external";

export interface PlanStep {
  id: string;
  /** What the agent will do, in the user's words. */
  title: string;
  /** One line on what it touches or why. */
  detail?: string;
  /** read: only looks. write: changes your data. external: reaches people or systems outside the app. */
  effect: StepEffect;
  /** Whether the step can be undone after it runs. */
  reversible: boolean;
  /** Optional steps can be switched off before running. Required steps can't. */
  optional?: boolean;
}

export interface PlanPreviewProps {
  title: string;
  summary?: string;
  steps: PlanStep[];
  /** Called with the ids of the steps the user kept. */
  onRun?: (stepIds: string[]) => void;
  onCancel?: () => void;
  /** Which agent or feature is asking. Shown above the title. */
  agentName?: string;
}

const EFFECT_LABEL: Record<StepEffect, string> = {
  read: "Reads only",
  write: "Changes your data",
  external: "Reaches outside the app",
};

/**
 * "Here's what I'm about to do." Shows the full plan before anything runs,
 * lets people switch off optional steps, and says up front what can't be undone.
 */
export function PlanPreview({ title, summary, steps, onRun, onCancel, agentName = "Assistant" }: PlanPreviewProps) {
  const [excluded, setExcluded] = useState<Set<string>>(() => new Set());
  const headingId = useId();

  const kept = useMemo(() => steps.filter((s) => !excluded.has(s.id)), [steps, excluded]);
  const permanent = kept.filter((s) => !s.reversible).length;

  function toggle(id: string) {
    setExcluded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <section className="aui-card" aria-labelledby={headingId}>
      <div className="aui-head">
        <p className="aui-eyebrow"><span className="aui-dot aui-dot--accent" />{agentName} has a plan</p>
        <h2 className="aui-title" id={headingId}>{title}</h2>
        {summary && <p className="aui-summary">{summary}</p>}
      </div>

      <ol className="aui-plan">
        {steps.map((step, i) => {
          const included = !excluded.has(step.id);
          return (
            <li key={step.id} className="aui-plan-step" data-included={included}>
              <span className="aui-num" aria-hidden="true">{i + 1}</span>
              <div className="aui-plan-body">
                <p className="aui-plan-title">{step.title}</p>
                {step.detail && <p className="aui-plan-detail">{step.detail}</p>}
                <div className="aui-plan-meta">
                  <span className={`aui-tag${step.effect === "external" ? " aui-tag--caution" : ""}`}>{EFFECT_LABEL[step.effect]}</span>
                  {!step.reversible && <span className="aui-tag aui-tag--reject">Can't be undone</span>}
                  {step.optional && (
                    <label className="aui-toggle">
                      <input type="checkbox" checked={included} onChange={() => toggle(step.id)} />
                      {included ? "Included" : "Skipped"}
                    </label>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="aui-foot">
        <span aria-live="polite">
          {kept.length} of {steps.length} steps
          {permanent > 0 && `, ${permanent} can't be undone`}
        </span>
        <div className="aui-actions">
          <button type="button" className="aui-btn aui-btn--quiet" onClick={onCancel}>Cancel</button>
          <button type="button" className="aui-btn aui-btn--primary" disabled={kept.length === 0} onClick={() => onRun?.(kept.map((s) => s.id))}>
            Run {kept.length} {kept.length === 1 ? "step" : "steps"}
          </button>
        </div>
      </div>
    </section>
  );
}
