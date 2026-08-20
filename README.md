# Swarm Debugger

A multi-agent AI debugging platform that analyzes failing code and error messages to propose and review fixes.

![Swarm Debugger Demo](./public/demo-placeholder.png)

## Why This Exists
Debugging complex errors can be time-consuming. Swarm Debugger uses a multi-agent AI architecture where specialized agents (Code Analysis Agent, Fix Agent, Reviewer Agent) collaborate to find the root cause of an error and propose a verified fix.

## Features
- **Multi-Agent Architecture**: Dedicated agents for analysis, fixing, and reviewing.
- **Code & Error Analysis**: Paste your failing code and stack trace.
- **Proposed Fixes**: Receive specific, actionable code fixes.
- **Review System**: A secondary agent verifies the proposed fix for safety and correctness.

## Tech Stack
- Next.js (React)
- TypeScript
- Tailwind CSS

## Getting Started

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### Usage
Open [http://localhost:3000](http://localhost:3000) in your browser. Paste your code and error message, then click "Run Agents" to see the debugging process in action.

## Roadmap
See [ROADMAP.md](./ROADMAP.md) for planned features and milestones.

## License
MIT
