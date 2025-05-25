# OH卡心理投射工具 MCP 服务器 (OH Cards MCP Server)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40cosmowind%2Fohcard-cloud-mcp.svg)](https://badge.fury.io/js/%40cosmowind%2Fohcard-cloud-mcp)

🌟 一个基于 MCP（Model Context Protocol）的 OH 卡心理投射工具服务器，提供多种部署方案，帮助用户通过 OH 卡进行自我探索和内心洞察。

## 🎴 什么是 OH 卡？

OH 卡（Open Heart Cards）是一套心理投射工具，通过图像来帮助人们探索内心世界、获得洞察和启发。每个人对同一张卡的解读都是独特的，这正是它的魅力所在。

### 核心价值
- 🎯 **投射工具**：通过图像投射内心状态和感受
- 🌟 **自我探索**：深入了解内在需求和潜意识
- 💡 **启发思考**：从新角度看待问题和挑战
- 🌈 **情感表达**：帮助表达难以言喻的感受
- 🔮 **直觉连接**：激活内在智慧和直觉洞察

## 📁 项目结构

本项目提供四种不同的 MCP 实现方案，满足不同的使用场景和部署需求：

```
OH-Card-Helper-MCP-server/
├── ohcard-fastmcp/         # 🐍 FastMCP Python 实现（最简单）
├── ohcard-npx-pack/        # 📦 NPX 包实现（最方便）
├── ohcard-cloud/           # ☁️ 云托管实现（可申请 MCP.so）
├── cloud-server/           # 🐳 Docker 云部署（实验性，已废弃）
├── intro.md               # 项目介绍
├── LICENSE                # MIT 许可证
└── README.md              # 本文件
```

## 🚀 四种实现方案详解

### 1. 🐍 ohcard-fastmcp - Python 版本（最简单）
**适合：Python 开发者，快速本地部署**

- **技术栈**：Python + FastMCP 框架
- **特点**：代码简洁，易于理解和修改
- **部署**：本地 Python 环境运行
- **优势**：开发门槛低，适合学习 MCP 开发

```bash
cd ohcard-fastmcp
pip install -r requirements.txt
python ohcard.py
```

### 2. 📦 ohcard-npx-pack - NPX 包版本（最方便）
**适合：普通用户，一键使用**

- **技术栈**：Node.js + TypeScript
- **特点**：零配置，一条命令即可使用
- **部署**：通过 NPM 发布，npx 直接运行
- **优势**：用户体验最佳，无需环境配置

```bash
# 直接使用（推荐）
npx @cosmowind/ohcard-mcp

# Claude Desktop 配置
{
  "mcpServers": {
    "ohcard": {
      "command": "npx",
      "args": ["-y", "@cosmowind/ohcard-mcp"]
    }
  }
}
```

### 3. ☁️ ohcard-cloud - 云托管版本（可申请 MCP.so）
**适合：希望在 MCP Playground 中使用**

- **技术栈**：TypeScript + @chatmcp/sdk
- **特点**：支持 stdio 和 REST 双传输模式
- **部署**：可提交到 MCP.so 官方托管
- **优势**：无需本地安装，在线即用

基于 `ohcard-npx-pack` 改进，符合 MCP.so 托管要求：
- 使用 `getParamValue` 进行参数处理
- 支持 REST API 模式
- 包含 Dockerfile 和 chatmcp.yaml 配置

### 4. 🐳 cloud-server - Docker 云部署（已废弃）
**状态：实验性项目，部署失败**

- **原计划**：在云服务器上通过 Docker 部署 MCP 服务器
- **问题**：MCP 协议主要设计为本地 stdio 通信，云端部署存在技术障碍
- **结果**：项目已废弃，保留作为学习参考

## 📊 方案对比

| 特性 | FastMCP | NPX包 | 云托管 | Docker云部署 |
|------|---------|-------|--------|-------------|
| **部署难度** | 简单 | 极简 | 中等 | 复杂 |
| **使用便利性** | 中等 | 极高 | 高 | 低 |
| **技术门槛** | 低 | 无 | 中等 | 高 |
| **适用场景** | 开发学习 | 日常使用 | 在线体验 | 已废弃 |
| **维护成本** | 低 | 低 | 中等 | 高 |
| **扩展性** | 高 | 中等 | 中等 | 高 |
| **状态** | ✅ 稳定 | ✅ 推荐 | ✅ 可用 | ❌ 废弃 |

