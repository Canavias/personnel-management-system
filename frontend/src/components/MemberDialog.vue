<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="closeDialog"
    :title="props.editData ? '编辑成员' : '添加成员'"
    width="600px"
  >
    <el-form :model="formData" label-width="100px" ref="formRef">
      <el-form-item label="姓名" required>
        <el-input v-model="formData.name" placeholder="请输入姓名" />
      </el-form-item>
      
      <el-form-item label="性别" required>
        <el-radio-group v-model="formData.gender">
          <el-radio label="男">男</el-radio>
          <el-radio label="女">女</el-radio>
          <el-radio label="其他">其他</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="年级" required>
        <el-input v-model="formData.grade" placeholder="请输入年级" />
      </el-form-item>
      
      <el-form-item label="电话">
        <el-input v-model="formData.phone" placeholder="请输入电话" />
      </el-form-item>
      
      <el-form-item label="邮箱">
        <el-input v-model="formData.email" placeholder="请输入邮箱" />
      </el-form-item>
      
      <el-form-item label="部门">
        <el-select 
          v-model="formData.department_id" 
          :placeholder="formData.role_id === 1 ? '站长无需选择部门' : '请选择部门'"
          clearable
          :disabled="formData.role_id === 1"
        >
          <el-option
            v-for="dept in departments"
            :key="dept.id"
            :label="dept.name"
            :value="dept.id"
          />
        </el-select>
        <div v-if="formData.role_id === 1" style="color: #409EFF; font-size: 12px;">
          💡 站长职位不需要选择部门
        </div>
      </el-form-item>
      
      <el-form-item label="职位" required>
        <el-select 
          v-model="formData.role_id" 
          placeholder="请选择职位"
          clearable
        >
          <el-option
            v-for="role in roles"
            :key="role.id"
            :label="role.title"
            :value="role.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useMemberStore } from '@/stores/member'

interface MemberFormData {
  name: string
  gender: string
  grade: string
  phone: string | null
  email: string | null
  department_id: number | null
  role_id: number | null
}

interface Department {
  id: number
  name: string
}

interface Role {
  id: number
  title: string
}

const props = defineProps<{
  visible: boolean
  editData?: any
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}>()

const memberStore = useMemberStore()
const formRef = ref()
const submitting = ref(false)
const departments = ref<Department[]>([])
const roles = ref<Role[]>([])

// 表单数据 - 设置合理的初始值
const formData = ref<MemberFormData>({
  name: '',
  gender: '男',
  grade: '',
  phone: null,
  email: null,
  department_id: null,
  role_id: null
})

// 修复参数预处理函数
function prepareSubmitData(data: MemberFormData): any {
  console.log('📤 前端提交 - 原始表单数据:', JSON.stringify(data, null, 2))
  
  const prepared = {
    name: data.name || '',
    gender: data.gender || '男',
    grade: data.grade || '',
    phone: data.phone || null,
    email: data.email || null,
    department_id: data.department_id,
    role_id: data.role_id,
    is_active: true
  }
  
  // 确保数字字段是数字类型或null
  if (prepared.department_id !== null) {
    prepared.department_id = Number(prepared.department_id)
  }
  if (prepared.role_id !== null) {
    prepared.role_id = Number(prepared.role_id)
  }
  
  // 站长逻辑
  if (prepared.role_id === 1) {
    prepared.department_id = null
  }
  
  console.log('✅ 前端提交 - 处理后的数据:', JSON.stringify(prepared, null, 2))
  console.log('🔍 数据类型检查:')
  console.log('  department_id:', prepared.department_id, '类型:', typeof prepared.department_id)
  console.log('  role_id:', prepared.role_id, '类型:', typeof prepared.role_id)
  console.log('  phone:', prepared.phone, '类型:', typeof prepared.phone)
  console.log('  email:', prepared.email, '类型:', typeof prepared.email)
  
  return prepared
}

// 监听职位变化
watch(() => formData.value.role_id, (newRoleId) => {
  console.log('职位变化:', newRoleId)
  if (newRoleId === 1) {
    console.log('选择站长职位，清空部门选择')
    formData.value.department_id = null
  }
})

// 加载下拉数据
const loadSelectData = async () => {
  console.log('🔄 开始加载下拉框数据...')
  
  try {
    await memberStore.fetchDepartments()
    departments.value = memberStore.departments
    console.log('✅ 部门数据:', departments.value)
  } catch (error) {
    console.error('加载部门数据失败:', error)
    ElMessage.error('加载部门数据失败')
  }
  
  try {
    await memberStore.fetchRoles()
    roles.value = memberStore.roles
    console.log('✅ 职位数据:', roles.value)
  } catch (error) {
    console.error('加载职位数据失败:', error)
    ElMessage.error('加载职位数据失败')
  }
}

// 监听编辑数据
watch(() => props.editData, (newVal) => {
  console.log('📝 编辑数据变化:', newVal)
  if (newVal) {
    formData.value = {
      name: newVal.name || '',
      gender: newVal.gender || '男',
      grade: newVal.grade || '',
      phone: newVal.phone || null,
      email: newVal.email || null,
      department_id: newVal.department_id || null,
      role_id: newVal.role_id || null
    }
    console.log('✅ 表单数据已填充:', formData.value)
  } else {
    // 重置表单
    formData.value = {
      name: '',
      gender: '男',
      grade: '',
      phone: null,
      email: null,
      department_id: null,
      role_id: null
    }
  }
}, { immediate: true })

// 监听对话框显示
watch(() => props.visible, (newVal) => {
  if (newVal) {
    console.log('🎯 对话框打开，加载数据...')
    loadSelectData()
  }
})

// 关闭对话框
const closeDialog = () => {
  console.log('🔒 关闭对话框')
  emit('update:visible', false)
}

// 表单验证
const validateForm = (): boolean => {
  if (!formData.value.name.trim()) {
    ElMessage.error('姓名不能为空')
    return false
  }
  
  if (!formData.value.gender) {
    ElMessage.error('请选择性别')
    return false
  }
  
  if (!formData.value.grade.trim()) {
    ElMessage.error('年级不能为空')
    return false
  }
  
  if (!formData.value.role_id) {
    ElMessage.error('请选择职位')
    return false
  }
  
  // 非站长职位需要选择部门
  if (formData.value.role_id !== 1 && !formData.value.department_id) {
    ElMessage.error('非站长职位必须选择部门')
    return false
  }
  
  return true
}

// 提交表单
const handleSubmit = async () => {
  console.log('🚀 开始提交表单...')
  
  if (!validateForm()) {
    return
  }
  
  submitting.value = true
  
  try {
    // 准备提交数据
    const submitData = prepareSubmitData(formData.value)
    
    console.log('📤 最终提交数据:', JSON.stringify(submitData, null, 2))
    
    if (props.editData) {
      // 编辑模式
      console.log(`🔄 更新成员 ${props.editData.id}`)
      await memberStore.updateMember(props.editData.id, submitData)
      ElMessage.success('成员更新成功')
    } else {
      // 添加模式
      console.log('➕ 添加新成员')
      await memberStore.addMember(submitData)
      ElMessage.success('成员添加成功')
    }
    
    emit('success')
    closeDialog()
    
  } catch (error: any) {
    console.error('❌ 提交失败:', error)
    ElMessage.error(error.response?.data?.message || '操作失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
