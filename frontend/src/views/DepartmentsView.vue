<template>
  <div class="departments">
    <div class="header">
      <h1>部门管理</h1>
      <el-button type="primary" @click="refreshData" :loading="loading">
        刷新数据
      </el-button>
    </div>

    <!-- 部门统计 -->
    <el-row :gutter="20" class="stats-row">
      <el-col 
        v-for="dept in departmentStats" 
        :key="dept.department_id" 
        :span="6"
      >
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="dept-icon" :style="{ backgroundColor: getDepartmentColor(dept.department_id) }">
              <i class="el-icon-office-building"></i>
            </div>
            <div class="dept-info">
              <div class="dept-name">{{ dept.department_name }}</div>
              <div class="member-count">{{ dept.member_count }} 名成员</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 部门详情 -->
    <el-card class="details-card" header="部门成员详情">
      <el-table 
        :data="allDepartments" 
        v-loading="loading"
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="部门名称" width="150"></el-table-column>
        <el-table-column label="成员数量" width="120">
          <template #default="{ row }">
            <el-tag>{{ getMemberCount(row.id) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="部门描述">
          <template #default="{ row }">
            {{ row.description || '暂无描述' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button 
              size="small" 
              @click="viewDepartmentMembers(row.id)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useDepartmentStore } from '@/stores/department';
import { ElMessage } from 'element-plus';

const departmentStore = useDepartmentStore();
const loading = ref(false);

// 部门颜色
const departmentColors: any = {
  1: '#409EFF', // 程序部 - 蓝色
  2: '#67C23A', // 游戏部 - 绿色
  3: '#E6A23C', // Web部 - 橙色
  4: '#F56C6C', // UI部 - 红色
  5: '#909399', // App部 - 灰色
  6: '#FF85C0', // iOS部 - 粉色
  7: '#722ED1'  // 精英培优班 - 紫色
};

// 计算属性
const departmentStats = computed(() => {
  return (departmentStore.departmentStats || []).map((stat: any) => ({
    ...stat,
    member_count: stat.member_count || 0
  }));
});

const allDepartments = computed(() => {
  return departmentStore.allDepartments || [];
});

const getDepartmentColor = (id: number) => {
  return departmentColors[id] || '#409EFF';
};

const getMemberCount = (id: number) => {
  const stat = departmentStore.departmentStats.find((s: any) => s.department_id === id);
  return stat ? (stat.member_count || 0) : 0;
};

const loadDepartmentData = async () => {
  loading.value = true;
  try {
    await departmentStore.fetchDepartmentStats();
    await departmentStore.fetchAllDepartments();
    ElMessage.success('数据加载成功');
  } catch (error: any) {
    console.error('加载部门数据失败:', error);
    ElMessage.error('加载部门数据失败: ' + (error.response?.data?.message || error.message));
  } finally {
    loading.value = false;
  }
};

const refreshData = () => {
  loadDepartmentData();
};

const viewDepartmentMembers = (deptId: number) => {
  const dept = allDepartments.value.find(d => d.id === deptId);
  const deptName = dept?.name || `部门 ${deptId}`;
  ElMessage.info(`查看 ${deptName} 的成员列表`);
};

onMounted(() => {
  loadDepartmentData();
});
</script>

<style scoped>
.departments {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 10px;
}

.dept-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: white;
  font-size: 20px;
}

.dept-info {
  flex: 1;
}

.dept-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}

.member-count {
  color: #606266;
  font-size: 14px;
}

.details-card {
  margin-top: 20px;
}
</style>
