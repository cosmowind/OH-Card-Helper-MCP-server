#!/usr/bin/env node

/**
 * 简单的Docker容器API测试
 */

import fetch from 'node-fetch';

console.log('🐳 测试Docker容器API');

async function testAPI() {
  try {
    // 测试健康检查
    console.log('📋 测试健康检查...');
    const healthResponse = await fetch('http://localhost:9593/health');
    const healthData = await healthResponse.json();
    console.log('✅ 健康检查通过:', healthData);

    // 测试工具列表
    console.log('\n📋 测试工具列表...');
    const toolsResponse = await fetch('http://localhost:9593/tools/list');
    const toolsData = await toolsResponse.json();
    console.log('✅ 工具列表获取成功:', `发现 ${toolsData.tools.length} 个工具`);

    // 测试抽卡功能
    console.log('\n🎯 测试抽卡功能...');
    const drawResponse = await fetch('http://localhost:9593/tools/draw_oh_card', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        arguments: {
          intention: "测试Docker容器中的OH卡功能"
        }
      })
    });
    const drawData = await drawResponse.json();
    console.log('✅ 抽卡功能正常:', drawData.content[0].text.substring(0, 100) + '...');

    console.log('\n🎉 Docker容器API测试全部通过！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    process.exit(1);
  }
}

testAPI(); 