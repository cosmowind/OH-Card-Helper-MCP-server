#!/usr/bin/env node

// 简单的MCP客户端测试脚本
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 测试OH卡MCP服务器...');

// 启动服务器
const serverProcess = spawn('node', [join(__dirname, 'dist/index.js')], {
  stdio: ['pipe', 'pipe', 'inherit']
});

// 发送初始化请求
const initRequest = {
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: {
      name: "test-client",
      version: "1.0.0"
    }
  }
};

console.log('📤 发送初始化请求...');
serverProcess.stdin.write(JSON.stringify(initRequest) + '\n');

// 监听响应
let responseBuffer = '';
serverProcess.stdout.on('data', (data) => {
  responseBuffer += data.toString();
  
  // 尝试解析完整的JSON响应
  const lines = responseBuffer.split('\n');
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].trim();
    if (line) {
      try {
        const response = JSON.parse(line);
        console.log('📥 收到响应:', JSON.stringify(response, null, 2));
        
        if (response.id === 1) {
          // 初始化成功，发送工具列表请求
          const toolsRequest = {
            jsonrpc: "2.0",
            id: 2,
            method: "tools/list",
            params: {}
          };
          console.log('📤 发送工具列表请求...');
          serverProcess.stdin.write(JSON.stringify(toolsRequest) + '\n');
        } else if (response.id === 2) {
          // 工具列表响应，测试抽卡功能
          const drawCardRequest = {
            jsonrpc: "2.0",
            id: 3,
            method: "tools/call",
            params: {
              name: "draw_oh_card",
              arguments: {
                intention: "测试抽卡功能"
              }
            }
          };
          console.log('📤 发送抽卡请求...');
          serverProcess.stdin.write(JSON.stringify(drawCardRequest) + '\n');
        } else if (response.id === 3) {
          console.log('✅ 测试完成！服务器运行正常。');
          serverProcess.kill();
          process.exit(0);
        }
      } catch (e) {
        // 忽略解析错误，可能是不完整的JSON
      }
    }
  }
  responseBuffer = lines[lines.length - 1];
});

serverProcess.on('error', (error) => {
  console.error('❌ 服务器启动失败:', error);
  process.exit(1);
});

// 超时处理
setTimeout(() => {
  console.log('⏰ 测试超时');
  serverProcess.kill();
  process.exit(1);
}, 10000); 