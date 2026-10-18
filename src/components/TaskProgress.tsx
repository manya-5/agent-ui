import { useId } from "react";

export type TaskStatus = "pending" | "running" | "done" | "failed" | "skipped";

export interface TaskStep {
  id: string;
  title: string;
  status: TaskStatus;
  /** How long the step took, or has taken so far, in milliseconds. */
  durationMs?: number;
  /** Lines the agent logged while working. Shown on demand, never by default. */
  log?: string[];
  /** For failed steps: what went wrong, in plain words. */
  error?: string;
}

export interface TaskProgressProps {
  title: string;
  steps: TaskStep[];
  /** Shown once every step has finished or been skipped. */
  report?: { changed: string; unchanged?: string; undo?: string };
  onStop?: () => void;
  onRetry?: (stepId: string) => void;
  onSkip?: (stepId: string) => void;
  onUndo?: () => void;
}

function formatTime(ms?: number) {
  if (ms == null) return "";
  if (ms < 1000) return `${ms}ms`;
  const s = ms / 1000;
  return s < 60 ? `${s.toFixed(1)}s` : `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;
}

/**
 * Progress for a long-running agent task. Names the step that's running,
 * only fills the bar when a real step finishes, keeps Stop in reach,
 * and ends with a plain report of what changed.
 */
export function TaskProgress({ title, steps, report, onStop, onRetry, onSkip, onUndo }: TaskProgressProps) {
  const headingId = useId();
  const finished = steps.filter((s) => s.status === "done" || s.status === "skipped").length;
  const running = steps.find((s) => s.status === "running");
  const failed = steps.find((s) => s.status === "failed");
  const complete = finished === steps.length;
  const elapsed = steps.reduce((sum, s) => sum + (s.durationMs ?? 0), 0);
  const barState = failed ? "failed" : complete ? "done" : "running";
  const pct = steps.length ? (finished / steps.length) * 100 : 0;

  const status = failed
    ? `Stopped at step ${steps.indexOf(failed) + 1}: ${failed.title}`
    : running
      ? `Step ${steps.indexOf(running) + 1} of ${steps.length}: ${running.title}`
      : complete
        ? `Finished in ${formatTime(elapsed)}`
        : `Waiting to start`;

  return (
    <section className="aui-card" aria-labelledby={headingId}>
      <div className="aui-head" style={{ paddingBottom: 0 }}>
        <p className="aui-eyebrow">
          <span className={`aui-dot ${failed ? "aui-dot--reject" : complete ? "aui-dot--approve" : "aui-dot--accent"}`} />
          <span aria-live="polite">{status}</span>
        </p>
        <h2 className="aui-title" id={headingId}>{title}</h2>
      </div>

      <div className="aui-bar" data-state={barState} role="progressbar" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={finished} aria-label={`${finished} of ${steps.length} steps finished`}>
        <span style={{ width: `${pct}%` }} />
      </div>

      <ol className="aui-steps">
        {steps.map((step) => {
          const row = (
            <span className="aui-task-row">
              <span className="aui-mark" aria-hidden="true" />
              <span className="aui-task-name">
                {step.title}
                <span className="aui-sr"> ({step.status})</span>
              </span>
              <span className="aui-time">{step.status === "skipped" ? "Skipped" : formatTime(step.durationMs)}</span>
            </span>
          );
          return (
            <li key={step.id} className="aui-task" data-status={step.status}>
              {step.log && step.log.length > 0 ? (
                <details className="aui-log">
                  <summary>{row}</summary>
                  <pre>{step.log.join("\n")}</pre>
                </details>
              ) : (
                row
              )}
              {step.status === "failed" && (
                <div className="aui-error" role="alert">
                  <span>{step.error ?? "This step didn't finish."}</span>
                  {onRetry && <button type="button" className="aui-btn" onClick={() => onRetry(step.id)}>Try again</button>}
                  {onSkip && <button type="button" className="aui-btn aui-btn--quiet" onClick={() => onSkip(step.id)}>Skip this step</button>}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {complete && report && (
        <div className="aui-report" role="status">
          <p><strong>Changed:</strong> {report.changed}</p>
          {report.unchanged && <p><strong>Not changed:</strong> {report.unchanged}</p>}
          {report.undo && <p>{report.undo}</p>}
        </div>
      )}

      <div className="aui-foot">
        <span>{finished} of {steps.length} done{elapsed > 0 && !complete ? `, ${formatTime(elapsed)} so far` : ""}</span>
        <div className="aui-actions">
          {!complete && !failed && onStop && <button type="button" className="aui-btn" onClick={onStop}>Stop</button>}
          {complete && onUndo && <button type="button" className="aui-btn" onClick={onUndo}>Undo all</button>}
        </div>
      </div>
    </section>
  );
}
