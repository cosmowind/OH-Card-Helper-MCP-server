import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:9593';

// 测试所有端点
async function testAllEndpoints() {
  console.log('🧪 开始测试所有OH卡云服务端点...\n');

  // 1. 测试健康检查
  console.log('1️⃣ 测试健康检查...');
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ 健康检查成功:', data.status);
  } catch (error) {
    console.log('❌ 健康检查失败:', error.message);
  }

  // 2. 测试工具列表
  console.log('\n2️⃣ 测试工具列表...');
  try {
    const response = await fetch(`${BASE_URL}/tools/list`);
    const data = await response.json();
    console.log(`✅ 工具列表成功，共${data.tools.length}个工具:`);
    data.tools.forEach(tool => console.log(`   - ${tool.name}: ${tool.description}`));
  } catch (error) {
    console.log('❌ 工具列表失败:', error.message);
  }

  // 3. 测试OH卡介绍
  console.log('\n3️⃣ 测试OH卡介绍...');
  try {
    const response = await fetch(`${BASE_URL}/tools/what_is_oh_cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const data = await response.json();
    const result = JSON.parse(data.content[0].text);
    console.log('✅ OH卡介绍成功:', result.title);
  } catch (error) {
    console.log('❌ OH卡介绍失败:', error.message);
  }

  // 4. 测试抽卡流程
  console.log('\n4️⃣ 测试抽卡流程...');
  try {
    const response = await fetch(`${BASE_URL}/tools/get_oh_card_process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const data = await response.json();
    const result = JSON.parse(data.content[0].text);
    console.log('✅ 抽卡流程成功:', result.title, `共${result.steps.length}个步骤`);
  } catch (error) {
    console.log('❌ 抽卡流程失败:', error.message);
  }

  // 5. 测试抽卡功能
  console.log('\n5️⃣ 测试抽卡功能...');
  try {
    const response = await fetch(`${BASE_URL}/tools/draw_oh_card`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        arguments: {
          intention: "测试抽卡功能"
        }
      })
    });
    const data = await response.json();
    const result = JSON.parse(data.content[0].text);
    console.log('✅ 抽卡成功:', `卡牌ID${result.card_id}`, result.image_url);
  } catch (error) {
    console.log('❌ 抽卡失败:', error.message);
  }

  // 6. 测试引导问题
  console.log('\n6️⃣ 测试引导问题...');
  try {
    const response = await fetch(`${BASE_URL}/tools/get_guidance_questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        arguments: {
          question_type: "观察感受"
        }
      })
    });
    const data = await response.json();
    const result = JSON.parse(data.content[0].text);
    console.log('✅ 引导问题成功:', result.question_type, `共${result.questions.length}个问题`);
  } catch (error) {
    console.log('❌ 引导问题失败:', error.message);
  }

  // 7. 测试问题类型
  console.log('\n7️⃣ 测试问题类型...');
  try {
    const response = await fetch(`${BASE_URL}/tools/get_all_question_types`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const data = await response.json();
    const result = JSON.parse(data.content[0].text);
    console.log('✅ 问题类型成功:', result.title, `共${result.types.length}种类型`);
  } catch (error) {
    console.log('❌ 问题类型失败:', error.message);
  }

  // 8. 测试卡牌预览
  console.log('\n8️⃣ 测试卡牌预览...');
  try {
    const response = await fetch(`${BASE_URL}/tools/get_all_cards_preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const data = await response.json();
    const result = JSON.parse(data.content[0].text);
    console.log('✅ 卡牌预览成功:', result.title, `共${result.total_cards}张卡牌`);
  } catch (error) {
    console.log('❌ 卡牌预览失败:', error.message);
  }

  console.log('\n🎉 所有测试完成！');
}

// 执行测试
testAllEndpoints().catch(console.error); 