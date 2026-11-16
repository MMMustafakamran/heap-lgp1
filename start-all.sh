#!/usr/bin/env bash
# HARNESS: starts LangGraph-Python React on its harness ports (never 3000/8000).
#   8081 LangGraph Python API server (`langgraph dev`, LangSmith tab) serving every graph in backend/langgraph.json
#   8082 FastAPI agent (quickstart FastAPI tab, backend/fastapi_main.py; doc port 8123)
#   3080 Next.js frontend; Copilot Runtime at /api/copilotkit
# The doc pins 8123; the harness uses the doc's own override LANGGRAPH_DEPLOYMENT_URL in frontend/.env.local.
cd "$(dirname "$0")"
mkdir -p logs
# HARNESS: on Windows, langgraph dev's colored log renderer needs colorama (SystemError otherwise); Linux/CI does not.
WITH=; case "$(uname -s)" in MINGW*|MSYS*|CYGWIN*) WITH="--with colorama" ;; esac
(cd backend && uv run $WITH langgraph dev --port 8081 --no-browser > ../logs/agent.log 2>&1) &
(cd backend && uv run fastapi_main.py > ../logs/fastapi.log 2>&1) &  # HARNESS: doc `uv run main.py` (8123)
(cd frontend && npm run dev > ../logs/frontend.log 2>&1) &
wait
