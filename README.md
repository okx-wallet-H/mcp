# OKX MCP Console v2.0

OKX 全生态 360° MCP 原生统一控制台

## 架构

```
外部 AI (Cline) ←→ MCP Protocol ←→ mcp-core (统一 Server)
                                        ├─ Plugin Manager (CEX/Onchain/Outcomes)
                                        ├─ AI Agent Runtime (监控/执行/维护)
                                        ├─ Memory Engine (对话记忆/偏好)
                                        ├─ Knowledge Base (文档搜索/工具目录)
                                        └─ SSE/WS Gateway (实时数据)
                                              ↕
                                         Dashboard (Web UI)
                                         10 页面 · OKX 暗色主题
```

## 快速开始

```bash
# 安装依赖
npm install

# 启动 Dashboard (端口 3000)
cd packages/dashboard && npm run dev

# 启动 MCP Core Server (可选)
cd packages/mcp-core && npx tsx src/server.ts
```

## 页面

| 路由 | 功能 | 数据来源 |
|------|------|----------|
| `/` | 首页全景 | OKX API |
| `/mcp` | 中控台 | — |
| `/mcp/cex` | CEX 交易中心 | OKX 实时行情 + recharts K线 |
| `/mcp/onchain` | Onchain OS | 12 模块 |
| `/mcp/outcomes` | 预测市场 | — |
| `/mcp/signals` | 信号策略 | — |
| `/mcp/kb` | 知识库 | 50+ 工具目录 |
| `/mcp/collab` | 通讯站 | WS 协作 |
| `/mcp/plugins` | Plugin Manager | MCP Core |
| `/mcp/agent` | AI Agent | Task Runtime |

## 技术栈

- **Frontend**: Next.js 14 · React 18 · Tailwind CSS · shadcn/ui · recharts
- **Backend**: MCP SDK v1.x · WebSocket · SSE · HMAC-SHA256
- **Deploy**: Docker · Node.js 20

## 环境变量

复制 `.env.example` 为 `.env.local` 并填写：

```env
OKX_API_KEY=your_key
OKX_SECRET_KEY=your_secret
OKX_PASSPHRASE=your_passphrase
OKX_IS_DEMO=true
```

## Docker

```bash
cd packages/dashboard
docker build -t okx-mcp-console .
docker run -p 3000:3000 okx-mcp-console
```

## License

Private
