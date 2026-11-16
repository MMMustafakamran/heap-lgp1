# HARNESS: the Multimodal Attachments page gives no Python agent; plain create_agent + CopilotKitMiddleware
# (vision-capable model) so the attachment flow can be tested. Mirrors the JS harness "multimodal" graph.
from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from copilotkit import CopilotKitMiddleware

graph = create_agent(
    model=ChatOpenAI(reasoning_effort="none", model="gpt-6-luna"),
    tools=[],
    middleware=[CopilotKitMiddleware()],
    system_prompt="You are a helpful assistant. Describe any images or files the user attaches.",
)
