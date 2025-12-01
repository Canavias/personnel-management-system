import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'

interface Department {
  id: number
  name: string
  description?: string
  created_at?: string
  updated_at?: string
}

interface DepartmentStats {
  id: number
  name: string
  description: string
  member_count: number
}

export const useDepartmentStore = defineStore('department', () => {
  const departments = ref<Department[]>([])
  const departmentStats = ref<DepartmentStats[]>([])
  const allDepartments = ref<Department[]>([])
  const loading = ref(false)

  // 获取所有部门 - 修复响应格式
  const fetchDepartments = async () => {
    loading.value = true
    try {
      const response = await api.get('/departments')
      // 直接使用响应数据
      departments.value = response.data
      allDepartments.value = response.data
    } catch (error) {
      console.error('获取部门列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取部门统计信息 - 修复响应格式
  const fetchDepartmentStats = async () => {
    try {
      const response = await api.get('/departments/stats')
      // 直接使用响应数据
      departmentStats.value = response.data
    } catch (error) {
      console.error('获取部门统计失败:', error)
      throw error
    }
  }

  // 获取所有部门（兼容旧代码）
  const fetchAllDepartments = async () => {
    return fetchDepartments()
  }

  // 获取部门详情 - 修复响应格式
  const fetchDepartmentDetail = async (id: number) => {
    try {
      const response = await api.get(`/departments/${id}`)
      // 直接使用响应数据
      return response.data
    } catch (error) {
      console.error('获取部门详情失败:', error)
      throw error
    }
  }

  return {
    departments,
    departmentStats,
    allDepartments,
    loading,
    fetchDepartments,
    fetchDepartmentStats,
    fetchAllDepartments,
    fetchDepartmentDetail
  }
})
