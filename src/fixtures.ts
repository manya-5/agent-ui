import type { PlanStep } from "./components/PlanPreview";
import type { TaskStep } from "./components/TaskProgress";

export const followUpPlan: PlanStep[] = [
  { id: "read", title: "Read this week's meeting notes", detail: "Three docs in the Design folder", effect: "read", reversible: true },
  { id: "draft", title: "Draft a follow-up for each attendee", detail: "Saved as drafts, nothing is sent yet", effect: "write", reversible: true },
  { id: "tasks", title: "Add action items to the team board", detail: "5 new cards in the Next up column", effect: "write", reversible: true, optional: true },
  { id: "send", title: "Send the follow-up emails", detail: "To Priya, Sam and Jordan from your work account", effect: "external", reversible: false, optional: true },
];

export const runningSteps: TaskStep[] = [
  { id: "read", title: "Read this week's meeting notes", status: "done", durationMs: 2100, log: ["Opened Design review, Oct 14", "Opened Research sync, Oct 15", "Opened Planning, Oct 16", "Found 5 action items"] },
  { id: "draft", title: "Draft a follow-up for each attendee", status: "running", durationMs: 4300 },
  { id: "tasks", title: "Add action items to the team board", status: "pending" },
  { id: "send", title: "Send the follow-up emails", status: "pending" },
];
