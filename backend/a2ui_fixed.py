# Doc: generative-ui/a2ui/fixed-schema. Block 1 (src/agents/a2ui_fixed.py) + block 2 ("agent.py (LangGraph StateGraph form)"), verbatim, concatenated.
# HARNESS: a2ui_schemas/flight_schema.json is not shown on the page; copied from the JS harness (showcase).
# src/agents/a2ui_fixed.py
from __future__ import annotations

from pathlib import Path
from typing import TypedDict

from copilotkit import CopilotKitMiddleware, a2ui
from langchain.agents import create_agent
from langchain.tools import tool
from langchain_openai import ChatOpenAI

CATALOG_ID = "copilotkit://flight-fixed-catalog"
SURFACE_ID = "flight-fixed-schema"

_SCHEMAS_DIR = Path(__file__).parent / "a2ui_schemas"

# The schema is JSON so it can be authored and reviewed independently of the
# Python code. `a2ui.load_schema` is just a thin `json.load` wrapper.
FLIGHT_SCHEMA = a2ui.load_schema(_SCHEMAS_DIR / "flight_schema.json")


class Flight(TypedDict):
    """Shape the LLM should fill in when calling `display_flight`.

    LangGraph serializes this TypedDict into the tool's JSON schema, so
    defining it narrowly is how we steer the LLM to produce data that fits
    the frontend `FlightCard` component's props.
    """

    origin: str
    destination: str
    airline: str
    price: str


@tool
def display_flight(origin: str, destination: str, airline: str, price: str) -> str:
    """Show a flight card for the given trip.

    Use short airport codes (e.g. "SFO", "JFK") for origin/destination and a
    price string like "$289".

    After this tool returns, the flight card is already rendered to the user
    via the A2UI surface — the JSON returned here is the surface descriptor
    the renderer consumes, NOT a status code. Do NOT call this tool again
    for the same flight (the user already sees the card). Reply with one
    short confirmation sentence and stop.
    """
    # The A2UI middleware detects the `a2ui_operations` container in this
    # tool result and forwards the ops to the frontend renderer. The frontend
    # catalog resolves component names to the local React components.
    #
    # Note: schema-swap-on-action (e.g. swapping to a "booked" schema when
    # the card's button is clicked) will be added once the Python SDK
    # exposes `action_handlers=` on `a2ui.render`.
    return a2ui.render(
        operations=[
            a2ui.create_surface(SURFACE_ID, catalog_id=CATALOG_ID),
            a2ui.update_components(SURFACE_ID, FLIGHT_SCHEMA),
            a2ui.update_data_model(
                SURFACE_ID,
                {
                    "origin": origin,
                    "destination": destination,
                    "airline": airline,
                    "price": price,
                },
            ),
        ],
    )


from langchain_openai import ChatOpenAI
from langgraph.graph import START, MessagesState, StateGraph
from langgraph.prebuilt import ToolNode, tools_condition

# `display_flight` is the tool defined above — unchanged.
model = ChatOpenAI(model="gpt-6-luna", reasoning_effort="none").bind_tools([display_flight])


def call_model(state: MessagesState):
    return {"messages": [model.invoke(state["messages"])]}


builder = StateGraph(MessagesState)
builder.add_node("call_model", call_model)
builder.add_node("tools", ToolNode([display_flight]))
builder.add_edge(START, "call_model")
builder.add_conditional_edges("call_model", tools_condition)
builder.add_edge("tools", "call_model")

# No `checkpointer=` — the LangGraph API server owns persistence and
# rejects a custom one. See the LangGraph quickstart for the FastAPI case,
# where you host the graph yourself and do need a checkpointer.
graph = builder.compile()
