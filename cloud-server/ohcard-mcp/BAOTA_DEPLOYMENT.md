# 🎛️ 宝塔面板 Docker 部署指南

## 🎯 部署概览

本指南详细说明如何在阿里云服务器的宝塔面板上部署OH卡MCP服务器。

### 前置条件
- ✅ 阿里云服务器（Linux）
- ✅ 宝塔面板已安装
- ✅ Docker 已在宝塔面板中安装
- ✅ 服务器已开放必要端口

---

## 📋 第一步：准备服务器环境

### 1.1 宝塔面板安装Docker
1. 登录宝塔面板
2. 进入 **软件商店**
3. 搜索 "Docker" 并安装
4. 安装完成后，在左侧菜单会出现 "Docker" 选项

### 1.2 检查Docker状态
在宝塔面板的 **终端** 中执行：
```bash
docker --version
docker-compose --version
```

### 1.3 配置防火墙
在宝塔面板 **安全** 设置中放行端口：
- `9593` - OH卡服务端口
- `80` - HTTP（如果需要反向代理）
- `443` - HTTPS（如果需要SSL）

---

## 📦 第二步：上传项目代码

### 2.1 创建项目目录
在宝塔面板 **文件** 管理中：
```
/www/docker/ohcard-mcp/
```

### 2.2 上传代码文件
将以下文件上传到项目目录：

**必需文件**：
```
ohcard-mcp/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
├── src/
│   ├── index.js
│   └── ohcard/
│       ├── cards.js
│       ├── questions.js
│       └── tools.js
└── test_all_endpoints.js
```

### 2.3 调整配置文件
确保 `docker-compose.yml` 适合宝塔环境：

```yaml
version: '3.8'
services:
  ohcard-mcp:
    build: .
    container_name: ohcard-mcp-server
    ports:
      - "9593:9593"  # 对外端口:容器内端口
    environment:
      - NODE_ENV=production
      - PORT=9593
      - LOG_LEVEL=info
    restart: unless-stopped
    volumes:
      - ./logs:/app/logs  # 日志持久化
    networks:
      - ohcard-network

networks:
  ohcard-network:
    driver: bridge
```

---

## 🚀 第三步：Docker部署

### 3.1 通过宝塔面板部署

#### 方式一：使用宝塔Docker管理器（推荐）

1. **进入Docker管理**
   - 宝塔面板 → Docker → 容器

2. **添加容器**
   - 点击 "添加容器"
   - 选择 "从 Compose 文件创建"
   - 选择项目目录中的 `docker-compose.yml`

3. **配置容器**
   ```
   容器名称: ohcard-mcp-server
   映像: 自动构建
   端口映射: 9593:9593
   环境变量: 
     NODE_ENV=production
     PORT=9593
     LOG_LEVEL=info
   ```

4. **启动容器**
   - 点击 "创建并启动"
   - 等待构建完成

#### 方式二：使用终端命令

在宝塔面板 **终端** 中：

```bash
# 进入项目目录
cd /www/docker/ohcard-mcp

# 构建并启动
docker-compose up -d --build

# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f ohcard-mcp
```

### 3.2 验证部署

在终端中测试：
```bash
# 健康检查
curl http://localhost:9593/health

# 工具列表
curl http://localhost:9593/tools

# 测试OH卡功能
curl -X POST http://localhost:9593/tools/draw_oh_card \
  -H "Content-Type: application/json" \
  -d '{"arguments": {"intention": "测试部署"}}'
```

---

## 🌐 第四步：配置反向代理（可选）

### 4.1 创建网站
1. 宝塔面板 → 网站 → 添加站点
2. 输入域名（如：ohcard.yourdomain.com）
3. 选择 "不创建FTP和数据库"

### 4.2 配置反向代理
1. 进入网站设置 → 反向代理
2. 添加反向代理：
   ```
   代理名称: OH卡MCP服务
   目标URL: http://127.0.0.1:9593
   发送域名: $host
   ```

