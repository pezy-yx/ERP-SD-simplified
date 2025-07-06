import axios from 'axios';

// 假设后端 API 的基础 URL
const API_BASE_URL = 'http://localhost:3000/api'; // 替换为你的后端地址

// // 注册接口
// export async function register(username: string, password: string) {
//     try {
//     const response = await axios.post(`${API_BASE_URL}/register`, {
//         username,
//         password
//     });
//     return response.data; // { success: boolean, message: string }
//     } catch (error) {
//         return { success: false, message: '注册失败，请稍后重试' };
//     }
// }

// // 登录接口
// export async function login(username: string, password: string) {
//     try {
//         const response = await axios.post(`${API_BASE_URL}/login`, {
//         username,
//         password
//         });
//         return response.data; // { success: boolean, token: string, message: string }
//     } catch (error) {
//         return { success: false, message: '登录失败，请检查用户名或密码' };
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