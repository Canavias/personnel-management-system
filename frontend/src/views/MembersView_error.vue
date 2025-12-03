<template>
  <div class="members">
    <div class="header">
      <h1>成员管理</h1>
      <div class="header-controls">
        <!-- 添加成员按钮 -->
        <el-button type="primary" @click="handleAddMember">
          添加成员
        </el-button>
      </div>
    </div>

    <!-- 排序控制区域 -->
    <el-card class="sort-control-card">
      <div class="sort-controls">
        <div class="sort-control-group">
          <span class="sort-label">排序方式：</span>
          <el-radio-group v-model="sortMode" @change="handleSortChange">
            <el-radio label="department">部门优先</el-radio>
            <el-radio label="role">职位优先</el-radio>
          </el-radio-group>
        </div>
        
        <div class="sort-description">
          <el-text type="info">{{ sortingDescription }}</el-text>
        </div>
      </div>
    </el-card>

    <!-- 搜索和筛选 -->
    <el-card class="filter-card">
      <div class="filter-row">
        <el-input
          v-model="searchKeyword"
          placeholder="按姓名搜索"
          style="width: 200px; margin-right: 10px;"
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <el-select 
          v-model="selectedGrade" 
          placeholder="选择年级" 
          style="width: 150px; margin-right: 10px;"
          @change="handleFilter"
          clearable
        >
          <el-option label="所有年级" value=""></el-option>
          <el-option label="2020级" value="2020级"></el-option>
          <el-option label="2021级" value="2021级"></el-option>
          <el-option label="2022级" value="2022级"></el-option>
          <el-option label="2023级" value="2023级"></el-option>
          <el-option label="2024级" value="2024级"></el-option>
          <el-option label="2025级" value="2025级"></el-option>
        </el-select>
        
        <el-select 
          v-model="selectedDepartment" 
          placeholder="选择部门" 
          style="width: 150px; margin-right: 10px;"
          @change="handleFilter"
        >
          <el-option label="所有部门" value=""></el-option>
          <el-option label="无部门" value="0"></el-option>
          <el-option label="程序部" value="1"></el-option>
          <el-option label="游戏部" value="2"></el-option>
          <el-option label="Web部" value="3"></el-option>
          <el-option label="UI部" value="4"></el-option>
          <el-option label="App部" value="5"></el-option>
          <el-option label="iOS部" value="6"></el-option>
          <el-option label="精英培优班" value="7"></el-option>
        </el-select>

        <el-select 
          v-model="selectedRole" 
          placeholder="选择职位" 
          style="width: 150px;"
          @change="handleFilter"
        >
          <el-option label="所有职位" value=""></el-option>
          <el-option label="站长" value="1"></el-option>
          <el-option label="部长" value="2"></el-option>
          <el-option label="副部长" value="3"></el-option>
          <el-option label="负责人" value="4"></el-option>
          <el-option label="成员" value="5"></el-option>
        </el-select>
      </div>
    </el-card>

    <!-- 统计信息 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="4">
        <el-statistic title="总成员数" :value="totalMemberCount" />
      </el-col>
      <el-col :span="4">
        <el-statistic title="站长" :value="roleCounts.stationMaster" />
      </el-col>
      <el-col :span="4">
        <el-statistic title="部长" :value="roleCounts.minister" />
      </el-col>
      <el-col :span="4">
        <el-statistic title="副部长" :value="roleCounts.viceMinister" />
      </el-col>
      <el-col :span="4">
        <el-statistic title="负责人" :value="roleCounts.responsiblePerson" />
      </el-col>
      <el-col :span="4">
        <el-statistic title="普通成员" :value="roleCounts.member" />
      </el-col>
    </el-row>

    <!-- 成员表格（去掉姓名和年级的sortable） -->
    <el-card class="table-card">
      <el-table 
        :data="paginatedMembers" 
        v-loading="loading"
        style="width: 100%"
      >
        <el-table-column type="index" width="60" label="序号"></el-table-column>
        <el-table-column prop="name" label="姓名" width="120"></el-table-column> <!-- 去掉 sortable -->
        <el-table-column prop="gender" label="性别" width="80"></el-table-column>
        <el-table-column prop="grade" label="年级" width="100"></el-table-column> <!-- 去掉 sortable -->
        <el-table-column prop="department_name" label="部门" width="130">
          <template #default="{ row }">
            {{ row.department_name || '无部门' }}
          </template>
        </el-table-column>
        <el-table-column prop="role_title" label="职位" width="130"> <!-- 去掉 sortable -->
          <template #default="{ row }">
            <el-tag :type="getRoleTagType(row.role_title)" effect="dark">
              {{ row.role_title }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="电话" width="130">
          <template #default="{ row }">
            {{ row.phone || '未填写' }}
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="200">
          <template #default="{ row }">
            {{ row.email || '未填写' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEditMember(row)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDeleteMember(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredMembers.length"
          :pager-count="5"
          layout="total, sizes, prev, pager, next, jumper"
          prev-text="上一页"
          next-text="下一页"
        />
      </div>
    </el-card>

    <!-- 添加/编辑成员对话框 -->
    <MemberDialog
      v-model="dialogVisible"
      :member="editingMember"
      :is-edit="isEdit"
      @success="handleDialogSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useMemberStore } from '@/stores/member';
import MemberDialog from '@/components/MemberDialog.vue';
import { sortMembers, getSortingDescription } from '@/utils/sorting';

const memberStore = useMemberStore();

const loading = ref(false);
const searchKeyword = ref('');
const selectedGrade = ref('');
const selectedDepartment = ref('');
const selectedRole = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const dialogVisible = ref(false);
const editingMember = ref(null);
const isEdit = ref(false);
const sortMode = ref('department'); // 'department' 或 'role'

// 计算排序描述
const sortingDescription = computed(() => getSortingDescription(sortMode.value));

// 职位标签类型
const getRoleTagType = (role: string) => {
  switch (role) {
    case '站长': return 'danger';
    case '部长': return 'warning';
    case '副部长': return 'success';
    case '负责人': return 'primary';
    case '成员': return 'info';
    default: return 'info';
  }
};

// 基础筛选
const basicFilteredMembers = computed(() => {
  let members = [...memberStore.members];

  // 应用搜索筛选
  if (searchKeyword.value) {
    members = members.filter(member => 
      member.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    );
  }

  // 应用年级筛选
  if (selectedGrade.value) {
    members = members.filter(member => 
      member.grade === selectedGrade.value
    );
  }

  // 应用部门筛选
  if (selectedDepartment.value) {
    if (selectedDepartment.value === '0') {
      members = members.filter(member => member.department_id === null);
    } else {
      members = members.filter(member => 
        member.department_id == selectedDepartment.value
      );
    }
  }

  // 应用职位筛选
  if (selectedRole.value) {
    members = members.filter(member => 
      member.role_id == selectedRole.value
    );
  }

  return members;
});

// 排序后的成员
const sortedMembers = computed(() => {
  return sortMembers(basicFilteredMembers.value, sortMode.value);
});

// 最终显示的成员列表
const filteredMembers = computed(() => {
  return sortedMembers.value;
});

// 分页成员
const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredMembers.value.slice(start, end);
});

// 计算属性 - 总成员数应该不受筛选影响
const totalMemberCount = computed(() => memberStore.members.length);

const roleCounts = computed(() => {
  const counts = {
    stationMaster: 0,
    minister: 0,
    viceMinister: 0,
    responsiblePerson: 0,
    member: 0
  };

  memberStore.members.forEach(member => {
    switch (member.role_title) {
      case '站长': counts.stationMaster++; break;
      case '部长': counts.minister++; break;
      case '副部长': counts.viceMinister++; break;
      case '负责人': counts.responsiblePerson++; break;
      case '成员': counts.member++; break;
      default: counts.member++;
    }
  });

  return counts;
});

// 方法
const handleSearch = () => {
  currentPage.value = 1;
};

const handleFilter = () => {
  currentPage.value = 1;
};

const handleSortChange = () => {
  currentPage.value = 1;
  ElMessage.success(`已切换到${sortMode.value === 'department' ? '部门优先' : '职位优先'}排序`);
};

const handleAddMember = () => {
  editingMember.value = null;
  isEdit.value = false;
  dialogVisible.value = true;
};

const handleEditMember = (member: any) => {
  editingMember.value = { ...member };
  isEdit.value = true;
  dialogVisible.value = true;
};

const handleDeleteMember = async (id: number) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个成员吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    await memberStore.deleteMember(id);
  } catch (error) {
    // 用户取消删除
  }
};

