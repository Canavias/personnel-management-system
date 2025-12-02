/**
 * 成员排序工具
 * 排序规则：
 * 1. 站长始终置顶
 * 2. 非站长按：部门优先级 > 职位权重 > 姓名首字母排序
 */

// 部门权重映射（值越小优先级越高）
// 顺序：程序 > web > app > 游戏 > ios > 精英 > UI
const departmentWeights = {
  '程序部': 1,      // 程序
  'Web部': 2,       // web
  'App部': 3,       // app
  '游戏部': 4,      // 游戏
  'iOS部': 5,       // ios（你说ios是7，精英培优班是6，但根据需求ios应该在精英前面）
  '精英培优班': 6,  // 精英
  'UI部': 7,        // 需求中未提及
  'NULL': 8,        // 无部门（如站长）
};

// 职位权重映射（使用数据库中的level字段）
const roleWeights = {
  '站长': 100,
  '部长': 90,
  '副部长': 80,
  '负责人': 70,
  '成员': 60,
};

/**
 * 获取部门权重
 * @param {string} departmentName - 部门名称
 * @returns {number} 权重值
 */
function getDepartmentWeight(departmentName) {
  if (!departmentName) return departmentWeights['NULL'];
  return departmentWeights[departmentName] || 99; // 未知部门权重最低
}

/**
 * 获取职位权重
 * @param {string} roleTitle - 职位名称
 * @returns {number} 权重值
 */
function getRoleWeight(roleTitle) {
  return roleWeights[roleTitle] || 0;
}

/**
 * 中文姓名首字母排序比较
 * @param {string} a - 姓名A
 * @param {string} b - 姓名B
 * @returns {number} 比较结果
 */
function compareChineseNames(a, b) {
  // 使用localeCompare进行中文排序
  return a.localeCompare(b, 'zh-CN');
}

/**
 * 成员排序主函数
 * @param {Array} members - 成员数组
 * @returns {Array} 排序后的成员数组
 */
export function sortMembers(members) {
  if (!members || !Array.isArray(members)) return [];
  
  // 创建副本以避免修改原数组
  const sortedMembers = [...members];
  
  sortedMembers.sort((a, b) => {
    // 规则1：站长始终在最前面
    const isStationMasterA = a.role_title === '站长';
    const isStationMasterB = b.role_title === '站长';
    
    if (isStationMasterA && !isStationMasterB) return -1;
    if (!isStationMasterA && isStationMasterB) return 1;
    
    // 如果都是站长，按ID排序（理论上只有一个站长）
    if (isStationMasterA && isStationMasterB) {
      return a.id - b.id;
    }
    
    // 规则2：按部门权重排序
    const deptWeightA = getDepartmentWeight(a.department_name);
    const deptWeightB = getDepartmentWeight(b.department_name);
    
    if (deptWeightA !== deptWeightB) {
      return deptWeightA - deptWeightB;
    }
    
    // 规则3：同部门内按职位权重排序
    const roleWeightA = getRoleWeight(a.role_title);
    const roleWeightB = getRoleWeight(b.role_title);
    
    if (roleWeightA !== roleWeightB) {
      // 职位权重大的在前（站长已处理，这里部长>副部长>...）
      return roleWeightB - roleWeightA;
    }
    
    // 规则4：同部门同职位按姓名首字母排序
    return compareChineseNames(a.name, b.name);
  });
  
  return sortedMembers;
}

/**
 * 获取排序说明文本
 * @returns {string} 排序规则说明
 */
export function getSortingDescription() {
  return `当前排序规则：
  1. 站长始终置顶
  2. 部门优先级：程序部 > Web部 > App部 > 游戏部 > iOS部 > 精英培优班 > UI部
  3. 同部门内职位优先级：站长 > 部长 > 副部长 > 负责人 > 成员
  4. 同部门同职位按姓名首字母排序`;
}

export default {
  sortMembers,
  getSortingDescription,
  departmentWeights,
  roleWeights
};
