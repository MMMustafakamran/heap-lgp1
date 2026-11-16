# HARNESS: the Dynamic Schema page's default path ("The catalog auto-enables A2UI and injects the
# `generate_a2ui` tool") gives no Python agent at all. Mirrors the JS harness graph
# (agent/src/showcase/a2ui-dynamic.ts: tools [], copilotkit middleware) with the Python doc pattern
# (create_agent + CopilotKitMiddleware, which forwards the injected frontend tool).
#
# The page's Python snippet belongs to the opt-out path only ("I opted out of auto-inject"):
#   generate_a2ui = get_a2ui_tools({"model": ChatOpenAI(model="gpt-6-luna", reasoning_effort="none"),
#                                   "default_catalog_id": "copilotkit://app-dashboard-catalog"})
#   tools = [my_other_tool, generate_a2ui]   # my_other_tool is never defined on the page
# Adding it next to the auto-injected tool (earlier harness version) made the agent render for the
# wrong catalog id -> "A2UI render error: Cannot read properties of undefined (reading 'map')".
from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from copilotkit import CopilotKitMiddleware

SYSTEM_PROMPT = 'You are a demo assistant for Declarative Generative UI (A2UI — Dynamic Schema). Whenever a response would benefit from a rich visual — a dashboard, status report, KPI summary, card layout, info grid, a pie/donut chart of part-of-whole breakdowns, or a bar chart comparing values across categories — call `generate_a2ui` to draw it. Keep chat replies to one short sentence and let the UI do the talking.'

graph = create_agent(
    model=ChatOpenAI(model="gpt-5-mini"),
    tools=[],
    middleware=[CopilotKitMiddleware()],
    system_prompt=SYSTEM_PROMPT,
)
