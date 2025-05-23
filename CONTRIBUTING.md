# 贡献指南

感谢你对OH卡探索工具项目的关注！我们欢迎任何形式的贡献，无论是新功能、错误修复、文档改进，还是其他建议。

## 如何贡献

### 报告问题

如果你发现了bug或有新功能建议，请通过以下步骤提交问题：

1. 首先检查是否已存在相同或类似的问题
2. 如果没有，请创建一个新的issue
3. 尽可能详细地描述问题，包括：
   - 问题的具体表现
   - 复现步骤
   - 预期行为
   - 环境信息（操作系统、Python版本等）
   - 如果可能，附上截图或日志

### 提交代码

如果你想直接贡献代码，请遵循以下步骤：

1. Fork本仓库
2. 创建你的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m '添加了某某功能'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 提交Pull Request

### Pull Request规范

为了使你的PR更容易被接受，请确保：

- 你的代码符合项目的编码风格
- 你为新功能编写了测试
- 所有测试都能通过
- 你已更新了相关文档

## 开发环境设置

1. 克隆你fork的仓库到本地
2. 安装开发依赖：
   ```bash
   pip install -r requirements.txt
   ```
3. 运行测试确保一切正常：
   ```bash
   python -m unittest discover tests
   ```

## 项目结构

```
oh-cards-explorer/
├── docs/                  # 文档
├── tests/                 # 测试文件
├── ohcard.py              # 主程序
├── example_client.py      # 示例客户端
├── run.py                 # 运行脚本
├── setup.py               # 安装脚本
├── requirements.txt       # 依赖
├── README.md              # 项目简介
└── LICENSE                # 许可证
```

## 添加新卡牌

如果你想添加新的OH卡，请修改`ohcard.py`文件中的`OH_CARDS`字典，格式如下：

```python
OH_CARDS = {
    # ... 现有卡牌 ...
    10: {
        "image_url": "https://example.com/path/to/your/card.png"
    },
    # ... 更多卡牌 ...
}
```

## 添加新的引导问题

要添加新的引导问题，请修改`ohcard.py`文件中的`GUIDANCE_QUESTIONS`字典：

```python
GUIDANCE_QUESTIONS = {
    # ... 现有问题类型 ...
    "新问题类型": [
        "这是第一个问题?",
        "这是第二个问题?",
        # ... 更多问题 ...
    ],
}
```

## 编码规范

- 使用4个空格进行缩进
- 函数和类应有清晰的文档字符串
- 变量名使用小写加下划线
- 类名使用驼峰命名法
- 遵循[PEP 8](https://www.python.org/dev/peps/pep-0008/)规范

## 联系我们

如果你有任何问题或建议，请通过issue或者邮件联系我们。

感谢你的贡献！ 