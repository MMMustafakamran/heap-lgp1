# HARNESS: the prebuilt-components / look-and-feel / voice pages (<CopilotKit agent="...">) give no Python
# agent code; a plain chat agent (same shape as the Frontend Tools page's create_agent + CopilotKitMiddleware)
# so the frontend pages can be reached. Mirrors the JS harness's "starterAgent".
from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from copilotkit import CopilotKitMiddleware

graph = create_agent(
    model=ChatOpenAI(reasoning_effort="none", model="gpt-6-luna"),
    tools=[],
    middleware=[CopilotKitMiddleware()],
    system_prompt="You are a helpful, concise assistant.",
)
