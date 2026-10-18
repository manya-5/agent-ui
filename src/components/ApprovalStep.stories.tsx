import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { ApprovalStep } from "./ApprovalStep";

const meta: Meta<typeof ApprovalStep> = {
  title: "ApprovalStep",
  component: ApprovalStep,
  tags: ["autodocs"],
  args: {
    action: "Send 3 follow-up emails",
    description: "Drafts are ready. Each one lists that person's action items from Tuesday's review.",
    details: [
      { label: "To", value: "Priya, Sam, Jordan" },
      { label: "From", value: "Your work account" },
      { label: "When", value: "Right after you approve" },
    ],
    risk: "medium",
    reversible: false,
    onApprove: fn(),
    onReject: fn(),
  },
  argTypes: {
    risk: { control: "inline-radio", options: ["low", "medium", "high"] },
    decision: { control: "inline-radio", options: [undefined, "pending", "approved", "rejected"] },
  },
};
export default meta;
type Story = StoryObj<typeof ApprovalStep>;

export const Default: Story = {};

export const LowRisk: Story = {
  name: "Low risk, undoable",
  args: {
    action: "Archive 12 old drafts",
    description: "None of them have been opened in 90 days.",
    details: [{ label: "Moves to", value: "Archive folder" }],
    risk: "low",
    reversible: true,
  },
};

export const HighRisk: Story = {
  name: "High risk, needs acknowledgment",
  args: {
    action: "Delete the Q3 research project",
    description: "This removes 14 interviews and their notes for everyone on the team.",
    details: [
      { label: "Interviews", value: "14" },
      { label: "Shared with", value: "6 people" },
    ],
    risk: "high",
    reversible: false,
    approveLabel: "Delete project",
    rejectLabel: "Keep it",
  },
};

export const Approved: Story = { args: { decision: "approved" } };
export const Rejected: Story = { args: { decision: "rejected" } };
