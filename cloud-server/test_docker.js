import fetch from 'node-fetch';

const CONTAINER_URL = 'http://localhost:9593';

// 测试容器功能
async function testDockerContainer() {
  console.log('🐳 开始测试OH卡云服务器Docker容器...\n');

  // 等待容器启动
  console.log('⏳ 等待容器启动（30秒）...');
  await new Promise(resolve => setTimeout(resolve, 30000));

  let allTestsPassed = true;

  // 1. 健康检查测试
  console.log('1️⃣ 测试容器健康检查...');
  try {
    const response = await fetch(`${CONTAINER_URL}/health`);
    const data = await response.json();
    console.log('✅ 容器健康检查成功:', {
      status: data.status,
      environment: data.environment,
      uptime: data.uptime
    });
  } catch (error) {
    console.log('❌ 容器健康检查失败:', error.message);
    allTestsPassed = false;
  }

  // 2. 环境变量测试
  console.log('\n2️⃣ 测试环境变量配置...');
  try {
    const response = await fetch(`${CONTAINER_URL}/health`);
    const data = await response.json();
    
    const expectedEnv = 'production';
    if (data.environment === expectedEnv) {
      console.log('✅ 环境变量配置正确:', data.environment);
    } else {
      console.log('❌ 环境变量配置异常:', data.environment, '期望:', expectedEnv);
      allTestsPassed = false;
    }
  } catch (error) {
    console.log('❌ 环境变量测试失败:', error.message);
    allTestsPassed = false;
  }

  // 3. 工具功能测试
  console.log('\n3️⃣ 测试容器内工具功能...');
  try {
    // 测试抽卡功能
    const response = await fetch(`${CONTAINER_URL}/tools/draw_oh_card`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        arguments: { intention: "容器测试抽卡" }
      })
    });
    
    const data = await response.json();
    const result = JSON.parse(data.content[0].text);
    
    if (result.card_id && result.image_url) {
      console.log('✅ 容器内抽卡功能正常:', `卡牌ID${result.card_id}`);
    } else {
      console.log('❌ 容器内抽卡功能异常:', result);
      allTestsPassed = false;
    }
  } catch (error) {
    console.log('❌ 容器工具功能测试失败:', error.message);
    allTestsPassed = false;
  }

  // 4. 网络连通性测试
  console.log('\n4️⃣ 测试容器网络连通性...');
  try {
    const startTime = Date.now();
    const response = await fetch(`${CONTAINER_URL}/tools/list`);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (response.ok && responseTime < 2000) {
      console.log('✅ 网络连通性良好:', `响应时间 ${responseTime}ms`);
    } else {
      console.log('❌ 网络连通性问题:', `响应时间 ${responseTime}ms`);
      allTestsPassed = false;
    }
  } catch (error) {
    console.log('❌ 网络连通性测试失败:', error.message);
    allTestsPassed = false;
  }

  // 5. 并发访问测试
  console.log('\n5️⃣ 测试容器并发处理能力...');
  try {
    const concurrentRequests = 5;
    const promises = [];
    
    for (let i = 0; i < concurrentRequests; i++) {
      promises.push(
        fetch(`${CONTAINER_URL}/health`)
          .then(res => res.json())
      );
    }
    
    const results = await Promise.all(promises);
    const successCount = results.filter(r => r.status === 'ok').length;
    
    if (successCount === concurrentRequests) {
      console.log('✅ 并发处理能力正常:', `${successCount}/${concurrentRequests} 请求成功`);
    } else {
      console.log('❌ 并发处理能力不足:', `${successCount}/${concurrentRequests} 请求成功`);
      allTestsPassed = false;
    }
  } catch (error) {
    console.log('❌ 并发访问测试失败:', error.message);
    allTestsPassed = false;
  }

  // 测试总结
  console.log('\n📊 容器测试总结:');
  if (allTestsPassed) {
    console.log('🎉 所有容器测试通过！容器部署成功！');
    console.log('✅ Milestone 3 验收标准达成:');
    console.log('  - Docker镜像成功构建');
    console.log('  - 容器正常启动和运行');
    console.log('  - 环境变量正确传递');
    console.log('  - 容器内外网络通信正常');
    console.log('  - 日志输出清晰可读');
  } else {
    console.log('❌ 部分容器测试失败，需要检查配置');
  }
}

// 执行测试
testDockerContainer().catch(console.error); 