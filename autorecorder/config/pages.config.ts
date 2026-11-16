/**
 * One entry per tested doc page of https://docs.copilotkit.ai/google-antigravity, in the order
 * the clips are numbered. docUrl, demoUrl and the filename are derived from project.config.ts.
 *
 * Every demo route is served from the root of the app (demoSuffix is ''), because this harness
 * puts each doc page on its own route rather than a `/demo-chat` sub-page.
 *
 * Pages with no frontend to drive (State Rendering, Sub-Agents) are `docOnly`: their backends
 * were tested over AG-UI directly (see FINDINGS.md), and the clip is the doc read on camera.
 *
 * Not registered: premium/Intelligence pages and Threads (owner instruction, 2026-11-04).
 */
import { definePages } from '../core/types';

/** Registered but not recorded, with the reason printed on every run. */
export const SKIP_RECORDING: Record<string, string> = {
  'use-interrupt': 'N/A: the page says "Not supported on LangGraph (Python)" (same rule as the JS harness, owner 2026-11-11)',
  'headless-interrupts': 'N/A: the page says "Not supported on LangGraph (Python)" (same rule as the JS harness, owner 2026-11-11)',
  subgraphs: 'no runnable code on the page (one useAgent snippet, no subgraph): report N/A, no clip',
};

