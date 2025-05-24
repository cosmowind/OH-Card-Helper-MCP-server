import { RestServerTransport } from "@chatmcp/sdk/server/rest.js";
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

const app = express();
app.use(express.json());

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ohcard-mcp-cloud',
    version: '1.0.0'
  });
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
  res.json({
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
  });
});

// OH卡工具函数端点
app.post('/tools/what_is_oh_cards', (req, res) => {
  try {
    const result = whatIsOhCards();
    res.json({
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }],
      isError: false
    });
  } catch (error) {
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
    res.json({
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }],
      isError: false
    });
  } catch (error) {
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
    res.json({
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }],
      isError: false
    });
  } catch (error) {
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
    res.json({
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }],
      isError: false
    });
  } catch (error) {
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
    res.json({
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }],
      isError: false
    });
  } catch (error) {
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
    res.json({
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }],
      isError: false
    });
  } catch (error) {
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
  res.status(404).json({
    error: 'Not Found',
    message: '请使用 /health, /tools/list 或正确的工具端点'
  });
});

// 启动服务器
async function startServer() {
  const mode = getParamValue("mode") || "rest";
  const port = getParamValue("port") || 9593;
  
  if (mode === "rest") {
    app.listen(port, () => {
      console.log(`🚀 OH卡云服务器启动成功！`);
      console.log(`📡 HTTP API地址: http://localhost:${port}`);
      console.log(`🔍 健康检查: http://localhost:${port}/health`);
      console.log(`📋 工具列表: http://localhost:${port}/tools/list`);
      console.log(`\n✨ 可用的工具端点:`);
      console.log(`  POST /tools/what_is_oh_cards - OH卡介绍`);
      console.log(`  POST /tools/get_oh_card_process - 抽卡流程`);
      console.log(`  POST /tools/draw_oh_card - 抽取卡牌`);
      console.log(`  POST /tools/get_guidance_questions - 引导问题`);
      console.log(`  POST /tools/get_all_question_types - 问题类型`);
      console.log(`  POST /tools/get_all_cards_preview - 卡牌预览`);
    });
  } else {
    console.log("📋 stdio模式暂时不可用，请使用 npm run rest 测试REST API");
  }
}

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n👋 正在优雅关闭服务器...');
  process.exit(0);
});

// 启动
startServer().catch(console.error); 