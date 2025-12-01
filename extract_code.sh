#!/bin/bash

# ============================================
# 人员名单管理系统 - 关键代码提取脚本
# 用于提取前后端关键代码，便于问题诊断
# 输出文件: project_code_summary.txt
# ============================================

# 设置输出文件
OUTPUT_FILE="project_code_summary.txt"
echo "" > $OUTPUT_FILE

echo "🔄 开始提取人员名单管理系统关键代码..."
echo "📁 项目根目录: ~/personnel-system"
echo "📄 输出文件: $OUTPUT_FILE"
echo "============================================"

# ============================================
# 函数：添加文件内容到输出文件
# ============================================
add_file() {
    local file_path=$1
    local title=$2
    
    if [ -f "$file_path" ]; then
        echo "" >> $OUTPUT_FILE
        echo "==================================================================" >> $OUTPUT_FILE
        echo "📋 $title" >> $OUTPUT_FILE
        echo "📁 文件: $file_path" >> $OUTPUT_FILE
        echo "==================================================================" >> $OUTPUT_FILE
        cat "$file_path" >> $OUTPUT_FILE
        echo "" >> $OUTPUT_FILE
        echo "✅ 已提取: $file_path"
    else
        echo "" >> $OUTPUT_FILE
        echo "==================================================================" >> $OUTPUT_FILE
        echo "❌ 文件不存在: $file_path" >> $OUTPUT_FILE
        echo "==================================================================" >> $OUTPUT_FILE
        echo "⚠️  未找到: $file_path"
    fi
}

# ============================================
# 1. 项目信息头
# ============================================
echo "🚀 人员名单管理系统 - 关键代码提取" > $OUTPUT_FILE
echo "⏰ 提取时间: $(date)" >> $OUTPUT_FILE
echo "👤 用户: $(whoami)" >> $OUTPUT_FILE
echo "============================================" >> $OUTPUT_FILE

# ============================================
# 2. 后端关键文件提取
# ============================================
echo "🔧 正在提取后端代码..." 

# 后端配置文件
add_file "~/personnel-system/backend/config/database.js" "后端数据库配置"
add_file "~/personnel-system/backend/config/database_fixed.js" "修复后的数据库配置"

# 后端主文件
add_file "~/personnel-system/backend/server.js" "后端主服务器文件"
add_file "~/personnel-system/backend/app.js" "后端应用配置"

# 路由文件（重点关注 members.js）
add_file "~/personnel-system/backend/routes/members.js" "成员管理路由"
add_file "~/personnel-system/backend/routes/members_fixed.js" "修复后的成员路由"
add_file "~/personnel-system/backend/routes/auth.js" "用户认证路由"
add_file "~/personnel-system/backend/routes/departments.js" "部门管理路由"
add_file "~/personnel-system/backend/routes/performance.js" "绩效管理路由"

# 模型文件
add_file "~/personnel-system/backend/models/user.js" "用户模型"

# 中间件
add_file "~/personnel-system/backend/middleware/auth.js" "认证中间件"

# 修复脚本
add_file "~/personnel-system/backend/fix_gender_encoding_correct.js" "性别编码修复脚本"
add_file "~/personnel-system/backend/fix_database_gender.js" "数据库性别字段修复脚本"

# 包配置
add_file "~/personnel-system/backend/package.json" "后端包配置"

# ============================================
# 3. 前端关键文件提取
# ============================================
echo "🎨 正在提取前端代码..."

# Vue组件（重点关注成员管理）
add_file "~/personnel-system/frontend/src/views/MembersView.vue" "成员管理页面"
add_file "~/personnel-system/frontend/src/views/MembersView_fixed.vue" "修复后的成员管理页面"
add_file "~/personnel-system/frontend/src/components/MemberDialog.vue" "成员对话框组件"
add_file "~/personnel-system/frontend/src/views/DepartmentsView.vue" "部门管理页面"
add_file "~/personnel-system/frontend/src/views/LoginView.vue" "登录页面"
add_file "~/personnel-system/frontend/src/views/DashboardView.vue" "仪表板页面"

# 状态管理（Pinia）
add_file "~/personnel-system/frontend/src/stores/member.ts" "成员状态管理"
add_file "~/personnel-system/frontend/src/stores/member_fixed.ts" "修复后的成员状态管理"
add_file "~/personnel-system/frontend/src/stores/department.ts" "部门状态管理"
add_file "~/personnel-system/frontend/src/stores/user.ts" "用户状态管理"

# API服务
add_file "~/personnel-system/frontend/src/services/api.ts" "前端API服务"
add_file "~/personnel-system/frontend/src/services/api_debug.ts" "调试API服务"

# 路由配置
add_file "~/personnel-system/frontend/src/router/index.ts" "前端路由配置"

# 类型定义
add_file "~/personnel-system/frontend/src/types/index.ts" "TypeScript类型定义"

