## 接口文档 - 认证服务

### 概述

本文档详细描述了用户认证相关的 API 接口，包括用户注册和用户登录功能。这些接口旨在提供健壮的请求和响应处理，包括详细的成功和错误信息。

**API 基础 URL:** `process.env.VUE_APP_API_BASE_URL` (如果未设置，默认为 `http://localhost:3000/api`)

### 统一响应结构

所有 API 响应都将遵循以下统一的 JSON 结构，以便前端进行统一处理：

```typescript
interface ApiResponse<T> {
    success: boolean;        // 操作是否成功 (true/false)
    message: string;         // 描述操作结果的简短消息
    data?: T;                // 成功时返回的数据载荷 (类型根据具体接口而定，失败时通常为空)
    statusCode?: number;     // HTTP 状态码 (如 200, 400, 401, 500)
    errorCode?: string;      // 后端自定义的错误代码 (仅在 success 为 false 时存在，可选)
    details?: any;           // 更多错误详情，如字段验证错误 (仅在 success 为 false 时存在，可选)
}
```

### 接口列表

-----

### 1\. 用户注册

用于新用户在系统中创建账户。

  * **路径:** `/register`
  * **方法:** `POST`
  * **描述:** 创建一个新的用户账户。
  * **身份验证:** 无需验证

#### 请求 (Request)

  * **Content-Type:** `application/json`

  * **请求体 (Request Body):**

    | 字段       | 类型     | 必填 | 描述     | 示例           |
    | :--------- | :------- | :--- | :------- | :------------- |
    | `username` | `string` | 是   | 用户名，必须唯一 | `newbieUser`   |
    | `password` | `string` | 是   | 用户密码，建议包含大小写字母、数字和特殊字符 | `securePwd#123` |

#### 响应 (Response)

所有响应都将符合 [统一响应结构](https://www.google.com/search?q=%23%E7%BB%9F%E4%B8%80%E5%93%8D%E5%BA%94%E7%BB%93%E6%9E%84)。

  * **成功响应 (Status: `200 OK`)**

      * **描述:** 用户账户成功创建。
      * **响应体示例:**
        ```json
        {
          "success": true,
          "message": "注册成功",
          "statusCode": 200
        }
        ```

  * **失败响应 (客户端错误 - Status: `4xx`)**

      * **描述:** 请求无效，通常是由于用户输入不正确或违反业务规则。
      * **常见状态码:** `400 Bad Request` (无效输入), `409 Conflict` (用户名已存在)
      * **响应体示例 (用户名已存在):**
        ```json
        {
          "success": false,
          "message": "用户名已存在",
          "statusCode": 409,
          "errorCode": "USERNAME_ALREADY_EXISTS"
        }
        ```
      * **响应体示例 (密码不符合要求):**
        ```json
        {
          "success": false,
          "message": "密码不符合要求",
          "statusCode": 400,
          "errorCode": "INVALID_PASSWORD",
          "details": {
            "min_length": 8,
            "requires_uppercase": true
          }
        }
        ```

  * **失败响应 (服务器错误 - Status: `5xx`)**

      * **描述:** 服务器内部发生错误，无法完成请求。
      * **常见状态码:** `500 Internal Server Error`
      * **响应体示例:**
        ```json
        {
          "success": false,
          "message": "服务器内部错误，请稍后再试",
          "statusCode": 500,
          "errorCode": "SERVER_ERROR"
        }
        ```

  * **网络/请求错误 (无 HTTP 状态码)**

      * **描述:** 请求未能到达服务器或在发送请求时发生错误（例如，网络断开、CORS 配置错误、DNS 解析失败）。
      * **前端处理后的响应结构 (示例):**
        ```json
        {
          "success": false,
          "message": "注册失败：无响应，请检查网络连接或服务器状态",
          "details": "Network Error: Request failed with status code 0" // Axios 的原始错误信息
        }
        ```

-----

### 2\. 用户登录

用于已注册用户登录系统并获取认证凭证。

  * **路径:** `/login`
  * **方法:** `POST`
  * **描述:** 使用用户名和密码进行登录，成功后返回认证令牌。
  * **身份验证:** 无需验证

#### 请求 (Request)

  * **Content-Type:** `application/json`

  * **请求体 (Request Body):**

    | 字段       | 类型     | 必填 | 描述     | 示例         |
    | :--------- | :------- | :--- | :------- | :----------- |
    | `username` | `string` | 是   | 用户名   | `user123`    |
    | `password` | `string` | 是   | 用户密码 | `mySecret123` |

#### 响应 (Response)

所有响应都将符合 [统一响应结构](https://www.google.com/search?q=%23%E7%BB%9F%E4%B8%80%E5%93%8D%E5%BA%94%E7%BB%93%E6%9E%84)。

  * **成功响应 (Status: `200 OK`)**

      * **描述:** 用户认证成功，返回认证令牌和可选的用户信息。
      * **数据 (`data`) 字段结构:**
        | 字段   | 类型     | 必填 | 描述           | 示例                 |
        | :----- | :------- | :--- | :------------- | :------------------- |
        | `token`  | `string` | 是   | 用于后续认证的JWT令牌 | `eyJhbGciOiJIUzI...` |
        | `user`   | `object` | 否   | 用户的基本信息 | `{ "id": "1", "username": "user123" }` |
      * **响应体示例:**
        ```json
        {
          "success": true,
          "message": "登录成功",
          "data": {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhYmMxMjMiLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwiaWF0IjoxNzA0MDY3MjAwLCJleHAiOjE3MDQwNzQ0MDB9.signature",
            "user": {
                "id": "user_id_123",
                "username": "testuser"
            }
          },
          "statusCode": 200
        }
        ```

  * **失败响应 (认证失败 - Status: `4xx`)**

      * **描述:** 提供的凭据无效（用户名或密码不匹配）。
      * **常见状态码:** `401 Unauthorized`
      * **响应体示例:**
        ```json
        {
          "success": false,
          "message": "用户名或密码不正确",
          "statusCode": 401,
          "errorCode": "INVALID_CREDENTIALS"
        }
        ```

  * **失败响应 (其他客户端错误 - Status: `4xx`)**

      * **描述:** 请求格式错误或其他客户端问题。
      * **常见状态码:** `400 Bad Request`
      * **响应体示例:**
        ```json
        {
          "success": false,
          "message": "请求参数无效",
          "statusCode": 400,
          "errorCode": "INVALID_INPUT"
        }
        ```

  * **失败响应 (服务器错误 - Status: `5xx`)**

      * **描述:** 服务器内部发生错误，无法完成请求。
      * **常见状态码:** `500 Internal Server Error`
      * **响应体示例:**
        ```json
        {
          "success": false,
          "message": "服务器内部错误，登录失败",
          "statusCode": 500,
          "errorCode": "SERVER_ERROR"
        }
        ```

  * **网络/请求错误 (无 HTTP 状态码)**

      * **描述:** 请求未能到达服务器或在发送请求时发生错误。
      * **前端处理后的响应结构 (示例):**
        ```json
        {
          "success": false,
          "message": "登录失败：网络连接问题或服务器无响应",
          "details": "Error: Network Error" // Axios 的原始错误信息
        }
        ```

-----
