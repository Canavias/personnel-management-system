#!/bin/bash

# 创建收集目录
COLLECT_DIR="project_codes_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$COLLECT_DIR"

echo "🎯 开始收集项目代码..."

# 1. 收集后端代码
echo "📦 收集后端代码..."
mkdir -p "$COLLECT_DIR/backend"
find ./backend -type f \( -name "*.js" -o -name "*.json" -o -name "*.sql" -o -name "*.sh" \) | while read file; do
    echo "=== $file ===" > "$COLLECT_DIR/backend/$(basename "$file")_full.txt"
    cat "$file" >> "$COLLECT_DIR/backend/$(basename "$file")_full.txt"
    echo -e "\n\n" >> "$COLLECT_DIR/backend/$(basename "$file")_full.txt"
done

# 2. 收集前端代码
echo "🎨 收集前端代码..."
mkdir -p "$COLLECT_DIR/frontend"
find ./frontend -type f \( -name "*.vue" -o -name "*.ts" -o -name "*.js" -o -name "*.json" -o -name "*.css" -o -name "*.sh" -o -name "*.md" \) | while read file; do
    echo "=== $file ===" > "$COLLECT_DIR/frontend/$(basename "$file")_full.txt"
    cat "$file" >> "$COLLECT_DIR/frontend/$(basename "$file")_full.txt"
    echo -e "\n\n" >> "$COLLECT_DIR/frontend/$(basename "$file")_full.txt"
done

# 3. 创建索引文件
echo "📋 创建文件索引..."
echo "# 项目代码收集 - $(date)" > "$COLLECT_DIR/文件列表.txt"
echo "" >> "$COLLECT_DIR/文件列表.txt"

echo "=== 后端文件 ===" >> "$COLLECT_DIR/文件列表.txt"
find ./backend -type f | sort >> "$COLLECT_DIR/文件列表.txt"
echo "" >> "$COLLECT_DIR/文件列表.txt"

echo "=== 前端文件 ===" >> "$COLLECT_DIR/文件列表.txt"
find ./frontend -type f | sort >> "$COLLECT_DIR/文件列表.txt"

# 4. 创建打包文件（便于下载）
echo "📦 创建打包文件..."
tar -czf "$COLLECT_DIR.tar.gz" "$COLLECT_DIR"

echo "✅ 收集完成！"
echo "📁 目录: $COLLECT_DIR"
echo "📦 打包文件: $COLLECT_DIR.tar.gz"
echo ""
echo "📊 统计信息:"
echo "后端文件数: $(find ./backend -type f | wc -l)"
echo "前端文件数: $(find ./frontend -type f | wc -l)"
