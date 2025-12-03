/**
 * 成员排序工具
 * 支持两种排序模式：
 * 1. 部门优先排序（同部门成员在一起）
 * 2. 职位优先排序（同职位成员在一起）
 */

// 部门权重 - 确保同部门在一起，精英培优班在最后
const departmentWeights = {
  // 普通部门
  '程序部': 1,
  '游戏部': 1,
  'Web部': 1,
  'iOS部': 1,
  'App部': 1,
  'UI部': 1,
  // 特殊部门：精英培优班在最后
  '精英培优班': 9,
  // 无部门（站长）
  '无部门': 0,
  'NULL': 0,
  null: 0,
  undefined: 0
};

// 职位权重（值越大优先级越高）
const roleWeights = {
  '站长': 100,
  '部长': 90,
  '副部长': 80,
  '负责人': 70,
  '成员': 60
};

/**
 * 获取部门权重
 */
function getDepartmentWeight(departmentName) {
  if (!departmentName || departmentName === '无部门') {
    return departmentWeights['无部门'];
  }
  const weight = departmentWeights[departmentName];
  if (weight === undefined) {
    console.warn('未知部门名称，使用默认权重:', departmentName);
  }
  return weight || 5; // 默认权重
}

/**
 * 获取职位权重
 */
function getRoleWeight(roleTitle) {
  return roleWeights[roleTitle] || 60;
}

/**
 * 部门优先排序
 * 排序：站长 > 部门（同部门在一起）> 职位 > 姓名
 */
export function sortByDepartmentFirst(members) {
  if (!members || !Array.isArray(members)) return [];
  
  const sortedMembers = [...members];
  
  sortedMembers.sort((a, b) => {
    // 1. 站长优先
    if (a.role_title === '站长' && b.role_title !== '站长') return -1;
    if (a.role_title !== '站长' && b.role_title === '站长') return 1;
    if (a.role_title === '站长' && b.role_title === '站长') {
      return a.name.localeCompare(b.name, 'zh-CN');
    }
    
    // 2. 按部门分组（确保同部门在一起）
    const deptNameA = a.department_name || '无部门';
    const deptNameB = b.department_name || '无部门';
    
    // 如果部门不同，按部门排序
    if (deptNameA !== deptNameB) {
      // 先按部门权重
      const deptWeightA = getDepartmentWeight(deptNameA);
      const deptWeightB = getDepartmentWeight(deptNameB);
      if (deptWeightA !== deptWeightB) {
        return deptWeightA - deptWeightB;
      }
      // 再按部门名称字母排序
      return deptNameA.localeCompare(deptNameB, 'zh-CN');
    }
    
    // 3. 同部门内按职位排序
    const roleWeightA = getRoleWeight(a.role_title);
    const roleWeightB = getRoleWeight(b.role_title);
    if (roleWeightA !== roleWeightB) {
      return roleWeightB - roleWeightA; // 数值大的排在前面
    }
    
    // 4. 同部门同职位按姓名排序
    return a.name.localeCompare(b.name, 'zh-CN');
  });
  
  return sortedMembers;
}

/**
 * 职位优先排序
 * 排序：站长 > 职位（同职位在一起）> 部门 > 姓名
 */
export function sortByRoleFirst(members) {
  if (!members || !Array.isArray(members)) return [];
  
  const sortedMembers = [...members];
  
  sortedMembers.sort((a, b) => {
    // 1. 站长优先
    if (a.role_title === '站长' && b.role_title !== '站长') return -1;
    if (a.role_title !== '站长' && b.role_title === '站长') return 1;
    if (a.role_title === '站长' && b.role_title === '站长') {
      return a.name.localeCompare(b.name, 'zh-CN');
    }
    
    // 2. 按职位分组（确保同职位在一起）
    const roleA = a.role_title;
    const roleB = b.role_title;
    
    // 如果职位不同，按职位排序
    if (roleA !== roleB) {
      const roleWeightA = getRoleWeight(roleA);
      const roleWeightB = getRoleWeight(roleB);
      return roleWeightB - roleWeightA; // 数值大的排在前面
    }
    
    // 3. 同职位内按部门排序
    const deptNameA = a.department_name || '无部门';
    const deptNameB = b.department_name || '无部门';
    
    if (deptNameA !== deptNameB) {
      const deptWeightA = getDepartmentWeight(deptNameA);
      const deptWeightB = getDepartmentWeight(deptNameB);
      if (deptWeightA !== deptWeightB) {
        return deptWeightA - deptWeightB;
      }
      return deptNameA.localeCompare(deptNameB, 'zh-CN');
    }
    
    // 4. 同职位同部门按姓名排序
    return a.name.localeCompare(b.name, 'zh-CN');
  });
  
  return sortedMembers;
}

/**
 * 根据模式排序
 */
export function sortMembers(members, mode = 'department') {
  console.log(`执行${mode}排序，成员数量:`, members?.length || 0);
  
  if (mode === 'role') {
    const result = sortByRoleFirst(members);
    console.log('职位优先排序结果:');
    result.slice(0, 10).forEach((m, i) => {
      console.log(`${i+1}. ${m.name} - ${m.department_name || '无部门'} - ${m.role_title}`);
    });
    return result;
  }
  
  const result = sortByDepartmentFirst(members);
  console.log('部门优先排序结果:');
  result.slice(0, 10).forEach((m, i) => {
    console.log(`${i+1}. ${m.name} - ${m.department_name || '无部门'} - ${m.role_title}`);
  });
  return result;
}

/**
 * 获取排序说明
 */
export function getSortingDescription(mode = 'department') {
  if (mode === 'role') {
    return `职位优先排序：同职位成员在一起，职位顺序：站长 > 部长 > 副部长 > 负责人 > 成员`;
  }
  
  return `部门优先排序：同部门成员在一起，精英培优班在最后`;
}

/**
 * 调试函数：查看部门分组
 */
export function debugDepartmentGrouping(members) {
  console.log('=== 部门分组调试 ===');
  
  const groups = {};
  members.forEach(m => {
    const dept = m.department_name || '无部门';
    if (!groups[dept]) {
      groups[dept] = [];
    }
    groups[dept].push(m);
  });
  
  Object.keys(groups).forEach(dept => {
    console.log(`部门【${dept}】有 ${groups[dept].length} 个成员:`);
    groups[dept].forEach(m => {
      console.log(`  ${m.name} - ${m.role_title}`);
    });
  });
}

export default {
  sortMembers,
  sortByDepartmentFirst,
  sortByRoleFirst,
  getSortingDescription,
  debugDepartmentGrouping
};
