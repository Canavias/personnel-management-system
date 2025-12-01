<template>
  <div class="network-test">
    <el-button @click="testConnection" type="primary">测试网络连接</el-button>
    <div v-if="testResult" class="test-result">
      <pre>{{ testResult }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { api } from '@/services/api'

const testResult = ref('')

const testConnection = async () => {
  testResult.value = '正在测试连接...\n'
  
  try {
    // 测试基础连接
    testResult.value += '1. 测试 /health 端点...\n'
    const healthResponse = await fetch('http://localhost:3000/health')
    testResult.value += `   状态: ${healthResponse.status}\n`
    
    // 测试API连接
    testResult.value += '2. 测试 /api/auth/login 端点...\n'
    const loginTest = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'test',
        password: '123456'
      })
    })
    testResult.value += `   状态: ${loginTest.status}\n`
    
    // 测试axios实例
    testResult.value += '3. 测试axios实例...\n'
    const apiResponse = await api.get('/health').catch(err => err)
    testResult.value += `   结果: ${typeof apiResponse}\n`
    
    testResult.value += '\n✅ 所有测试完成！'
    
  } catch (error: any) {
    testResult.value += `\n❌ 测试失败: ${error.message}\n`
    console.error('网络测试错误:', error)
  }
}
</script>

<style scoped>
.network-test {
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  margin: 20px 0;
}

.test-result {
  margin-top: 10px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  white-space: pre-wrap;
}
</style>
