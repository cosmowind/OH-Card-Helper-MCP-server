OH卡MCP云服务器部署包
========================

本目录为宝塔面板/云服务器专用部署包，包含：

- Dockerfile、docker-compose.yml：容器化部署配置
- deploy.sh：一键部署与管理脚本
- package.json/package-lock.json：依赖管理
- src/：核心服务代码
- test_all_endpoints.js：API功能测试脚本
- test_performance.js：性能测试脚本
- BAOTA_DEPLOYMENT.md：宝塔面板详细部署指南
- .dockerignore：构建优化

【使用说明】
1. 上传本目录所有内容到服务器 /www/docker/ohcard-mcp/
2. 赋予deploy.sh执行权限：chmod +x deploy.sh
3. 一键部署：bash deploy.sh deploy
4. 详细见 BAOTA_DEPLOYMENT.md 