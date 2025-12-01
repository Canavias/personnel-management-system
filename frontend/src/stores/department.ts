import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'
import { useMemberStore } from './member'

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
      console.log('🔍 部门API响应:', response.data)
      
      if (response.data && response.data.success) {
        departments.value = response.data.data
        allDepartments.value = response.data.data
        console.log('✅ 部门数据加载成功:', departments.value.length, '个部门')
      } else {
        console.error('部门API返回格式错误:', response.data)
        departments.value = []
        allDepartments.value = []
      }
    } catch (error) {
      console.error('获取部门列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchDepartmentStats = async () => {
    try {
      console.log('📊 开始计算部门统计...')
      
      // 先获取部门数据
      await fetchDepartments()
      
      // 获取成员数据来计算统计
      const memberStore = useMemberStore()
      
      // 如果成员数据未加载，先加载
      if (memberStore.members.length === 0) {
        console.log('🔄 加载成员数据用于统计计算...')
        await memberStore.fetchMembers()
      }
      
      console.log('📈 成员数据:', memberStore.members.length, '个成员')
      
      // 计算每个部门的成员数量
      const statsMap = new Map<number, { count: number, name: string, description?: string }>()
      
      // 初始化所有部门
      departments.value.forEach(dept => {
        statsMap.set(dept.id, {
          count: 0,
          name: dept.name,
          description: dept.description
        })
      })
      
      // 统计无部门的成员（站长）
      const noDeptCount = memberStore.members.filter(m => m.department_id === null).length
      if (noDeptCount > 0) {
        statsMap.set(0, {
          count: noDeptCount,
          name: '无部门',
          description: '站长等无部门归属的成员'
        })
      }
      
      // 统计每个部门的成员
      memberStore.members.forEach(member => {
        if (member.department_id !== null) {
          const deptId = member.department_id
          const stat = statsMap.get(deptId)
          if (stat) {
            stat.count++
          } else {
            // 如果数据库中有部门但部门列表中没有，创建一个临时记录
            statsMap.set(deptId, {
              count: 1,
              name: `部门 ${deptId}`,
              description: '未在部门列表中定义的部门'
            })
          }
        }
      })
      
      // 转换为数组格式
      const statsArray: DepartmentStats[] = []
      statsMap.forEach((value, key) => {
        statsArray.push({
          department_id: key,
          department_name: value.name,
          member_count: value.count,
          description: value.description
        })
      })
      
      // 按成员数量降序排序
      statsArray.sort((a, b) => b.member_count - a.member_count)
      
      console.log('✅ 部门统计计算完成:', statsArray)
      departmentStats.value = statsArray
      
    } catch (error) {
      console.error('计算部门统计失败:', error)
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
