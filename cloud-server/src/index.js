import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import express from 'express';
import {
  whatIsOhCards,
  getOhCardProcess,
  drawOhCard,
  getGuidanceQuestions,
  getAllQuestionTypes,
  getAllCardsPreview
} from './ohcard/tools.js';

// 获取参数的工具函数
function getParamValue(key) {
  return process.env[key.toUpperCase()] || "";
}

// 日志功能
function log(level, message, ...args) {
  const timestamp = new Date().toISOString();
  const logLevel = process.env.LOG_LEVEL || 'info';
  const levels = { error: 0, warn: 1, info: 2, debug: 3 };
  
  if (levels[level] <= levels[logLevel]) {
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, ...args);
  }
}

const app = express();
app.use(express.json());

// 请求日志中间件
app.use((req, res, next) => {
  log('debug', `${req.method} ${req.path}`, { 
    userAgent: req.get('User-Agent'),
    ip: req.ip 
  });
  next();
});

// 健康检查端点
app.get('/health', (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ohcard-mcp-cloud',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  };
  log('debug', '健康检查请求', health);
  res.json(health);
});

// 简单的测试端点
app.post('/tools/test_connection', (req, res) => {
  res.json({
    content: [{
      type: "text",
      text: "🎉 云服务器MCP连接成功！基础HTTP API工作正常。"
    }],
    isError: false
  });
});

// 工具列表端点
app.get('/tools/list', (req, res) => {
  const tools = {
    tools: [
      {
        name: "what_is_oh_cards",
        description: "介绍什么是OH卡",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_oh_card_process",
        description: "获取OH卡抽取流程",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "draw_oh_card",
        description: "抽取一张OH卡",
        inputSchema: {
          type: "object",
          properties: {
            intention: {
              type: "string",
              description: "用户的意图或想要探索的问题（可选）",
            },
          },
        },
      },
      {
        name: "get_guidance_questions",
        description: "获取引导问题来帮助用户探索卡牌",
        inputSchema: {
          type: "object",
          properties: {
            question_type: {
              type: "string",
              description: "问题类型 (\"观察感受\", \"深入探索\", \"情境代入\", \"内心连接\", \"启发行动\", \"random\")",
              default: "random",
            },
          },
        },
      },
      {
        name: "get_all_question_types",
        description: "获取所有引导问题类型",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_all_cards_preview",
        description: "获取所有OH卡的预览信息（仅显示图片URL）",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
  log('info', '工具列表请求', { toolCount: tools.tools.length });
  res.json(tools);
});

// OH卡工具函数端点
app.post('/tools/what_is_oh_cards', (req, res) => {
  try {
    const result = whatIsOhCards();
    log('info', 'OH卡介绍调用成功');
    res.json({
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }],
      isError: false
    });
  } catch (error) {
    log('error', 'OH卡介绍调用失败', error);
    res.status(500).json({
      content: [{
        type: "text",
        text: `错误: ${error.message}`
      }],
      isError: true
    });
  }
});

app.post('/tools/get_oh_card_process', (req, res) => {
  try {
    const result = getOhCardProcess();
    log('info', '抽卡流程调用成功');
    res.json({
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }],
      isError: false
    });
  } catch (error) {
    log('error', '抽卡流程调用失败', error);
    res.status(500).json({
      content: [{
        type: "text",
        text: `错误: ${error.message}`
      }],
      isError: true
    });
  }
});

app.post('/tools/draw_oh_card', (req, res) => {
  try {
    const { intention } = req.body.arguments || {};
    const result = drawOhCard(intention);
    log('info', '抽卡调用成功', { cardId: result.card_id, intention });
    res.json({
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }],
      isError: false
    });
  } catch (error) {
    log('error', '抽卡调用失败', error);
    res.status(500).json({
      content: [{
        type: "text",
        text: `错误: ${error.message}`
      }],
      isError: true
    });
  }
});

app.post('/tools/get_guidance_questions', (req, res) => {
  try {
    const { question_type } = req.body.arguments || {};
    const result = getGuidanceQuestions(question_type);
    log('info', '引导问题调用成功', { questionType: result.question_type });
    res.json({
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }],
      isError: false
    });
  } catch (error) {
    log('error', '引导问题调用失败', error);
    res.status(500).json({
      content: [{
        type: "text",
        text: `错误: ${error.message}`
      }],
      isError: true
    });
  }
});

app.post('/tools/get_all_question_types', (req, res) => {
  try {
    const result = getAllQuestionTypes();
    log('info', '问题类型调用成功');
    res.json({
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }],
      isError: false
    });
  } catch (error) {
    log('error', '问题类型调用失败', error);
    res.status(500).json({
      content: [{
        type: "text",
        text: `错误: ${error.message}`
      }],
      isError: true
    });
  }
});

