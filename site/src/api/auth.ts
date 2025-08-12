import axios, { AxiosError } from 'axios'; // 导入 AxiosError 类型

// 注册接口
export async function register(username: string, password: string) {
    try {
        const response = await axios.post(`${window.getAPIBaseUrl()}/api/register`, {
            username,
            password
        });

        // 假设后端成功响应时，data 结构就是 { success: boolean, message: string }
        return {
            success: response.data.success,
            message: response.data.message || '注册成功',
            statusCode: response.status
        };
    } catch (error) {
        const axiosError = error as AxiosError; // 类型断言

        if (axiosError.response) {
            // 服务器返回了状态码在 2xx 之外的响应
            const errorData = axiosError.response.data as { message?: string, code?: string, details?: any };
            return {
                success: false,
                message: errorData.message || '注册失败：服务器返回错误',
                statusCode: axiosError.response.status,
                errorCode: errorData.code,
                details: errorData.details
            };
        } else if (axiosError.request) {
            // 请求已发出，但没有收到响应（例如网络中断，CORS问题）
            return {
                success: false,
                message: '注册失败：无响应，请检查网络连接或服务器状态',
                details: axiosError.message // Axios 自身的错误消息
            };
        } else {
            // 在设置请求时发生了一些事情，触发了错误
            return {
                success: false,
                message: '注册失败：请求设置错误',
                details: axiosError.message
            };
        }
    }
}

// 登录接口
export async function login(username: string, password: string){
    try {
        const response = await axios.post(`${window.getAPIBaseUrl()}/api/login`, {
            username,
            password
        });

        // 假设后端成功响应时，data 结构是 { token: string, message: string, user?: {...} }
        // 确保你的后端在成功登录时返回了 token
        if (response.data.token) {
            return {
                success: response.data.success,
                message: response.data.message || '登录成功',
                data: {
                    token: response.data.token,
                    user: {
                        username: response.data.user.username
                    }
                },
                statusCode: response.status
            };
        } else {
            // 如果后端成功返回 2xx 状态码但没有 token（不符合预期）
            return {
                success: false,
                message: response.data.message || '登录成功，但未获取到认证信息',
                statusCode: response.status,
                errorCode: 'NO_TOKEN_RECEIVED'
            };
        }

    } catch (error) {
        const axiosError = error as AxiosError; // 类型断言

        if (axiosError.response) {
            // 服务器返回了状态码在 2xx 之外的响应 (如 401 Unauthorized)
            const errorData = axiosError.response.data as { message?: string, code?: string, details?: any };
            return {
                success: false,
                message: errorData.message || '登录失败：用户名或密码不正确',
                statusCode: axiosError.response.status,
                errorCode: errorData.code,
                details: errorData.details
            };
        } else if (axiosError.request) {
            // 请求已发出，但没有收到响应（例如网络中断）
            return {
                success: false,
                message: '登录失败：网络连接问题或服务器无响应',
                details: axiosError.message
            };
        } else {
            // 在设置请求时发生了一些事情，触发了错误
            return {
                success: false,
                message: '登录失败：请求配置错误',
                details: axiosError.message
            };
        }
    }
}



// // 模拟注册和登录接口

// // 这里使用简单的逻辑模拟注册和登录，实际应用中应连接后端服务

// export async function register(username: string, password: string) {
//     return { success: true, message: 'Registered Successfully' };
// }

// export async function login(username: string, password: string) {
//     if (username === 'admin' && password === '123456') {
//         return { success: true, token: 'fake-token', message: 'Login Successfully' };
//     }
//     return { success: false, message: 'Wrong username or password' };
// }