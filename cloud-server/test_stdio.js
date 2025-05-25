#!/usr/bin/env node

/**
 * 简单的stdio模式测试
 */

import { spawn } from 'child_process';

console.log('🧪 测试stdio模式MCP服务器');

const child = spawn('node', ['src/index.js', 'stdio'], {
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
      name: "test-client",
      version: "1.0.0"
    }
  }
};

console.log('📤 发送初始化请求...');
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
        console.log('📥 收到响应:', JSON.stringify(response, null, 2));
        
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
          console.log('✅ stdio模式测试成功！');
          console.log(`📋 发现 ${response.result?.tools?.length || 0} 个工具`);
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
  console.log('📝 服务器日志:', data.toString().trim());
});

child.on('error', (error) => {
  console.error('❌ 启动失败:', error);
  process.exit(1);
});

// 10秒超时
setTimeout(() => {
  console.log('⏰ 测试超时');
  child.kill('SIGTERM');
  process.exit(1);
}, 10000); 