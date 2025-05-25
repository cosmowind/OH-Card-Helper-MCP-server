🎉 宝塔面板部署 - 完整步骤指南
📋 第一步：准备你的阿里云服务器
确保宝塔面板已安装并正常运行
在宝塔面板安装Docker：
进入 软件商店
搜索 "Docker" 并安装
等待安装完成
配置防火墙：
宝塔面板 → 安全 → 防火墙
添加端口：9593
📦 第二步：上传项目文件
在宝塔面板文件管理中创建目录：
   /www/docker/ohcard-mcp/
上传以下文件到该目录：
   ohcard-mcp/
   ├── Dockerfile
   ├── docker-compose.yml
   ├── deploy.sh
   ├── package.json
   ├── package-lock.json
   ├── src/
   │   ├── index.js
   │   └── ohcard/
   │       ├── cards.js
   │       ├── questions.js
   │       └── tools.js
   ├── test_all_endpoints.js
   ├── test_performance.js
   └── BAOTA_DEPLOYMENT.md

🚀 第三步：一键部署
打开宝塔面板终端
进入项目目录：
   cd /www/docker/ohcard-mcp
给部署脚本执行权限：
   chmod +x deploy.sh
一键部署：
   bash deploy.sh deploy
✅ 第四步：验证部署
脚本会自动检查服务状态，你也可以手动验证：
# 查看服务状态
bash deploy.sh status

# 查看日志
bash deploy.sh logs

# 运行功能测试
bash deploy.sh test

# 运行性能测试
bash deploy.sh perf


🌐 第五步：配置访问（可选）
如果你想通过域名访问，可以在宝塔面板配置反向代理：
创建网站：
宝塔面板 → 网站 → 添加站点
输入你的域名
配置反向代理：
网站设置 → 反向代理
目标URL：http://127.0.0.1:9593
配置SSL（推荐）：
网站设置 → SSL
申请 Let's Encrypt 免费证书
📊 服务地址
部署成功后，你的OH卡MCP服务器将运行在：
本地访问：http://localhost:9593
服务器IP访问：http://your-server-ip:9593
域名访问（如果配置）：https://your-domain.com
重要端点：
健康检查：/health
工具列表：/tools
API文档：查看 BAOTA_DEPLOYMENT.md
🛠️ 日常管理命令
# 查看服务状态
bash deploy.sh status

# 重启服务
bash deploy.sh restart

# 停止服务
bash deploy.sh stop

# 查看实时日志
bash deploy.sh logs

# 健康检查
bash deploy.sh health


🎯 关键优势
一键部署：bash deploy.sh deploy 完成所有部署
生产就绪：包含健康检查、自动重启、资源限制
完整监控：日志、状态、性能指标
宝塔集成：与宝塔面板Docker管理器完美兼容
安全配置：网络隔离、权限控制、SSL支持
🔧 性能配置
服务默认配置：
CPU限制：1核心
内存限制：512MB
端口：9593
日志持久化：./logs/ 目录
如需调整，编辑 docker-compose.yml 中的 resources 部分。