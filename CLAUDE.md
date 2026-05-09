# IFE Game Channel - 开发指南

## 项目概述

机载 Wi-Fi Portal 游戏频道系统。前端 Vue 3 + Vite SPA，后端 TypeScript Node.js。
设计用于飞机离线局域网部署，单 Docker 容器（Nginx + PM2 + SQLite）。

## 代码结构

- `src/` — 前端 Vue 3 SPA，hash 路由，纯静态展示（暂无后端对接）
- `server/src/module-b/` — REST API，纯 Node.js HTTP（无框架），端口 3000
- `server/src/module-c/` — WebSocket 联机引擎，Socket.IO，端口 3001
- `server/src/module-c/plugins/` — 游戏插件（gobang 五子棋、doudizhu 斗地主）
- `server/src/sdk/` — 客户端 SDK，封装 socket.io-client
- `server/config/points.json` — 积分规则配置
- `docs/` — 全部设计文档（中文）

## 开发命令

```bash
# 前端
npm run dev          # Vite dev server :5173
npm run build        # 构建到 dist/

# 后端
cd server
npm run dev          # tsx watch，API:3000 + WS:3001
npm test             # node --test 运行全部测试
npm run build        # tsc 编译
```

## 鉴权桩（开发态）

- REST: `Authorization: Bearer dev_<userId>`
- WebSocket 握手: `{ "playerId": "<userId>", "token": "dev_<userId>" }`

## 关键架构决策

- 后端无框架，纯 Node.js HTTP + Socket.IO
- 所有数据内存存储（InMemoryMap），生产需换 SQLite
- 游戏插件通过 `GameLogicPlugin` 接口扩展，支持 server-authoritative 和 server-validation 两种模式
- 前端目前纯静态，需接入 SDK 实现联机功能
- 房间状态机: WAITING → PLAYING → SETTLED → DISMISSED
- 积分三重封顶: 单局 200、单日 500、单航班 1200

## 约定

- 中文注释和文档
- 服务端测试使用 `node --test` 内置测试框架
- 响应式断点: 0-655px / 656-979px / 980-1303px / 1304px+
