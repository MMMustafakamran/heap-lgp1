# Doc: https://docs.copilotkit.ai/langgraph-python/guardrails, guardrails.py blocks (input, output, tool
# screening), verbatim. The page leaves screen_input / redact_sensitive / tool_call_allowed to the reader
# ("your classifier or rules", "your DLP pass", "your policy"); the HARNESS stubs below fill them.
import re
from types import SimpleNamespace

# --- HARNESS stubs (not on the page) ---
def screen_input(text: str):  # HARNESS: blocks an obvious prompt-injection phrase
    return SimpleNamespace(allowed="ignore previous instructions" not in text.lower())

def redact_sensitive(text: str) -> str:  # HARNESS: redacts US SSNs
    return re.sub(r"\b\d{3}-\d{2}-\d{4}\b", "[REDACTED_SSN]", text)

def tool_call_allowed(request) -> bool:  # HARNESS: allow everything (agent has no tools)
    return True
# --- end HARNESS ---

from typing import Any

from langchain.agents.middleware import AgentMiddleware, AgentState, hook_config
from langchain_core.messages import AIMessage, HumanMessage
from langgraph.runtime import Runtime


class InputFirewall(AgentMiddleware):
    """Rejects user input that fails policy before it reaches the model."""

    def __init__(self, *, refusal: str = "I can't help with that request."):
        super().__init__()
        self.refusal = refusal

    # can_jump_to declares the edge; without it, "jump_to" is ignored.
    @hook_config(can_jump_to=["end"])
    def before_model(
        self, state: AgentState, runtime: Runtime[Any]
    ) -> dict[str, Any] | None:
        messages = state.get("messages", [])
        latest = next(
            (m for m in reversed(messages) if isinstance(m, HumanMessage)), None
        )
        if latest is None:
            return None

        verdict = screen_input(str(latest.content))  # your classifier or rules
        if not verdict.allowed:
            # Ending with an AIMessage means the user sees the refusal in chat
            # rather than an error toast.
            return {
                "jump_to": "end",
                "messages": [AIMessage(content=self.refusal)],
            }

        return None

from dataclasses import replace
from typing import Awaitable, Callable

from langchain.agents.middleware import (
    AgentMiddleware,
    ModelRequest,
    ModelResponse,
)
from langchain_core.messages import AIMessage


class OutputFirewall(AgentMiddleware):
    """Scrubs or blocks model output before it leaves the agent."""

    def wrap_model_call(
        self,
        request: ModelRequest,
        handler: Callable[[ModelRequest], ModelResponse],
    ) -> ModelResponse:
        response = handler(request)

        scrubbed = []
        for message in response.result:
            if isinstance(message, AIMessage) and isinstance(message.content, str):
                clean = redact_sensitive(message.content)  # your DLP pass
                if clean != message.content:
                    message = message.model_copy(update={"content": clean})
            scrubbed.append(message)

        return replace(response, result=scrubbed)

    async def awrap_model_call(
        self,
        request: ModelRequest,
        handler: Callable[[ModelRequest], Awaitable[ModelResponse]],
    ) -> ModelResponse:
        response = await handler(request)
        # ...same scrubbing as above
        return response

from langgraph.types import Command
from langchain_core.messages import ToolMessage
from langchain.agents.middleware import ToolCallRequest


class ToolFirewall(AgentMiddleware):
    def wrap_tool_call(
        self,
        request: ToolCallRequest,
        handler: Callable[[ToolCallRequest], ToolMessage | Command],
    ) -> ToolMessage | Command:
        if not tool_call_allowed(request):  # your policy
            return ToolMessage(
                content="This action is not permitted.",
                tool_call_id=request.tool_call["id"],
            )
        return handler(request)