3. 高级配置：
   ```nginx
   location / {
       proxy_pass http://127.0.0.1:9593;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
       
       # 健康检查
       proxy_connect_timeout 60s;
       proxy_send_timeout 60s;
       proxy_read_timeout 60s;
   }
   ```

### 4.3 配置SSL证书（推荐）
1. 网站设置 → SSL
2. 选择 "Let's Encrypt" 免费证书
3. 申请并部署证书
4. 开启 "强制HTTPS"

---

## 📊 第五步：监控和管理

### 5.1 宝塔面板监控
- **Docker管理器**: 查看容器状态、资源使用
- **系统监控**: CPU、内存、磁盘使用情况
- **网站监控**: 访问统计、响应时间

### 5.2 日志管理
```bash
# 查看实时日志
docker-compose logs -f ohcard-mcp

# 查看最近日志
docker-compose logs --tail=100 ohcard-mcp

# 日志文件位置（如果配置了卷映射）
/www/docker/ohcard-mcp/logs/
```

### 5.3 容器管理命令
```bash
# 停止服务
docker-compose stop

# 重启服务
docker-compose restart

# 更新服务
git pull  # 拉取最新代码
docker-compose up -d --build

# 清理无用镜像
docker system prune -f
```

---

## 🔧 第六步：性能优化

### 6.1 Docker优化
在 `docker-compose.yml` 中添加资源限制：
```yaml
services:
  ohcard-mcp:
    # ... 其他配置
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### 6.2 Nginx优化
在宝塔面板的 **Nginx设置** 中：
```nginx
# 启用gzip压缩
gzip on;
gzip_types text/plain application/json application/javascript text/css;

# 缓存静态资源
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 6.3 监控设置
安装宝塔面板监控插件：
- **系统监控** - 实时监控服务器状态
- **网站监控** - 监控应用响应时间
- **文件监控** - 监控重要文件变化

---

## 🚨 故障排除

### 常见问题

#### 1. 容器启动失败
```bash
# 查看详细错误日志
docker-compose logs ohcard-mcp

# 检查端口占用
netstat -tulpn | grep 9593

# 重新构建镜像
docker-compose build --no-cache
```

#### 2. 访问不通
- 检查防火墙设置
- 检查反向代理配置
- 检查容器是否正常运行：`docker ps`

#### 3. 性能问题
```bash
# 查看容器资源使用
docker stats ohcard-mcp-server

# 查看系统资源
htop
```

### 调试模式
临时启用调试模式：
```bash
# 停止当前容器
docker-compose stop

# 启动调试模式
docker-compose run --rm -e LOG_LEVEL=debug ohcard-mcp npm run rest
```

---

## ✅ 部署检查清单

### 部署前检查
- [ ] 服务器环境准备完成
- [ ] Docker和docker-compose已安装
- [ ] 防火墙端口已开放
- [ ] 项目代码已上传

### 部署验证
- [ ] 容器成功启动
- [ ] 健康检查通过：`curl http://your-server:9593/health`
- [ ] 所有API端点正常响应
- [ ] 反向代理配置正确（如果使用）
- [ ] SSL证书配置正确（如果使用）

### 性能测试
- [ ] 运行性能测试：`npm run test:performance`
- [ ] 响应时间符合要求
- [ ] 并发处理正常
- [ ] 内存使用稳定

---

## 🎯 下一步

部署成功后：

1. **配置域名解析**（如果使用域名）
2. **设置定时备份**（数据库、配置文件）
3. **配置监控告警**
4. **准备负载均衡**（如果需要高可用）

---

## 📞 技术支持

如果遇到问题：
1. 查看 [Docker官方文档](https://docs.docker.com/)
2. 查看 [宝塔面板文档](https://www.bt.cn/bbs/)
3. 检查项目 `test_all_endpoints.js` 测试结果
4. 查看容器日志：`docker-compose logs -f`

**部署成功后，你的OH卡MCP服务器将在 `http://your-server-ip:9593` 运行！** 🎉 