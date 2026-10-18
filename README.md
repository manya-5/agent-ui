# agent-ui

React components for AI agent interfaces: a plan preview, an approval step and task progress.

![The three agent-ui components in Storybook](https://manya-5.github.io/agent-ui/screenshot.png)

**Live:** https://manya-5.github.io/agent-ui/

## Why I built this

Agents are starting to do real work for people, and most interfaces either ask too often or not at all. These components are my take on the three moments that decide whether people trust an agent: before it acts, when it needs a yes, and while it works.

## How it works

| Component | What it's for |
|---|---|
| `PlanPreview` | "Here's what I'm about to do." The whole plan before anything runs. Optional steps can be switched off, and anything that can't be undone is labeled up front. |
| `ApprovalStep` | One clear yes or no. The button names the action ("Send 3 follow-up emails"), and high-risk actions that can't be undone need an extra checkbox first. |
| `TaskProgress` | Multi-step progress for long tasks. It names the running step, only moves the bar when a step finishes, keeps Stop in reach, explains failures with Try again and Skip, and ends with a report of what changed. |

The **Flow** story puts all three together: preview the plan, approve the one step that reaches other people, then watch it run.

Styles use plain CSS and the variables from my [tokens](https://github.com/manya-5/tokens) repo, so light and dark mode come for free. Every control works with a keyboard, and motion respects reduced-motion settings.

```tsx
import { PlanPreview } from "./src";

<PlanPreview
  title="Follow up on this week's design reviews"
  steps={[
    { id: "read", title: "Read the meeting notes", effect: "read", reversible: true },
    { id: "send", title: "Send the follow-up emails", effect: "external", reversible: false, optional: true },
  ]}
  onRun={(ids) => run(ids)}
/>
```

## Run it locally

Needs Node 18 or newer.

```bash
git clone https://github.com/manya-5/agent-ui.git
cd agent-ui
npm install
npm run storybook
```

Storybook opens at http://localhost:6006. Every push to `main` builds Storybook, captures the screenshot above, and deploys to GitHub Pages.
