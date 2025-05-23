# OH卡探索工具 (OH Cards Explorer)

这是一个基于[FastMCP](https://github.com/microsoft/FastMCP)的OH卡探索工具，帮助用户通过OH卡进行自我探索和内心洞察。

## 什么是OH卡？

OH卡（Open Heart Cards）是一套心理投射工具，通过图像来帮助人们探索内心世界、获得洞察和启发。

- 🎯 **投射工具**：通过图像投射内心状态
- 🌟 **自我探索**：深入了解内在需求和感受
- 💡 **启发思考**：从新角度看待问题和挑战
- 🌈 **情感表达**：帮助表达难以言喻的感受
- 🔮 **直觉连接**：激活内在智慧和直觉

## 安装指南

### 前提条件

- Python 3.11+
- [FastMCP](https://github.com/microsoft/FastMCP) 库

### 安装步骤

1. 克隆此仓库：

```bash
git clone https://github.com/yourusername/oh-cards-explorer.git
cd oh-cards-explorer
```

2. 安装依赖：

```bash
pip install -r requirements.txt
```

## 使用方法

### 启动服务器

```bash
python ohcard.py
```

### 配置MCP客户端

在你的MCP客户端配置文件（通常是`mcp.json`）中添加以下配置：

```json
{
  "mcpServers": {
    "ohcard-helper": {
      "command": "python",
      "args": [
        "path/to/ohcard.py"
      ]
    }
  }
}
```

请将`path/to/ohcard.py`替换为实际的路径。

### 使用流程

1. **确定心中的卡点**：思考你最近遇到的困惑或问题
2. **抽取OH卡**：使用`draw_oh_card`功能抽取一张卡牌
3. **问题引导**：通过`get_guidance_questions`获取引导问题
4. **寻找启发**：深入思考并回答引导问题，发现内在智慧
5. **完成体验**：总结这次抽卡体验给你的启发和洞察

## 功能列表

| 功能名称 | 描述 |
|---------|------|
| `what_is_oh_cards` | 介绍什么是OH卡 |
| `get_oh_card_process` | 获取OH卡抽取流程 |
| `draw_oh_card` | 抽取一张OH卡 |
| `get_guidance_questions` | 获取引导问题来帮助用户探索卡牌 |
| `get_all_question_types` | 获取所有引导问题类型 |
| `get_all_cards_preview` | 获取所有OH卡的预览信息 |

## 示例

### 抽取一张OH卡

```python
# 使用MCP客户端调用
result = await mcp_client.invoke("ohcard-helper", "draw_oh_card", {"intention": "我该如何处理工作压力"})
print(f"你的OH卡：{result['image_url']}")
```

### 获取引导问题

```python
# 使用MCP客户端调用
questions = await mcp_client.invoke("ohcard-helper", "get_guidance_questions", {"question_type": "深入探索"})
for q in questions["questions"]:
    print(f"- {q}")
```

## 贡献指南

欢迎提交Pull Request或Issue来帮助改进这个项目！

## 许可证

MIT License 