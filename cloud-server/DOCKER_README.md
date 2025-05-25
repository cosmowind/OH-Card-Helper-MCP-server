# Docker 容器化部署指南

## 🐳 概述

此文档介绍如何使用Docker容器化部署OH卡云服务器。

## 📋 前置要求

- Docker Engine 20.0+ 
- Docker Compose 1.28+
- 至少512MB可用内存

## 🚀 快速开始

### 1. 构建镜像

```bash
# 方式1：使用npm脚本
npm run docker:build

# 方式2：直接使用docker命令
docker build -t ohcard-mcp-cloud:latest .
```

### 2. 运行容器

```bash
# 方式1：使用npm脚本
npm run docker:run

# 方式2：直接使用docker命令
docker run -p 9593:9593 ohcard-mcp-cloud:latest
```

### 3. 使用Docker Compose

```bash
# 启动服务
npm run docker:compose:up

# 停止服务
npm run docker:compose:down

# 查看日志
npm run docker:compose:logs
```

## 🔧 配置选项

### 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `NODE_ENV` | `production` | 运行环境 |
| `MODE` | `rest` | 运行模式 |
| `PORT` | `9593` | 监听端口 |
| `LOG_LEVEL` | `info` | 日志级别 |

### Docker Compose 配置

```yaml
# 自定义端口
ports:
  - "8080:9593"

# 自定义环境变量
environment:
  - LOG_LEVEL=debug
  - NODE_ENV=development
```

## 🧪 测试容器

### 基础测试

```bash
# 健康检查
curl http://localhost:9593/health

# 工具列表
curl http://localhost:9593/tools/list
```

### 完整测试

```bash
# 运行容器测试脚本
node test_docker.js
```

## 📊 监控和日志

### 查看容器日志

```bash
# 实时日志
docker logs -f ohcard-mcp-cloud

# 最近100行日志
docker logs --tail 100 ohcard-mcp-cloud
```

### 容器状态检查

```bash
# 容器状态
docker ps

# 容器详细信息
docker inspect ohcard-mcp-cloud

# 容器资源使用
docker stats ohcard-mcp-cloud
```

### 健康检查

容器内置健康检查，每30秒检查一次：

```bash
# 查看健康状态
docker inspect --format='{{.State.Health.Status}}' ohcard-mcp-cloud
```

## 🔍 故障排除

### 常见问题

1. **端口冲突**
   ```bash
   # 检查端口占用
   netstat -tulpn | grep 9593
   
   # 使用其他端口
   docker run -p 8080:9593 ohcard-mcp-cloud:latest
   ```

2. **容器启动失败**
   ```bash
   # 查看启动日志
   docker logs ohcard-mcp-cloud
   
   # 进入容器调试
   docker exec -it ohcard-mcp-cloud sh
   ```

3. **内存不足**
   ```bash
   # 限制内存使用
   docker run -m 512m -p 9593:9593 ohcard-mcp-cloud:latest
   ```

### 日志级别调试

```bash
# 启用调试日志
docker run -e LOG_LEVEL=debug -p 9593:9593 ohcard-mcp-cloud:latest
```

## 🚀 生产部署建议

### 1. 资源限制

```yaml
# docker-compose.yml
services:
  ohcard-mcp:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

### 2. 持久化存储

```yaml
# 日志持久化
volumes:
  - ./logs:/app/logs
```

### 3. 网络安全

```yaml
# 仅内网访问
ports:
  - "127.0.0.1:9593:9593"
```

### 4. 自动重启

```yaml
restart: unless-stopped
```

## 📦 镜像信息

- **基础镜像**: `node:18-alpine`
- **最终大小**: ~100MB
- **运行用户**: `ohcard` (非root)
- **健康检查**: 内置HTTP健康检查
- **信号处理**: 支持优雅关闭

## 🔗 相关链接

- [Docker官方文档](https://docs.docker.com/)
- [Node.js Alpine镜像](https://hub.docker.com/_/node)
- [Docker Compose文档](https://docs.docker.com/compose/)

---

## 📞 支持

如有问题，请检查：
1. [故障排除](#故障排除)部分
2. 容器日志输出
3. 主项目README文档 