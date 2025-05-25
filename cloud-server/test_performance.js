#!/usr/bin/env node

/**
 * OH卡MCP服务器 - 性能测试脚本
 * 用于测试云端部署后的响应时间、并发能力等性能指标
 */

import { performance } from 'perf_hooks';

// 配置
const CONFIG = {
  baseUrl: process.env.TEST_URL || 'http://localhost:9593',
  concurrency: parseInt(process.env.CONCURRENCY) || 10,
  requests: parseInt(process.env.REQUESTS) || 100,
  timeout: parseInt(process.env.TIMEOUT) || 30000,
};

console.log('🚀 OH卡MCP服务器性能测试');
console.log('=====================================');
console.log(`目标URL: ${CONFIG.baseUrl}`);
console.log(`并发数: ${CONFIG.concurrency}`);
console.log(`请求总数: ${CONFIG.requests}`);
console.log(`超时时间: ${CONFIG.timeout}ms`);
console.log('=====================================\n');

// 测试端点配置
const TEST_ENDPOINTS = [
  {
    name: '健康检查',
    method: 'GET',
    path: '/health',
    expectedStatus: 200,
    weight: 4  // 权重，表示在测试中的比例
  },
  {
    name: '工具列表',
    method: 'GET', 
    path: '/tools',
    expectedStatus: 200,
    weight: 2
  },
  {
    name: 'OH卡介绍',
    method: 'POST',
    path: '/tools/what_is_oh_cards',
    body: {},
    expectedStatus: 200,
    weight: 2
  },
  {
    name: '抽取OH卡',
    method: 'POST',
    path: '/tools/draw_oh_card',
    body: { arguments: { intention: '性能测试' } },
    expectedStatus: 200,
    weight: 3
  },
  {
    name: '获取引导问题',
    method: 'POST',
    path: '/tools/get_guidance_questions',
    body: { arguments: { question_type: 'random' } },
    expectedStatus: 200,
    weight: 2
  }
];

// 性能指标收集
const metrics = {
  requests: 0,
  errors: 0,
  timeouts: 0,
  responseTimes: [],
  errorsByEndpoint: {},
  responseTimesByEndpoint: {},
  statusCodes: {}
};

// 初始化端点指标
TEST_ENDPOINTS.forEach(endpoint => {
  metrics.errorsByEndpoint[endpoint.name] = 0;
  metrics.responseTimesByEndpoint[endpoint.name] = [];
});

/**
 * 发送单个HTTP请求
 */
async function makeRequest(endpoint) {
  const url = `${CONFIG.baseUrl}${endpoint.path}`;
  const startTime = performance.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.timeout);
    
    const options = {
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'OH-Card-Performance-Test/1.0'
      },
      signal: controller.signal
    };
    
    if (endpoint.body) {
      options.body = JSON.stringify(endpoint.body);
    }
    
    const response = await fetch(url, options);
    clearTimeout(timeoutId);
    
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    // 记录指标
    metrics.requests++;
    metrics.responseTimes.push(responseTime);
    metrics.responseTimesByEndpoint[endpoint.name].push(responseTime);
    
    const status = response.status;
    metrics.statusCodes[status] = (metrics.statusCodes[status] || 0) + 1;
    
    if (status !== endpoint.expectedStatus) {
      metrics.errors++;
      metrics.errorsByEndpoint[endpoint.name]++;
      console.error(`❌ ${endpoint.name}: 状态码 ${status}，期望 ${endpoint.expectedStatus}`);
    }
    
    return { success: true, responseTime, status };
    
  } catch (error) {
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    metrics.requests++;
    if (error.name === 'AbortError') {
      metrics.timeouts++;
      console.error(`⏰ ${endpoint.name}: 请求超时`);
    } else {
      metrics.errors++;
      metrics.errorsByEndpoint[endpoint.name]++;
      console.error(`❌ ${endpoint.name}: ${error.message}`);
    }
    
    return { success: false, responseTime, error: error.message };
  }
}

/**
 * 选择随机端点（基于权重）
 */
function selectRandomEndpoint() {
  const totalWeight = TEST_ENDPOINTS.reduce((sum, ep) => sum + ep.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const endpoint of TEST_ENDPOINTS) {
    random -= endpoint.weight;
    if (random <= 0) {
      return endpoint;
    }
  }
  
  return TEST_ENDPOINTS[0]; // 回退
}

/**
 * 执行并发测试
 */