# 配置文件
add_file "~/personnel-system/frontend/vite.config.ts" "Vite配置"
add_file "~/personnel-system/frontend/package.json" "前端包配置"

# ============================================
# 4. 数据库文件提取
# ============================================
echo "🗄️  正在提取数据库文件..."

add_file "~/personnel-system/database/create_tables.sql" "数据库表结构"
add_file "~/personnel-system/backend/database/create_performance_table.sql" "绩效表结构"
add_file "~/personnel-system/backend/fix_charset.sql" "字符集修复SQL"
add_file "~/personnel-system/backend/fix_members_table.sql" "成员表修复SQL"

# ============================================
# 5. 日志文件（最后100行）
# ============================================
echo "📋 正在提取日志文件..."

echo "" >> $OUTPUT_FILE
echo "==================================================================" >> $OUTPUT_FILE
echo "📊 后端日志（最后100行）" >> $OUTPUT_FILE
echo "📁 文件: ~/personnel-system/backend/backend.log" >> $OUTPUT_FILE
echo "==================================================================" >> $OUTPUT_FILE
if [ -f "~/personnel-system/backend/backend.log" ]; then
    tail -100 ~/personnel-system/backend/backend.log >> $OUTPUT_FILE
else
    echo "日志文件不存在" >> $OUTPUT_FILE
fi

echo "" >> $OUTPUT_FILE
echo "==================================================================" >> $OUTPUT_FILE
echo "📊 前端日志（最后100行）" >> $OUTPUT_FILE
echo "📁 文件: ~/personnel-system/frontend/frontend.log" >> $OUTPUT_FILE
echo "==================================================================" >> $OUTPUT_FILE
if [ -f "~/personnel-system/frontend/frontend.log" ]; then
    tail -100 ~/personnel-system/frontend/frontend.log >> $OUTPUT_FILE
else
    echo "日志文件不存在" >> $OUTPUT_FILE
fi

# ============================================
# 6. 当前运行状态
# ============================================
echo "🔍 正在收集系统状态..."

echo "" >> $OUTPUT_FILE
echo "==================================================================" >> $OUTPUT_FILE
echo "🖥️  系统当前状态" >> $OUTPUT_FILE
echo "==================================================================" >> $OUTPUT_FILE
echo "🕐 系统时间: $(date)" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

echo "🌐 网络端口监听状态:" >> $OUTPUT_FILE
echo "--------------------------------------------------" >> $OUTPUT_FILE
netstat -tlnp 2>/dev/null | grep -E '(3000|5173)' >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

echo "📊 进程状态:" >> $OUTPUT_FILE
echo "--------------------------------------------------" >> $OUTPUT_FILE
ps aux | grep -E '(node|npm|vite)' | grep -v grep >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# ============================================
# 7. 文件统计
# ============================================
echo "" >> $OUTPUT_FILE
echo "==================================================================" >> $OUTPUT_FILE
echo "📈 项目文件统计" >> $OUTPUT_FILE
echo "==================================================================" >> $OUTPUT_FILE

echo "📁 后端文件数量:" >> $OUTPUT_FILE
find ~/personnel-system/backend -type f -name "*.js" -o -name "*.json" -o -name "*.sql" | wc -l >> $OUTPUT_FILE

echo "📁 前端Vue文件数量:" >> $OUTPUT_FILE
find ~/personnel-system/frontend/src -type f -name "*.vue" | wc -l >> $OUTPUT_FILE

echo "📁 前端TypeScript文件数量:" >> $OUTPUT_FILE
find ~/personnel-system/frontend/src -type f -name "*.ts" | wc -l >> $OUTPUT_FILE

# ============================================
# 完成信息
# ============================================
echo "" >> $OUTPUT_FILE
echo "==================================================================" >> $OUTPUT_FILE
echo "✅ 代码提取完成!" >> $OUTPUT_FILE
echo "📄 输出文件: $OUTPUT_FILE" >> $OUTPUT_FILE
echo "📏 文件大小: $(wc -l < $OUTPUT_FILE) 行" >> $OUTPUT_FILE
echo "💾 文件大小: $(du -h $OUTPUT_FILE | cut -f1)" >> $OUTPUT_FILE
echo "==================================================================" >> $OUTPUT_FILE

echo ""
echo "============================================"
echo "✅ 代码提取完成!"
echo "📄 输出文件: $OUTPUT_FILE"
echo "📏 文件大小: $(wc -l < $OUTPUT_FILE) 行"
echo "💾 文件大小: $(du -h $OUTPUT_FILE | cut -f1)"
echo ""
echo "📤 使用以下命令将文件传输到Windows:"
echo "   sz $OUTPUT_FILE"
echo ""
echo "💡 提示: 在Xshell中，sz命令会弹出文件保存对话框"
echo "============================================"af-
