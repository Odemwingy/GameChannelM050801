# IFE Game Channel - Wi-Fi Portal 游戏频道

机载 Wi-Fi Portal 游戏频道系统，包含前端页面和联机服务后端，适用于飞机离线局域网部署。

## 项目结构

```
GameChannelM050801/
├── src/                    # 前端源码 (Vue 3 + Vite)
│   ├── App.vue             # 轻量 hash 路由
│   ├── components/         # 页面组件
│   ├── composables/        # Vue composables (useAuth, useMultiplayer)
│   ├── data/games.js       # 游戏列表数据
│   ├── styles.css          # 全局样式与响应式断点
│   └── utils/              # 工具函数 (API, WebSocket, 指纹)
├── public/assets/source/   # 离线图片资源 (494 张)
├── server/                 # 联机服务 (TypeScript + Node.js)
│   ├── src/module-b/       # 模块 B: REST API (用户、房间、航班管理)
│   ├── src/module-c/       # 模块 C: WebSocket 联机引擎 (Gateway + RoomEngine + Plugin)
│   ├── src/sdk/            # 客户端 SDK
│   └── config/points.json  # 积分规则配置
├── Dockerfile              # 多阶段 Docker 构建
├── nginx.conf              # Nginx 配置
├── ecosystem.config.cjs    # PM2 进程管理
├── docs/                   # 项目设计文档
└── scripts/                # 工具脚本
```

## 快速开始

### 前端

```bash
npm install
npm run dev     # 开发服务器 http://localhost:5173
npm run build   # 构建产物输出到 dist/
```

### 联机服务

```bash
cd server
npm install
npm run dev     # 启动 API (3000) + WebSocket Gateway (3001)
npm test        # 运行测试
npm run build   # 编译 TypeScript
```

## 系统模块

| 模块 | 说明 | 状态 |
|------|------|------|
| 前端 Portal | 游戏列表、详情、搜索、分类筛选、响应式布局 | 已完成 |
| 模块 B: REST API | 用户注册、房间管理、航班生命周期、积分系统 | 已完成 |
| 模块 C: 联机引擎 | WebSocket Gateway + 房间状态机 + 游戏插件架构 | 已完成 |
| 模块 D: 积分系统 | 三重封顶、幂等结算、审计日志 | 已完成 |
| 前后端联调 | 前端对接 REST API 和 WebSocket，五子棋+斗地主联机 | 已完成 |
| Docker 部署 | Nginx + PM2 单容器方案 | 已完成 |

## Docker 部署

```bash
docker build -t game-channel .
docker run -p 80:80 game-channel
```

单容器内运行 Nginx (静态文件 + API/WebSocket 代理) + Node.js 服务。

## 响应式断点

- `0-655px`: small (移动端)
- `656-979px`: medium (平板)
- `980-1303px`: large (桌面)
- `1304px+`: xlarge (大屏)

## 设计文档

详细技术设计见 [docs/](docs/) 目录：
- [架构总览](docs/01-架构总览.md)
- [联机引擎设计](docs/02-模块设计/联机引擎.md)
- [积分系统设计](docs/02-模块设计/积分系统.md)
- [会员同步设计](docs/02-模块设计/会员同步.md)
- [完整技术方案](docs/IFE游戏频道_技术设计方案.md)
- [联机模块详细设计](docs/联机游戏模块_详细设计.md)
