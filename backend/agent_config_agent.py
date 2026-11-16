# Doc: https://docs.copilotkit.ai/langgraph-python/agent-config ("Wire CopilotKit middleware into your graph"),
# verbatim between the HARNESS lines.
from langchain.agents import create_agent  # HARNESS: snippet has no imports
from langchain_openai import ChatOpenAI  # HARNESS
from copilotkit import CopilotKitMiddleware  # HARNESS
# HARNESS: SYSTEM_PROMPT is never defined on the page ("see src/agents/agent_config_agent.py ... in the showcase").
SYSTEM_PROMPT = "You are a helpful assistant. Follow the 'Agent response preferences' context (tone, expertise, responseLength) on every turn."  # HARNESS

graph = create_agent(
    model=ChatOpenAI(reasoning_effort="none", model="gpt-6-luna", temperature=0.4),
    tools=[],
    middleware=[CopilotKitMiddleware()],
    system_prompt=SYSTEM_PROMPT,
)
