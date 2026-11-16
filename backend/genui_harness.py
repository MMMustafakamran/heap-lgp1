# HARNESS: not from any doc page. Components pages say "Your agent must pass the run's tools and context to its model"; no Python agent is given. CopilotKitMiddleware does exactly that.
# Mirrors the JS harness graph (agent/src/showcase) with the Python doc pattern
# (create_agent + CopilotKitMiddleware, which forwards the frontend tools and context).
from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from copilotkit import CopilotKitMiddleware

SYSTEM_PROMPT = 'You are a helpful assistant.'

graph = create_agent(
    model=ChatOpenAI(model="gpt-5-mini"),
    tools=[],
    middleware=[CopilotKitMiddleware()],
    system_prompt=SYSTEM_PROMPT,
)
