import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { PlanPreview } from "./PlanPreview";
import { followUpPlan } from "../fixtures";

const meta: Meta<typeof PlanPreview> = {
  title: "PlanPreview",
  component: PlanPreview,
  tags: ["autodocs"],
  args: {
    title: "Follow up on this week's design reviews",
    summary: "I'll read the notes, draft a follow-up for each person, and add the action items to your board. Switch off anything you'd rather do yourself.",
    steps: followUpPlan,
    onRun: fn(),
    onCancel: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof PlanPreview>;

export const Default: Story = {};

export const ReadOnly: Story = {
  name: "Nothing permanent",
  args: {
    title: "Summarize last month's research",
    summary: undefined,
    steps: [
      { id: "a", title: "Find interview notes from September", effect: "read", reversible: true },
      { id: "b", title: "Group quotes by theme", effect: "read", reversible: true },
      { id: "c", title: "Write a one-page summary in a new doc", effect: "write", reversible: true },
    ],
  },
};

export const LongTitles: Story = {
  name: "Long step names",
  args: {
    title: "Clean up the shared component library before the handoff to engineering next week",
    steps: [
      { id: "a", title: "Rename 48 components so they match the naming guide agreed in the design system review", detail: "Old names are kept as aliases for one release", effect: "write", reversible: true },
      { id: "b", title: "Delete unused variants", detail: "14 variants with no instances in any file", effect: "write", reversible: false, optional: true },
    ],
  },
};
