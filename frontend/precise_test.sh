echo "=== 精确测试更新API ==="

# 测试1：最小化数据测试
echo "测试1 - 最小数据:"
curl -X PUT http://localhost:3000/api/members/12 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "爱妃",
    "gender": "女",
    "grade": "2022级",
    "is_active": true
  }'

echo -e "\n"

# 测试2：包含所有字段但明确设置null
echo "测试2 - 完整数据:"
curl -X PUT http://localhost:3000/api/members/12 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "爱妃",
    "gender": "女", 
    "grade": "2022级",
    "student_id": null,
    "phone": "15165467326",
    "email": "1903423298@qq.com",
    "department_id": null,
    "role_id": 1,
    "is_active": true
  }'

echo -e "\n"

# 测试3：检查当前确切的数据结构
echo "测试3 - 当前确切数据:"
curl -s http://localhost:3000/api/members/12 | jq '.' 2>/dev/null || curl -s http://localhost:3000/api/members/12

echo -e "\n"

# 测试4：使用与前端完全相同的格式
echo "测试4 - 前端格式:"
curl -X PUT http://localhost:3000/api/members/12 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "爱妃",
    "gender": "女",
    "grade": "2022级", 
    "student_id": null,
    "phone": "15165467326",
    "email": "1903423298@qq.com",
    "department_id": null,
    "role_id": 1,
    "is_active": true
  }'
