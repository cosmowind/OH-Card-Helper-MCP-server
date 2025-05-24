import { OH_CARDS } from './cards.js';
import { GUIDANCE_QUESTIONS } from './questions.js';

// 工具函数：随机选择数组元素
function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// 工具函数：随机采样数组
function randomSample(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

// 1. 介绍什么是OH卡
export function whatIsOhCards() {
  const info = {
    "title": "什么是OH卡？",
    "description": "OH卡（Open Heart Cards）是一套心理投射工具，通过图像来帮助人们探索内心世界、获得洞察和启发。",
    "features": [
      "🎯 投射工具：通过图像投射内心状态",
      "🌟 自我探索：深入了解内在需求和感受",
      "💡 启发思考：从新角度看待问题和挑战",
      "🌈 情感表达：帮助表达难以言喻的感受",
      "🔮 直觉连接：激活内在智慧和直觉"
    ],
    "principle": "OH卡的核心原理是'投射'——我们看到的不仅仅是图像本身，更是我们内心世界的反映。每个人对同一张卡的解读都是独特的，这正是它的魅力所在。",
    "benefits": [
      "获得新的视角和洞察",
      "释放内在智慧",
      "促进自我觉察",
      "激发创造性思维",
      "找到解决问题的灵感"
    ]
  };
  
  console.log('用户查询了OH卡的介绍信息');
  return info;
}

// 2. 获取OH卡抽取流程
export function getOhCardProcess() {
  const process = {
    "title": "OH卡抽取流程",
    "subtitle": "跟随这5个步骤，开启一段内心探索之旅",
    "steps": [
      {
        "step": 1,
        "name": "确定心中的卡点",
        "description": "思考你最近遇到的困惑或问题",
        "guidance": "静下心来，想想最近让你困扰、迷茫或想要深入了解的事情。可以是情感问题、人际关系、工作选择、人生方向等任何让你感到需要指引的话题。",
        "action": "在心中明确你想要探索的问题"
      },
      {
        "step": 2,
        "name": "凝聚宇宙能量",
        "description": "抽取你的OH卡",
        "guidance": "带着你的问题，深呼吸几次，让自己的意识与宇宙能量连接。当你感到准备好时，抽取你的OH卡。相信直觉的指引，第一张抽到的卡就是为你而来的。",
        "action": "使用'draw_oh_card'功能抽取你的专属卡牌"
      },
      {
        "step": 3,
        "name": "问题引导",
        "description": "让自己代入图片中",
        "guidance": "仔细观察你的卡牌，让图像自然地与你的内心产生共鸣。不要急于分析，先感受图像给你带来的第一印象和情感反应。",
        "action": "使用'get_guidance_questions'获取引导问题，帮助你深入探索"
      },
      {
        "step": 4,
        "name": "寻找启发",
        "description": "从图片与问题中找到解决卡点的启发",
        "guidance": "通过回答引导问题，将卡牌的意象与你的真实处境连接起来。探索图像中的象征意义，寻找它对你问题的启示和指引。",
        "action": "深入思考并回答引导问题，发现内在智慧"
      },
      {
        "step": 5,
        "name": "完成体验",
        "description": "拿走你的纪念卡",
        "guidance": "总结这次抽卡体验给你的启发和洞察。记录下重要的感悟，并思考如何将这些洞察应用到你的实际生活中。",
        "action": "保存卡牌信息作为纪念，让这份智慧伴随你前行"
      }
    ],
    "tips": [
      "💫 保持开放的心态，相信直觉的指引",
      "🌟 没有标准答案，你的感受最重要",
      "💭 慢慢来，给自己充分的时间感受",
      "📝 记录下重要的洞察和启发",
      "🔄 必要时可以重新抽卡，直到找到共鸣"
    ]
  };
  
  console.log('用户查询了OH卡抽取流程');
  return process;
}

// 3. 抽取一张OH卡
export function drawOhCard(intention = "") {
  const cardId = Math.floor(Math.random() * 9) + 1;
  const card = { ...OH_CARDS[cardId] };
  card.card_id = cardId;
  card.draw_time = "刚刚";
  
  // 简化返回信息，只保留图片URL和基本引导
  const result = {
    "card_id": cardId,
    "image_url": card.image_url,
    "draw_time": card.draw_time,
    "message": `你的OH卡已经抽取完成！请点击查看图片：${card.image_url}`,
    "guidance": "仔细观察这张卡牌，让图像与你的内心产生共鸣。你可以使用'get_guidance_questions'功能获取引导问题来深入探索。"
  };
  
  if (intention) {
    result.user_intention = intention;
    result.connection_hint = `这张卡牌出现在你关于'${intention}'的询问中，请仔细观察图像，它可能包含了你需要的答案。`;
  }
  
  console.log(`用户抽取了卡牌 ID: ${cardId}, 意图: ${intention || "未指定"}`);
  return result;
}

// 4. 获取引导问题
export function getGuidanceQuestions(questionType = "random") {
  let selectedType = questionType;
  
  if (questionType === "random" || !GUIDANCE_QUESTIONS[questionType]) {
    // 随机选择一个类型
    const questionTypes = Object.keys(GUIDANCE_QUESTIONS);
    selectedType = randomChoice(questionTypes);
  }
  
  const questions = GUIDANCE_QUESTIONS[selectedType];
  const selectedQuestions = randomSample(questions, Math.min(3, questions.length));
  
  const guidance = {
    "question_type": selectedType,
    "questions": selectedQuestions,
    "usage_tip": "选择一个最吸引你的问题开始，慢慢地、深入地思考。不要急于回答所有问题，重要的是质量而非数量。",
    "type_description": {
      "观察感受": "帮助你观察卡牌并感受第一印象",
      "深入探索": "引导你深入挖掘卡牌的细节和含义",
      "情境代入": "让你融入卡牌情境，获得身临其境的体验",
      "内心连接": "建立卡牌与你内心世界的联系",
      "启发行动": "从卡牌中获得实际的生活指导"
    }[selectedType] || "综合性问题",
    "next_steps": [
      "深入思考选中的问题",
      "可以使用'get_guidance_questions'获取其他类型的问题",
      "完成探索后可以记录你的感悟和洞察"
    ]
  };
  
  console.log(`为用户提供了${selectedType}类型的引导问题`);
  return guidance;
}

// 5. 获取所有引导问题类型
export function getAllQuestionTypes() {
  const typesInfo = {
    "title": "引导问题类型",
    "description": "不同类型的问题帮助你从不同角度探索卡牌",
    "types": []
  };
  
  const typeDescriptions = {
    "观察感受": {
      "description": "帮助你观察卡牌并感受第一印象",
      "purpose": "建立与卡牌的初始连接",
      "example": "看到了什么？感受如何？"
    },
    "深入探索": {
      "description": "引导你深入挖掘卡牌的细节和含义",
      "purpose": "发现更多隐藏的信息和象征",
      "example": "你注意到的这个细节，你觉得它是什么？"
    },
    "情境代入": {
      "description": "让你融入卡牌情境，获得身临其境的体验",
      "purpose": "通过角色扮演获得更深层的理解",
      "example": "你在这个卡牌中吗？你是里面的谁？"
    },
    "内心连接": {
      "description": "建立卡牌与你内心世界的联系",
      "purpose": "将卡牌与个人经历和感受连接",
      "example": "这张卡牌反映了你内心的哪个部分？"
    },
    "启发行动": {
      "description": "从卡牌中获得实际的生活指导",
      "purpose": "将洞察转化为具体的行动计划",
      "example": "根据卡牌的提示，你可以采取什么具体行动？"
    }
  };
  
  for (const [typeName, typeInfo] of Object.entries(typeDescriptions)) {
    typesInfo.types.push({
      "name": typeName,
      "description": typeInfo.description,
      "purpose": typeInfo.purpose,
      "example": typeInfo.example,
      "questions_count": GUIDANCE_QUESTIONS[typeName].length
    });
  }
  
  typesInfo.usage_guide = {
    "how_to_use": "调用 get_guidance_questions 时指定 question_type 参数",
    "available_types": Object.keys(typeDescriptions),
    "random_option": "使用 'random' 或不指定类型可随机获取问题"
  };
  
  console.log('用户查询了所有引导问题类型');
  return typesInfo;
}

// 6. 获取所有OH卡预览
export function getAllCardsPreview() {
  const preview = {
    "title": "OH卡牌预览",
    "description": "所有可用的OH卡牌图片",
    "total_cards": Object.keys(OH_CARDS).length,
    "cards": []
  };
  
  for (const [cardId, cardData] of Object.entries(OH_CARDS)) {
    preview.cards.push({
      "card_id": parseInt(cardId),
      "image_url": cardData.image_url,
      "preview_tip": `卡牌 #${cardId} - 点击查看完整图片`
    });
  }
  
  preview.usage_note = "这些是所有可用的OH卡牌。每次抽卡都会随机选择其中一张，让宇宙为你选择最适合的指引。";
  
  console.log('用户查看了所有OH卡预览');
  return preview;
} 