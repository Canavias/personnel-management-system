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
  department_id: number
  department_name: string
  member_count: number
  description?: string
}

export const useDepartmentStore = defineStore('department', () => {
  const departments = ref<Department[]>([])
  const departmentStats = ref<DepartmentStats[]>([])
  const allDepartments = ref<Department[]>([])
  const loading = ref(false)

  const fetchDepartments = async () => {
    loading.value = true
    try {
      const response = await api.get('/departments')
      departments.value = response.data
      allDepartments.value = response.data
    } catch (error) {
      console.error('获取部门列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchDepartmentStats = async () => {
    try {
      const response = await api.get('/departments/stats')
      console.log('🔍 部门统计API完整响应:', response.data)
      
      if (response.data && response.data.length > 0) {
        response.data.forEach((dept: any, index: number) => {
          console.log(`部门 ${index + 1}:`, dept)
        })
        
        console.log('📊 部门统计字段结构:', Object.keys(response.data[0]))
      }
      
      departmentStats.value = response.data
    } catch (error) {
      console.error('获取部门统计失败:', error)
      throw error
    }
  }

  const fetchAllDepartments = async () => {
    return fetchDepartments()
  }

  const fetchDepartmentDetail = async (id: number) => {
    try {
      const response = await api.get(`/departments/${id}`)
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
