# OH卡探索工具 - FastMCP实现方案

## 概述

这是基于[FastMCP](https://github.com/microsoft/FastMCP)框架实现的OH卡探索工具MCP服务器。通过Python开发，提供完整的OH卡心理投射功能，支持Claude Desktop等MCP客户端调用。

## 什么是FastMCP？

FastMCP是微软开源的Model Context Protocol (MCP)实现框架，专门用于快速构建MCP服务器。它提供了：

- 🚀 **快速开发**：简化的API和装饰器语法
- 🔧 **易于集成**：支持多种客户端连接方式
- 📡 **标准协议**：完全兼容MCP标准
- 🐍 **Python原生**：基于Python生态系统

## 项目结构

```
ohcard-fastmcp/
├── ohcard.py              # 主要的MCP服务器实现
├── setup.py               # Python包安装配置
├── requirements.txt       # 依赖项配置
├── run.py                 # 启动脚本
├── example_client.py      # 示例客户端代码
├── example_mcp.json       # MCP配置示例
├── tests/                 # 测试文件目录
└── docs/                  # 文档目录
```

## 核心实现

### 1. MCP服务器主文件 (ohcard.py)

基于FastMCP框架构建，提供以下核心功能：

#### 主要工具函数：
- `what_is_oh_cards()` - OH卡介绍
- `get_oh_card_process()` - 抽卡流程指导
- `draw_oh_card(intention)` - 抽取OH卡
- `get_guidance_questions(question_type)` - 获取引导问题
- `get_all_question_types()` - 获取问题类型列表
- `get_all_cards_preview()` - 获取所有卡牌预览

#### 技术特点：
- 使用`@app.tool()`装饰器定义MCP工具
- 异步函数支持高并发访问
- 详细的日志记录和错误处理
- 类型提示确保代码质量

### 2. 数据结构设计

#### OH卡数据结构：
```python
OH_CARDS = {
    1: {"image_url": "https://cosmowind.github.io/oh-cards/images/card_01.png"},
    2: {"image_url": "https://cosmowind.github.io/oh-cards/images/card_02.png"},
    # ... 更多卡牌
}
```

#### 引导问题库：
```python
GUIDANCE_QUESTIONS = {
    "观察感受": [...],
    "深入探索": [...],
    "情境代入": [...],
    "内心连接": [...],
    "启发行动": [...]
}
```

### 3. 启动和配置

#### 依赖要求 (requirements.txt)：
```
fastmcp>=2.4.0
```

#### 启动方式：
1. **直接启动**：`python ohcard.py`
2. **脚本启动**：`python run.py`
3. **包安装后启动**：`ohcard-server`

## 安装和使用

### 1. 环境准备

```bash
# 确保Python版本
python --version  # 需要 >= 3.7

# 创建虚拟环境（推荐）
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
venv\Scripts\activate     # Windows
```

### 2. 安装依赖

```bash
cd ohcard-fastmcp
pip install -r requirements.txt
```

### 3. 启动服务器

```bash
# 方法1：直接启动
python ohcard.py

# 方法2：使用启动脚本
python run.py

# 方法3：开发环境安装
pip install -e .
ohcard-server
```

### 4. Claude Desktop配置

在Claude Desktop的配置文件中添加：

```json
{
  "mcpServers": {
    "ohcard-helper": {
      "command": "python",
      "args": [
        "/path/to/ohcard-fastmcp/ohcard.py"
      ]
    }
  }
}
```

## 功能特性

### 1. 心理投射工具
- 提供9张精选OH卡图像
- 支持意图导向的抽卡
- 丰富的引导问题库

### 2. 完整的体验流程
- 五步骤抽卡流程指导
- 多维度问题引导系统
- 个性化的探索体验

### 3. 技术优势
- 异步处理，响应迅速
- 详细日志记录
- 错误处理机制
- 易于扩展和维护

## 开发指南

### 1. 添加新工具

```python
@app.tool()
async def new_tool_function(param: str) -> Dict:
    """
    新工具的描述
    
    Args:
        param: 参数描述
    
    Returns:
        返回值描述
    """
    # 实现逻辑
    result = {"message": f"处理参数: {param}"}
    logging.info(f'新工具被调用: {param}')
    return result
```

### 2. 扩展卡牌数据

在`OH_CARDS`字典中添加新的卡牌：

```python
OH_CARDS[10] = {
    "image_url": "https://your-domain.com/new-card.png"
}
```

### 3. 添加新的问题类型

在`GUIDANCE_QUESTIONS`中添加新分类：

```python
GUIDANCE_QUESTIONS["新分类"] = [
    "新的引导问题1？",
    "新的引导问题2？",
    # ...
]
```

## 部署方案

### 1. 本地开发
- 直接运行Python脚本
- 使用pip开发模式安装

### 2. 服务器部署
- 使用systemd服务管理
- 配置nginx反向代理
- 使用Docker容器化

### 3. 云平台部署
- 支持各大云服务商
- 容器化部署
- CI/CD自动化

## 测试和调试

### 1. 单元测试
```bash
cd ohcard-fastmcp
python -m pytest tests/
```

### 2. 功能测试
```bash
# 使用示例客户端测试
python example_client.py
```

### 3. 调试模式
设置环境变量启用详细日志：
```bash
export LOG_LEVEL=DEBUG
python ohcard.py
```

## 常见问题

### 1. FastMCP依赖问题
**问题**：安装fastmcp失败
**解决**：
```bash
pip install --upgrade pip
pip install fastmcp>=2.4.0
```

### 2. 图片显示问题
**问题**：Claude中无法显示图片
**解决**：确保图片URL可公开访问，检查CORS设置

### 3. 连接问题
**问题**：Claude Desktop无法连接
**解决**：
- 检查Python路径配置
- 确认脚本权限
- 查看Claude Desktop日志

## 版本历史

- **v0.1.0** - 初始版本，基础OH卡功能
- 后续版本将添加更多功能和优化

## 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 发起Pull Request

## 许可证

MIT License - 详见LICENSE文件

## 相关链接

- [FastMCP官方文档](https://github.com/microsoft/FastMCP)
- [MCP协议规范](https://modelcontextprotocol.io/)
- [Claude Desktop配置指南](https://claude.ai/docs/desktop)

---

**注意**：这个实现方案适合需要完全控制服务器逻辑、有Python开发能力的场景。如果需要更简单的部署方案，可以考虑使用NPX包方案。 