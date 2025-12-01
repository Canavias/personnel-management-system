// 用户相关类型
export interface User {
  id: number
  username: string
  role: string
  department?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

// 部门类型
export type DepartmentType = 
  | '程序部' 
  | '游戏部' 
  | 'Web部' 
  | 'UI部' 
  | 'App部' 
  | 'iOS部' 
  | '精英培优班'
  | ''

// 职位类型
export type PositionType = 
  | '站长' 
  | '部长' 
  | '副部长' 
  | '负责人' 
  | '成员'

// 成员相关类型
export interface Member {
  id: number
  name: string
  gender: '男' | '女'
  grade: string
  department: DepartmentType
  position: PositionType
  phone?: string
  email?: string
  joinDate?: string
}

export interface MemberForm {
  name: string
  gender: '男' | '女'
  grade: string
  department: DepartmentType
  position: PositionType
  phone?: string
  email?: string
}

// 部门相关类型
export interface Department {
  id: number
  name: DepartmentType
  memberCount: number
  description?: string
}

// 绩效相关类型
export interface Performance {
  id: number
  memberId: number
  memberName: string
  department: DepartmentType
  score: number
  comment?: string
  date: string
}

// 通用响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
}
