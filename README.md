# OH卡探索工具 (OH Cards Explorer)

这是一个多方案实现的OH卡探索工具项目，帮助用户通过OH卡进行自我探索和内心洞察，支持Claude Desktop等MCP客户端。

## 什么是OH卡？

OH卡（Open Heart Cards）是一套心理投射工具，通过图像来帮助人们探索内心世界、获得洞察和启发。

- 🎯 **投射工具**：通过图像投射内心状态
- 🌟 **自我探索**：深入了解内在需求和感受
- 💡 **启发思考**：从新角度看待问题和挑战
- 🌈 **情感表达**：帮助表达难以言喻的感受
- 🔮 **直觉连接**：激活内在智慧和直觉

## 项目结构

本项目提供两种不同的MCP实现方案：

```
OH-Card-Helper-MCP-server/
├── ohcard-fastmcp/         # FastMCP Python实现方案
│   ├── ohcard.py          # 主要的MCP服务器
│   ├── requirements.txt   # Python依赖
│   ├── setup.py          # 安装配置
│   ├── run.py            # 启动脚本
│   ├── readme_fastmcp.md # FastMCP方案文档
│   └── ...               # 其他支持文件
├── ohcard-npx-pack/       # NPX包实现方案
│   ├── bin/              # NPX可执行文件
│   ├── package.json      # NPM包配置
│   └── ...               # 其他NPX相关文件
├── intro.md              # 项目介绍
├── LICENSE               # 许可证
└── README.md             # 本文件
```

## 实现方案对比

| 特性 | FastMCP方案 | NPX方案 |
|------|-------------|---------|
| **部署难度** | 中等（需Python环境） | 简单（一条命令） |
| **依赖管理** | 需要pip安装fastmcp | 自动处理依赖 |
| **启动方式** | python命令 | npx命令 |
| **适用场景** | 开发者、定制需求 | 快速体验、简单部署 |
| **扩展性** | 高（完全控制） | 中等（包装形式） |
| **维护成本** | 高 | 低 |

## 快速开始

### 方案1：NPX包方式（推荐用于快速体验）

最简单的使用方式，一条命令即可开始：

```bash
# 直接通过NPX运行（推荐）
npx @cosmowind/ohcard-mcp
```

在Claude Desktop配置文件中添加：
```json
{
  "mcpServers": {
    "ohcard": {
      "command": "npx",
      "args": ["-y", "@cosmowind/ohcard-mcp"]
    }
  }
}
```

### 方案2：FastMCP Python方式（推荐用于开发定制）

适合需要定制功能的开发者：

```bash
# 进入FastMCP方案目录
cd ohcard-fastmcp

# 安装依赖
pip install -r requirements.txt

# 启动服务器
python ohcard.py
```

详细文档请参考：[FastMCP实现方案](ohcard-fastmcp/readme_fastmcp.md)

## 功能特性

无论选择哪种实现方案，都提供以下完整功能：

### 核心功能
| 功能名称 | 描述 |
|---------|------|
| `what_is_oh_cards` | 介绍什么是OH卡 |
| `get_oh_card_process` | 获取OH卡抽取流程 |
| `draw_oh_card` | 抽取一张OH卡 |
| `get_guidance_questions` | 获取引导问题来帮助用户探索卡牌 |
| `get_all_question_types` | 获取所有引导问题类型 |
| `get_all_cards_preview` | 获取所有OH卡的预览信息 |

### 使用流程

1. **确定心中的卡点**：思考你最近遇到的困惑或问题
2. **抽取OH卡**：使用`draw_oh_card`功能抽取一张卡牌
3. **问题引导**：通过`get_guidance_questions`获取引导问题
4. **寻找启发**：深入思考并回答引导问题，发现内在智慧
5. **完成体验**：总结这次抽卡体验给你的启发和洞察

## 选择指南

### 选择NPX方案，如果你：
- 想要快速体验OH卡功能
- 不想配置复杂的Python环境
- 希望一条命令就能使用
- 对功能定制需求不高

### 选择FastMCP方案，如果你：
- 是Python开发者
- 需要定制OH卡功能
- 想要深度控制服务器逻辑
- 计划添加新功能或修改现有功能

## 示例用法

在Claude Desktop中配置好后，你可以这样使用：

```
我：我最近在工作上遇到一些困惑，想用OH卡来探索一下内心的声音。

Claude：我来帮你使用OH卡进行内心探索。让我先为你抽取一张OH卡。

[调用 draw_oh_card 功能]

你抽到的OH卡是：[显示卡牌图像]

这张卡牌想告诉你什么呢？让我为你提供一些引导问题来深入探索...

[调用 get_guidance_questions 功能]
```

## 技术支持

- **NPX方案问题**：请查看ohcard-npx-pack目录下的相关文档
- **FastMCP方案问题**：请查看[FastMCP实现方案文档](ohcard-fastmcp/readme_fastmcp.md)
- **通用问题**：请提交GitHub Issue

## 贡献指南

欢迎为项目贡献代码或建议！

1. Fork本项目
2. 创建功能分支
3. 提交更改
4. 发起Pull Request

## 许可证

MIT License - 详见LICENSE文件

## 相关链接

- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- [Claude Desktop](https://claude.ai/desktop)
- [FastMCP框架](https://github.com/microsoft/FastMCP)
- [NPM包地址](https://www.npmjs.com/package/@cosmowind/ohcard-mcp)

---

**选择最适合你的方案开始OH卡探索之旅吧！** ✨ 