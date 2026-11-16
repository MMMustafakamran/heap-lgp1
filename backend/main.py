from dotenv import load_dotenv
from langchain_core.messages import SystemMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import END, START, MessagesState, StateGraph

load_dotenv()


async def mock_llm(state: MessagesState):
  model = ChatOpenAI(model="gpt-6-luna", reasoning_effort="none")
  system_message = SystemMessage(content="You are a helpful assistant.")
  response = await model.ainvoke(
    [
      system_message,
      *state["messages"],
    ]
  )
  return {"messages": response}


graph = StateGraph(MessagesState)
graph.add_node(mock_llm)
graph.add_edge(START, "mock_llm")
graph.add_edge("mock_llm", END)
graph = graph.compile()
