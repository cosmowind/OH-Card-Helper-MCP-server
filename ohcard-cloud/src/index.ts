#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { RestServerTransport } from "@chatmcp/sdk/server/rest.js";
import { getParamValue, getAuthValue } from "@chatmcp/sdk/utils/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

// OH卡数据结构
const OH_CARDS = {
  1: {
    image_url: "https://cosmowind.github.io/oh-cards/images/card_01.png"
  },
  2: {
    image_url: "https://cosmowind.github.io/oh-cards/images/card_02.png"
  },
  3: {
    image_url: "https://cosmowind.github.io/oh-cards/images/card_03.png"
  },
  4: {
    image_url: "https://cosmowind.github.io/oh-cards/images/card_04.png"
  },
  5: {
    image_url: "https://cosmowind.github.io/oh-cards/images/card_05.png"
  },
  6: {
    image_url: "https://cosmowind.github.io/oh-cards/images/card_06.png"
  },
  7: {
    image_url: "https://cosmowind.github.io/oh-cards/images/card_07.png"
  },
  8: {
    image_url: "https://cosmowind.github.io/oh-cards/images/card_08.png"
  },
  9: {
    image_url: "https://cosmowind.github.io/oh-cards/images/card_09.png"
  }
};

// 引导问题库
const GUIDANCE_QUESTIONS = {
  "观察感受": [
    "看到了什么？感受如何？",
    "抽到的卡牌与你最近发生的事或感受相关吗？",
    "你说卡牌中的两个主角，他们是什么关系？",
    "这张卡牌给你的第一印象是什么？",
    "卡牌中最吸引你注意力的是什么？"
  ],
  "深入探索": [
    "我很好奇，你为什么会这样描述它？",
    "你注意到的这个细节，你觉得它是什么？从哪里来的？",
    "你觉得这个人在做什么？ta做这件事有什么感受？",
    "如果你能听到卡牌中的声音，会是什么？",
    "这个画面让你想起了什么回忆或经历？"
  ],
  "情境代入": [
    "卡中人物处在什么环境中？环境对ta有什么影响？",
    "你在这个卡牌中吗？你是里面的谁？在做什么？感受如何？",
    "你的故事里，主角遭遇的事情，ta可以怎么解决？",
    "如果你是卡牌中的主角，你会选择什么行动？",
    "这个场景如果发生在你的生活中，会是什么样子？"
  ],
  "内心连接": [
    "这张卡牌反映了你内心的哪个部分？",
    "卡牌中的情境与你当前的处境有什么相似之处？",
    "从这张卡牌中，你看到了什么解决问题的可能性？",
    "这张卡牌想告诉你什么重要的信息？",
    "如果这张卡牌是一面镜子，它照出了你的什么？"
  ],
  "启发行动": [
    "这张卡牌给了你什么启发来处理你的困惑？",
    "根据卡牌的提示，你可以采取什么具体行动？",
    "这张卡牌如何帮助你看待当前的挑战？",
    "从卡牌中得到的洞察，你准备如何应用到生活中？",
    "这次抽卡体验让你对自己有了什么新的认识？"
  ]
};

// 获取参数
const mode = getParamValue("mode") || "stdio";
const port = parseInt(getParamValue("port") || "9593");
const endpoint = getParamValue("endpoint") || "/rest";

