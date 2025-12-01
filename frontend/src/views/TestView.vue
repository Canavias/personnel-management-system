<template>
  <div class="test-container">
    <h1>数据加载测试</h1>
    
    <el-button @click="loadData">加载数据</el-button>
    
    <div class="data-section">
      <h2>部门数据 ({{ departments.length }}):</h2>
      <pre>{{ departments }}</pre>
    </div>
    
    <div class="data-section">
      <h2>职位数据 ({{ roles.length }}):</h2>
      <pre>{{ roles }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMemberStore } from '@/stores/member'

const memberStore = useMemberStore()
const departments = ref([])
const roles = ref([])

const loadData = async () => {
  console.log('开始加载测试数据...')
  
  try {
    await memberStore.fetchDepartments()
    departments.value = memberStore.departments
    console.log('部门数据:', departments.value)
  } catch (error) {
    console.error('加载部门数据失败:', error)
  }
  
  try {
    await memberStore.fetchRoles()
    roles.value = memberStore.roles
    console.log('职位数据:', roles.value)
  } catch (error) {
    console.error('加载职位数据失败:', error)
  }
}
</script>

<style scoped>
.test-container {
  padding: 20px;
}
.data-section {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
pre {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow: auto;
}
</style>
