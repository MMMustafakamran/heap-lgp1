# Findings — LangGraph Python (React)
Open doc defects only, from probe evidence. Numbers are stable IDs (code cites `FINDINGS.md #N`).
Stack: `@copilotkit/react-core`/`runtime` per frontend/VERSIONS.md (npm latest in CI), `langgraph` 1.2.22, `langgraph-cli` 0.4.43 (`langgraph-api` 0.18.1), `langchain-openai` 1.8.0, `langchain-core` 1.8.1, `copilotkit` 0.1.97, `ag-ui-langgraph` 0.0.47, `next` 16.4.5, `react` 19.3.0, Node 26.7.0, Python 3.13 (uv), Windows 11. Docs: https://docs.copilotkit.ai/langgraph-python (checked 2026-11-16)

## Dev blockers

### [A2UI](https://docs.copilotkit.ai/langgraph-python/generative-ui/a2ui) / [Dynamic schema](https://docs.copilotkit.ai/langgraph-python/generative-ui/a2ui/dynamic-schema)
**#1** The default path crashes on every run with a Python agent.
**Doc:** "That is all the default path needs. The catalog auto-enables A2UI and injects the `generate_a2ui` tool, so the runtime needs no `a2ui` block." (no Python agent shown for the default path; only the opt-out `agent.py` fragment)
**Error:** chat toast `<asyncio.locks.Event object at 0x… [unset]> is bound to a different event loop`; browser `[CopilotKit] Agent error … Code: agent_run_error_event`; no dashboard renders (3/3 probes). `CopilotKitMiddleware` swaps in `ag_ui_langgraph/a2ui_tool.py` `generate_a2ui`, which runs its subagent via `asyncio.to_thread(asyncio.run(...))`.
**Confirmed by harness:** `backend/a2ui_dynamic.py` is a HARNESS graph mirroring the JS one (`tools=[]` + `CopilotKitMiddleware`), since the page gives none.

### [A2UI Fixed schema](https://docs.copilotkit.ai/langgraph-python/generative-ui/a2ui/fixed-schema)
**#2** The flight card renders but every data-bound field is empty.
**Doc:** the page's `update_data_model` op with `path "/"` and the flight values.
**Result:** the reply says "Here's the United flight from SFO to JFK for $289." and the card shows no airports and no price. Main feature (card with the flight data) does not work as documented.

### [Rendering in app](https://docs.copilotkit.ai/langgraph-python/shared-state/rendering-in-app)
**#3** `useAgent()` with no agentId needs a `default` agent the setup never registers.
**Doc:** `useAgent()` — "No agentId means the \"default\" agent. Pass { agentId } to target another."
**Error:** `useAgent: Agent 'default' not found after runtime sync (runtimeUrl=/api/copilotkit-quickstart). Known agents: [sample_agent]`

### [Components: Surfaces](https://docs.copilotkit.ai/langgraph-python/generative-ui/components/surfaces)
**#4** The featured products surface never updates.
**Result:** the agent calls `render_ui`; console `The agent called the tool "render_ui", and no renderer is registered for it`; the area stays "Classic Tee / Canvas Tote" (3/3 probes).

### [Configurable](https://docs.copilotkit.ai/langgraph-python/configurable)
**#5** Python fragments only, not runnable.
**Doc:** `def build_agent(tenant_id: str) -> LangGraphAGUIAgent: … graph=graph` — `graph` and `AgentState` undefined, no endpoint wiring, no frontend code.

### [Components](https://docs.copilotkit.ai/langgraph-python/generative-ui/components) / [State and actions](https://docs.copilotkit.ai/langgraph-python/generative-ui/components/state-and-actions)
**#16** With today's packages (CopilotKit 1.88.0) no component renders.
**Doc:** "The table fills in while the agent writes it. It is a real component…"
**Error:** console `[CopilotKit] The agent called the tool "render_ui", and no renderer is registered for it, so that message rendered nothing.`; Components gets a plain-text table instead, State and actions shows no product cards (2/2 CI runs on 1.88.0; worked locally on 1.85.0).

### [Hashbrown](https://docs.copilotkit.ai/langgraph-python/generative-ui/hashbrown)
**#17** (already in the team doc, ⚠️) The page gives no Python agent, only an example assistant message; the agent has to be written by hand (`backend/byoc_hashbrown.py`, HARNESS). With it, the dashboard renders.

## Minor notes
- **#6** Quickstart (any tab): on Windows `langgraph dev` crashes at start (`SystemError: ConsoleRenderer with colors=True on Windows requires the colorama package`); the install line doesn't add `colorama` (`langgraph-cli[inmem]` itself is never named either).
- **#7** Guardrails: `screen_input`, `redact_sensitive`, `tool_call_allowed` left to the reader; `tools=[...]` as written raises `ValueError: The first argument must be a string or a callable with a __name__`.
- **#8** Interrupt flow: `agent.py` never builds or compiles a graph.
- **#9** Programmatic control: the page never says where to mount `AgentTrigger`.
- **#10** Chat controls: `analytics` is undefined in the feedback snippet.
- **#11** Quickstart FastAPI: the start step runs `uv run main.py` after `cd ..`, but `main.py` is in the agent directory.
- **#12** `react-native` page linked from the components pages and inspector is a 404.
- **#13** `CopilotKitProvider`'s `Date.now()` triggers the Next.js unstable-value error on every route (badge hidden, `devIndicators: false`).
- **#14** Sub-agents: `subagents.py` imports `src._header_forwarding_middleware` (a showcase-only helper not on the page): `ModuleNotFoundError: No module named 'src'`; a no-op stand-in makes it run.
- **#15** WebMCP: `searchOrders` is called but never defined on the page.
- **#18** Open Generative UI: `VISUALIZATION_DESIGN_SKILL` is used but never defined; filled with a hand-written prompt.
- **#19** Governed actions: the page shows no provider or agent; reused the frontend-tools agent.
