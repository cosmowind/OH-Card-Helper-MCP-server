# OH卡心理投射工具MCP服务器 - NPX包开发指南

[![npm version](https://badge.fury.io/js/%40cosmowind%2Fohcard-mcp.svg)](https://badge.fury.io/js/%40cosmowind%2Fohcard-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

🌟 一个基于MCP（Model Context Protocol）的OH卡心理投射工具服务器，通过npx提供便捷的安装和使用体验。

## ✨ 什么是OH卡？

OH卡（Open Heart Cards）是一套心理投射工具，通过图像来帮助人们探索内心世界、获得洞察和启发。每个人对同一张卡的解读都是独特的，这正是它的魅力所在。

### 🎯 核心功能

- **🎴 随机抽卡**: 从9张精美的OH卡中随机抽取一张
- **🤔 引导问题**: 提供五类专业引导问题帮助深入探索
- **🌈 情感投射**: 通过图像投射内心状态和感受
- **💡 启发思考**: 从新角度看待问题和挑战
- **🔮 直觉连接**: 激活内在智慧和直觉

## 🚀 快速使用

### 在Claude Desktop中使用

1. **配置Claude Desktop**：
   
   在Claude Desktop的配置文件中添加以下配置：

   ```json
   {
     "mcpServers": {
       "ohcard": {
         "command": "npx",
         "args": [
           "-y",
           "@cosmowind/ohcard-mcp"
         ]
       }
     }
   }
   ```

2. **重启Claude Desktop**，OH卡MCP服务器将自动启动

3. **开始使用**：
   - "介绍一下OH卡"
   - "我想抽一张OH卡"
   - "给我一些引导问题"

### 直接运行

```bash
# 使用npx直接运行（推荐）
npx @cosmowind/ohcard-mcp

# 或者全局安装后运行
npm install -g @cosmowind/ohcard-mcp
ohcard-mcp
```

## 🛠️ 系统要求

- **Node.js**: 14.0.0 或更高版本
- **npm**: 最新版本
- **网络连接**: 用于下载依赖和查看卡片图像

## 🎮 可用工具

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

## 📦 NPX包开发指南

### 🏗️ 项目结构

创建一个标准的npm包结构：

```
your-npx-package/
├── bin/
│   └── index.js          # 主入口文件（带shebang）
├── package.json          # 包配置文件
├── README.md            # 项目文档
├── LICENSE              # 许可证
└── .gitignore           # Git忽略文件
```

### 📄 核心文件配置

#### 1. package.json配置

```json
{
  "name": "@yourusername/your-package-name",
  "version": "1.0.0",
  "description": "你的包描述",
  "main": "bin/index.js",
  "bin": {
    "your-command": "bin/index.js"
  },
  "scripts": {
    "start": "node bin/index.js",
    "test": "echo \"暂无测试\" && exit 0"
  },
  "keywords": [
    "mcp",
    "npx",
    "tool"
  ],
  "author": "Your Name",
  "license": "MIT",
  "engines": {
    "node": ">=14.0.0"
  },
  "dependencies": {},
  "files": [
    "bin/",
    "README.md",
    "LICENSE"
  ]
}
```

#### 2. bin/index.js配置

```javascript
#!/usr/bin/env node

// 必须的shebang行，让系统知道用Node.js执行
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// 你的应用逻辑
function main() {
    console.log('🚀 启动你的npx应用...');
    // 应用代码
}

// 启动应用
main();
```

### 🔧 NPX开发流程

#### 第一步：初始化项目

```bash
# 创建项目目录
mkdir your-npx-package
cd your-npx-package

# 初始化npm项目
npm init -y

# 创建bin目录
mkdir bin

# 创建主入口文件
touch bin/index.js
```

#### 第二步：配置package.json

重要字段说明：

- **`bin`**: 定义命令行命令名称和对应的执行文件
- **`main`**: 包的主入口文件
- **`files`**: 指定发布时包含的文件/目录
- **`engines`**: 指定Node.js版本要求
- **`keywords`**: 帮助用户搜索到你的包

#### 第三步：编写应用代码

```javascript
#!/usr/bin/env node

// bin/index.js 示例
const packageInfo = require('../package.json');

function showHelp() {
    console.log(`
${packageInfo.name} v${packageInfo.version}

用法:
  npx ${packageInfo.name}

选项:
  --help, -h     显示帮助信息
  --version, -v  显示版本信息
`);
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
        showHelp();
        return;
    }
    
    if (args.includes('--version') || args.includes('-v')) {
        console.log(packageInfo.version);
        return;
    }
    
    // 你的主要逻辑
    console.log('🚀 应用正在运行...');
}

main();
```

### 📋 本地测试方法

#### 方法1：npm link测试

```bash
# 在项目目录中
npm link

# 测试命令（假设命令名为your-command）
your-command

# 测试完成后清理
npm unlink
```

#### 方法2：npm pack测试

```bash
# 打包项目
npm pack

# 全局安装测试包
npm install -g ./your-package-1.0.0.tgz

# 测试命令
your-command

# 清理
npm uninstall -g your-package
```

#### 方法3：直接运行测试

```bash
# 直接运行主文件
node bin/index.js

# 或使用npm script
npm start
```

### 🚀 发布到npm流程

#### 第一步：准备发布

```bash
# 检查package.json配置
npm pkg fix

# 检查将要发布的文件
npm pack --dry-run

# 实际打包查看
npm pack
```

#### 第二步：npm账户设置

```bash
# 注册npm账户（如果没有）
npm adduser

# 或登录现有账户
npm login

# 验证登录状态
npm whoami
```

#### 第三步：发布前检查

```bash
# 检查npm注册表（必须是官方源）
npm config get registry
# 应该显示: https://registry.npmjs.org/

# 如果不是官方源，切换到官方源
npm config set registry https://registry.npmjs.org/
```

#### 第四步：发布包

```bash
# 发布公开包（如果使用作用域名称） 发布前在package.json中把版本号改一下
npm publish --access public

# 发布普通包
npm publish

# 发布成功后验证
npm view your-package-name
```

### 🔄 版本管理

#### 更新版本号

```bash
# 补丁版本更新 (1.0.0 -> 1.0.1)
npm version patch

# 小版本更新 (1.0.0 -> 1.1.0)
npm version minor

# 大版本更新 (1.0.0 -> 2.0.0)
npm version major

# 预发布版本 (1.0.0 -> 1.0.1-0)
npm version prerelease
```

#### 发布新版本

```bash
# 更新版本号并发布
npm version patch && npm publish --access public
```

### 🐛 故障排除

#### ❌ 问题1：npm发布认证失败

```
npm error need auth This command requires you to be logged in
```

**解决方案**:
```bash
# 检查当前注册表
npm config get registry

# 切换到官方npm注册表
npm config set registry https://registry.npmjs.org/

# 重新登录
npm login

# 发布
npm publish --access public
```

#### ❌ 问题2：包名冲突

```
npm error 403 Forbidden - PUT https://registry.npmjs.org/package-name
```

**解决方案**:
- 使用作用域名称：`@yourusername/package-name`
- 更换包名
- 检查npm官网是否已存在同名包

#### ❌ 问题3：shebang权限问题

**解决方案**:
```bash
# 确保bin文件有shebang行
#!/usr/bin/env node

# 在Unix系统中设置执行权限
chmod +x bin/index.js
```

#### ❌ 问题4：npx运行失败

**解决方案**:
```bash
# 检查Node.js版本
node --version

# 清除npx缓存
npx --version
npx clear-npx-cache

# 强制重新安装
npx --ignore-existing your-package-name
```

### 📊 发布后的管理

#### 查看包信息

```bash
# 查看包基本信息
npm view your-package-name

# 查看版本历史
npm view your-package-name versions --json

# 查看下载统计
npm view your-package-name

# 查看依赖信息
npm view your-package-name dependencies
```

#### 撤销发布

```bash
# 撤销特定版本（72小时内）
npm unpublish your-package-name@1.0.0

# 撤销整个包（谨慎使用）
npm unpublish your-package-name --force
```

#### 标签管理

```bash
# 添加标签
npm dist-tag add your-package-name@1.0.0 beta

# 查看标签
npm dist-tag ls your-package-name

# 删除标签
npm dist-tag rm your-package-name beta
```

## 💡 最佳实践

### 📝 代码规范

1. **shebang必须**: `#!/usr/bin/env node`
2. **错误处理**: 妥善处理异常情况
3. **帮助信息**: 提供`--help`选项
4. **版本信息**: 提供`--version`选项

### 📦 包配置

1. **keywords优化**: 便于用户搜索
2. **files字段**: 只包含必要文件
3. **engines限制**: 明确Node.js版本要求
4. **license明确**: 选择合适的开源许可证

### 🚀 发布策略

1. **语义化版本**: 遵循semver规范
2. **changelog维护**: 记录版本变更
3. **测试充分**: 本地测试后再发布
4. **文档完善**: README详细说明使用方法

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 🤝 贡献

本方案学习了：https://juejin.cn/post/7492640608206618634

欢迎提交Issues和Pull Requests！

## 📞 联系方式

- **作者**: CosmoWind
- **npm包**: https://www.npmjs.com/package/@cosmowind/ohcard-mcp
- **主页**: https://github.com/cosmowind/ohcard-mcp
- **Issues**: https://github.com/cosmowind/ohcard-mcp/issues

---

💫 **愿这份npx开发指南帮助你创建出色的命令行工具！** ✨ 