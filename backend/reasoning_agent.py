# HARNESS: the Reasoning / Reasoning Messages pages give no Python agent; mirrors the JS harness
# reasoning-agent.ts (reasoning model via the Responses API so reasoning events stream).
from langchain_core.messages import SystemMessage
from langchain_core.runnables import RunnableConfig
from langchain_openai import ChatOpenAI
from langgraph.graph import START, END, MessagesState, StateGraph

SYSTEM_PROMPT = (
    "You are a helpful assistant. For each user question, first think "
    "step-by-step about the approach, then give a concise answer."
)


async def chat_node(state: MessagesState, config: RunnableConfig):
    model = ChatOpenAI(
        model="gpt-6-luna",
        use_responses_api=True,
        reasoning={"effort": "low", "summary": "auto"},
    )
    response = await model.ainvoke([SystemMessage(content=SYSTEM_PROMPT), *state["messages"]], config)
    return {"messages": response}


graph = StateGraph(MessagesState)
graph.add_node("chat_node", chat_node)
graph.add_edge(START, "chat_node")
graph.add_edge("chat_node", END)
graph = graph.compile()
