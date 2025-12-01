<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑成员' : '添加成员'"
    width="600px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名" />
      </el-form-item>

      <el-form-item label="性别" prop="gender">
        <el-select v-model="form.gender" placeholder="请选择性别" style="width: 100%" @change="logGenderValue">
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>

      <el-form-item label="年级" prop="grade">
        <el-select v-model="form.grade" placeholder="请选择年级" style="width: 100%">
          <el-option label="2021级" value="2021级" />
          <el-option label="2022级" value="2022级" />
          <el-option label="2023级" value="2023级" />
          <el-option label="2024级" value="2024级" />
          <el-option label="2025级" value="2025级" />
        </el-select>
      </el-form-item>

      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入电话号码" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱地址" />
      </el-form-item>

      <el-form-item label="职位" prop="role_id">
        <el-select 
          v-model="form.role_id" 
          placeholder="请选择职位" 
          style="width: 100%"
          @change="handleRoleChange"
        >
          <el-option label="站长" :value="1" />
          <el-option label="部长" :value="2" />
          <el-option label="副部长" :value="3" />
          <el-option label="负责人" :value="4" />
          <el-option label="成员" :value="5" />
        </el-select>
      </el-form-item>

      <el-form-item 
        v-if="form.role_id !== 1"
        label="部门" 
        prop="department_id"
      >
        <el-select v-model="form.department_id" placeholder="请选择部门" style="width: 100%">
          <el-option label="程序部" :value="1" />
          <el-option label="游戏部" :value="2" />
          <el-option label="Web部" :value="3" />
          <el-option label="UI部" :value="4" />
          <el-option label="App部" :value="5" />
          <el-option label="iOS部" :value="6" />
          <el-option label="精英培优班" :value="7" />
        </el-select>
      </el-form-item>

      <el-form-item v-if="form.role_id === 1">
        <el-alert
          title="站长不属于任何部门"
          type="info"
          :closable="false"
          show-icon
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick, computed } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useMemberStore } from '@/stores/member'

interface Props {
  modelValue: boolean
  member?: any
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  member: null,
  isEdit: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  success: []
}>()

const memberStore = useMemberStore()
const formRef = ref<FormInstance>()
const loading = ref(false)
const visible = ref(props.modelValue)

const form = reactive({
  name: '',
  gender: '',
  grade: '',
  phone: '',
  email: '',
  department_id: null as number | null,
  role_id: null as number | null
})

// 详细检查性别值
const logGenderValue = (value: string) => {
  console.log('🔍 性别选择详细检查:')
  console.log('  实际值:', value)
  console.log('  类型:', typeof value)
  console.log('  长度:', value.length)
  console.log('  字符代码:', value.charCodeAt(0))
  console.log('  是否等于"女":', value === '女')
  console.log('  是否等于"男":', value === '男')
  console.log('  当前表单gender:', form.gender)
}

// 动态表单验证规则
const rules = computed<FormRules>(() => {
  const baseRules: FormRules = {
    name: [
      { required: true, message: '请输入姓名', trigger: 'blur' }
    ],
    gender: [
      { required: true, message: '请选择性别', trigger: 'change' }
    ],
    grade: [
      { required: true, message: '请选择年级', trigger: 'change' }
    ],
    role_id: [
      { required: true, message: '请选择职位', trigger: 'change' }
    ]
  }
  
  if (form.role_id !== 1) {
    baseRules.department_id = [
      { required: true, message: '请选择部门', trigger: 'change' }
    ]
  }
  
  return baseRules
})

const handleRoleChange = (roleId: number) => {
  if (roleId === 1) {
    form.department_id = null
  }
}

const resetForm = () => {
  form.name = ''
  form.gender = ''
  form.grade = ''
  form.phone = ''
  form.email = ''
  form.department_id = null
  form.role_id = null
  
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

const cleanData = (data: any) => {
  const cleaned: any = {}
  Object.keys(data).forEach(key => {
    if (data[key] === undefined || data[key] === '') {
      cleaned[key] = null
    } else {
      cleaned[key] = data[key]
    }
  })
  return cleaned
}

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    if (props.isEdit && props.member) {
      Object.assign(form, {
        name: props.member.name || '',
        gender: props.member.gender || '',
        grade: props.member.grade || '',
        phone: props.member.phone || '',
        email: props.member.email || '',
        department_id: props.member.department_id || null,
        role_id: props.member.role_id || null
      })
      console.log('🎯 编辑模式 - 初始性别值检查:')
      console.log('  传入的gender:', props.member.gender)
      console.log('  表单中的gender:', form.gender)
    } else {
      resetForm()
    }
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

const handleClose = () => {
  visible.value = false
  resetForm()
}

const handleSubmit = async () => {
  if (!formRef.value) return

  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    const submitData = cleanData({
      name: form.name,
      gender: form.gender,
      grade: form.grade,
      phone: form.phone,
      email: form.email,
      department_id: form.role_id === 1 ? null : form.department_id,
      role_id: form.role_id,
      is_active: true
    })

    console.log('🚀 最终提交数据检查:')
    console.log('  gender值:', submitData.gender)
    console.log('  gender类型:', typeof submitData.gender)
    console.log('  完整数据:', submitData)

    if (props.isEdit && props.member) {
      await memberStore.updateMember(props.member.id, submitData)
    } else {
      await memberStore.addMember(submitData)
    }
    
    ElMessage.success(props.isEdit ? '成员信息更新成功' : '成员添加成功')
    emit('success')
    handleClose()
  } catch (error) {
    console.error('保存成员信息失败:', error)
    ElMessage.error(props.isEdit ? '更新成员信息失败' : '添加成员失败')
  } finally {
    loading.value = false
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
