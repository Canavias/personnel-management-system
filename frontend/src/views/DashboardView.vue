<template>
  <div class="dashboard">
    <h1>系统概览</h1>
    
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon system-status">
              <i class="el-icon-success"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">运行正常</div>
              <div class="stat-label">系统状态</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon total-members">
              <i class="el-icon-user"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ memberCount }}</div>
              <div class="stat-label">总成员数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon total-departments">
              <i class="el-icon-office-building"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ departmentCount }}</div>
              <div class="stat-label">部门数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon active-users">
              <i class="el-icon-user-solid"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">1</div>
              <div class="stat-label">在线用户</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="recent-activity" header="最近活动">
      <el-timeline>
        <el-timeline-item timestamp="2025-11-30" placement="top">
          <el-card>
            <h4>系统启动</h4>
            <p>人员名单管理系统已启动运行</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMemberStore } from '@/stores/member'
import { useDepartmentStore } from '@/stores/department'

const memberStore = useMemberStore()
const departmentStore = useDepartmentStore()
const memberCount = ref(0)
const departmentCount = ref(0)

onMounted(async () => {
  try {
    // 加载成员数据
    await memberStore.fetchMembers()
    memberCount.value = memberStore.members.length
    
    // 加载部门数据
    await departmentStore.fetchDepartments()
    departmentCount.value = departmentStore.departments.length
    
    console.log('📊 仪表盘数据:', {
      成员数: memberCount.value,
      部门数: departmentCount.value,
      部门列表: departmentStore.departments.map(d => d.name)
    })
  } catch (error) {
    console.error('加载仪表盘数据失败:', error)
    memberCount.value = 0
    departmentCount.value = 0
  }
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 24px;
  color: white;
}

.system-status {
  background-color: #67C23A;
}

.total-members {
  background-color: #409EFF;
}

.total-departments {
  background-color: #E6A23C;
}

.active-users {
  background-color: #F56C6C;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  color: #606266;
  font-size: 14px;
}

.recent-activity {
  margin-top: 20px;
}
</style>