app.post('/tools/get_all_cards_preview', (req, res) => {
  try {
    const result = getAllCardsPreview();
    log('info', '卡牌预览调用成功');
    res.json({
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }],
      isError: false
    });
  } catch (error) {
    log('error', '卡牌预览调用失败', error);
    res.status(500).json({
      content: [{
        type: "text",
        text: `错误: ${error.message}`
      }],
      isError: true
    });
  }
});

// 404处理
app.use((req, res) => {
  log('warn', '404请求', { path: req.path, method: req.method });
  res.status(404).json({
    error: 'Not Found',
    message: '请使用 /health, /tools/list 或正确的工具端点'
  });
});

// 错误处理中间件
app.use((error, req, res, next) => {
  log('error', '未处理的错误', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? '服务器内部错误' : error.message
  });
});

// 创建MCP服务器实例
const mcpServer = new Server(
  {
    name: "ohcard-mcp-cloud",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 注册工具列表处理器
mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "what_is_oh_cards",
        description: "介绍什么是OH卡",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_oh_card_process",
        description: "获取OH卡抽取流程",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "draw_oh_card",
        description: "抽取一张OH卡",
        inputSchema: {
          type: "object",
          properties: {
            intention: {
              type: "string",
              description: "用户的意图或想要探索的问题（可选）",
            },
          },
        },
      },
      {
        name: "get_guidance_questions",
        description: "获取引导问题来帮助用户探索卡牌",
        inputSchema: {
          type: "object",
          properties: {
            question_type: {
              type: "string",
              description: "问题类型 (\"观察感受\", \"深入探索\", \"情境代入\", \"内心连接\", \"启发行动\", \"random\")",
              default: "random",
            },
          },
        },
      },
      {
        name: "get_all_question_types",
        description: "获取所有引导问题类型",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_all_cards_preview",
        description: "获取所有OH卡的预览信息（仅显示图片URL）",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

// 注册工具调用处理器
mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;
    
    switch (name) {
      case "what_is_oh_cards": {
        const result = whatIsOhCards();
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          isError: false,
        };
      }
      
      case "get_oh_card_process": {
        const result = getOhCardProcess();
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          isError: false,
        };
      }
      
      case "draw_oh_card": {
        const { intention } = args || {};
        const result = drawOhCard(intention);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          isError: false,
        };
      }
      
      case "get_guidance_questions": {
        const { question_type } = args || {};
        const result = getGuidanceQuestions(question_type);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          isError: false,
        };
      }
      
      case "get_all_question_types": {
        const result = getAllQuestionTypes();
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          isError: false,
        };
      }
      
      case "get_all_cards_preview": {
        const result = getAllCardsPreview();
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          isError: false,
        };
      }
      
      default:
        throw new Error(`未知的工具: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `错误: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// 启动服务器
async function startServer() {
  const mode = process.argv[2] || getParamValue("mode") || "rest";
  const port = parseInt(getParamValue("port")) || 9593;
  const env = process.env.NODE_ENV || 'development';
  
  if (mode === "stdio") {
    // stdio模式 - 用于本地MCP客户端
    const transport = new StdioServerTransport();
    await mcpServer.connect(transport);
    log('info', "🚀 OH卡MCP服务器启动成功 (stdio模式)");
    
  } else if (mode === "rest") {
    // REST模式 - 用于云端部署
    const server = app.listen(port, '0.0.0.0', () => {
      log('info', `🚀 OH卡云服务器启动成功！`);
      log('info', `📡 HTTP API地址: http://0.0.0.0:${port}`);
      log('info', `🔍 健康检查: http://0.0.0.0:${port}/health`);
      log('info', `📋 工具列表: http://0.0.0.0:${port}/tools/list`);
      log('info', `🌍 运行环境: ${env}`);
      log('info', `📊 日志级别: ${process.env.LOG_LEVEL || 'info'}`);
      log('info', `\n✨ 可用的工具端点:`);
      log('info', `  POST /tools/what_is_oh_cards - OH卡介绍`);
      log('info', `  POST /tools/get_oh_card_process - 抽卡流程`);
      log('info', `  POST /tools/draw_oh_card - 抽取卡牌`);
      log('info', `  POST /tools/get_guidance_questions - 引导问题`);
      log('info', `  POST /tools/get_all_question_types - 问题类型`);
      log('info', `  POST /tools/get_all_cards_preview - 卡牌预览`);
    });
    
    // 优雅关闭
    const gracefulShutdown = (signal) => {
      log('info', `收到 ${signal} 信号，开始优雅关闭...`);
      server.close(() => {
        log('info', '服务器已关闭');
        process.exit(0);
      });
    };
    
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    
  } else {
    throw new Error(`未知的模式: ${mode}。请使用 'stdio' 或 'rest'`);
  }
}

// 启动
startServer().catch((error) => {
  log('error', '服务器启动失败', error);
  process.exit(1);
}); 