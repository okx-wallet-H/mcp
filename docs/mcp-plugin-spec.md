# Hvip-One MCP Plugin Spec

> 给其他团队 — 如何开发一个接入中控台的 MCP Server

## 1. 协议

**MCP (Model Context Protocol)** — JSON-RPC 2.0

| 传输方式 | 说明 |
|----------|------|
| **stdio** | Node.js child_process，推荐 |
| **SSE** | HTTP Server-Sent Events |

## 2. 必须实现的 3 个方法

### initialize
```json
// 请求
{ "jsonrpc": "2.0", "id": 1, "method": "initialize", "params": { "protocolVersion": "2024-11-05", "capabilities": {} } }

// 响应
{ "jsonrpc": "2.0", "id": 1, "result": { "protocolVersion": "2024-11-05", "serverInfo": { "name": "okx-onchain", "version": "1.0.0" }, "capabilities": { "tools": {} } } }
```

### tools/list
```json
// 请求
{ "jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {} }

// 响应
{ "jsonrpc": "2.0", "id": 2, "result": { "tools": [
  { "name": "okx_get_ticker", "description": "获取行情", "inputSchema": { "type": "object", "properties": { "instId": { "type": "string" } }, "required": ["instId"] } }
] } }
```

### tools/call
```json
// 请求
{ "jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": { "name": "okx_get_ticker", "arguments": { "instId": "BTC-USDT" } } }

// 响应
{ "jsonrpc": "2.0", "id": 3, "result": { "content": [{ "type": "text", "text": "{\"instId\":\"BTC-USDT\",\"last\":63773}" }] } }
```

## 3. NPM 包示例

```bash
npm init -y
npm i @modelcontextprotocol/sdk
```

```ts
// index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({ name: "okx-onchain", version: "1.0.0" }, { capabilities: { tools: {} } });

server.setRequestHandler("tools/list", async () => ({
  tools: [{ name: "your_tool", description: "...", inputSchema: { type: "object", properties: { param: { type: "string" } } } }]
}));

server.setRequestHandler("tools/call", async (req) => ({
  content: [{ type: "text", text: JSON.stringify({ result: "ok" }) }]
}));

new StdioServerTransport().pipe(server);
```

## 4. 接入中控台

把 NPM 包名告诉我就行，我在 `plugins/types.ts` 里加一行：

```ts
{ name: "你的模块", module: "自定义", transport: "stdio", endpoint: "npx your-pkg", autoStart: true }
```

## 5. 参考

| 项目 | 链接 |
|------|------|
| 中控台仓库 | https://github.com/okx-wallet-H/mcp |
| 现有 CEX 插件 | `hvip-mcp-server` (180 tools) |
| MCP 协议 | https://modelcontextprotocol.io |

---

**问题联系**: 在仓库提 Issue 或 PR
