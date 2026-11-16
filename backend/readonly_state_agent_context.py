# HARNESS: imports added (the Agent Read-Only Context page shows only the create_agent call, no imports).
from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from copilotkit import CopilotKitMiddleware

graph = create_agent(
    model=ChatOpenAI(reasoning_effort="none", model="gpt-6-luna"),
    tools=[],
    middleware=[CopilotKitMiddleware()],
    system_prompt=(
        "You are a helpful, concise assistant. The frontend may provide "
        "read-only context about the user (e.g. name, timezone, recent "
        "activity) via the `useAgentContext` hook. Always consult that "
        "context when it is relevant — address the user by name if known, "
        "respect their timezone when mentioning times, and reference "
        "recent activity when it helps you answer. Keep responses short."
    ),
)
