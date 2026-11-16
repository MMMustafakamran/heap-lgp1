import json # [!code highlight]

from langchain_core.runnables import RunnableConfig
from langchain_core.messages import SystemMessage
from langchain_openai import ChatOpenAI
from copilotkit import CopilotKitState

# add the agent state definition from the previous step
class AgentState(CopilotKitState):
    # ... Your defined state properties

def chat_node(state: AgentState, config: RunnableConfig):
    # Extract the colleagues from CopilotKit context
    colleagues_context_item = next(
        (item for item in state["copilotkit"]["context"] if item.get("description") == "The current user's colleagues"),
        None
    )

    # The value is a JSON string, so parse it to read the fields
    colleagues = []
    if colleagues_context_item:
        colleagues = json.loads(colleagues_context_item["value"])

    # Now each entry is a dict, so colleague["name"] works
    colleague_list = ", ".join(f"{c['name']} ({c['role']})" for c in colleagues)

    # Provide the list of colleagues to the LLM
    system_message = SystemMessage(
        content=f"""You are a helpful assistant that can help emailing colleagues.
        The user's colleagues are: {colleague_list}"""
    )

    response = ChatOpenAI(model="gpt-6-luna", reasoning_effort="none").invoke(
        [system_message, *state["messages"]],
        config
    )

    return {
        **state,
        "messages": response,
    }
