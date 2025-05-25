# 🚀 云端部署检查清单

## 📋 部署前准备

### 代码准备
- [ ] 所有代码已提交到Git仓库
- [ ] package.json版本已更新
- [ ] 所有依赖已正确安装
- [ ] 本地测试通过：`npm test`
- [ ] Docker构建成功：`npm run docker:build` (如果支持)

### 配置文件检查
- [ ] `render.yaml` 配置正确
- [ ] `railway.toml` 配置正确  
- [ ] `vercel.json` 配置正确
- [ ] 环境变量设置完整

---

## 🌐 Render 部署清单

### 部署步骤
- [ ] 访问 [render.com](https://render.com)
- [ ] 连接GitHub账户
- [ ] 创建新的Web Service
- [ ] 选择正确的仓库和分支
- [ ] 确认build和start命令
- [ ] 设置环境变量
- [ ] 配置健康检查路径：`/health`
- [ ] 启动部署

### 部署后验证
- [ ] 服务状态为 "Live"
- [ ] 健康检查通过：`curl https://your-app.onrender.com/health`
- [ ] 工具列表正常：`curl https://your-app.onrender.com/tools`
- [ ] OH卡功能测试：
  ```bash
  curl -X POST https://your-app.onrender.com/tools/draw_oh_card \
    -H "Content-Type: application/json" \
    -d '{"arguments": {"intention": "测试部署"}}'
  ```

---

## 🚄 Railway 部署清单

### 部署步骤
- [ ] 安装Railway CLI：`npm install -g @railway/cli`
- [ ] 登录：`railway login`
- [ ] 初始化项目：`railway init`
- [ ] 设置环境变量：`railway variables set NODE_ENV=production`
- [ ] 部署：`railway up`

### 部署后验证
- [ ] 获取部署URL：`railway domain`
- [ ] 健康检查测试
- [ ] 功能完整性测试

---

## ⚡ Vercel 部署清单

### 部署步骤
- [ ] 安装Vercel CLI：`npm install -g vercel`
- [ ] 登录：`vercel login`
- [ ] 部署：`vercel --prod`
- [ ] 确认域名设置

### 部署后验证
- [ ] 访问生产域名
- [ ] 测试serverless函数响应
- [ ] 验证路由配置

---

## 🌍 Fly.io 部署清单

### 部署步骤
- [ ] 安装Fly CLI
- [ ] 登录：`fly auth login`
- [ ] 初始化：`fly launch --no-deploy`
- [ ] 设置secrets：`fly secrets set NODE_ENV=production`
- [ ] 部署：`fly deploy`

### 部署后验证
- [ ] 检查应用状态：`fly status`
- [ ] 查看日志：`fly logs`
- [ ] 功能测试

---

## 📊 性能测试清单

### 本地性能基准
- [ ] 运行本地性能测试：`npm run test:performance:local`
- [ ] 记录基准指标：
  - [ ] 平均响应时间 < 100ms
  - [ ] P95响应时间 < 200ms
  - [ ] 错误率 < 1%

### 云端性能测试
- [ ] 设置云端测试URL：`export TEST_URL=https://your-app.platform.com`
- [ ] 运行云端性能测试：`npm run test:performance:cloud`
- [ ] 验证性能指标：
  - [ ] 平均响应时间 < 2000ms
  - [ ] P95响应时间 < 5000ms
  - [ ] 错误率 < 5%
  - [ ] 吞吐量 > 10 请求/秒

### 并发测试
- [ ] 高并发测试：`CONCURRENCY=50 REQUESTS=500 npm run test:performance:cloud`
- [ ] 验证稳定性：
  - [ ] 无内存泄漏
  - [ ] 无连接超时
  - [ ] 错误率保持低位

---

## 🔒 安全检查清单

### 基础安全
- [ ] HTTPS强制启用
- [ ] 敏感信息使用环境变量
- [ ] 错误信息不泄露内部详情
- [ ] 健康检查不暴露敏感数据

### 生产环境配置
- [ ] `NODE_ENV=production`
- [ ] 适当的日志级别设置
- [ ] 资源限制配置
- [ ] 优雅关闭处理

---

## 📈 监控设置清单

### 基础监控
- [ ] 应用状态监控（平台自带）
- [ ] 健康检查定期执行
- [ ] 错误日志收集
- [ ] 性能指标跟踪

### 高级监控（可选）
- [ ] 自定义监控面板
- [ ] 警报规则设置
- [ ] 用量统计分析
- [ ] 用户行为分析

---

## 🚨 故障排除清单

### 常见问题检查
- [ ] 构建日志无错误
- [ ] 启动命令正确
- [ ] 端口配置匹配
- [ ] 环境变量完整
- [ ] 依赖版本兼容

### 调试工具
- [ ] 平台日志查看
- [ ] 健康检查详情
- [ ] 网络连接测试
- [ ] 资源使用情况

---

## ✅ 部署成功验证

### 功能验证
- [ ] 所有6个OH卡工具功能正常
- [ ] 随机抽卡算法工作
- [ ] 引导问题筛选正确
- [ ] 中文内容显示正常

### 性能验证
- [ ] 响应时间符合标准
- [ ] 并发处理能力满足需求
- [ ] 内存使用合理
- [ ] CPU使用率正常

### 稳定性验证
- [ ] 连续运行24小时无问题
- [ ] 重启后自动恢复
- [ ] 负载测试通过
- [ ] 错误处理机制有效

---

## 📝 部署后更新

### 文档更新
- [ ] 更新README.md中的部署URL
- [ ] 更新todo.md中的Milestone 4状态
- [ ] 记录部署经验和问题
- [ ] 更新性能基准数据

### 代码仓库
- [ ] 添加部署状态徽章
- [ ] 更新版本标签
- [ ] 创建发布说明
- [ ] 备份配置文件

---

## 🎉 完成标志

当以下所有条件满足时，Milestone 4 完成：

- ✅ 至少一个云平台部署成功
- ✅ 所有功能在云端正常工作
- ✅ 性能测试通过标准
- ✅ 监控和日志工作正常
- ✅ 文档更新完整

**下一步**: 开始 Milestone 5 - MCP.so提交准备 