// 创建服务器实例
const server = new Server(
  {
    name: "ohcard-cloud-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 定义工具
const WHAT_IS_OH_CARDS_TOOL: Tool = {
  name: "what_is_oh_cards",
  description: "介绍什么是OH卡",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

const GET_OH_CARD_PROCESS_TOOL: Tool = {
  name: "get_oh_card_process",
  description: "获取OH卡抽取流程",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

const DRAW_OH_CARD_TOOL: Tool = {
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
};

const GET_GUIDANCE_QUESTIONS_TOOL: Tool = {
  name: "get_guidance_questions",
  description: "获取引导问题来帮助用户探索卡牌",
  inputSchema: {
    type: "object",
    properties: {
      question_type: {
        type: "string",
        description: "问题类型",
        enum: ["观察感受", "深入探索", "情境代入", "内心连接", "启发行动", "random"],
      },
    },
  },
};

const GET_ALL_QUESTION_TYPES_TOOL: Tool = {
  name: "get_all_question_types",
  description: "获取所有引导问题类型",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

const GET_ALL_CARDS_PREVIEW_TOOL: Tool = {
  name: "get_all_cards_preview",
  description: "获取所有OH卡的预览信息",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

// 注册工具列表处理器
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      WHAT_IS_OH_CARDS_TOOL,
      GET_OH_CARD_PROCESS_TOOL,
      DRAW_OH_CARD_TOOL,
      GET_GUIDANCE_QUESTIONS_TOOL,
      GET_ALL_QUESTION_TYPES_TOOL,
      GET_ALL_CARDS_PREVIEW_TOOL,
    ],
  };
});

// 注册工具调用处理器
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "what_is_oh_cards": {
        const info = {
          title: "什么是OH卡？",
          description: "OH卡（Open Heart Cards）是一套心理投射工具，通过图像来帮助人们探索内心世界、获得洞察和启发。",
          features: [
            "🎯 投射工具：通过图像投射内心状态",
            "🌟 自我探索：深入了解内在需求和感受",
            "💡 启发思考：从新角度看待问题和挑战",
            "🌈 情感表达：帮助表达难以言喻的感受",
            "🔮 直觉连接：激活内在智慧和直觉"
          ],
          principle: "OH卡的核心原理是'投射'——我们看到的不仅仅是图像本身，更是我们内心世界的反映。每个人对同一张卡的解读都是独特的，这正是它的魅力所在。",
          benefits: [
            "获得新的视角和洞察",
            "释放内在智慧",
            "促进自我觉察",
            "激发创造性思维",
            "找到解决问题的灵感"
          ]
        };

        return {
          content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
          isError: false,
        };
      }

      case "get_oh_card_process": {
        const process = {
          title: "OH卡抽取流程",
          subtitle: "跟随这5个步骤，开启一段内心探索之旅",
          steps: [
            {
              step: 1,
              name: "确定心中的卡点",
              description: "思考你最近遇到的困惑或问题",
              guidance: "静下心来，想想最近让你困扰、迷茫或想要深入了解的事情。可以是情感问题、人际关系、工作选择、人生方向等任何让你感到需要指引的话题。",
              action: "在心中明确你想要探索的问题"
            },
            {
              step: 2,
              name: "凝聚宇宙能量",
              description: "抽取你的OH卡",
              guidance: "带着你的问题，深呼吸几次，让自己的意识与宇宙能量连接。当你感到准备好时，抽取你的OH卡。相信直觉的指引，第一张抽到的卡就是为你而来的。",
              action: "使用'draw_oh_card'功能抽取你的专属卡牌"
            },
            {
              step: 3,
              name: "问题引导",
              description: "让自己代入图片中",
              guidance: "仔细观察你的卡牌，让图像自然地与你的内心产生共鸣。不要急于分析，先感受图像给你带来的第一印象和情感反应。",
              action: "使用'get_guidance_questions'获取引导问题，帮助你深入探索"
            },
            {
              step: 4,
              name: "寻找启发",
              description: "从图片与问题中找到解决卡点的启发",
              guidance: "通过回答引导问题，将卡牌的意象与你的真实处境连接起来。探索图像中的象征意义，寻找它对你问题的启示和指引。",
              action: "深入思考并回答引导问题，发现内在智慧"
            },
            {
              step: 5,
              name: "完成体验",
              description: "拿走你的纪念卡",
              guidance: "总结这次抽卡体验给你的启发和洞察。记录下重要的感悟，并思考如何将这些洞察应用到你的实际生活中。",
              action: "保存卡牌信息作为纪念，让这份智慧伴随你前行"
            }
          ],
          tips: [
            "💫 保持开放的心态，相信直觉的指引",
            "🌟 没有标准答案，你的感受最重要",
            "💭 慢慢来，给自己充分的时间感受",
            "📝 记录下重要的洞察和启发",
            "🔄 必要时可以重新抽卡，直到找到共鸣"
          ]
        };

        return {
          content: [{ type: "text", text: JSON.stringify(process, null, 2) }],
          isError: false,
        };
      }

      case "draw_oh_card": {
        const intention = args?.intention || "";
        const cardId = Math.floor(Math.random() * 9) + 1;
        const card = OH_CARDS[cardId as keyof typeof OH_CARDS];
        
        const result = {
          card_id: cardId,
          image_url: card.image_url,
          draw_time: "刚刚",
          message: `你的OH卡已经抽取完成！请点击查看图片：${card.image_url}`,
          guidance: "仔细观察这张卡牌，让图像与你的内心产生共鸣。你可以使用'get_guidance_questions'功能获取引导问题来深入探索。"
        };

        if (intention) {
          (result as any).user_intention = intention;
          (result as any).connection_hint = `这张卡牌出现在你关于'${intention}'的询问中，请仔细观察图像，它可能包含了你需要的答案。`;
        }

        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          isError: false,
        };
      }

      case "get_guidance_questions": {
        let questionType: string = (args?.question_type as string) || "random";
        
        if (questionType === "random" || !(questionType in GUIDANCE_QUESTIONS)) {
          const types = Object.keys(GUIDANCE_QUESTIONS);
          questionType = types[Math.floor(Math.random() * types.length)];
        }

        const questions = GUIDANCE_QUESTIONS[questionType as keyof typeof GUIDANCE_QUESTIONS];
        const selectedQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 3);

        const typeDescriptions: Record<string, string> = {
          "观察感受": "帮助你观察卡牌并感受第一印象",
          "深入探索": "引导你深入挖掘卡牌的细节和含义",
          "情境代入": "让你融入卡牌情境，获得身临其境的体验",
          "内心连接": "建立卡牌与你内心世界的联系",
          "启发行动": "从卡牌中获得实际的生活指导"
        };

        const guidance = {
          question_type: questionType,
          questions: selectedQuestions,
          usage_tip: "选择一个最吸引你的问题开始，慢慢地、深入地思考。不要急于回答所有问题，重要的是质量而非数量。",
          type_description: typeDescriptions[questionType] || "综合性问题",
          next_steps: [
            "深入思考选中的问题",
            "可以使用'get_guidance_questions'获取其他类型的问题",
            "完成探索后可以记录你的感悟和洞察"
          ]
        };

        return {
          content: [{ type: "text", text: JSON.stringify(guidance, null, 2) }],
          isError: false,
        };
      }

      case "get_all_question_types": {
        const typesInfo = {
          title: "引导问题类型",
          description: "不同类型的问题帮助你从不同角度探索卡牌",
          types: [
            {
              type: "观察感受",
              description: "帮助你观察卡牌并感受第一印象",
              purpose: "建立与卡牌的初始连接",
              example: "看到了什么？感受如何？"
            },
            {
              type: "深入探索",
              description: "引导你深入挖掘卡牌的细节和含义",
              purpose: "发现更多隐藏的信息和象征",
              example: "你注意到的这个细节，你觉得它是什么？"
            },
            {
              type: "情境代入",
              description: "让你融入卡牌情境，获得身临其境的体验",
              purpose: "通过角色扮演获得更深层的理解",
              example: "你在这个卡牌中吗？你是里面的谁？"
            },
            {
              type: "内心连接",
              description: "建立卡牌与你内心世界的联系",
              purpose: "将卡牌与个人经历和感受连接",
              example: "这张卡牌反映了你内心的哪个部分？"
            },
            {
              type: "启发行动",
              description: "从卡牌中获得实际的生活指导",
              purpose: "将洞察转化为具体的行动方案",
              example: "根据卡牌的提示，你可以采取什么具体行动？"
            }
          ],
          usage_tip: "建议按顺序进行：观察感受 → 深入探索 → 情境代入 → 内心连接 → 启发行动，这样能获得最完整的探索体验。"
        };

        return {
          content: [{ type: "text", text: JSON.stringify(typesInfo, null, 2) }],
          isError: false,
        };
      }

      case "get_all_cards_preview": {
        const cardsPreview = Object.entries(OH_CARDS).map(([cardId, cardData]) => ({
          card_id: parseInt(cardId),
          image_url: cardData.image_url
        }));

        const previewInfo = {
          total_cards: cardsPreview.length,
          cards: cardsPreview,
          message: "这里是所有OH卡的图片链接。点击任意链接查看卡牌图片，但建议通过抽卡功能来获得更好的探索体验！"
        };

        return {
          content: [{ type: "text", text: JSON.stringify(previewInfo, null, 2) }],
          isError: false,
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
      isError: true,
    };
  }
});

/**
 * 启动服务器
 */
async function runServer() {
  try {
    if (mode === "rest") {
      const transport = new RestServerTransport({
        port,
        endpoint,
      });
      await server.connect(transport);

      await transport.startServer();
      console.error(`OH卡MCP服务器正在运行在REST模式，端口: ${port}, 端点: ${endpoint}`);
    } else {
      const transport = new StdioServerTransport();
      await server.connect(transport);
      console.error(
        "OH卡MCP服务器正在运行在stdio模式，提供OH卡抽取、引导问题等工具"
      );
    }
  } catch (error) {
    console.error("启动服务器时发生致命错误:", error);
    process.exit(1);
  }
}

// 启动服务器
runServer(); 