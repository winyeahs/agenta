import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { Request, Response, NextFunction } from "express";
import notifyServer from "./mcp/notify";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();
const server = notifyServer;
// Create Express application
const app = express();
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*", //allowed origins
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 在请求入口添加日志中间件
app.use((req, res, next) => {
  console.info(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Set up routes
app.post("/mcp", async (req, res) => {
  // Configure Streamable HTTP transport (sessionless)
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // Disable session management
  });

  try {
    console.log("Received MCP request:", req.body);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
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
  streamable: {} as Record<string, StreamableHTTPServerTransport>,
  sse: {} as Record<string, SSEServerTransport>,
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
  const transport = new SSEServerTransport("/messages", res);
  transports.sse[transport.sessionId] = transport;

  await server.connect(transport);
  res.on("close", () => {
    delete transports.sse[transport.sessionId];
  });
});

// Legacy message endpoint for older clients
app.post("/messages", async (req, res) => {
  console.info(
    `[${new Date().toISOString()}] [INFO] Received legacy message:`,
    {
      method: req.method,
      url: req.url,
      query: req.query,
      body: req.body,
      headers: req.headers,
    }
  );
  const sessionId = req.query.sessionId as string;
  const transport = transports.sse[sessionId];
  if (transport) {
    await transport.handlePostMessage(req, res, req.body);
  } else {
    res.status(400).send("No transport found for sessionId");
  }
});

// 错误处理
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(
    `[${new Date().toISOString()}] [ERROR] ${req.method} ${req.url} -`,
    err.stack || err.message
  );
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
  res.writeHead(405).end(
    JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed.",
      },
      id: null,
    })
  );
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.info(`MCP Email Server listening on port ${PORT}`);
});
