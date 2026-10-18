import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { TaskProgress } from "./TaskProgress";
import { runningSteps } from "../fixtures";

const meta: Meta<typeof TaskProgress> = {
  title: "TaskProgress",
  component: TaskProgress,
  tags: ["autodocs"],
  args: {
    title: "Follow up on this week's design reviews",
    steps: runningSteps,
    onStop: fn(),
    onRetry: fn(),
    onSkip: fn(),
    onUndo: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof TaskProgress>;

export const Running: Story = {};

export const Failed: Story = {
  name: "A step failed",
  args: {
    steps: [
      { ...runningSteps[0] },
      { id: "draft", title: "Draft a follow-up for each attendee", status: "done", durationMs: 6200 },
      { id: "tasks", title: "Add action items to the team board", status: "failed", durationMs: 1800, error: "The board is read-only for your account. Ask an admin for edit access, or skip this step." },
      { id: "send", title: "Send the follow-up emails", status: "pending" },
    ],
  },
};

export const Finished: Story = {
  args: {
    steps: [
      { ...runningSteps[0] },
      { id: "draft", title: "Draft a follow-up for each attendee", status: "done", durationMs: 6200 },
      { id: "tasks", title: "Add action items to the team board", status: "skipped" },
      { id: "send", title: "Send the follow-up emails", status: "done", durationMs: 900 },
    ],
    report: {
      changed: "Sent 3 follow-up emails from your work account.",
      unchanged: "The team board. You skipped that step.",
      undo: "Sent emails can't be unsent. The drafts are saved in your Sent folder.",
    },
    onUndo: undefined,
  },
};
