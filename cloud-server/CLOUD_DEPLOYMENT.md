# ☁️ OH卡探索工具 - 云端部署指南

## 🎯 部署概览

本指南提供将OH卡MCP服务器部署到各大云平台的详细步骤。目前支持的平台：

- **Render** ⭐ (推荐) - 类Heroku体验，价格优惠
- **Railway** - 现代化PaaS，用量计费
- **Vercel** - 适合前端和serverless
- **Fly.io** - 全球边缘部署
- **Heroku** - 传统PaaS平台

## 🚀 方案1: Render 部署 (推荐)

### 为什么选择 Render？

- ✅ **简单易用**: 类似Heroku的体验
- ✅ **价格优惠**: 免费层 + $7/月起的付费计划
- ✅ **Docker支持**: 完整的容器化支持
- ✅ **自动HTTPS**: 内置SSL证书
- ✅ **Git集成**: 自动部署

### 快速部署步骤

#### 方式一: 使用 render.yaml (推荐)

1. **准备代码**
   ```bash
   # 确保代码已推送到GitHub
   git add .
   git commit -m "准备Render部署"
   git push origin main
   ```

2. **连接Render**
   - 访问 [render.com](https://render.com)
   - 登录并连接GitHub账户
   - 选择 "New > Blueprint"
   - 选择你的仓库

3. **自动配置**
   - Render会自动读取 `render.yaml` 配置
   - 确认服务设置无误
   - 点击 "Apply" 开始部署

#### 方式二: 手动配置

1. **创建Web Service**
   - 在Render Dashboard点击 "New > Web Service"
   - 连接GitHub仓库
   - 选择分支 (通常是 `main`)

2. **配置构建设置**
   ```
   Name: ohcard-mcp-cloud
   Environment: Node
   Region: Oregon (或选择最近的区域)
   Branch: main
   Root Directory: (留空，除非在子目录)
   Build Command: npm install
   Start Command: npm start
   ```

3. **设置环境变量**
   ```
   NODE_ENV=production
   PORT=10000
   LOG_LEVEL=info
   ```

4. **配置健康检查**
   ```
   Health Check Path: /health
   ```

### 部署后验证

```bash
# 检查服务状态
curl https://your-app-name.onrender.com/health

# 测试工具端点
curl -X POST https://your-app-name.onrender.com/tools/what_is_oh_cards \
  -H "Content-Type: application/json" \
  -d "{}"
```

### Render 配置优化

```yaml
# render.yaml 完整配置
services:
  - type: web
    name: ohcard-mcp-cloud
    env: node
    plan: starter
    buildCommand: npm ci --only=production
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: LOG_LEVEL
        value: info
    healthCheckPath: /health
    autoDeploy: true
    region: oregon
    
    # 性能优化
    numInstances: 1
    scaling:
      minInstances: 1
      maxInstances: 3
      targetMemoryPercent: 80
      targetCPUPercent: 80
```

---

## 🚄 方案2: Railway 部署

### 快速部署

1. **安装Railway CLI**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **初始化项目**
   ```bash
   cd OH-Card-Helper-MCP-server/cloud-server
   railway init
   railway link  # 连接到现有项目或创建新项目
   ```

3. **设置环境变量**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set LOG_LEVEL=info
   ```

4. **部署**
   ```bash
   railway up
   ```

### Railway 配置文件

```toml
# railway.toml
[build]
builder = "nixpacks"

[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "on-failure"
restartPolicyMaxRetries = 10

[[ports]]
port = 3000
protocol = "http"

[env]
NODE_ENV = "production"
LOG_LEVEL = "info"
```

---

## ⚡ 方案3: Vercel 部署

### 配置 Vercel

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "LOG_LEVEL": "info"
  }
}
```

### 部署命令

```bash
npm install -g vercel
vercel --prod
```

---

## 🌍 方案4: Fly.io 部署

### 配置文件

```toml
# fly.toml
app = "ohcard-mcp-cloud"
primary_region = "nrt"  # 东京区域

[build]
  dockerfile = "Dockerfile"

[http_service]
  internal_port = 9593
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[http_service.checks]]
  grace_period = "10s"
  interval = "30s"
  method = "GET"
  path = "/health"
  protocol = "http"
  timeout = "5s"

[env]
  NODE_ENV = "production"
  PORT = "9593"
  LOG_LEVEL = "info"

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256
```

### 部署步骤

```bash
# 安装 Fly CLI
curl -L https://fly.io/install.sh | sh

# 登录和初始化
fly auth login
fly launch --no-deploy

# 设置环境变量
fly secrets set NODE_ENV=production LOG_LEVEL=info

# 部署
fly deploy
```

---

## 🔧 通用配置建议

### 环境变量

所有平台都应设置以下环境变量：

```bash
NODE_ENV=production
PORT=<平台指定端口>
LOG_LEVEL=info
```

### 健康检查

确保所有平台都配置健康检查端点：

```
路径: /health
超时: 30秒
间隔: 60秒
方法: GET
```

### 性能优化

```json
// package.json 优化
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "scripts": {
    "start": "node src/index.js",
    "build": "echo 'No build step required'",
    "postinstall": "echo 'Installation complete'"
  }
}
```

---

## 📊 平台对比

| 平台 | 免费层 | 付费起价 | Docker支持 | 自动扩展 | 推荐度 |
|------|--------|----------|-------------|----------|---------|
| **Render** | ✅ | $7/月 | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| **Railway** | $5信用/月 | 用量计费 | ✅ | ✅ | ⭐⭐⭐⭐ |
| **Vercel** | ✅ | $20/月 | ❌ | ✅ | ⭐⭐⭐ |
| **Fly.io** | 部分免费 | $5/月 | ✅ | ✅ | ⭐⭐⭐⭐ |
| **Heroku** | ❌ | $5/月 | ✅ | ✅ | ⭐⭐⭐ |

---

## 🚨 部署后检查清单

### 功能验证

```bash
# 1. 健康检查
curl https://your-app.platform.com/health

# 2. 工具列表
curl https://your-app.platform.com/tools

# 3. 测试OH卡功能
curl -X POST https://your-app.platform.com/tools/draw_oh_card \
  -H "Content-Type: application/json" \
  -d '{"arguments": {"intention": "测试部署"}}'
```

### 性能监控

- ✅ 响应时间 < 2秒
- ✅ 内存使用 < 512MB
- ✅ CPU使用率 < 80%
- ✅ 错误率 < 1%

### 安全检查

- ✅ HTTPS强制启用
- ✅ 环境变量安全设置
- ✅ 错误信息不泄露敏感数据
- ✅ 健康检查正常

---

## 🔗 相关资源

- [Render官方文档](https://render.com/docs)
- [Railway官方文档](https://docs.railway.app)
- [Vercel官方文档](https://vercel.com/docs)
- [Fly.io官方文档](https://fly.io/docs)
- [项目Docker文档](./DOCKER_README.md)
- [项目开发进度](./todo.md)

---

## 📞 获取帮助

如果部署过程中遇到问题：

1. 检查 [todo.md](./todo.md) 中的已知问题
2. 查看平台的日志和错误信息
3. 运行本地测试确认代码无误：`npm test`
4. 确认Docker构建正常：`npm run docker:build`

**部署成功后，请更新 [todo.md](./todo.md) 中的 Milestone 4 状态！** 🎉 