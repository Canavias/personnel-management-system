import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'

interface Member {
  id: number
  name: string
  gender: string
  grade: string
  student_id?: string
  phone?: string
  email?: string
  department_id: number | null
  department_name?: string
  role_id?: number
  role_name?: string  // 主要修复：使用 role_name
  role_title?: string // 保留兼容性
  is_active: boolean
  join_date?: string
  created_at: string
  updated_at: string
}

interface MemberForm {
  name: string
  gender: string
  grade: string
  student_id?: string
  phone?: string
  email?: string
  department_id: number | null
  role_id?: number | null
}

export const useMemberStore = defineStore('member', () => {
  const members = ref<Member[]>([])
  const loading = ref(false)
  const total = ref(0)

  // 获取所有成员 - 修复响应格式处理
  const fetchMembers = async () => {
    loading.value = true
    try {
      const response = await api.get('/members')
      console.log('🔍 成员API响应数据:', response.data)
      if (response.data && response.data.length > 0) {
        console.log('📋 第一个成员字段详情:', Object.keys(response.data[0]))
        console.log('👤 第一个成员职位字段:', {
          role_id: response.data[0].role_id,
          role_name: response.data[0].role_name,
          role_title: response.data[0].role_title
        })
      }
      
      members.value = response.data
      total.value = response.data.length
    } catch (error) {
      console.error('获取成员列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 搜索成员 - 修复响应格式处理
  const searchMembers = async (keyword: string) => {
    if (!keyword.trim()) {
      await fetchMembers()
      return
    }

    loading.value = true
    try {
      const response = await api.get(`/members/search/${encodeURIComponent(keyword)}`)
      members.value = response.data
      total.value = response.data.length
    } catch (error) {
      console.error('搜索成员失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 添加成员 - 修复响应格式处理
  const addMember = async (memberData: MemberForm) => {
    try {
      const formattedData = {
        name: memberData.name,
        gender: memberData.gender,
        grade: memberData.grade,
        student_id: memberData.student_id || null,
        phone: memberData.phone || null,
        email: memberData.email || null,
        department_id: memberData.department_id,
        role_id: memberData.role_id || null
      }

      const response = await api.post('/members', formattedData)
      await fetchMembers()
      return response.data
    } catch (error) {
      console.error('添加成员失败:', error)
      throw error
    }
  }

  // 更新成员 - 修复响应格式处理
  const updateMember = async (id: number, memberData: MemberForm) => {
    try {
      const formattedData = {
        name: memberData.name,
        gender: memberData.gender,
        grade: memberData.grade,
        student_id: memberData.student_id || null,
        phone: memberData.phone || null,
        email: memberData.email || null,
        department_id: memberData.department_id,
        role_id: memberData.role_id || null,
        is_active: true
      }

      const response = await api.put(`/members/${id}`, formattedData)
      await fetchMembers()
      return response.data
    } catch (error) {
      console.error('更新成员失败:', error)
      throw error
    }
  }

  // 删除成员 - 修复响应格式处理
  const deleteMember = async (id: number) => {
    try {
      await api.delete(`/members/${id}`)
      await fetchMembers()
    } catch (error) {
      console.error('删除成员失败:', error)
      throw error
    }
  }

  // 按部门获取成员 - 修复响应格式处理
  const fetchMembersByDepartment = async (departmentId: number) => {
    loading.value = true
    try {
      const response = await api.get(`/members/department/${departmentId}`)
      return response.data
    } catch (error) {
      console.error('获取部门成员失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    members,
    loading,
    total,
    fetchMembers,
    searchMembers,
    addMember,
    updateMember,
    deleteMember,
    fetchMembersByDepartment
  }
})