async function runConcurrentTest() {
  console.log('🔥 开始并发测试...\n');
  
  const startTime = performance.now();
  const promises = [];
  
  // 创建请求队列
  const requestQueue = [];
  for (let i = 0; i < CONFIG.requests; i++) {
    requestQueue.push(selectRandomEndpoint());
  }
  
  // 启动并发工作线程
  for (let i = 0; i < CONFIG.concurrency; i++) {
    promises.push(async function worker() {
      while (requestQueue.length > 0) {
        const endpoint = requestQueue.shift();
        if (endpoint) {
          await makeRequest(endpoint);
          
          // 显示进度
          const completed = CONFIG.requests - requestQueue.length;
          if (completed % Math.ceil(CONFIG.requests / 10) === 0) {
            console.log(`📊 进度: ${completed}/${CONFIG.requests} (${Math.round(completed/CONFIG.requests*100)}%)`);
          }
        }
      }
    }());
  }
  
  await Promise.all(promises);
  
  const endTime = performance.now();
  const totalTime = endTime - startTime;
  
  console.log('\n✅ 测试完成！');
  return totalTime;
}

/**
 * 计算统计数据
 */
function calculateStats() {
  const stats = {
    totalRequests: metrics.requests,
    successfulRequests: metrics.requests - metrics.errors - metrics.timeouts,
    errorRate: ((metrics.errors + metrics.timeouts) / metrics.requests * 100).toFixed(2),
    timeoutRate: (metrics.timeouts / metrics.requests * 100).toFixed(2)
  };
  
  // 响应时间统计
  if (metrics.responseTimes.length > 0) {
    const sorted = metrics.responseTimes.sort((a, b) => a - b);
    stats.responseTime = {
      min: sorted[0].toFixed(2),
      max: sorted[sorted.length - 1].toFixed(2),
      avg: (sorted.reduce((a, b) => a + b, 0) / sorted.length).toFixed(2),
      p50: sorted[Math.floor(sorted.length * 0.5)].toFixed(2),
      p95: sorted[Math.floor(sorted.length * 0.95)].toFixed(2),
      p99: sorted[Math.floor(sorted.length * 0.99)].toFixed(2)
    };
  }
  
  return stats;
}

/**
 * 显示测试结果
 */
function displayResults(totalTime, stats) {
  console.log('\n📊 性能测试报告');
  console.log('=====================================');
  console.log(`总测试时间: ${(totalTime / 1000).toFixed(2)}秒`);
  console.log(`吞吐量: ${(CONFIG.requests / (totalTime / 1000)).toFixed(2)} 请求/秒`);
  console.log(`总请求数: ${stats.totalRequests}`);
  console.log(`成功请求: ${stats.successfulRequests}`);
  console.log(`错误率: ${stats.errorRate}%`);
  console.log(`超时率: ${stats.timeoutRate}%`);
  
  if (stats.responseTime) {
    console.log('\n⏱️  响应时间统计 (毫秒):');
    console.log(`  最小值: ${stats.responseTime.min}ms`);
    console.log(`  最大值: ${stats.responseTime.max}ms`);
    console.log(`  平均值: ${stats.responseTime.avg}ms`);
    console.log(`  P50: ${stats.responseTime.p50}ms`);
    console.log(`  P95: ${stats.responseTime.p95}ms`);
    console.log(`  P99: ${stats.responseTime.p99}ms`);
  }
  
  console.log('\n📡 状态码分布:');
  Object.entries(metrics.statusCodes).forEach(([code, count]) => {
    console.log(`  ${code}: ${count} (${(count/stats.totalRequests*100).toFixed(1)}%)`);
  });
  
  console.log('\n🎯 端点错误统计:');
  TEST_ENDPOINTS.forEach(endpoint => {
    const errors = metrics.errorsByEndpoint[endpoint.name];
    const responseTimes = metrics.responseTimesByEndpoint[endpoint.name];
    const avgTime = responseTimes.length > 0 ? 
      (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(2) : 'N/A';
    
    console.log(`  ${endpoint.name}: ${errors} 错误, 平均 ${avgTime}ms`);
  });
  
  // 性能评估
  console.log('\n🏆 性能评估:');
  const avgTime = parseFloat(stats.responseTime?.avg || 0);
  const errorRate = parseFloat(stats.errorRate);
  
  if (avgTime < 500 && errorRate < 1) {
    console.log('  🟢 优秀: 响应时间快，错误率低');
  } else if (avgTime < 2000 && errorRate < 5) {
    console.log('  🟡 良好: 响应时间可接受，错误率较低');
  } else {
    console.log('  🔴 需要优化: 响应时间过慢或错误率过高');
  }
  
  console.log('=====================================');
}

/**
 * 主测试函数
 */
async function main() {
  try {
    // 预热测试
    console.log('🔥 预热服务器...');
    await makeRequest(TEST_ENDPOINTS[0]);
    console.log('✅ 预热完成\n');
    
    // 执行性能测试
    const totalTime = await runConcurrentTest();
    
    // 计算并显示结果
    const stats = calculateStats();
    displayResults(totalTime, stats);
    
    // 退出状态
    const avgTime = parseFloat(stats.responseTime?.avg || 0);
    const errorRate = parseFloat(stats.errorRate);
    
    if (avgTime > 2000 || errorRate > 5) {
      console.log('\n❌ 性能测试未通过标准');
      process.exit(1);
    } else {
      console.log('\n✅ 性能测试通过');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('💥 测试执行失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
} 