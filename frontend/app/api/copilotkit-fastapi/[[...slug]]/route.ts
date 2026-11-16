// Doc: https://docs.copilotkit.ai/langgraph-python/quickstart ("Use an existing agent", runtime route, FastAPI tab).
// DOC CALLOUT "Running without the Intelligence Platform?": intelligence + identifyUser dropped (as in the main route).
import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
// [!code highlight]
import { HttpAgent } from "@ag-ui/client";

const runtime = new CopilotRuntime({
  agents: {
    // [!code highlight:3]
    sample_agent: new HttpAgent({
      // HARNESS: doc `process.env.LANGGRAPH_DEPLOYMENT_URL || "http://localhost:8123"`. In this repo
      // LANGGRAPH_DEPLOYMENT_URL points at the LangSmith-tab server (8081); the FastAPI main.py runs on 8082.
      url:  process.env.FASTAPI_AGENT_URL || "http://localhost:8082",
    }),
  },
});

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-fastapi", // HARNESS: own path (doc: "/api/copilotkit")
});

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;
