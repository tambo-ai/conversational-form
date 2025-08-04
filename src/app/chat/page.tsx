"use client";
import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";
import { TamboMcpProvider } from "@tambo-ai/react/mcp";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";

export default function Home() {

  // Load MCP server configurations
  const mcpServers = useMcpServers();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TamboProvider
        apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
        components={components}
        tools={tools}
      >
        <TamboMcpProvider mcpServers={mcpServers}>
          <div className="w-full max-w-4xl mx-auto">
            <MessageThreadFull contextKey="tambo-template" />
          </div>
        </TamboMcpProvider>
      </TamboProvider>
    </div>
  );
}
