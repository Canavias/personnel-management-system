echo "=== 当前数据库中的成员数据 ==="
curl -s http://localhost:3000/api/members | jq '.[] | {id: .id, name: .name, gender: .gender}' 2>/dev/null || curl -s http://localhost:3000/api/members

echo -e "\n=== 测试更新API ==="
# 更新ID为5的成员性别为女
curl -X PUT http://localhost:3000/api/members/5 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "王俊泽",
    "gender": "女", 
    "grade": "2024级",
    "phone": null,
    "email": null,
    "department_id": 2,
    "role_id": 2,
    "is_active": true
  }'

echo -e "\n=== 更新后检查数据 ==="
curl -s http://localhost:3000/api/members | jq '.[] | select(.id==5) | {id: .id, name: .name, gender: .gender}' 2>/dev/null || curl -s http://localhost:3000/api/members | grep -A 10 -B 10 "王俊泽"
