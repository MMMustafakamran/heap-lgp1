"use client"; // [!code highlight]
// Doc: quickstart app/page.tsx (verbatim body) + app/providers.tsx provider, FastAPI tab.
// HARNESS: the root layout's provider points at the LangSmith-tab runtime (/api/copilotkit); this route
// wraps the same doc page in the doc's provider pointed at the FastAPI-tab runtime instead.

import { CopilotKitProvider } from "@copilotkit/react-core/v2";
import { CopilotSidebar } from "@copilotkit/react-core/v2"; // [!code highlight:1]

export default function Page() {
  return (
    // HARNESS: runtimeUrl "/api/copilotkit-fastapi" (doc: "/api/copilotkit")
    <CopilotKitProvider runtimeUrl="/api/copilotkit-fastapi" agentId="sample_agent" useSingleEndpoint={false}>
      <main>
        <h1>Your App</h1>
        {/* [!code highlight:1] */}
        <CopilotSidebar />
      </main>
    </CopilotKitProvider>
  );
}