export const PAGES = definePages([
  {
    id: 'quickstart', name: 'Quickstart (use an existing agent, Python LangSmith)', videoName: 'Quickstart',
    docPath: 'quickstart', route: '',
    ideFile: 'frontend/VERSIONS.md', startLine: 1, endLine: 24,
    extraTabs: [
      { filePath: 'backend/main.py', startLine: 1, endLine: 26 },
      { filePath: 'frontend/app/api/copilotkit/[[...slug]]/route.ts', startLine: 1, endLine: 30 },
      { filePath: 'frontend/app/providers.tsx', startLine: 1, endLine: 11 },
      { filePath: 'frontend/app/page.tsx', startLine: 1, endLine: 13 },
    ],
    prompt: 'Can you tell me a joke?',
    waitAfterPromptMs: 3000,
  },
  {
    id: 'quickstart-fastapi', name: 'Quickstart (use an existing agent, Python FastAPI)', videoName: 'QuickstartFastAPI',
    docPath: 'quickstart', route: 'quickstart-fastapi',
    ideFile: 'backend/fastapi_main.py', startLine: 1, endLine: 61,
    extraTabs: [
      { filePath: 'frontend/app/api/copilotkit-fastapi/[[...slug]]/route.ts', startLine: 1, endLine: 29 },
      { filePath: 'frontend/app/quickstart-fastapi/page.tsx', startLine: 1, endLine: 20 },
    ],
    prompt: 'Can you tell me a joke?',
  },
  {
    id: 'frontend-tools', name: 'App Control - Frontend Tools', videoName: 'FrontendTools',
    docPath: 'frontend-tools', route: 'frontend-tools',
    ideFile: 'backend/frontend_tools.py', startLine: 1, endLine: 11,
    extraTabs: [{ filePath: 'frontend/app/frontend-tools/page.tsx', startLine: 1, endLine: 42 }],
    prompt: 'Change the background to a sunset gradient.',
  },
  {
    id: 'human-in-the-loop', name: 'Human in the Loop - useHumanInTheLoop', videoName: 'HumanInTheLoop',
    docPath: 'human-in-the-loop', route: 'hitl-in-chat',
    ideFile: 'frontend/app/hitl-in-chat/page.tsx', startLine: 51, endLine: 74,
    extraTabs: [{ filePath: 'backend/frontend_tools.py', startLine: 1, endLine: 11 }],
    prompt: 'Please book an intro call with the sales team to discuss pricing.',
  },
  {
    id: 'use-interrupt', name: 'Human in the Loop - useInterrupt', videoName: 'UseInterrupt',
    docPath: 'human-in-the-loop/useInterrupt', route: 'gen-ui-interrupt',
    ideFile: 'frontend/app/gen-ui-interrupt/page.tsx', startLine: 28, endLine: 72,
    extraTabs: [{ filePath: 'backend/interrupt_agent.py', startLine: 1, endLine: 70 }],
    prompt: 'Book an intro call with the sales team to discuss pricing.',
  },
  {
    id: 'headless-interrupts', name: 'Human in the Loop - Headless interrupts', videoName: 'HeadlessInterrupts',
    docPath: 'human-in-the-loop/headless', route: 'interrupt-headless',
    ideFile: 'frontend/app/interrupt-headless/page.tsx', startLine: 70, endLine: 130,
    prompt: 'Book an intro call with the sales team to discuss pricing.',
  },
  {
    id: 'interrupt-flow', name: 'Human in the Loop - Interrupts (interrupt flow)', videoName: 'InterruptFlow',
    docPath: 'human-in-the-loop/interrupt-flow', route: 'human-in-the-loop/interrupt-flow',
    ideFile: 'backend/interrupt_flow.py', startLine: 1, endLine: 42,
    extraTabs: [{ filePath: 'frontend/app/human-in-the-loop/interrupt-flow/page.tsx', startLine: 1, endLine: 31 }],
    prompt: 'Hi there',
  },
  {
    id: 'shared-state', name: 'Shared State - read and write', videoName: 'SharedState',
    docPath: 'shared-state', route: 'shared-state-read-write',
    ideFile: 'frontend/app/shared-state-read-write/page.tsx', startLine: 40, endLine: 70,
    prompt: 'Remember that I love hiking. Also, what is my name?',
  },
  {
    id: 'state-streaming', name: 'Shared State - State Streaming', videoName: 'StateStreaming',
    docPath: 'shared-state/streaming', route: 'shared-state-streaming',
    ideFile: 'backend/shared_state_streaming.py', startLine: 1, endLine: 70,
    extraTabs: [{ filePath: 'frontend/app/shared-state-streaming/page.tsx', startLine: 25, endLine: 43 }],
    prompt: 'Write a short poem about autumn leaves.',
    timeouts: { replyStartMs: 180000, replyStreamMs: 180000 },
  },
  {
    id: 'tool-rendering', name: 'Generative UI - Tool Rendering (per-tool)', videoName: 'ToolRendering',
    docPath: 'generative-ui/tool-rendering', route: 'tool-rendering',
    ideFile: 'frontend/app/tool-rendering/page.tsx', startLine: 70, endLine: 130,
    prompt: "What's the weather in San Francisco?",
  },
  {
    id: 'tool-rendering-default', name: 'Generative UI - Tool Rendering (default catch-all)', videoName: 'ToolRenderingDefault',
    docPath: 'generative-ui/tool-rendering', route: 'tool-rendering-default-catchall',
    ideFile: 'frontend/app/tool-rendering-default-catchall/page.tsx', startLine: 40, endLine: 59,
    prompt: 'Find flights from SFO to JFK.',
  },
  {
    id: 'tool-rendering-custom', name: 'Generative UI - Tool Rendering (custom catch-all)', videoName: 'ToolRenderingCustom',
    docPath: 'generative-ui/tool-rendering', route: 'tool-rendering-custom-catchall',
    ideFile: 'frontend/app/tool-rendering-custom-catchall/page.tsx', startLine: 38, endLine: 66,
    prompt: 'Roll a d20',
  },
  {
    id: 'reasoning', name: 'Generative UI - Reasoning (default)', videoName: 'Reasoning',
    docPath: 'generative-ui/reasoning', route: 'reasoning-default',
    ideFile: 'frontend/app/reasoning-default/page.tsx', startLine: 1, endLine: 37,
    prompt: 'What is 17 times 23? Think step by step.',
    timeouts: { replyStartMs: 180000, replyStreamMs: 180000 },
  },
  {
    id: 'components', name: 'Generative UI - Components and surfaces (step 3 only)', videoName: 'Components',
    docPath: 'generative-ui/components', route: 'generative-ui/components',
    ideFile: 'frontend/app/generative-ui/components/providers.tsx', startLine: 1, endLine: 14,
    extraTabs: [{ filePath: 'frontend/app/generative-ui/components/page.tsx', startLine: 1, endLine: 7 }],
    prompt: 'Compare the Starter, Team, and Enterprise plans in a table',
    timeouts: { replyStartMs: 180000, replyStreamMs: 180000 },
  },
  {
    id: 'mcp-apps', name: 'Generative UI - MCP Apps', videoName: 'McpApps',
    docPath: 'generative-ui/mcp-apps', route: 'mcp-apps',
    ideFile: 'frontend/app/api/copilotkit-mcp-apps/[[...slug]]/route.ts', startLine: 41, endLine: 66,
    prompt: 'Use Excalidraw to draw a simple flowchart with three steps.',
    timeouts: { replyStartMs: 180000, replyStreamMs: 180000 },
  },
  {
    id: 'subagents', name: 'Multi-Agent - Sub-Agents', videoName: 'SubAgents',
    docPath: 'multi-agent/subagents', route: 'subagents',
    ideFile: 'backend/subagents.py', startLine: 1, endLine: 70,
    prompt: 'Write a short blog post about why cats are great.',
    timeouts: { replyStartMs: 180000, replyStreamMs: 180000 },
  },
  {
    id: 'inspector', name: 'Debugging - Inspector', videoName: 'Inspector',
    docPath: 'inspector', route: '',
    ideFile: 'frontend/app/providers.tsx', startLine: 1, endLine: 11,
    prompt: 'Say hello in five words.',
  },
  {
    id: 'webmcp', name: 'Browser Agents - WebMCP', videoName: 'WebMCP',
    docPath: 'webmcp', route: 'webmcp',
    ideFile: 'frontend/app/webmcp/OrderSearch.tsx', startLine: 1, endLine: 35,
    prompt: 'Which of my orders are shipped?',
  },
  // --- Batch 2: the remaining runnable pages of the LangGraph JS track (37) ---
  {
    id: 'prebuilt-chat', name: 'Prebuilt Components - Chat', videoName: 'PrebuiltChat',
    docPath: 'prebuilt-components/chat', route: 'agentic-chat',
    ideFile: 'frontend/app/agentic-chat/page.tsx', startLine: 1, endLine: 24,
    prompt: "Tell me a joke about developers.",
  },
  {
    id: 'prebuilt-popup', name: 'Prebuilt Components - Popup', videoName: 'PrebuiltPopup',
    docPath: 'prebuilt-components/popup', route: 'prebuilt-popup',
    ideFile: 'frontend/app/prebuilt-popup/page.tsx', startLine: 1, endLine: 24,
    prompt: "Say hi from the popup!",
  },
  {
    id: 'prebuilt-sidebar', name: 'Prebuilt Components - Sidebar', videoName: 'PrebuiltSidebar',
    docPath: 'prebuilt-components/sidebar', route: 'prebuilt-sidebar',
    ideFile: 'frontend/app/prebuilt-sidebar/page.tsx', startLine: 1, endLine: 20,
    prompt: "Say hi!",
  },
  {
    id: 'chat-controls', name: 'Prebuilt Components - Chat Controls', videoName: 'ChatControls',
    docPath: 'prebuilt-components/chat-controls', route: 'prebuilt-components/chat-controls/open-state',
    ideFile: 'frontend/app/prebuilt-components/chat-controls/feedback/page.tsx', startLine: 1, endLine: 32,
    prompt: "Give me a link to the React docs and a short heading.",
  },
  {
    id: 'css', name: 'Custom Look and Feel - CSS', videoName: 'CSS',
    docPath: 'custom-look-and-feel/css', route: 'chat-customization-css',
    ideFile: 'frontend/app/chat-customization-css/page.tsx', startLine: 1, endLine: 30,
    prompt: "Hi! In one sentence, what can you do?",
  },
  {
    id: 'slots', name: 'Custom Look and Feel - Slots', videoName: 'Slots',
    docPath: 'custom-look-and-feel/slots', route: 'chat-slots',
    ideFile: 'frontend/app/chat-slots/page.tsx', startLine: 20, endLine: 60,
    prompt: "Write a short sonnet about AI.",
  },
  {
    id: 'headless-ui', name: 'Custom Look and Feel - Headless UI', videoName: 'HeadlessUI',
    docPath: 'custom-look-and-feel/headless-ui', route: 'headless-complete',
    ideFile: 'frontend/app/headless-complete/page.tsx', startLine: 9, endLine: 49,
    prompt: "What is the weather in Tokyo?",
  },
  {
    id: 'markdown', name: 'Custom Look and Feel - Markdown', videoName: 'Markdown',
    docPath: 'custom-look-and-feel/markdown', route: 'custom-look-and-feel/markdown/tags',
    ideFile: 'frontend/app/custom-look-and-feel/markdown/tags/page.tsx', startLine: 1, endLine: 38,
    prompt: "Reply with a markdown h2 heading and a link to https://react.dev",
  },
  {
    id: 'reasoning-messages', name: 'Custom Look and Feel - Reasoning Messages', videoName: 'ReasoningMessages',
    docPath: 'custom-look-and-feel/reasoning-messages', route: 'reasoning-custom',
    ideFile: 'frontend/app/reasoning-custom/page.tsx', startLine: 12, endLine: 52,
    prompt: "What is 17 times 23? Think step by step.",
    timeouts: { replyStartMs: 180000, replyStreamMs: 180000 },
  },
  {
    id: 'json-render', name: 'Generative UI - JSON Render', videoName: 'JsonRender',
    docPath: 'generative-ui/json-render', route: 'declarative-json-render',
    ideFile: 'frontend/app/declarative-json-render/page.tsx', startLine: 1, endLine: 19,
    prompt: "Show me the sales dashboard with metrics and a revenue chart",
    timeouts: { replyStartMs: 180000, replyStreamMs: 180000 },
  },
  {
    id: 'hashbrown', name: 'Generative UI - Hashbrown', videoName: 'Hashbrown',
    docPath: 'generative-ui/hashbrown', route: 'declarative-hashbrown',
    ideFile: 'frontend/app/declarative-hashbrown/page.tsx', startLine: 1, endLine: 30,
    extraTabs: [{ filePath: 'backend/byoc_hashbrown.py', startLine: 1, endLine: 15, addedText: 'middleware=[CopilotKitMiddleware()],' }],
    prompt: "Show me a sales summary with a chart",
    timeouts: { replyStartMs: 180000, replyStreamMs: 180000 },
  },
  {
    id: 'open-generative-ui', name: 'Generative UI - Open Generative UI', videoName: 'OpenGenerativeUI',
    docPath: 'generative-ui/open-generative-ui', route: 'open-gen-ui',
    ideFile: 'frontend/app/open-gen-ui/page.tsx', startLine: 9, endLine: 49,
    prompt: "Make a small quicksort visualization.",
    timeouts: { replyStartMs: 180000, replyStreamMs: 180000 },
  },
  {
    id: 'a2ui', name: 'Generative UI - A2UI', videoName: 'A2UI',
    docPath: 'generative-ui/a2ui', route: 'declarative-gen-ui',
    ideFile: 'frontend/app/declarative-gen-ui/page.tsx', startLine: 1, endLine: 43,
    extraTabs: [{ filePath: 'backend/a2ui_dynamic.py', startLine: 1, endLine: 23, addedText: 'middleware=[CopilotKitMiddleware()],' }],
    prompt: "Show me my sales dashboard for this quarter.",
    timeouts: { replyStartMs: 180000, replyStreamMs: 180000 },
  },
  {
    id: 'a2ui-dynamic', name: 'Generative UI - A2UI Dynamic Schema', videoName: 'A2UIDynamicSchema',
    docPath: 'generative-ui/a2ui/dynamic-schema', route: 'declarative-gen-ui',
    ideFile: 'frontend/app/declarative-gen-ui/page.tsx', startLine: 1, endLine: 43,
    extraTabs: [{ filePath: 'backend/a2ui_dynamic.py', startLine: 1, endLine: 23, addedText: 'middleware=[CopilotKitMiddleware()],' }],
    prompt: "Show my team performance.",
    timeouts: { replyStartMs: 180000, replyStreamMs: 180000 },
  },
  {
    id: 'a2ui-fixed', name: 'Generative UI - A2UI Fixed Schema', videoName: 'A2UIFixedSchema',
    docPath: 'generative-ui/a2ui/fixed-schema', route: 'a2ui-fixed-schema',
    ideFile: 'frontend/app/a2ui-fixed-schema/page.tsx', startLine: 1, endLine: 41,
    prompt: "Find me a flight from SFO to JFK on United for $289.",
    timeouts: { replyStartMs: 180000, replyStreamMs: 180000 },
  },
  {
    id: 'components-catalogs', name: 'Generative UI - Components: Catalogs', videoName: 'ComponentsCatalogs',
    docPath: 'generative-ui/components/catalogs', route: 'generative-ui/components-sub/catalogs',
    ideFile: 'frontend/app/generative-ui/components-sub/catalogs/catalog.tsx', startLine: 1, endLine: 43,
    prompt: "Show me two running shoes as product cards in a grid.",
    timeouts: { replyStartMs: 180000, replyStreamMs: 180000 },
  },
  {
    id: 'components-surfaces', name: 'Generative UI - Components: Surfaces', videoName: 'ComponentsSurfaces',
    docPath: 'generative-ui/components/surfaces', route: 'generative-ui/components-sub/surfaces',
    ideFile: 'frontend/app/generative-ui/components-sub/surfaces/page.tsx', ideAddedText: 'type Product = { name: string; price: number }; // HARNESS', startLine: 10, endLine: 47,
    prompt: "Show cheap running shoes in the featured products area.",
    timeouts: { replyStartMs: 180000, replyStreamMs: 180000 },
  },
  {
    id: 'components-theming', name: 'Generative UI - Components: Theming', videoName: 'ComponentsTheming',
    docPath: 'generative-ui/components/theming', route: 'generative-ui/components-sub/theming',
    ideFile: 'frontend/app/generative-ui/components-sub/theming/page.tsx', startLine: 1, endLine: 24,
    prompt: "Show me a card with a title, a short description and a primary button.",
    timeouts: { replyStartMs: 180000, replyStreamMs: 180000 },
  },
  {
    id: 'components-transports', name: 'Generative UI - Components: Transports', videoName: 'ComponentsTransports',
    docPath: 'generative-ui/components/transports', route: 'generative-ui/components-sub/transports',
    ideFile: 'frontend/app/generative-ui/components-sub/transports/page.tsx', startLine: 1, endLine: 14,
    prompt: "Show me a card with a seats slider and a price label.",
    timeouts: { replyStartMs: 180000, replyStreamMs: 180000 },
  },
  {
    id: 'components-state-actions', name: 'Generative UI - Components: State and actions', videoName: 'ComponentsStateActions',
    docPath: 'generative-ui/components/state-and-actions', route: 'generative-ui/components-sub/state-and-actions',
    ideFile: 'frontend/app/generative-ui/components-sub/state-and-actions/catalog.tsx', startLine: 16, endLine: 53,
    prompt: "Show me product cards for productId shoe-1 named Runner and productId shoe-2 named Trail.",
    timeouts: { replyStartMs: 180000, replyStreamMs: 180000 },
  },
  {
    id: 'components-markdown-mode', name: 'Generative UI - Components: Markdown mode', videoName: 'ComponentsMarkdownMode',
    docPath: 'generative-ui/components/markdown-mode', route: 'generative-ui/components-sub/markdown-mode',
    ideFile: 'frontend/app/generative-ui/components-sub/markdown-mode/page.tsx', startLine: 1, endLine: 14,
    prompt: "Show me a card with a seats slider and a price label.",
    timeouts: { replyStartMs: 180000, replyStreamMs: 180000 },
  },
  {
    id: 'agent-readonly', name: 'Shared State - Agent Read-Only Context', videoName: 'AgentReadOnly',
    docPath: 'shared-state/agent-readonly', route: 'readonly-state-agent-context',
    ideFile: 'frontend/app/readonly-state-agent-context/page.tsx', startLine: 34, endLine: 74,
    prompt: "What do you know about me from my context?",
  },
  {
    id: 'governed-actions', name: 'Human in the Loop - Governed Actions', videoName: 'GovernedActions',
    docPath: 'human-in-the-loop/governed-actions', route: 'human-in-the-loop/governed-actions',
    ideFile: 'frontend/app/human-in-the-loop/governed-actions/governed.tsx', startLine: 20, endLine: 60,
    prompt: "Send an email to bob@example.com saying the invoice is paid. Ask for approval first with approve_governed_action (verdict require_approval).",
  },
  {
    id: 'agent-app-context', name: 'Agent App Context (Readables)', videoName: 'AgentAppContext',
    docPath: 'agent-app-context', route: 'agent-app-context/custom',
    ideFile: 'backend/app_context.py', startLine: 1, endLine: 52,
    prompt: "Who are my colleagues? List their roles.",
  },
  {
    id: 'agent-config', name: 'Agent Config (temperature fix)', videoName: 'AgentConfig',
    docPath: 'agent-config', route: 'agent-config-harness',
    ideFile: 'backend/agent_config_harness.py', startLine: 1, endLine: 14,
    prompt: "Hi! Explain what an API is.",
  },
  {
    id: 'multimodal', name: 'Multimodal Attachments', videoName: 'Multimodal',
    docPath: 'multimodal-attachments', route: 'multimodal',
    ideFile: 'frontend/app/multimodal/page.tsx', startLine: 1, endLine: 39,
    prompt: "What kinds of files can you read?",
  },
  {
    id: 'programmatic-control', name: 'Programmatic Control', videoName: 'ProgrammaticControl',
    docPath: 'programmatic-control', route: 'programmatic-control',
    ideFile: 'frontend/app/programmatic-control/AgentTrigger.tsx', startLine: 1, endLine: 40,
    extraTabs: [
      { filePath: 'backend/programmatic_control.py', startLine: 1, endLine: 12 },
      { filePath: 'frontend/app/programmatic-control/page.tsx', startLine: 1, endLine: 18 },
    ],
    prompt: 'Say hi in five words.',
  },
  // --- Rows from the team testing doc not covered above ---
  {
    id: 'tool-based', name: 'Generative UI - Components as Tools', videoName: 'ComponentsAsTools',
    docPath: 'generative-ui/tool-based', route: 'gen-ui-tool-based',
    ideFile: 'frontend/app/gen-ui-tool-based/page.tsx', startLine: 12, endLine: 52,
    prompt: "Show me a pie chart of my monthly expenses: rent 1200, food 400, transport 150.",
  },
  {
    id: 'state-rendering', name: 'Generative UI - State Rendering', videoName: 'StateRendering',
    docPath: 'generative-ui/state-rendering', route: 'shared-state-streaming',
    ideFile: 'frontend/app/shared-state-streaming/page.tsx', startLine: 1, endLine: 43,
    prompt: "Write a short poem about autumn leaves.",
    timeouts: { replyStartMs: 180000, replyStreamMs: 180000 },
  },
  {
    id: 'components-standard-catalog', name: 'Generative UI - Components: Standard catalog', videoName: 'ComponentsStandardCatalog',
    docPath: 'generative-ui/components/standard-catalog', route: 'generative-ui/components-sub/standard-catalog',
    ideFile: 'frontend/app/generative-ui/components-sub/standard-catalog/page.tsx', startLine: 1, endLine: 21,
    prompt: "Show a table of three plans with their price and seats, and a bar chart of the prices.",
    timeouts: { replyStartMs: 180000, replyStreamMs: 180000 },
  },
  {
    id: 'components-from-a2ui', name: 'Generative UI - Components: Adopt from A2UI', videoName: 'ComponentsFromA2UI',
    docPath: 'generative-ui/components/from-a2ui', route: 'generative-ui/components-sub/from-a2ui',
    ideFile: 'frontend/app/generative-ui/components-sub/from-a2ui/page.tsx', startLine: 1, endLine: 37,
    prompt: "Show my flight from SFO (San Francisco) to JFK (New York) with the Airport and Arrow components.",
    timeouts: { replyStartMs: 180000, replyStreamMs: 180000 },
  },
  {
    id: 'rendering-in-app', name: 'Shared State - Render agent state in your app', videoName: 'RenderAgentState',
    // ❌ #37: the demo opens the doc's page (quickstart runtime, crashes), then the harness copy.
    docPath: 'shared-state/rendering-in-app', route: 'shared-state/rendering-in-app',
    ideFile: 'frontend/components/Canvas.tsx', startLine: 20, endLine: 55,
    extraTabs: [
      { filePath: 'frontend/app/shared-state/rendering-in-app/page.tsx', startLine: 1, endLine: 21 },
      { filePath: 'frontend/app/shared-state/rendering-in-app/harness/page.tsx', startLine: 1, endLine: 16 },
    ],
    prompt: "Hi! What can you see?",
  },
  {
    id: 'readables-prebuilt', name: 'Agent App Context (Readables) - Prebuilt agent', videoName: 'ReadablesPrebuilt',
    docPath: 'agent-app-context', route: 'agent-app-context/prebuilt',
    ideFile: 'backend/app_context_prebuilt.py', startLine: 1, endLine: 14,
    prompt: "Who are my colleagues? List their roles.",
  },
  {
    id: 'subgraphs', name: 'Agent Capabilities - Subgraphs', videoName: 'Subgraphs',
    docPath: 'subgraphs', route: '', docOnly: true,
    ideFile: 'frontend/VERSIONS.md', startLine: 1, endLine: 5,
    prompt: '-',
  },
  {
    id: 'configurable', name: 'Agent Capabilities - Configurable', videoName: 'Configurable',
    // Doc-only finding clip (#15): doc read, then the faulty TypeScript block highlighted + Notepad.
    docPath: 'configurable', route: '', docOnly: true, docOnlyAction: true, docViewDurationMs: 20000,
    ideFile: 'frontend/VERSIONS.md', startLine: 1, endLine: 5,
    prompt: '-',
  },
  {
    id: 'guardrails', name: 'Agent Capabilities - Guardrails and DLP', videoName: 'Guardrails',
    // HARNESS route: the page is backend-only; chat on backend/guardrails_agent.py (doc agent.py + guardrails.py).
    docPath: 'guardrails', route: 'guardrails',
    ideFile: 'backend/guardrails_agent.py', startLine: 1, endLine: 32,
    extraTabs: [{ filePath: 'backend/guardrails.py', startLine: 1, endLine: 60 }],
    prompt: 'My email is jane.doe@example.com and my card is 4111 1111 1111 1111. Repeat both back to me exactly.',
  },
  // --- Added 2026-11-08: Voice + Threads (team doc "Threads" row) ---
  {
    id: 'voice', name: 'Voice', videoName: 'Voice',
    docPath: 'voice', route: 'voice',
    ideFile: 'frontend/app/voice/page.tsx', startLine: 1, endLine: 22,
    extraTabs: [
      { filePath: 'frontend/app/api/copilotkit-voice/[[...slug]]/route.ts', startLine: 1, endLine: 89 },
      { filePath: 'frontend/app/voice/sample-audio-button.tsx', startLine: 1, endLine: 17 },
      // ❌ #36: the file the doc imports but never shows (HARNESS copy from the showcase).
      { filePath: 'frontend/app/voice/voice-chat.tsx', startLine: 1, endLine: 20 },
    ],
    prompt: 'What is the weather in Tokyo?',
  },
  {
    id: 'prebuilt-components-copilot-threads-drawer', name: 'Prebuilt Components - Threads Drawer', videoName: 'ThreadsDrawer',
    docPath: 'prebuilt-components/copilot-threads-drawer', route: 'threads-drawer',
    ideFile: 'frontend/app/threads-drawer/page.tsx', startLine: 1, endLine: 22,
    prompt: 'Say hi in five words.',
  },
  {
    id: 'headless-threads', name: 'Headless Threads', videoName: 'HeadlessThreads',
    docPath: 'headless-threads', route: 'headless-threads',
    ideFile: 'frontend/app/api/copilotkit-threads/[[...slug]]/route.ts', startLine: 1, endLine: 52,
    extraTabs: [
      { filePath: 'frontend/app/headless-threads/ThreadSidebar.tsx', startLine: 1, endLine: 32 },
      { filePath: 'frontend/app/headless-threads/App.tsx', startLine: 1, endLine: 17 },
    ],
    prompt: 'Say hi in five words.',
  },
]);
