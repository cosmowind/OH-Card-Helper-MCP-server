# OH卡心理投射工具MCP服务器 - 云端托管版

🌟 一个基于MCP（Model Context Protocol）的OH卡心理投射工具服务器，专为mcp.so云端托管优化。

## ✨ 什么是OH卡？

OH卡（Open Heart Cards）是一套心理投射工具，通过图像来帮助人们探索内心世界、获得洞察和启发。每个人对同一张卡的解读都是独特的，这正是它的魅力所在。

### 🎯 核心功能

- **🎴 随机抽卡**: 从9张精美的OH卡中随机抽取一张
- **🤔 引导问题**: 提供五类专业引导问题帮助深入探索
- **🌈 情感投射**: 通过图像投射内心状态和感受
- **💡 启发思考**: 从新角度看待问题和挑战
- **🔮 直觉连接**: 激活内在智慧和直觉

## 🛠️ 可用工具

### 1. `what_is_oh_cards`
获取OH卡的详细介绍，了解其原理和价值。

### 2. `get_oh_card_process`
获取完整的OH卡抽取和探索流程指导。

### 3. `draw_oh_card`
抽取一张OH卡。
- **参数**: `intention` (可选) - 你想要探索的问题或意图

### 4. `get_guidance_questions`
获取引导问题帮助深入探索卡牌。
- **参数**: `question_type` (可选) - 问题类型：
  - `观察感受`: 帮助观察卡牌并感受第一印象
  - `深入探索`: 引导深入挖掘卡牌的细节和含义  
  - `情境代入`: 让你融入卡牌情境
  - `内心连接`: 建立卡牌与内心世界的联系
  - `启发行动`: 从卡牌中获得实际的生活指导
  - `random`: 随机选择类型

### 5. `get_all_question_types`
查看所有引导问题类型的详细说明。

### 6. `get_all_cards_preview`
预览所有OH卡的图片链接。

## 🚀 使用方式

### 在mcp.so上使用

本服务器已针对mcp.so云端托管进行优化，支持：

- **REST API模式**: 通过HTTP接口访问
- **stdio模式**: 传统的标准输入输出模式
- **Docker容器**: 容器化部署

### 在Claude Desktop中使用

```json
{
  "mcpServers": {
    "ohcard": {
      "command": "npx",
      "args": [
        "-y",
        "ohcard-cloud-mcp"
      ]
    }
  }
}
```

## 🏗️ 开发和部署

### 本地开发

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 启动服务器
npm start

# 开发模式
npm run dev
```

### Docker部署

```bash
# 构建镜像
docker build -t mcp/ohcard-cloud .

# 运行容器
docker run -i --rm mcp/ohcard-cloud
```

### REST模式

```bash
# 启动REST服务器
node dist/index.js --mode=rest --port=9593 --endpoint=/rest
```

## 🌟 特性

- **🔄 双传输支持**: 同时支持stdio和REST传输
- **📦 容器化**: 完整的Docker支持
- **🎯 零配置**: 无需额外参数即可运行
- **🌐 云端优化**: 专为mcp.so托管优化
- **🔧 TypeScript**: 完整的类型支持

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 🤝 贡献

欢迎提交Issues和Pull Requests！

## 📞 联系方式

- **作者**: CosmoWind
- **项目主页**: https://github.com/cosmowind/ohcard-mcp

---

💫 **愿这份OH卡工具帮助你探索内心世界，获得智慧和启发！** ✨ 