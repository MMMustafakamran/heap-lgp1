# HARNESS: the Dynamic Schema page's agent.py snippet is a fragment (undefined my_other_tool, no graph). Same prompt as the JS harness; generate_a2ui from the page's get_a2ui_tools call.
# Mirrors the JS harness graph (agent/src/showcase) with the Python doc pattern
# (create_agent + CopilotKitMiddleware, which forwards the frontend tools and context).
from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from copilotkit import CopilotKitMiddleware
from ag_ui_langgraph import get_a2ui_tools

# Doc (generative-ui/a2ui/dynamic-schema, agent.py), verbatim:
generate_a2ui = get_a2ui_tools({
    "model": ChatOpenAI(model="gpt-6-luna", reasoning_effort="none"),
    "default_catalog_id": "copilotkit://app-dashboard-catalog",
})

# tools = [my_other_tool, generate_a2ui]  # Doc line: my_other_tool is never defined on the page
tools = [generate_a2ui]  # HARNESS: my_other_tool removed (undefined)

SYSTEM_PROMPT = 'You are a demo assistant for Declarative Generative UI (A2UI — Dynamic Schema). Whenever a response would benefit from a rich visual — a dashboard, status report, KPI summary, card layout, info grid, a pie/donut chart of part-of-whole breakdowns, or a bar chart comparing values across categories — call `generate_a2ui` to draw it. Keep chat replies to one short sentence and let the UI do the talking.'

graph = create_agent(
    model=ChatOpenAI(model="gpt-5-mini"),
    tools=tools,
    middleware=[CopilotKitMiddleware()],
    system_prompt=SYSTEM_PROMPT,
)
