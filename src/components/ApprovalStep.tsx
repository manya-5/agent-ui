import { useId, useState } from "react";

export type Risk = "low" | "medium" | "high";
export type Decision = "pending" | "approved" | "rejected";

export interface ApprovalStepProps {
  /** The action as a short question-free verb phrase, like "Send 3 follow-up emails". */
  action: string;
  description?: string;
  /** The specifics people need to decide: who, what, when, from where. */
  details?: { label: string; value: string }[];
  risk?: Risk;
  /** Can this be undone after it runs? */
  reversible?: boolean;
  /** Button text. Defaults to the action itself, so the button says what happens. */
  approveLabel?: string;
  rejectLabel?: string;
  /** Pass to control the decision from outside. Leave out to let the component track it. */
  decision?: Decision;
  onApprove?: () => void;
  onReject?: () => void;
  agentName?: string;
}

const RISK_DOT: Record<Risk, string> = { low: "aui-dot--approve", medium: "aui-dot--caution", high: "aui-dot--reject" };

/**
 * One clear yes or no before the agent acts. The approve button names the action,
 * and anything high risk that can't be undone needs an explicit acknowledgment first.
 */
export function ApprovalStep({
  action,
  description,
  details = [],
  risk = "medium",
  reversible = true,
  approveLabel,
  rejectLabel = "Don't do this",
  decision,
  onApprove,
  onReject,
  agentName = "Assistant",
}: ApprovalStepProps) {
  const [local, setLocal] = useState<Decision>("pending");
  const [acknowledged, setAcknowledged] = useState(false);
  const headingId = useId();
  const state = decision ?? local;
  const needsAck = risk === "high" && !reversible;

  function approve() {
    setLocal("approved");
    onApprove?.();
  }
  function reject() {
    setLocal("rejected");
    onReject?.();
  }

  return (
    <section className="aui-card" aria-labelledby={headingId}>
      <div className="aui-head">
        <p className="aui-eyebrow">
          <span className={`aui-dot ${state === "pending" ? RISK_DOT[risk] : state === "approved" ? "aui-dot--approve" : ""}`} />
          {state === "pending" ? `${agentName} needs your OK` : state === "approved" ? "Approved" : "Not approved"}
        </p>
        <h2 className="aui-title" id={headingId}>{action}?</h2>
        {description && <p className="aui-summary">{description}</p>}
      </div>

      {details.length > 0 && (
        <dl className="aui-details">
          {details.map((d) => (
            <div key={d.label}><dt>{d.label}</dt><dd>{d.value}</dd></div>
          ))}
        </dl>
      )}

      {state === "pending" && needsAck && (
        <label className="aui-ack">
          <input type="checkbox" checked={acknowledged} onChange={(e) => setAcknowledged(e.target.checked)} />
          <span>I understand this can't be undone.</span>
        </label>
      )}

      <div className="aui-foot">
        {state === "pending" ? (
          <>
            <span>{reversible ? "You can undo this afterwards." : <span className="aui-tag aui-tag--reject">Can't be undone</span>}</span>
            <div className="aui-actions">
              <button type="button" className="aui-btn" onClick={reject}>{rejectLabel}</button>
              <button
                type="button"
                className={`aui-btn ${risk === "high" ? "aui-btn--danger" : "aui-btn--primary"}`}
                disabled={needsAck && !acknowledged}
                onClick={approve}
              >
                {approveLabel ?? action}
              </button>
            </div>
          </>
        ) : (
          <p className="aui-decision" role="status">
            {state === "approved" ? `${agentName} will go ahead.` : `Stopped. ${agentName} won't do this.`}
          </p>
        )}
      </div>
    </section>
  );
}
