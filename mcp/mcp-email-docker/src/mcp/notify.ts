import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { notifySchema, sendNotification } from "../tool/notify";

// 创建 MCP Server
const notifyServer = new McpServer({
  name: "NotifyServer",
  version: "0.0.1",
  capabilities: {
    tools: {},
  },
});

notifyServer.tool(
  "notify",
  "send notification by email. The attachment function is not supported",
  notifySchema.shape,
  async ({ method, to, content }) => {
    await sendNotification({ method, to, content });
    return {
      content: [{ type: "text", text: "通知已发送" }],
    };
  }
);

export default notifyServer;
