## 接口文档 - 认证服务

### 1\. 用户注册接口

  * **接口名字：** 用户注册

  * **接口地址：** `POST /api/register`

  * **接口描述：** 用于新用户在系统中创建账户。

  * **请求参数：**

    ```json
    {
      "username": "string",  // 用户名
      "password": "string"   // 用户密码
    }
    ```

  * **响应结果：**

      * **成功注册:**

        ```json
        {
          "success": true,
          "message": "用户注册成功",
          "statusCode": 200
        }
        ```

      * **失败：用户名已存在 (Status: 409 Conflict):**

        ```json
        {
          "success": false,
          "message": "用户名已存在，请尝试其他用户名",
          "statusCode": 409,
          "errorCode": "USERNAME_ALREADY_EXISTS"
        }
        ```

      * **失败：密码不符合要求 (Status: 400 Bad Request):**

        ```json
        {
          "success": false,
          "message": "密码不符合要求",
          "statusCode": 400,
          "errorCode": "INVALID_PASSWORD_FORMAT",
          "details": {
            "minLength": 8,
            "requiresUppercase": true
          }
        }
        ```

      * **失败：请求参数缺失/格式错误 (Status: 400 Bad Request):**

        ```json
        {
          "success": false,
          "message": "请求参数验证失败",
          "statusCode": 400,
          "errorCode": "INVALID_INPUT",
          "details": [
            {"field": "username", "error": "用户名不能为空"}
          ]
        }
        ```

      * **失败：服务器内部错误 (Status: 500 Internal Server Error):**

        ```json
        {
          "success": false,
          "message": "服务器内部错误，注册失败，请稍后再试",
          "statusCode": 500,
          "errorCode": "INTERNAL_SERVER_ERROR"
        }
        ```

      * **失败：网络/请求错误 (无 HTTP 状态码):**

        ```json
        {
          "success": false,
          "message": "注册失败：网络连接问题或服务器无响应",
          "statusCode": null,
          "errorCode": "NETWORK_ERROR",
          "details": "Error: Network Error"
        }
        ```

  * **响应字段说明：**

      * `success` (boolean): 请求是否成功 (`true` 或 `false`)。
      * `message` (string): 响应消息，描述操作结果或错误详情。
      * `statusCode` (number, 可选): HTTP 状态码。对于网络错误可能为 `null` 或 `undefined`。
      * `errorCode` (string, 可选): 后端自定义的错误代码，用于前端更精确地识别错误类型。
      * `details` (any, 可选): 更多错误详情，例如字段验证失败的具体信息。

-----

### 2\. 用户登录接口

  * **接口名字：** 用户登录

  * **接口地址：** `POST /api/login`

  * **接口描述：** 用于已注册用户登录系统并获取认证凭证。

  * **请求参数：**

    ```json
    {
      "username": "string",  // 用户的用户名
      "password": "string"   // 用户的密码
    }
    ```

  * **响应结果：**

      * **成功登录:**

        ```json
        {
          "success": true,
          "token": "string",
          "message": "登录成功",
          "statusCode": 200,
          "data": {
              "user": {
                  "id": "string",
                  "username": "string",
                  "email": "string" // 假设可能返回更多用户信息
              }
          }
        }
        ```

      * **失败：用户名或密码不正确 (Status: 401 Unauthorized):**

        ```json
        {
          "success": false,
          "message": "用户名或密码不正确",
          "statusCode": 401,
          "errorCode": "INVALID_CREDENTIALS"
        }
        ```

      * **失败：账户被锁定/禁用 (Status: 403 Forbidden):**

        ```json
        {
          "success": false,
          "message": "账户已被锁定或禁用，请联系管理员",
          "statusCode": 403,
          "errorCode": "ACCOUNT_LOCKED_OR_DISABLED",
          "details": {"reason": "Too many failed login attempts"}
        }
        ```

      * **失败：请求参数缺失 (Status: 400 Bad Request):**

        ```json
        {
          "success": false,
          "message": "请求参数缺失",
          "statusCode": 400,
          "errorCode": "MISSING_PARAMETERS",
          "details": ["username", "password"]
        }
        ```

      * **失败：服务器内部错误 (Status: 500 Internal Server Error):**

        ```json
        {
          "success": false,
          "message": "服务器内部错误，登录失败，请稍后再试",
          "statusCode": 500,
          "errorCode": "INTERNAL_SERVER_ERROR"
        }
        ```

      * **失败：网络/请求错误 (无 HTTP 状态码):**

        ```json
        {
          "success": false,
          "message": "登录失败：网络连接问题或服务器无响应",
          "statusCode": null,
          "errorCode": "NETWORK_ERROR",
          "details": "Error: Network Error"
        }
        ```

  * **响应字段说明：**

      * `success` (boolean): 请求是否成功 (`true` 或 `false`)。
      * `token` (string, **仅成功时有**): 用于后续认证的令牌 (如 JWT)。
      * `message` (string): 响应消息，描述操作结果或错误详情。
      * `statusCode` (number, 可选): HTTP 状态码。对于网络错误可能为 `null` 或 `undefined`。
      * `errorCode` (string, 可选): 后端自定义的错误代码，用于前端更精确地识别错误类型。
      * `details` (any, 可选): 更多错误详情，例如账户锁定原因、或原始 Axios 错误信息。
      * `data` (object, 可选，**仅成功时有**): 成功响应时可能包含额外的数据，例如用户的基本信息。
