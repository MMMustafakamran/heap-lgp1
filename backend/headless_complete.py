# HARNESS: the Headless UI page gives no Python agent; mirrors the JS harness headless-complete.ts
# (mock get_weather / get_stock_price / get_revenue_chart backend tools + frontend tools via middleware).
import json
from langchain.agents import create_agent
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from copilotkit import CopilotKitMiddleware

SYSTEM_PROMPT = """You are a helpful, concise assistant wired into a headless chat surface.
  - If the user asks about weather for a place, call get_weather with the location.
  - If the user asks about a stock or ticker, call get_stock_price with the ticker.
  - If the user asks for a chart of revenue or metrics, call get_revenue_chart.
  - If the user asks you to highlight a short note, call the frontend highlight_note tool with the text and a color (yellow, pink, green, or blue).
  - Otherwise, reply in plain text.
After a tool returns, write one short sentence summarizing the result."""


@tool
def get_weather(location: str) -> str:
    """Get the current weather for a given location (mock)."""
    return json.dumps({"city": location, "temperature": 68, "humidity": 55, "wind_speed": 10, "conditions": "Sunny"})


@tool
def get_stock_price(ticker: str) -> str:
    """Get a mock current price for a stock ticker."""
    return json.dumps({"ticker": ticker.upper(), "price_usd": 189.42, "change_pct": 1.27})


@tool
def get_revenue_chart() -> str:
    """Get a mock six-month revenue series for a chart visualization."""
    data = [{"label": m, "value": v} for m, v in zip(["Jan", "Feb", "Mar", "Apr", "May", "Jun"], [38, 47, 52, 49, 63, 71])]
    return json.dumps({"title": "Quarterly revenue", "subtitle": "Last six months · USD thousands", "data": data})


graph = create_agent(
    model=ChatOpenAI(reasoning_effort="none", model="gpt-6-luna"),
    tools=[get_weather, get_stock_price, get_revenue_chart],
    middleware=[CopilotKitMiddleware()],
    system_prompt=SYSTEM_PROMPT,
)
