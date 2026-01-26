"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const notify_1 = require("../tool/notify");
// 创建 MCP Server
const notifyServer = new mcp_js_1.McpServer({
    name: "NotifyServer",
    version: "0.0.1",
    capabilities: {
        tools: {},
    },
});
notifyServer.tool("notify", "send notification by email. The attachment function is not supported", notify_1.notifySchema.shape, async ({ method, to, content }) => {
    await (0, notify_1.sendNotification)({ method, to, content });
    return {
        content: [{ type: "text", text: "通知已发送" }],
    };
});
exports.default = notifyServer;
