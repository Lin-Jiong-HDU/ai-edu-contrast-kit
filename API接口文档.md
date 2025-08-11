# AI教学助手后端 API 接口文档

## 项目概述

**AI教学助手后端**是一个基于FastAPI、LangChain和LangGraph构建的智能教学助手服务，为教师和学生提供AI对话、网络搜索和PPT生成等功能。

- **项目名称**: AI教学助手
- **版本**: v1.0.0
- **基础URL**: `http://60.204.168.139:720`
- **API前缀**: `/api/v1`

## 认证方式

当前版本暂无认证机制，所有接口均可直接访问。

## 通用响应格式

### 成功响应
```json
{
  "success": true,
  "message": "操作成功",
  "timestamp": "2024-01-01T12:00:00",
  "data": {}
}
```

### 错误响应
```json
{
  "success": false,
  "message": "错误信息",
  "error_code": "ERROR_CODE",
  "error_details": {},
  "timestamp": "2024-01-01T12:00:00"
}
```

## 核心接口

### 1. 系统接口

#### 1.1 根路径信息
- **接口**: `GET /`
- **描述**: 获取服务基本信息
- **参数**: 无

**响应示例**:
```json
{
  "message": "欢迎使用AI教学助手",
  "version": "1.0.0",
  "status": "running",
  "docs": "/docs"
}
```

#### 1.2 健康检查
- **接口**: `GET /health`
- **描述**: 检查服务健康状态
- **参数**: 无

**响应示例**:
```json
{
  "status": "healthy",
  "service": "AI教学助手",
  "version": "1.0.0"
}
```

### 2. 聊天会话管理

#### 2.1 创建新会话
- **接口**: `POST /api/v1/chat/session`
- **描述**: 创建一个新的聊天会话
- **参数**: 无

**响应示例**:
```json
{
  "success": true,
  "message": "会话创建成功",
  "timestamp": "2024-01-01T12:00:00",
  "data": {
    "session_id": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

#### 2.2 删除会话
- **接口**: `DELETE /api/v1/chat/session/{session_id}`
- **描述**: 删除指定的聊天会话
- **参数**:
  - `session_id` (路径参数): UUID格式的会话ID

**响应示例**:
```json
{
  "success": true,
  "message": "会话删除成功",
  "timestamp": "2024-01-01T12:00:00"
}
```

**错误响应**:
```json
{
  "success": false,
  "message": "会话不存在",
  "error_code": "SESSION_NOT_FOUND",
  "timestamp": "2024-01-01T12:00:00"
}
```

#### 2.3 获取会话信息
- **接口**: `GET /api/v1/chat/sessions`
- **描述**: 获取当前活跃会话统计信息
- **参数**: 无

**响应示例**:
```json
{
  "success": true,
  "message": "获取会话信息成功",
  "timestamp": "2024-01-01T12:00:00",
  "data": {
    "active_sessions": 5,
    "total_count": 5
  }
}
```

### 3. 消息处理接口

#### 3.1 发送消息（非流式）
- **接口**: `POST /api/v1/chat/message`
- **描述**: 发送消息并获取AI回复（非流式响应）
- **Content-Type**: `application/json`

**请求参数**:
```json
{
  "session_id": "123e4567-e89b-12d3-a456-426614174000",
  "message": "请帮我搜索一下人工智能的最新发展",
  "user_type": "student"
}
```

**参数说明**:
- `session_id` (必填): UUID格式的会话ID
- `message` (必填): 用户输入的消息，长度限制1-2000字符
- `user_type` (可选): 用户类型，支持 `teacher` 或 `student`，默认为 `teacher`

**响应示例**:
```json
{
  "session_id": "123e4567-e89b-12d3-a456-426614174000",
  "response": "我来帮您搜索人工智能的最新发展情况...\n\n🔧 正在使用工具: search_tool\n\n基于搜索结果，人工智能在2024年有以下重要发展...",
  "timestamp": "2024-01-01T12:00:00"
}
```

#### 3.2 发送消息（流式）
- **接口**: `POST /api/v1/chat/stream`
- **描述**: 发送消息并获取AI流式回复
- **Content-Type**: `application/json`
- **Response-Type**: `text/event-stream`

**请求参数**:
```json
{
  "session_id": "123e4567-e89b-12d3-a456-426614174000",
  "message": "请生成一个关于机器学习的PPT",
  "user_type": "teacher"
}
```

**流式响应格式**:
```
data: {"event": "start", "session_id": "123e4567-e89b-12d3-a456-426614174000", "timestamp": "2024-01-01T12:00:00"}

data: {"event": "message", "session_id": "123e4567-e89b-12d3-a456-426614174000", "chunk": "我来为您生成", "is_complete": false}

data: {"event": "message", "session_id": "123e4567-e89b-12d3-a456-426614174000", "chunk": "一个关于机器学习的PPT", "is_complete": false}

data: {"event": "message", "session_id": "123e4567-e89b-12d3-a456-426614174000", "chunk": "\n\n🔧 正在使用工具: ppt_generator\n", "is_complete": false}

data: {"event": "message", "session_id": "123e4567-e89b-12d3-a456-426614174000", "chunk": "\n✅ 工具 ppt_generator 执行完成\n\n", "is_complete": false}

