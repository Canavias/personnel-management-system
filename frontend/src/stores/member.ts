import { defineStore } from 'pinia'
import { api } from '@/services/api'

export const useMemberStore = defineStore('member', {
  state: () => ({
    members: [] as any[],
    departments: [] as any[],
    roles: [] as any[],
    loading: false
  }),

  getters: {
    // 可以根据需要添加 getters
  },

  actions: {
    // 获取所有成员
    async fetchMembers() {
      try {
        this.loading = true
        const response = await api.get('/members')
        console.log('📋 成员API响应:', response)
        
        // 处理不同的响应格式
        if (response.data && Array.isArray(response.data)) {
          this.members = response.data
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          this.members = response.data.data
        } else {
          this.members = []
        }
      } catch (error) {
        console.error('获取成员列表失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // 获取部门列表
    async fetchDepartments() {
      try {
        console.log('🌐 请求部门API...')
        const response = await api.get('/departments')
      
  console.log('🏢 部门API完整响应:', response)
        
        // 统一处理响应格式
        if (response.data && response.data.success) {
          this.departments = response.data.data
          console.log('✅ 部门数据加载成功:', this.departments.length, '个部门')
        } else if (Array.isArray(response.data)) {
          this.departments = response.data
          console.log('✅ 部门数据加载成功 (数组格式):', this.departments.length, '个部门')
        } else {
          console.error('部门API返回错误:', response.data)
          this.departments = []
        }
      } catch (error) {
        console.error('❌ 获取部门列表失败:', error)
        this.departments = []
        throw error
      }
    },

    // 获取职位列表  
    async fetchRoles() {
      try {
        console.log('🌐 请求职位API...')
        const response = await api.get('/roles')
        console.log('💼 职位API完整响应:', response)
        
        // 统一处理响应格式
        if (response.data && response.data.success) {
          this.roles = response.data.data
          console.log('✅ 职位数据加载成功:', this.roles.length, '个职位')
        } else if (Array.isArray(response.data)) {
          this.roles = response.data
          console.log('✅ 职位数据加载成功 (数组格式):', this.roles.length, '个职位')
        } else {
          console.error('职位API返回错误:', response.data)
          this.roles = []
        }
      } catch (error) {
        console.error('❌ 获取职位列表失败:', error)
        this.roles = []
        throw error
      }
    },

    // 添加成员
    async addMember(memberData: any) {
      try {
        const response = await api.post('/members', memberData)
        // 重新获取最新的成员列表以确保数据一致
        await this.fetchMembers()
        return response.data
      } catch (error) {
        console.error('添加成员失败:', error)
        throw error
      }
    },

    // 修复的更新成员方法
    async updateMember(id: number, memberData: any) {
      try {
        console.log('🔧 更新成员数据:', { id, memberData })
        const response = await api.put(`/members/${id}`, memberData)
        console.log('📦 后端响应:', response.data)
        
        // 关键修复：重新获取成员列表以确保前端store与数据库同步
        await this.fetchMembers()
        
        // 或者：更新本地store中的特定成员（如果不想重新获取全部数据）
        /*
        const index = this.members.findIndex((m: any) => m.id === id)
        if (index !== -1) {
          // 合并更新数据到现有成员对象
          this.members[index] = { ...this.members[index], ...memberData }
        }
        */
        
        return response.data
      } catch (error) {
        console.error('更新成员失败:', error)
        throw error
      }
    },

    // 删除成员
    async deleteMember(id: number) {
      try {
        await api.delete(`/members/${id}`)
        // 重新获取成员列表以确保UI更新
        await this.fetchMembers()
      } catch (error) {
        console.error('删除成员失败:', error)
        throw error
      }
    }
  }
})
