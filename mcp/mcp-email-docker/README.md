[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/fantasy-lotus-mcp-email-docker-badge.png)](https://mseep.ai/app/fantasy-lotus-mcp-email-docker)

# mcp-email-docker

基于 [Model Context Protocol (MCP)](https://github.com/modelcontext/modelcontextprotocol) 的邮件通知服务，支持通过Streamable HTTP， SSE（Server-Sent Events）与客户端通信，并通过 SMTP 服务发送通知邮件。已支持 Docker 镜像部署。
本项目也适合作为新手上手学习MCP Server的学习项目

---

## 功能特性

- 支持接入MCP Client通过 MCP 协议发送邮件或其他通知
- ⭐️ 兼容旧SSE和新Streamable HTTP协议
- ⭐️ 支持 Docker 一键部署到remote or local，通过Http而不是Stdio通信
  - Dockerfile使用多阶段构建以及slim nodejs环境降低image打包大小

---

## 目录结构

```
.
├── package.json        # 项目依赖与脚本
├── Dockerfile          # Docker 镜像构建文件
├──.dockerignore        # Docker build忽略设置
├── tsconfig.json       # TypeScript 配置
├── src/
│   ├── index.ts        # 服务器入口
│   ├── mcp/
│   │   └── notify.ts   # MCP 通知服务实现
│   └── tool/
│       └── notify.ts   # 邮件发送工具
└── .env.example        # 环境变量示例
```

---

## 快速开始

### 1. 安装依赖

```sh
npm install
```

### 2. 配置环境变量

在项目根目录下创建 `.env` 文件，内容示例：

```
SMTP_USER=你的邮箱账号
SMTP_PASS=你的邮箱SMTP授权码
SMTP_SERVICE=
SMTP_HOST
PORT=
```

### 3. 本地开发启动

```sh
npm run build
npm start
```

或直接用 ts-node：

```sh
npx ts-node src/index.ts
```

---

## Docker 部署

### 1. 构建镜像

```sh
docker build -t yourname/mcp-email-docker .
```

### 2. 运行容器

```sh
docker run -p 8080:8080 \
  -e SMTP_USER=你的邮箱账号 \
  -e SMTP_PASS=你的邮箱SMTP授权码 \
  -e SMTP_SERVICE=QQ \
  -e SMTP_HOST=smtp.qq.com \
  yourname/mcp-email-docker
```

或使用 `.env` 文件：

```sh
docker run --env-file .env -p 8080:8080 yourname/mcp-email-docker
```

---
## API 说明

- `GET /sse`  
  建立 SSE 连接，用于实时消息推送。

- `POST /messages?sessionId=xxx`  
  客户端发送消息接口，需携带 `sessionId`。

- `POST /mcp`  
  通过 Streamable HTTP协议连接mcp server

---

## MCP 邮件通知参数

- `method`：通知方式，目前仅基于nodemailer实现 `"email"`
- `to`：收件人邮箱
- `content`：邮件内容

---

## 依赖

- [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk)
- [nodemailer](https://nodemailer.com/about/)
- [zod](https://zod.dev/)
- [dotenv](https://github.com/motdotla/dotenv)
- [express](https://expressjs.com/)

---

## License

MIT
