import type { Preview } from "@storybook/react";
import "../src/styles/tokens.css";
import "../src/styles/base.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: { expanded: true },
    backgrounds: { disable: true },
    options: { storySort: { order: ["Flow", "PlanPreview", "ApprovalStep", "TaskProgress"] } },
  },
};

export default preview;
