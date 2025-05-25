#!/usr/bin/env node

/**
 * MCP配置测试脚本
 * 用于验证不同模式下的MCP服务器配置
 */

import { spawn } from 'child_process';
import { readFileSync } from 'fs';

console.log('🧪 MCP配置测试脚本');
console.log('==================');

// 测试stdio模式
function testStdioMode() {
  return new Promise((resolve, reject) => {
    console.log('\n📋 测试stdio模式...');
    
    const child = spawn('node', ['src/index.js', 'stdio'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: process.cwd()
    });
    
    let output = '';
    let errorOutput = '';
    
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
      if (errorOutput.includes('OH卡MCP服务器启动成功')) {
        console.log('✅ stdio模式启动成功');
        child.kill('SIGTERM');
        resolve(true);
      }
    });
    
    child.on('error', (error) => {
      console.log('❌ stdio模式启动失败:', error.message);
      reject(error);
    });
    
    // 5秒超时
    setTimeout(() => {
      child.kill('SIGTERM');
      console.log('⏰ stdio模式测试超时');
      resolve(false);
    }, 5000);
  });
}

// 测试REST模式
function testRestMode() {
  return new Promise((resolve, reject) => {
    console.log('\n🌐 测试REST模式...');
    
    const child = spawn('node', ['src/index.js', 'rest'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: process.cwd(),
      env: { ...process.env, PORT: '9594' } // 使用不同端口避免冲突
    });
    
    let output = '';
    let errorOutput = '';
    
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
      if (errorOutput.includes('OH卡云服务器启动成功')) {
        console.log('✅ REST模式启动成功');
        
        // 测试健康检查
        fetch('http://localhost:9594/health')
          .then(res => res.json())
          .then(data => {
            console.log('✅ 健康检查通过:', data.status);
            child.kill('SIGTERM');
            resolve(true);
          })
          .catch(err => {
            console.log('❌ 健康检查失败:', err.message);
            child.kill('SIGTERM');
            resolve(false);
          });
      }
    });
    
    child.on('error', (error) => {
      console.log('❌ REST模式启动失败:', error.message);
      reject(error);
    });
    
    // 10秒超时
    setTimeout(() => {
      child.kill('SIGTERM');
      console.log('⏰ REST模式测试超时');
      resolve(false);
    }, 10000);
  });
}

// 显示配置文件内容
function showConfigFiles() {
  console.log('\n📄 配置文件内容:');
  console.log('================');
  
  try {
    console.log('\n🔧 本地stdio配置 (claude_config_local.json):');
    const localConfig = readFileSync('claude_config_local.json', 'utf8');
    console.log(localConfig);
    
    console.log('\n🐳 Docker配置 (claude_config_docker.json):');
    const dockerConfig = readFileSync('claude_config_docker.json', 'utf8');
    console.log(dockerConfig);
    
    console.log('\n☁️ 云端配置 (chatmcp.yaml):');
    const cloudConfig = readFileSync('chatmcp.yaml', 'utf8');
    console.log(cloudConfig);
    
  } catch (error) {
    console.log('❌ 读取配置文件失败:', error.message);
  }
}

// 主测试函数
async function runTests() {
  try {
    // 显示配置文件
    showConfigFiles();
    
    // 测试stdio模式
    const stdioResult = await testStdioMode();
    
    // 测试REST模式
    const restResult = await testRestMode();
    
    console.log('\n📊 测试结果总结:');
    console.log('================');
    console.log(`📋 stdio模式: ${stdioResult ? '✅ 通过' : '❌ 失败'}`);
    console.log(`🌐 REST模式: ${restResult ? '✅ 通过' : '❌ 失败'}`);
    
    if (stdioResult && restResult) {
      console.log('\n🎉 所有测试通过！MCP服务器配置正确。');
      console.log('\n📝 下一步操作:');
      console.log('1. 将 claude_config_local.json 内容复制到 Claude Desktop 配置');
      console.log('2. 重启 Claude Desktop');
      console.log('3. 测试 OH卡功能');
      console.log('4. 构建 Docker 镜像进行云端部署');
    } else {
      console.log('\n❌ 部分测试失败，请检查配置和代码。');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
    process.exit(1);
  }
}

// 运行测试
runTests(); 