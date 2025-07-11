import axios, { AxiosError } from 'axios'; // 导入 AxiosError 类型

// 后端 API 的基础 URL - 从环境变量读取
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000/api';

// // 定义统一的 API 响应类型
// interface ApiResponse<T> {
//     success: boolean;
//     message: string;
//     data?: T; // 成功时的数据
//     statusCode?: number; // HTTP 状态码
//     errorCode?: string; // 后端自定义错误码
//     details?: any; // 更多错误详情，如字段验证错误
// }

// // 注册接口
// export async function register(username: string, password: string): Promise<ApiResponse<null>> {
//     try {
//         const response = await axios.post(`${API_BASE_URL}/register`, {
//             username,
//             password
//         });

//         // 假设后端成功响应时，data 结构就是 { success: boolean, message: string }
//         // 如果后端只返回 { message: "Registered successfully" }，你可能需要调整 data: response.data
//         return {
//             success: true,
//             message: response.data.message || '注册成功',
//             statusCode: response.status
//         };
//     } catch (error) {
//         const axiosError = error as AxiosError; // 类型断言

//         if (axiosError.response) {
//             // 服务器返回了状态码在 2xx 之外的响应
//             const errorData = axiosError.response.data as { message?: string, code?: string, details?: any };
//             return {
//                 success: false,
//                 message: errorData.message || '注册失败：服务器返回错误',
//                 statusCode: axiosError.response.status,
//                 errorCode: errorData.code,
//                 details: errorData.details
//             };
//         } else if (axiosError.request) {
//             // 请求已发出，但没有收到响应（例如网络中断，CORS问题）
//             return {
//                 success: false,
//                 message: '注册失败：无响应，请检查网络连接或服务器状态',
//                 details: axiosError.message // Axios 自身的错误消息
//             };
//         } else {
//             // 在设置请求时发生了一些事情，触发了错误
//             return {
//                 success: false,
//                 message: '注册失败：请求设置错误',
//                 details: axiosError.message
//             };
//         }
//     }
// }

// // 定义登录成功时的数据类型
// interface LoginSuccessData {
//     token: string;
//     user?: { id: string; username: string }; // 可选的用户信息
// }

// // 登录接口
// export async function login(username: string, password: string): Promise<ApiResponse<LoginSuccessData>> {
//     try {
//         const response = await axios.post(`${API_BASE_URL}/login`, {
//             username,
//             password
//         });

//         // 假设后端成功响应时，data 结构是 { token: string, message: string, user?: {...} }
//         // 确保你的后端在成功登录时返回了 token
//         if (response.data.token) {
//             return {
//                 success: true,
//                 message: response.data.message || '登录成功',
//                 data: {
//                     token: response.data.token,
//                     user: response.data.user // 如果后端返回用户信息
//                 },
//                 statusCode: response.status
//             };
//         } else {
//             // 如果后端成功返回 2xx 状态码但没有 token（不符合预期）
//             return {
//                 success: false,
//                 message: response.data.message || '登录成功，但未获取到认证信息',
//                 statusCode: response.status,
//                 errorCode: 'NO_TOKEN_RECEIVED'
//             };
//         }

//     } catch (error) {
//         const axiosError = error as AxiosError; // 类型断言

//         if (axiosError.response) {
//             // 服务器返回了状态码在 2xx 之外的响应 (如 401 Unauthorized)
//             const errorData = axiosError.response.data as { message?: string, code?: string, details?: any };
//             return {
//                 success: false,
//                 message: errorData.message || '登录失败：用户名或密码不正确',
//                 statusCode: axiosError.response.status,
//                 errorCode: errorData.code,
//                 details: errorData.details
//             };
//         } else if (axiosError.request) {
//             // 请求已发出，但没有收到响应（例如网络中断）
//             return {
//                 success: false,
//                 message: '登录失败：网络连接问题或服务器无响应',
//                 details: axiosError.message
//             };
//         } else {
//             // 在设置请求时发生了一些事情，触发了错误
//             return {
//                 success: false,
//                 message: '登录失败：请求配置错误',
//                 details: axiosError.message
//             };
//         }
//     }
// }



// 模拟注册和登录接口

// 这里使用简单的逻辑模拟注册和登录，实际应用中应连接后端服务

export async function register(username: string, password: string) {
    return { success: true, message: 'Registered Successfully' };
}

export async function login(username: string, password: string) {
    if (username === 'admin' && password === '123456') {
        return { success: true, token: 'fake-token', message: 'Login Successfully' };
    }
    return { success: false, message: 'Wrong username or password' };
}