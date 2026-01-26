"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const streamableHttp_js_1 = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const express_1 = __importDefault(require("express"));
const notify_1 = __importDefault(require("./mcp/notify"));
const sse_js_1 = require("@modelcontextprotocol/sdk/server/sse.js");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const server = notify_1.default;
// Create Express application
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ((_a = process.env.ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(",")) || "*", //allowed origins
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// 在请求入口添加日志中间件
app.use((req, res, next) => {
    console.info(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
// Set up routes
app.post("/mcp", async (req, res) => {
    // Configure Streamable HTTP transport (sessionless)
    const transport = new streamableHttp_js_1.StreamableHTTPServerTransport({
        sessionIdGenerator: undefined, // Disable session management
    });
    try {
        console.log("Received MCP request:", req.body);
        await transport.handleRequest(req, res, req.body);
    }
    catch (error) {
        console.error("Error handling MCP request:", error);
        if (!res.headersSent) {
            res.status(500).json({
                jsonrpc: "2.0",
                error: {
                    code: -32603,
                    message: "Internal server error",
                },
                id: null,
            });
        }
    }
});
// 存储活跃连接
const transports = {
    streamable: {},
    sse: {},
};
app.get("/sse", async (req, res) => {
    console.info(`[${new Date().toISOString()}] [INFO] Received SSE message:`, {
        method: req.method,
        url: req.url,
        query: req.query,
        body: req.body,
        headers: req.headers,
    });
    // Create SSE transport for legacy clients
    const transport = new sse_js_1.SSEServerTransport("/messages", res);
    transports.sse[transport.sessionId] = transport;
    await server.connect(transport);
    res.on("close", () => {
        delete transports.sse[transport.sessionId];
    });
});
// Legacy message endpoint for older clients
app.post("/messages", async (req, res) => {
    console.info(`[${new Date().toISOString()}] [INFO] Received legacy message:`, {
        method: req.method,
        url: req.url,
        query: req.query,
        body: req.body,
        headers: req.headers,
    });
    const sessionId = req.query.sessionId;
    const transport = transports.sse[sessionId];
    if (transport) {
        await transport.handlePostMessage(req, res, req.body);
    }
    else {
        res.status(400).send("No transport found for sessionId");
    }
});
// 错误处理
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] [ERROR] ${req.method} ${req.url} -`, err.stack || err.message);
    res.status(500).json({
        jsonrpc: "2.0",
        error: {
            code: -32603,
            message: "Internal server error",
        },
        id: null,
    });
});
app.get("/mcp", async (req, res) => {
    res.writeHead(405).end(JSON.stringify({
        jsonrpc: "2.0",
        error: {
            code: -32000,
            message: "Method not allowed.",
        },
        id: null,
    }));
});
// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.info(`MCP Email Server listening on port ${PORT}`);
});
