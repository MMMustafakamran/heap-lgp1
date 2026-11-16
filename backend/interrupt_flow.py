# Doc: https://docs.copilotkit.ai/langgraph-python/human-in-the-loop/interrupt-flow, Python tab "agent.py" (step 3), verbatim (dedented).
from langchain_core.runnables import RunnableConfig
from langgraph.types import interrupt # [!code highlight]
from langchain_core.messages import SystemMessage
from langchain_openai import ChatOpenAI
from copilotkit import CopilotKitState

# add the agent state definition from the previous step
class AgentState(CopilotKitState):
    agent_name: str

def chat_node(state: AgentState, config: RunnableConfig):
    if not state.get("agent_name"):
        # Interrupt and wait for the user to respond with a name
        state["agent_name"] = interrupt("Before we start, what would you like to call me?") # [!code highlight]

    # Tell the agent its name
    system_message = SystemMessage(
        content=f"You are a helpful assistant named {state.get('agent_name')}..."
    )

    response = ChatOpenAI(model="gpt-6-luna", reasoning_effort="none").invoke(
        [system_message, *state["messages"]],
        config
    )

    return {
        **state,
        "messages": response,
    }

# HARNESS: the page never builds or compiles a graph. Minimal wiring so langgraph.json can load it
# (same as the JS harness's interrupt-flow.ts).
from langgraph.graph import START, END, StateGraph

graph = (
    StateGraph(AgentState)
    .add_node("chat_node", chat_node)
    .add_edge(START, "chat_node")
    .add_edge("chat_node", END)
    .compile()
)