data: {"event": "message", "session_id": "123e4567-e89b-12d3-a456-426614174000", "chunk": "PPT生成完成！下载链接：https://...", "is_complete": false}

data: {"event": "end", "session_id": "123e4567-e89b-12d3-a456-426614174000", "is_complete": true}
```

**流式事件类型**:
- `start`: 流式响应开始
- `message`: 消息内容片段
- `end`: 流式响应结束
- `error`: 发生错误时的事件

**错误事件格式**:
```
data: {"event": "error", "session_id": "123e4567-e89b-12d3-a456-426614174000", "error": "错误信息"}
```

#### 3.3 聊天服务健康检查
- **接口**: `GET /api/v1/chat/health`
- **描述**: 检查聊天服务健康状态
- **参数**: 无

**响应示例**:
```json
{
  "status": "healthy",
  "service": "AI教学助手",
  "active_sessions": 5
}
```

## AI助手功能特性

### 1. 智能对话
AI助手使用智谱AI GLM-4.5模型，支持：
- 自然语言对话
- 教学场景问答
- 基于用户身份（教师/学生）的差异化回复

### 2. 网络搜索
当用户询问需要实时信息的问题时，AI会自动调用搜索工具：
- 使用智谱AI的web_search功能
- 返回最多5条相关结果
- 自动整合搜索结果并生成回答

### 3. PPT生成
支持基于主题自动生成PowerPoint演示文稿：
- 自动生成PPT大纲
- 填充内容
- 应用随机模板
- 返回可下载的PPT链接

## 错误码对照表

| 错误码 | 描述 | HTTP状态码 |
|--------|------|-----------|
| SESSION_NOT_FOUND | 会话不存在 | 200 |
| HTTP_400 | 请求参数错误 | 400 |
| HTTP_404 | 资源不存在 | 404 |
| HTTP_500 | 服务器内部错误 | 500 |
| INTERNAL_SERVER_ERROR | 服务器内部错误 | 500 |

## 使用示例

### JavaScript/前端调用示例

#### 创建会话
```javascript
async function createSession() {
  const response = await fetch('/api/v1/chat/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return data.data.session_id;
}
```

#### 非流式聊天
```javascript
async function sendMessage(sessionId, message, userType = 'student') {
  const response = await fetch('/api/v1/chat/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      session_id: sessionId,
      message: message,
      user_type: userType
    })
  });
  return await response.json();
}
```

#### 流式聊天
```javascript
async function sendStreamMessage(sessionId, message, onMessage) {
  const response = await fetch('/api/v1/chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      session_id: sessionId,
      message: message,
      user_type: 'student'
    })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.substring(6));
          if (data.event === 'message' && data.chunk) {
            onMessage(data.chunk);
          }
        } catch (e) {
          console.error('解析流式数据错误:', e);
        }
      }
    }
  }
}
```

### Python调用示例

#### 使用requests库
```python
import requests
import json

BASE_URL = "http://60.204.168.139:720"

def create_session():
    response = requests.post(f"{BASE_URL}/api/v1/chat/session")
    return response.json()["data"]["session_id"]

def send_message(session_id, message, user_type="student"):
    data = {
        "session_id": session_id,
        "message": message,
        "user_type": user_type
    }
    response = requests.post(f"{BASE_URL}/api/v1/chat/message", json=data)
    return response.json()

def send_stream_message(session_id, message, user_type="student"):
    data = {
        "session_id": session_id,
        "message": message,
        "user_type": user_type
    }
    response = requests.post(
        f"{BASE_URL}/api/v1/chat/stream",
        json=data,
        stream=True
    )

    for line in response.iter_lines():
        if line.startswith(b'data: '):
            try:
                data = json.loads(line[6:].decode())
                if data.get('event') == 'message' and data.get('chunk'):
                    print(data['chunk'], end='', flush=True)
            except json.JSONDecodeError:
                continue

# 使用示例
session_id = create_session()
print(f"创建会话: {session_id}")

# 非流式聊天
result = send_message(session_id, "你好，我是一名学生")
print("AI回复:", result["response"])

# 流式聊天
print("流式回复:", end=" ")
send_stream_message(session_id, "请生成一个关于Python的PPT")
```

### cURL命令示例

#### 创建会话
```bash
curl -X POST "http://localhost:8000/api/v1/chat/session" \
     -H "Content-Type: application/json"
```

#### 发送消息
```bash
curl -X POST "http://localhost:8000/api/v1/chat/message" \
     -H "Content-Type: application/json" \
     -d '{
       "session_id": "123e4567-e89b-12d3-a456-426614174000",
       "message": "请帮我搜索人工智能最新发展",
       "user_type": "student"
     }'
```

#### 流式聊天
```bash
curl -X POST "http://localhost:8000/api/v1/chat/stream" \
     -H "Content-Type: application/json" \
     -d '{
       "session_id": "123e4567-e89b-12d3-a456-426614174000",
       "message": "请生成一个关于深度学习的PPT",
       "user_type": "teacher"
     }' \
     --no-buffer
```

## 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 支持基础聊天功能
- 集成网络搜索
- 支持PPT生成
- 支持流式响应