const handleDialogSuccess = () => {
  dialogVisible.value = false;
};

const loadMembers = async () => {
  loading.value = true;
  try {
    await memberStore.fetchMembers();
  } catch (error) {
    console.error('加载数据失败:', error);
    ElMessage.error('加载成员数据失败');
  } finally {
    loading.value = false;
  }
};

// 监听器
watch([searchKeyword, selectedGrade, selectedDepartment, selectedRole], () => {
  currentPage.value = 1;
});

// 生命周期
onMounted(() => {
  loadMembers();
});
</script>

<style scoped>
.members {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-controls {
  display: flex;
  align-items: center;
}

.sort-control-card {
  margin-bottom: 20px;
}

.sort-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sort-control-group {
  display: flex;
  align-items: center;
}

.sort-label {
  margin-right: 10px;
  font-weight: 500;
}

.sort-description {
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-size: 13px;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  align-items: center;
}

.stats-row {
  margin-bottom: 20px;
}

.table-card {
  margin-top: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
EOF# 在终端3中执行
cat << 'EOF' > ~/personnel-system/frontend/src/views/MembersView_fixed.vue
<template>
  <div class="members">
    <div class="header">
      <h1>成员管理</h1>
      <div class="header-controls">
        <!-- 添加成员按钮 -->
        <el-button type="primary" @click="handleAddMember">
          添加成员
        </el-button>
      </div>
    </div>

    <!-- 排序控制区域 -->
    <el-card class="sort-control-card">
      <div class="sort-controls">
        <div class="sort-control-group">
          <span class="sort-label">排序方式：</span>
          <el-radio-group v-model="sortMode" @change="handleSortChange">
            <el-radio label="department">部门优先</el-radio>
            <el-radio label="role">职位优先</el-radio>
          </el-radio-group>
        </div>
        
        <div class="sort-description">
          <el-text type="info">{{ sortingDescription }}</el-text>
        </div>
      </div>
    </el-card>

    <!-- 搜索和筛选 -->
    <el-card class="filter-card">
      <div class="filter-row">
        <el-input
          v-model="searchKeyword"
          placeholder="按姓名搜索"
          style="width: 200px; margin-right: 10px;"
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <el-select 
          v-model="selectedGrade" 
          placeholder="选择年级" 
          style="width: 150px; margin-right: 10px;"
          @change="handleFilter"
          clearable
        >
          <el-option label="所有年级" value=""></el-option>
          <el-option label="2020级" value="2020级"></el-option>
          <el-option label="2021级" value="2021级"></el-option>
          <el-option label="2022级" value="2022级"></el-option>
          <el-option label="2023级" value="2023级"></el-option>
          <el-option label="2024级" value="2024级"></el-option>
          <el-option label="2025级" value="2025级"></el-option>
        </el-select>
        
        <el-select 
          v-model="selectedDepartment" 
          placeholder="选择部门" 
          style="width: 150px; margin-right: 10px;"
          @change="handleFilter"
        >
          <el-option label="所有部门" value=""></el-option>
          <el-option label="无部门" value="0"></el-option>
          <el-option label="程序部" value="1"></el-option>
          <el-option label="游戏部" value="2"></el-option>
          <el-option label="Web部" value="3"></el-option>
          <el-option label="UI部" value="4"></el-option>
          <el-option label="App部" value="5"></el-option>
          <el-option label="iOS部" value="6"></el-option>
          <el-option label="精英培优班" value="7"></el-option>
        </el-select>

        <el-select 
          v-model="selectedRole" 
          placeholder="选择职位" 
          style="width: 150px;"
          @change="handleFilter"
        >
          <el-option label="所有职位" value=""></el-option>
          <el-option label="站长" value="1"></el-option>
          <el-option label="部长" value="2"></el-option>
          <el-option label="副部长" value="3"></el-option>
          <el-option label="负责人" value="4"></el-option>
          <el-option label="成员" value="5"></el-option>
        </el-select>
      </div>
    </el-card>

    <!-- 统计信息 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="4">
        <el-statistic title="总成员数" :value="totalMemberCount" />
      </el-col>
      <el-col :span="4">
        <el-statistic title="站长" :value="roleCounts.stationMaster" />
      </el-col>
      <el-col :span="4">
        <el-statistic title="部长" :value="roleCounts.minister" />
      </el-col>
      <el-col :span="4">
        <el-statistic title="副部长" :value="roleCounts.viceMinister" />
      </el-col>
      <el-col :span="4">
        <el-statistic title="负责人" :value="roleCounts.responsiblePerson" />
      </el-col>
      <el-col :span="4">
        <el-statistic title="普通成员" :value="roleCounts.member" />
      </el-col>
    </el-row>

    <!-- 成员表格（去掉姓名和年级的sortable） -->
    <el-card class="table-card">
      <el-table 
        :data="paginatedMembers" 
        v-loading="loading"
        style="width: 100%"
      >
        <el-table-column type="index" width="60" label="序号"></el-table-column>
        <el-table-column prop="name" label="姓名" width="120"></el-table-column> <!-- 去掉 sortable -->
        <el-table-column prop="gender" label="性别" width="80"></el-table-column>
        <el-table-column prop="grade" label="年级" width="100"></el-table-column> <!-- 去掉 sortable -->
        <el-table-column prop="department_name" label="部门" width="130">
          <template #default="{ row }">
            {{ row.department_name || '无部门' }}
          </template>
        </el-table-column>
        <el-table-column prop="role_title" label="职位" width="130"> <!-- 去掉 sortable -->
          <template #default="{ row }">
            <el-tag :type="getRoleTagType(row.role_title)" effect="dark">
              {{ row.role_title }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="电话" width="130">
          <template #default="{ row }">
            {{ row.phone || '未填写' }}
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="200">
          <template #default="{ row }">
            {{ row.email || '未填写' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEditMember(row)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDeleteMember(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredMembers.length"
          :pager-count="5"
          layout="total, sizes, prev, pager, next, jumper"
          prev-text="上一页"
          next-text="下一页"
        />
      </div>
    </el-card>

    <!-- 添加/编辑成员对话框 -->
    <MemberDialog
      v-model="dialogVisible"
      :member="editingMember"
      :is-edit="isEdit"
      @success="handleDialogSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useMemberStore } from '@/stores/member';
import MemberDialog from '@/components/MemberDialog.vue';
import { sortMembers, getSortingDescription } from '@/utils/sorting';

const memberStore = useMemberStore();

const loading = ref(false);
const searchKeyword = ref('');
const selectedGrade = ref('');
const selectedDepartment = ref('');
const selectedRole = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const dialogVisible = ref(false);
const editingMember = ref(null);
const isEdit = ref(false);
const sortMode = ref('department'); // 'department' 或 'role'

// 计算排序描述
const sortingDescription = computed(() => getSortingDescription(sortMode.value));

// 职位标签类型
const getRoleTagType = (role: string) => {
  switch (role) {
    case '站长': return 'danger';
    case '部长': return 'warning';
    case '副部长': return 'success';
    case '负责人': return 'primary';
    case '成员': return 'info';
    default: return 'info';
  }
};

// 基础筛选
const basicFilteredMembers = computed(() => {
  let members = [...memberStore.members];

  // 应用搜索筛选
  if (searchKeyword.value) {
    members = members.filter(member => 
      member.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    );
  }

  // 应用年级筛选
  if (selectedGrade.value) {
    members = members.filter(member => 
      member.grade === selectedGrade.value
    );
  }

  // 应用部门筛选
  if (selectedDepartment.value) {
    if (selectedDepartment.value === '0') {
      members = members.filter(member => member.department_id === null);
    } else {
      members = members.filter(member => 
        member.department_id == selectedDepartment.value
      );
    }
  }

  // 应用职位筛选
  if (selectedRole.value) {
    members = members.filter(member => 
      member.role_id == selectedRole.value
    );
  }

  return members;
});

// 排序后的成员
const sortedMembers = computed(() => {
  return sortMembers(basicFilteredMembers.value, sortMode.value);
});

// 最终显示的成员列表
const filteredMembers = computed(() => {
  return sortedMembers.value;
});

// 分页成员
const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredMembers.value.slice(start, end);
});

// 计算属性 - 总成员数应该不受筛选影响
const totalMemberCount = computed(() => memberStore.members.length);

const roleCounts = computed(() => {
  const counts = {
    stationMaster: 0,
    minister: 0,
    viceMinister: 0,
    responsiblePerson: 0,
    member: 0
  };

  memberStore.members.forEach(member => {
    switch (member.role_title) {
      case '站长': counts.stationMaster++; break;
      case '部长': counts.minister++; break;
      case '副部长': counts.viceMinister++; break;
      case '负责人': counts.responsiblePerson++; break;
      case '成员': counts.member++; break;
      default: counts.member++;
    }
  });

  return counts;
});

// 方法
const handleSearch = () => {
  currentPage.value = 1;
};

const handleFilter = () => {
  currentPage.value = 1;
};

const handleSortChange = () => {
  currentPage.value = 1;
  ElMessage.success(`已切换到${sortMode.value === 'department' ? '部门优先' : '职位优先'}排序`);
};

const handleAddMember = () => {
  editingMember.value = null;
  isEdit.value = false;
  dialogVisible.value = true;
};

const handleEditMember = (member: any) => {
  editingMember.value = { ...member };
  isEdit.value = true;
  dialogVisible.value = true;
};

const handleDeleteMember = async (id: number) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个成员吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    await memberStore.deleteMember(id);
  } catch (error) {
    // 用户取消删除
  }
};

const handleDialogSuccess = () => {
  dialogVisible.value = false;
};

const loadMembers = async () => {
  loading.value = true;
  try {
    await memberStore.fetchMembers();
  } catch (error) {
    console.error('加载数据失败:', error);
    ElMessage.error('加载成员数据失败');
  } finally {
    loading.value = false;
  }
};

// 监听器
watch([searchKeyword, selectedGrade, selectedDepartment, selectedRole], () => {
  currentPage.value = 1;
});

// 生命周期
onMounted(() => {
  loadMembers();
});
</script>

<style scoped>
.members {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-controls {
  display: flex;
  align-items: center;
}

.sort-control-card {
  margin-bottom: 20px;
}

.sort-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sort-control-group {
  display: flex;
  align-items: center;
}

.sort-label {
  margin-right: 10px;
  font-weight: 500;
}

.sort-description {
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-size: 13px;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  align-items: center;
}

.stats-row {
  margin-bottom: 20px;
}

.table-card {
  margin-top: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
