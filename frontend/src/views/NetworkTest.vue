<template>
  <div class="network-test">
    <h2>网络连接诊断</h2>
    
    <el-button @click="runAllTests" type="primary" size="large">
      运行完整网络诊断
    </el-button>
    
    <div v-if="testResults" class="results">
      <h3>诊断结果:</h3>
      <pre>{{ testResults }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const testResults = ref('')

const runAllTests = async () => {
  testResults.value = '开始网络诊断...\n\n'
  
  await testFetchDirect()
  await testWithCredentials()
  await testDifferentEndpoints()
}

const testFetchDirect = async () => {
  testResults.value += '=== 测试1: 直接Fetch请求 ===\n'
  
  const testURLs = [
    'http://localhost:3000/health',
    'http://100.64.9.75:3000/health',
    'http://100.64.9.75:3000/api/auth/login'
  ]
  
  for (const url of testURLs) {
    testResults.value += `测试 ${url}...\n`
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors'
      })
      testResults.value += `  ✅ 成功: ${response.status}\n`
    } catch (error: any) {
      testResults.value += `  ❌ 失败: ${error.message}\n`
    }
  }
  testResults.value += '\n'
}

const testWithCredentials = async () => {
  testResults.value += '=== 测试2: 带凭据的请求 ===\n'
  
  const url = 'http://100.64.9.75:3000/health'
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include'
    })
    testResults.value += `✅ 带凭据请求成功: ${response.status}\n`
  } catch (error: any) {
    testResults.value += `❌ 带凭据请求失败: ${error.message}\n`
  }
  
  testResults.value += '\n'
}

const testDifferentEndpoints = async () => {
  testResults.value += '=== 测试3: 不同端点测试 ===\n'
  
  const endpoints = [
    { url: 'http://100.64.9.75:3000/', method: 'GET' },
    { 
      url: 'http://100.64.9.75:3000/api/auth/login', 
      method: 'POST',
      body: JSON.stringify({ username: 'test', password: '123456' })
    }
  ]
  
  for (const endpoint of endpoints) {
    testResults.value += `测试 ${endpoint.method} ${endpoint.url}...\n`
    try {
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        headers: endpoint.body ? { 'Content-Type': 'application/json' } : {},
        body: endpoint.body
      })
      testResults.value += `  ✅ 成功: ${response.status}\n`
    } catch (error: any) {
      testResults.value += `  ❌ 失败: ${error.message}\n`
    }
  }
  
  testResults.value += '\n=== 诊断完成 ===\n'
}
</script>

<style scoped>
.network-test {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.results {
  margin-top: 20px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.results pre {
  white-space: pre-wrap;
  word-break: break-all;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.4;
}
</style>
