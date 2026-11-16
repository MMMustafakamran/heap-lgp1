# Doc: https://docs.copilotkit.ai/langgraph-python/quickstart ("Use an existing agent" -> Python -> FastAPI tab, main.py), verbatim
# except the two HARNESS lines in main() (file name and port).
import os

# [!code highlight:2]
from dotenv import load_dotenv
from ag_ui_langgraph import add_langgraph_fastapi_endpoint
from copilotkit import LangGraphAGUIAgent
from fastapi import FastAPI
from langgraph.graph import END, START, MessagesState, StateGraph
from langchain_core.messages import SystemMessage
from langchain_openai import ChatOpenAI
from langgraph.checkpoint.memory import MemorySaver
import uvicorn
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
graph = graph.compile(
  checkpointer=MemorySaver()
)

app = FastAPI()

# [!code highlight:9]
add_langgraph_fastapi_endpoint(
  app=app,
  agent=LangGraphAGUIAgent(
    name="sample_agent",
    description="An example agent to use as a starting point for your own agent.",
    graph=graph,
  ),
  path="/",
)

def main():
  """Run the uvicorn server."""
  uvicorn.run(
    "fastapi_main:app",  # HARNESS: doc "main:app"; backend/main.py is the LangSmith tab's graph, so this file has its own name
    host="0.0.0.0",
    port=8082,  # HARNESS: doc 8123 (port plan: 8081 langgraph dev, 8082 FastAPI)
    reload=True,
  )

if __name__ == "__main__":
  main()
