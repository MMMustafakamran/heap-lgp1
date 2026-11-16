# Doc: https://docs.copilotkit.ai/langgraph-python/programmatic-control ("Wire CopilotKit middleware into
# your graph", Python), verbatim (rendered page; the .md export has no Python block).
from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from copilotkit import CopilotKitMiddleware

graph = create_agent(
    model=ChatOpenAI(reasoning_effort="none", model="gpt-6-luna"),
    tools=[],
    middleware=[CopilotKitMiddleware()],
    system_prompt="You are a helpful, concise assistant.",
)
