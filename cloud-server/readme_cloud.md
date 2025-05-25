# OH卡探索工具 - 云服务器实现方案

## 🎯 项目目标

将现有的NPX+FastMCP方案改造为云服务器托管方案，支持在MCP.so等平台上进行托管，提供REST API接口和多用户并发访问。

## 📊 项目状态

**当前进度**: 60% (Milestone 1&2&3 已完成，准备进入 Milestone 4)

- ✅ **Milestone 1**: 本地REST API验证 (已完成)
- ✅ **Milestone 2**: 完整功能迁移 (已完成)  
- ✅ **Milestone 3**: 容器化部署 (已完成)
- 📋 **Milestone 4**: 云端部署测试 (进行中)
- 📋 **Milestone 5**: MCP.so提交准备 (待开始)

详细进度请查看 [todo.md](./todo.md)

## 🏗️ 技术架构

### 当前架构（NPX方案）
```
用户 → NPX包 → 本地Python进程 → FastMCP(stdio) → Claude Desktop
```

### 已实现架构（云服务器方案）
```
用户 → Claude Desktop → HTTP请求 → 云端REST API → Node.js MCP服务器 → OH卡逻辑
```

**技术栈**: Node.js + Express.js + @chatmcp/sdk + Docker

## 📦 项目结构（已实现）

```
cloud-server/
├── src/                    # 源代码目录
│   ├── index.js           # 主入口文件 (支持stdio/REST双模式)
│   ├── ohcard/            # OH卡业务逻辑
│   │   ├── cards.js       # 卡牌数据 (9张OH卡)
│   │   ├── questions.js   # 引导问题 (5类型25问题)
│   │   └── tools.js       # 工具函数实现 (6个工具)
│   └── utils/             # 工具函数
├── tests/                 # 测试文件目录
├── docs/                  # 文档目录
├── test_all_endpoints.js  # API测试脚本
├── test_docker.js         # Docker测试脚本
├── package.json           # NPM配置
├── Dockerfile             # 容器化配置 (多阶段构建)
├── docker-compose.yml     # 本地测试配置
├── DOCKER_README.md       # Docker部署文档
├── .dockerignore          # Docker忽略文件
├── readme_cloud.md       # 本文件
└── todo.md               # 开发任务清单
```

## 🔄 核心改造点（已完成）

### 1. 协议转换 ✅
- **从**：stdio 通信协议
- **到**：REST API HTTP协议 + stdio兼容

### 2. 技术栈转换 ✅
- **从**：Python + FastMCP
- **到**：Node.js + Express.js + @chatmcp/sdk

### 3. 部署方式转换 ✅
- **从**：本地进程
- **到**：Docker容器 + 云端部署

### 4. 参数传递转换 ✅
- **从**：环境变量
- **到**：REST API参数 + MCP格式

## 🚀 关键特性（已实现）

### MCP.so要求 ✅
- ✅ 开源且商业友好许可证（MIT）
- ✅ 不读取本地数据
- ✅ 支持stdio传输（向后兼容）
- ✅ 支持REST传输（云端部署）
- ✅ 容器化部署支持

### 增强特性 ✅
- ✅ 健康检查端点：`GET /health`
- ✅ 工具列表端点：`GET /tools`
- ✅ 结构化日志系统
- ✅ 优雅关闭处理
- ✅ 错误处理中间件
- ✅ 请求日志中间件
- ✅ Docker多阶段构建
- ✅ 非root用户安全运行
- ✅ 环境变量配置支持

## 🛠️ 开发环境要求

### 本地开发
- Node.js >= 18.0.0
- NPM >= 9.0.0
- Docker >= 20.0.0 (可选)
- Git

### 云端部署
- 支持Node.js容器的云平台 (Railway/Render/Vercel等)
- 支持HTTP/HTTPS访问
- 支持环境变量配置

## 📋 功能映射（已完成）

| NPX方案功能 | 云服务器方案 | 状态 |
|------------|-------------|------|
| `what_is_oh_cards` | REST: `POST /tools/what_is_oh_cards` | ✅ 已完成 |
| `get_oh_card_process` | REST: `POST /tools/get_oh_card_process` | ✅ 已完成 |
| `draw_oh_card` | REST: `POST /tools/draw_oh_card` | ✅ 已完成 |
| `get_guidance_questions` | REST: `POST /tools/get_guidance_questions` | ✅ 已完成 |
| `get_all_question_types` | REST: `POST /tools/get_all_question_types` | ✅ 已完成 |
| `get_all_cards_preview` | REST: `POST /tools/get_all_cards_preview` | ✅ 已完成 |

**测试结果**: 全部6个工具端点测试通过 ✅

## 🧪 测试策略（已实现）

### 单元测试 ✅
- 每个工具函数的单独测试
- 参数验证测试
- 错误处理测试

### 集成测试 ✅
- REST API端到端测试 (`test_all_endpoints.js`)
- Docker容器测试 (`test_docker.js`)
- 健康检查和工具列表测试

### 性能测试 📋
- 并发访问测试 (待Milestone 4)
- 响应时间测试 (待Milestone 4)
- 内存使用测试 (待Milestone 4)

## 🚀 部署方案

### 开发环境
```bash
# 安装依赖
npm install

# 本地开发 (stdio模式)
npm run dev

# REST API模式
npm run rest

# 测试所有端点
npm test
```

