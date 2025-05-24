# OH卡探索工具 - 云服务器实现方案

## 🎯 项目目标

将现有的NPX+FastMCP方案改造为云服务器托管方案，支持在MCP.so等平台上进行托管，提供REST API接口和多用户并发访问。

## 🏗️ 技术架构

### 当前架构（NPX方案）
```
用户 → NPX包 → 本地Python进程 → FastMCP(stdio) → Claude Desktop
```

### 目标架构（云服务器方案）
```
用户 → Claude Desktop → 网络请求 → 云端REST API → Node.js MCP服务器 → OH卡逻辑
```

## 📦 项目结构规划

```
cloud-server/
├── src/                    # 源代码目录
│   ├── index.js           # 主入口文件
│   ├── server.js          # MCP服务器实现
│   ├── ohcard/            # OH卡业务逻辑
│   │   ├── cards.js       # 卡牌数据
│   │   ├── questions.js   # 引导问题
│   │   └── tools.js       # 工具函数实现
│   └── utils/             # 工具函数
├── tests/                 # 测试文件
├── docs/                  # 文档
├── package.json           # NPM配置
├── Dockerfile             # 容器化配置
├── chatmcp.yaml           # MCP.so配置文件
├── docker-compose.yml     # 本地测试配置
├── .dockerignore          # Docker忽略文件
├── .gitignore            # Git忽略文件
├── readme_cloud.md       # 本文件
└── todo.md               # 开发任务清单
```

## 🔄 核心改造点

### 1. 协议转换
- **从**：stdio 通信协议
- **到**：REST API HTTP协议

### 2. 技术栈转换
- **从**：Python + FastMCP
- **到**：Node.js + @chatmcp/sdk

### 3. 部署方式转换
- **从**：本地进程
- **到**：云端容器

### 4. 参数传递转换
- **从**：环境变量
- **到**：动态参数获取

## 🚀 关键特性

### 必需特性（MCP.so要求）
- ✅ 开源且商业友好许可证（MIT）
- ✅ 不读取本地数据
- ✅ 支持stdio传输（向后兼容）
- ✅ 支持REST传输（云端部署）
- ✅ 容器化部署支持

### 增强特性
- 🔍 健康检查端点
- 📊 监控和日志
- 🔒 基本的访问控制
- ⚡ 性能优化
- 🔄 优雅关闭

## 🛠️ 开发环境要求

### 本地开发
- Node.js >= 18.0.0
- NPM >= 9.0.0
- Docker >= 20.0.0
- Git

### 云端部署
- 支持Node.js容器的云平台
- 支持HTTP/HTTPS访问
- 支持环境变量配置

## 📋 功能映射

| NPX方案功能 | 云服务器方案 | 状态 |
|------------|-------------|------|
| `what_is_oh_cards` | REST: `/tools/what_is_oh_cards` | 📋 待开发 |
| `get_oh_card_process` | REST: `/tools/get_oh_card_process` | 📋 待开发 |
| `draw_oh_card` | REST: `/tools/draw_oh_card` | 📋 待开发 |
| `get_guidance_questions` | REST: `/tools/get_guidance_questions` | 📋 待开发 |
| `get_all_question_types` | REST: `/tools/get_all_question_types` | 📋 待开发 |
| `get_all_cards_preview` | REST: `/tools/get_all_cards_preview` | 📋 待开发 |

## 🎯 里程碑规划

详见 [todo.md](./todo.md) 文件中的详细里程碑规划。

## 🧪 测试策略

### 单元测试
- 每个工具函数的单独测试
- 参数验证测试
- 错误处理测试

### 集成测试
- REST API端到端测试
- MCP协议兼容性测试
- Docker容器测试

### 性能测试
- 并发访问测试
- 响应时间测试
- 内存使用测试

## 🚀 部署方案

### 开发环境
```bash
npm install
npm run dev
```

### 本地容器测试
```bash
docker-compose up --build
```

### 云端部署
```bash
docker build -t ohcard-mcp .
docker run -p 9593:9593 ohcard-mcp
```

## 📊 监控指标

### 基础指标
- 请求数量和响应时间
- 错误率和成功率
- 内存和CPU使用率

### 业务指标
- 抽卡次数统计
- 热门问题类型
- 用户活跃度

## 🔒 安全考虑

### 基本安全
- 输入参数验证
- 输出数据清洗
- 基本的访问频率限制

### 高级安全（可选）
- API密钥认证
- HTTPS强制
- 请求签名验证

## 📚 API文档

### 健康检查
```
GET /health
Response: {"status": "ok", "timestamp": "2024-01-01T00:00:00Z"}
```

### MCP工具调用
```
POST /tools/draw_oh_card
Content-Type: application/json

{
  "arguments": {
    "intention": "我想探索内心的声音"
  }
}
```

## 🤝 兼容性

### MCP客户端兼容
- Claude Desktop
- 其他标准MCP客户端

### 向后兼容
- 保持原有NPX方案不变
- 支持stdio模式（本地开发）

## 📝 配置示例

### Claude Desktop配置（云端模式）
```json
{
  "mcpServers": {
    "ohcard-cloud": {
      "command": "npx",
      "args": ["-y", "@cosmowind/ohcard-mcp-cloud"]
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

## 🔗 相关链接

- [MCP.so 托管平台](https://mcp.so)
- [@chatmcp/sdk 文档](https://github.com/chatmcp/sdk)
- [Docker 官方文档](https://docs.docker.com)
- [Node.js 官方文档](https://nodejs.org)

---

## 📞 支持

如有问题，请查看：
1. [todo.md](./todo.md) - 开发任务和进度
2. [测试文档](./tests/README.md) - 测试相关说明
3. [部署文档](./docs/deployment.md) - 部署相关说明

**开发原则**：渐进式改造，保持功能完整性，确保向后兼容。 