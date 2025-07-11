## 接口文档 - 认证服务

### 概述

本文档描述了用户认证相关的 API 接口，包括用户注册和用户登录功能。这些接口通过 HTTP POST 请求与后端服务进行通信。

**API 基础 URL:** `process.env.VUE_APP_API_BASE_URL` (如果未设置，默认为 `http://localhost:3000/api`)

### 接口列表

-----

### 1\. 用户注册

用于新用户在系统中创建账户。

  * **路径:** `/register`
  * **方法:** `POST`
  * **描述:** 向后端服务提交用户凭证以创建新的用户账户。
  * **身份验证:** 无需验证 (此为注册接口)

#### 请求 (Request)

  * **Content-Type:** `application/json`

  * **请求体 (Request Body):**

    | 字段       | 类型     | 必填 | 描述     | 示例           |
    | :--------- | :------- | :--- | :------- | :------------- |
    | `username` | `string` | 是   | 用户名   | `myNewUser`    |
    | `password` | `string` | 是   | 用户密码 | `secureP@ssw0rd` |

#### 响应 (Response)

  * **成功状态码:** `200 OK` (如果后端成功处理请求)

  * **Content-Type:** `application/json`

  * **成功响应体 (Response Body - Success):**

    | 字段      | 类型      | 描述     | 示例                        |
    | :-------- | :-------- | :------- | :-------------------------- |
    | `success` | `boolean` | 操作是否成功 | `true`                      |
    | `message` | `string`  | 注册结果消息 | `User registered successfully.` |

    **示例成功响应:**

    ```json
    {
      "success": true,
      "message": "User registered successfully."
    }
    ```

  * **错误状态码:** `4xx` 或 `5xx` (例如 `400 Bad Request`, `500 Internal Server Error`)

  * **错误响应体 (Response Body - Error):**

    | 字段      | 类型      | 描述     | 示例                          |
    | :-------- | :-------- | :------- | :---------------------------- |
    | `success` | `boolean` | 操作是否成功 | `false`                       |
    | `message` | `string`  | 错误详细信息 | `Username already exists.`    |
    | `code`    | `number`  | 错误码 (可选) | `1001`                        |

    **示例错误响应:**

    ```json
    {
      "success": false,
      "message": "Username already exists.",
      "code": 1001
    }
    ```

    *注意：`catch` 块中的 `return { success: false, message: '注册失败，请稍后重试' };` 是前端的降级处理逻辑，实际后端错误响应结构可能更丰富。*

-----

### 2\. 用户登录

用于已注册用户登录系统并获取认证凭证。

  * **路径:** `/login`
  * **方法:** `POST`
  * **描述:** 向后端服务提交用户名和密码以进行用户身份验证。
  * **身份验证:** 无需验证 (此为登录接口)

#### 请求 (Request)

  * **Content-Type:** `application/json`

  * **请求体 (Request Body):**

    | 字段       | 类型     | 必填 | 描述     | 示例         |
    | :--------- | :------- | :--- | :------- | :----------- |
    | `username` | `string` | 是   | 用户名   | `existingUser` |
    | `password` | `string` | 是   | 用户密码 | `yourP@ssw0rd` |

#### 响应 (Response)

  * **成功状态码:** `200 OK` (如果后端成功验证用户)

  * **Content-Type:** `application/json`

  * **成功响应体 (Response Body - Success):**

    | 字段      | 类型      | 描述               | 示例                     |
    | :-------- | :-------- | :----------------- | :----------------------- |
    | `success` | `boolean` | 操作是否成功       | `true`                   |
    | `token`   | `string`  | 认证令牌 (如 JWT) | `eyJhbGciOiJIUzI1NiI...` |
    | `message` | `string`  | 登录结果消息       | `Login successful.`      |

    **示例成功响应:**

    ```json
    {
      "success": true,
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJ1c2VybmFtZSI6ImV4YW1wbGVVc2VyIiwiaWF0IjoxNjc4ODI2MjAwLCJleHAiOjE2Nzg4MzYyMDB9.signature",
      "message": "Login successful."
    }
    ```

  * **错误状态码:** `4xx` 或 `5xx` (例如 `401 Unauthorized`, `400 Bad Request`, `500 Internal Server Error`)

  * **错误响应体 (Response Body - Error):**

    | 字段      | 类型      | 描述               | 示例                          |
    | :-------- | :-------- | :----------------- | :---------------------------- |
    | `success` | `boolean` | 操作是否成功       | `false`                       |
    | `message` | `string`  | 错误详细信息       | `Invalid username or password.` |
    | `code`    | `number`  | 错误码 (可选)      | `1002`                        |

    **示例错误响应:**

    ```json
    {
      "success": false,
      "message": "Invalid username or password.",
      "code": 1002
    }
    ```

    *注意：`catch` 块中的 `return { success: false, message: '登录失败，请检查用户名或密码' };` 是前端的降级处理逻辑，实际后端错误响应结构可能更丰富。*

-----
