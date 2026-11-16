# Doc: https://docs.copilotkit.ai/langgraph-python/guardrails, agent.py ("Start with the built-in PII
# middleware"), verbatim, plus the page's "Ordering against CopilotKitMiddleware" list in front of it.
from langchain_openai import ChatOpenAI
from langchain.agents import create_agent
from langchain.agents.middleware import PIIMiddleware
from copilotkit import CopilotKitMiddleware

from guardrails import InputFirewall, OutputFirewall  # HARNESS: the ordering snippet uses these from guardrails.py

agent = create_agent(
    model=ChatOpenAI(model="gpt-6-luna", reasoning_effort="none"),
    tools=[],  # HARNESS: doc `tools=[...]` (placeholder; a literal Ellipsis raises "ValueError: The first argument must be a string or a callable")
    middleware=[
        InputFirewall(),        # outermost: screens before anything else runs  (doc ordering snippet)
        OutputFirewall(),       # sees the final response last                  (doc ordering snippet)
        # Redact emails the user sends in.
        PIIMiddleware("email", strategy="redact"),
        # Mask card numbers wherever they appear, including in tool results.
        PIIMiddleware(
            "credit_card",
            strategy="mask",
            apply_to_output=True,
            apply_to_tool_results=True,
        ),
        # Refuse outright if an API key shows up.
        PIIMiddleware("api_key", detector=r"sk-[a-zA-Z0-9]{32}", strategy="block"),
        CopilotKitMiddleware(),
    ],
)

graph = agent  # HARNESS: langgraph.json entry name
