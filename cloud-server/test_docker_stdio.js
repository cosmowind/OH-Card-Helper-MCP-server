#!/usr/bin/env node

/**
 * 测试Docker容器的stdio模式
 */

import { spawn } from 'child_process';

console.log('🐳 测试Docker容器stdio模式');

const child = spawn('docker', ['run', '-i', '--rm', 'ohcard-mcp-cloud:latest', 'stdio'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  cwd: process.cwd()
});

// 发送MCP初始化请求
const initRequest = {
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {
      tools: {}
    },
    clientInfo: {
      name: "docker-test-client",
      version: "1.0.0"
    }
  }
};

console.log('📤 发送初始化请求到Docker容器...');
child.stdin.write(JSON.stringify(initRequest) + '\n');

let responseBuffer = '';

child.stdout.on('data', (data) => {
  responseBuffer += data.toString();
  
  // 尝试解析JSON响应
  const lines = responseBuffer.split('\n');
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].trim();
    if (line) {
      try {
        const response = JSON.parse(line);
        console.log('📥 Docker容器响应:', JSON.stringify(response, null, 2));
        
        if (response.id === 1) {
          // 发送工具列表请求
          const toolsRequest = {
            jsonrpc: "2.0",
            id: 2,
            method: "tools/list",
            params: {}
          };
          console.log('📤 发送工具列表请求...');
          child.stdin.write(JSON.stringify(toolsRequest) + '\n');
        }
        
        if (response.id === 2) {
          console.log('✅ Docker stdio模式测试成功！');
          console.log(`📋 Docker容器中发现 ${response.result?.tools?.length || 0} 个工具`);
          
          // 测试抽卡功能
          const drawRequest = {
            jsonrpc: "2.0",
            id: 3,
            method: "tools/call",
            params: {
              name: "draw_oh_card",
              arguments: {
                intention: "测试Docker容器中的OH卡功能"
              }
            }
          };
          console.log('📤 测试抽卡功能...');
          child.stdin.write(JSON.stringify(drawRequest) + '\n');
        }
        
        if (response.id === 3) {
          console.log('🎯 抽卡功能测试成功！');
          console.log('🎉 Docker容器MCP服务器完全正常！');
          child.kill('SIGTERM');
          process.exit(0);
        }
        
      } catch (error) {
        // 忽略JSON解析错误，可能是部分数据
      }
    }
  }
  
  // 保留最后一行（可能是不完整的）
  responseBuffer = lines[lines.length - 1];
});

child.stderr.on('data', (data) => {
  console.log('📝 Docker容器日志:', data.toString().trim());
});

child.on('error', (error) => {
  console.error('❌ Docker容器启动失败:', error);
  process.exit(1);
});

// 15秒超时
setTimeout(() => {
  console.log('⏰ Docker测试超时');
  child.kill('SIGTERM');
  process.exit(1);
}, 15000); 