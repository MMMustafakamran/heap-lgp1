"use client";
// HARNESS: the Guardrails page is backend-only (no frontend code). A plain chat on the guardrails graph
// (backend/guardrails_agent.py) so the middleware can be exercised.
import { CopilotKit, CopilotChat } from "@copilotkit/react-core/v2";

export default function Page() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent="guardrails">
      <div style={{ height: "100vh" }}>
        <CopilotChat agentId="guardrails" />
      </div>
    </CopilotKit>
  );
}