## 🎯 功能特性

所有可用版本都提供以下完整功能：

### 核心工具
| 工具名称 | 功能描述 | 参数 |
|---------|----------|------|
| `what_is_oh_cards` | 获取 OH 卡的详细介绍 | 无 |
| `get_oh_card_process` | 获取 OH 卡抽取流程指导 | 无 |
| `draw_oh_card` | 随机抽取一张 OH 卡 | `intention`（可选）|
| `get_guidance_questions` | 获取引导问题帮助探索 | `question_type`（可选）|
| `get_all_question_types` | 查看所有引导问题类型 | 无 |
| `get_all_cards_preview` | 预览所有 OH 卡图片 | 无 |

### 引导问题类型
- **观察感受**：帮助观察卡牌并感受第一印象
- **深入探索**：引导深入挖掘卡牌的细节和含义
- **情境代入**：让你融入卡牌情境
- **内心连接**：建立卡牌与内心世界的联系
- **启发行动**：从卡牌中获得实际的生活指导

## 🎮 使用流程

1. **设定意图**：明确你想要探索的问题或困惑
2. **抽取卡牌**：使用 `draw_oh_card` 随机抽取一张 OH 卡
3. **观察感受**：仔细观察卡牌图像，记录第一印象
4. **引导探索**：通过 `get_guidance_questions` 获取引导问题
5. **深入思考**：回答引导问题，探索内心声音
6. **获得洞察**：总结这次体验带来的启发和洞察

## 🛠️ 快速开始

### 推荐方案：NPX 包（零配置）

```bash
# 一键启动
npx @cosmowind/ohcard-cloud-mcp
```

### 开发者方案：FastMCP

```bash
cd ohcard-fastmcp
pip install -r requirements.txt
python ohcard.py
```

### 在线体验：云托管版本

等待 MCP.so 审核通过后，可在 MCP Playground 中直接使用。

## 📝 示例对话

```
用户：我最近在工作上遇到一些困惑，想用 OH 卡来探索一下内心的声音。

Claude：我来帮你使用 OH 卡进行内心探索。让我先为你抽取一张 OH 卡。

[调用 draw_oh_card 工具]

你抽到的OH卡是xxx（链接）...

现在让我为你提供一些引导问题来深入探索这张卡的含义：

[调用 get_guidance_questions 工具]

1. 当你看到这张图片时，你的第一感受是什么？
2. 如果你现在身处其中，你会怎么做？
...
```

## 🔧 技术架构

### FastMCP 版本
- **语言**：Python 3.8+
- **框架**：FastMCP
- **传输**：stdio
- **依赖**：minimal

### NPX/云托管版本
- **语言**：TypeScript/Node.js 18+
- **框架**：@modelcontextprotocol/sdk
- **传输**：stdio + REST（云托管）
- **构建**：TypeScript 编译

## 📚 文档链接

- [FastMCP 实现文档](ohcard-fastmcp/readme_fastmcp.md)
- [NPX 包开发指南](ohcard-npx-pack/README_npx.md)
- [云托管配置说明](ohcard-cloud/托管说明.md)

## 🤝 贡献指南

欢迎为项目贡献代码或建议！

1. Fork 本项目
2. 选择合适的实现版本进行修改
3. 创建功能分支
4. 提交 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🔗 相关链接

- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- [Claude Desktop](https://claude.ai/desktop)
- [FastMCP 框架](https://github.com/microsoft/FastMCP)
- [NPM 包地址](https://www.npmjs.com/package/@cosmowind/ohcard-cloud-mcp)
- [MCP.so 官网](https://mcp.so/)

## 🌟 项目亮点

- **多方案支持**：从简单的 Python 脚本到云端托管，满足不同需求
- **零配置使用**：NPX 包提供一键启动体验
- **专业心理工具**：基于成熟的 OH 卡心理投射理论
- **开源友好**：MIT 许可证，欢迎社区贡献
- **MCP 生态**：积极参与 MCP 生态建设

---

**选择最适合你的方案，开始 OH 卡探索之旅吧！** ✨

> 💡 **推荐使用顺序**：NPX 包（日常使用）→ FastMCP（学习开发）→ 云托管（在线体验）