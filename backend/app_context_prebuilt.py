# Doc: https://docs.copilotkit.ai/langgraph-python/agent-app-context ("Prebuilt agent" > "Consume the data
# in your LangGraph agent", Python tab), verbatim. Served by `langgraph dev`, so the FastAPI step is skipped
# (the page says to skip it when deploying with LangSmith).
from langchain_openai import ChatOpenAI
from langchain.agents import create_agent
from copilotkit import CopilotKitMiddleware, CopilotKitState # [!code highlight]

graph = create_agent( # create_agent supersedes the deprecated create_react_agent, which accepts neither middleware= nor system_prompt=
    model=ChatOpenAI(model="gpt-6-luna", reasoning_effort="none"),
    tools=[],  # Backend tools go here
    middleware=[CopilotKitMiddleware()], # [!code highlight]
    system_prompt="You are a helpful assistant.",
    state_schema=CopilotKitState # [!code highlight]
)