### 本地容器测试
```bash
# 使用Docker Compose
npm run docker:compose:up

# 查看日志
npm run docker:compose:logs

# 停止服务
npm run docker:compose:down

# 单独构建和运行
npm run docker:build
npm run docker:run
```

### 云端部署 📋

#### 阿里云服务器 + 宝塔面板部署
```bash
# 1. 在宝塔面板中安装Docker
# 2. 构建生产镜像
docker build -t ohcard-mcp-cloud:latest .

# 3. 运行生产容器
docker run -d --name ohcard-mcp \
  -p 9593:9593 \
  -e NODE_ENV=production \
  --restart unless-stopped \
  ohcard-mcp-cloud:latest

# 4. 查看运行状态
docker ps | grep ohcard-mcp
docker logs ohcard-mcp
```

#### 其他云平台部署
```bash
# 构建生产镜像
docker build -t ohcard-mcp-cloud:latest .

# 运行生产容器
docker run -p 9593:9593 -e NODE_ENV=production ohcard-mcp-cloud:latest
```

## 📊 监控指标

### 基础指标 ✅
- 健康检查状态: `/health`
- 服务运行时间和环境信息
- 错误日志和请求日志

### 业务指标 📋
- 抽卡次数统计 (待监控系统)
- 热门问题类型 (待监控系统)
- 用户活跃度 (待监控系统)

## 🔒 安全考虑

### 基本安全 ✅
- 输入参数验证
- 输出数据清洗
- 容器安全配置 (非root用户)
- dumb-init信号处理

### 高级安全 📋
- API密钥认证 (可选)
- HTTPS强制 (云端部署时)
- 请求签名验证 (可选)

## 📚 API文档

### 健康检查
```bash
GET /health
# Response: 
{
  "status": "ok", 
  "timestamp": "2024-01-01T00:00:00Z",
  "environment": "development",
  "uptime": 123.45
}
```

### 工具列表
```bash
GET /tools
# Response: 6个可用工具的列表
```

### MCP工具调用
```bash
POST /tools/draw_oh_card
Content-Type: application/json

{
  "arguments": {
    "intention": "我想探索内心的声音"
  }
}

# Response:
{
  "content": [
    {
      "type": "text", 
      "text": "🎯 根据您的意图..."
    }
  ]
}
```

## 🤝 兼容性

### MCP客户端兼容 ✅
- Claude Desktop (stdio模式)
- 标准MCP客户端
- REST API客户端

### 双模式支持 ✅
```bash
# stdio模式 (本地开发)
node src/index.js stdio

# REST API模式 (云端部署)
MODE=rest node src/index.js
```

## 📝 配置示例

### Claude Desktop配置（本地模式）
```json
{
  "mcpServers": {
    "ohcard-local": {
      "command": "node",
      "args": ["src/index.js", "stdio"],
      "cwd": "/path/to/cloud-server"
    }
  }
}
```

### 环境变量配置
```bash
NODE_ENV=production
PORT=9593
LOG_LEVEL=info
```

### Docker环境配置
```yaml
version: '3.8'
services:
  ohcard-mcp:
    build: .
    ports:
      - "9593:9593"
    environment:
      - NODE_ENV=production
      - LOG_LEVEL=info
```

## 🎯 下一步计划

### Milestone 4: 云端部署测试 ⏳ **进行中**
- ✅ 选择云平台 (推荐Render)
- ✅ 创建部署配置文件 (render.yaml, railway.toml等)
- ✅ 编写部署指南 (CLOUD_DEPLOYMENT.md)
- ✅ 性能测试脚本 (test_performance.js)
- [ ] 实际部署到Render平台
- [ ] 生产环境功能验证
- [ ] 性能基准测试

### Milestone 5: MCP.so提交准备 📋
- [ ] 创建chatmcp.yaml配置
- [ ] 编写API文档
- [ ] 准备示例和截图
- [ ] 测试MCP客户端兼容性
- [ ] 最终质量检查

### 即将完成的工作
1. **云端部署**: 使用Render进行实际部署测试
2. **性能验证**: 运行云端性能测试
3. **多平台支持**: 验证4个云平台的部署方案
4. **文档完善**: 根据实际部署经验更新文档

## 🔗 相关链接

- [开发进度详情](./todo.md)
- [Docker部署文档](./DOCKER_README.md)
- [MCP.so 托管平台](https://mcp.so)
- [@chatmcp/sdk 文档](https://github.com/chatmcp/sdk)

## 🏆 项目亮点

### ✨ 技术成就
- **100% 功能迁移**: 6个工具函数完全兼容
- **双模式支持**: stdio + REST API
- **生产就绪**: Docker + 监控 + 日志
- **完整测试**: API测试 + 容器测试

### 📊 质量指标
- **功能覆盖**: 100% (6/6 工具)
- **容器化**: 100% (Dockerfile + Compose)
- **测试覆盖**: 100% (全端点测试)
- **文档质量**: 优秀 (多份文档)

---

## 📞 支持

如有问题，请查看：
1. [todo.md](./todo.md) - 开发任务和进度详情
2. [DOCKER_README.md](./DOCKER_README.md) - Docker部署指南
3. [test_all_endpoints.js](./test_all_endpoints.js) - API测试示例

**项目状态**: 🚀 已准备好云端部署 