<template>
    <div id="welcome-page-up">
        <div style="width:25% ; margin: 50px auto; padding: 20px;
            display: flex;flex-direction: column;align-items: center;">
            <h1 style="margin-bottom: 40px;font-size:39px;">WELCOME TO LOGIN</h1>
            <div class="account-input">
                <string-input
                    Type="text"
                    :node="formTree.findNodeByPath(['username'])"
                    :tree="formTree"
                    :nodePath="['username']"
                    v-model="username"
                    placeholder="Please enter username"
                    :readonly="readonly"
                    @validation-error="handleValidationError" />
            </div>
            <div class="account-input">
                <string-input
                    Type="password"
                    :node="formTree.findNodeByPath(['password'])"
                    :tree="formTree"
                    :nodePath="['password']"
                    v-model="password"
                    placeholder="Please enter password"
                    :readonly="readonly"
                    @validation-error="handleValidationError" />
            </div>
            <div style="width:100%;margin-top: 10px;margin-bottom: 20px;display: flex;">
                <div style="margin-right:auto;">
                    <router-link to="/register">Get an account</router-link>
                </div>
                <div style="margin-left:auto;">
                    <router-link to="/getMyPassBack">Forgot password</router-link>
                </div>
            </div>
            <button
                @click="handleLogin"
                :disabled="isSubmitting"
                class="login-button"
            >
                {{ isSubmitting ? 'login...' : '你给我摇滚出去🤘' }}
            </button>
            <div v-if="message" :style="{ color: messageType === 'error' ? 'red' : 'white', marginTop: '10px' }">
                {{ message }}
            </div>
        </div>  
    </div>
    <div id="welcome-page-down">
        <span style="color: var(--login-bg);display: flex;
            flex-direction: column;align-items: center;justify-content: center;">
            <p style="font-size: xx-large;font-weight: bold;margin:0px">TEAM CCC</p>
            <br><p style="width:50%;justify-content: center;">
                Our Sales & Distribution (SD) System empowers businesses with 
                end-to-end automation, from customer inquiries to payment collection. 
                Manage customers, orders, shipments, and finances seamlessly in 
                one integrated platform. Boost efficiency, reduce errors, 
                and gain real-time insights-making global sales faster and smarter than ever.
            </p><br>
            <span>© 2025 Team CCC. All rights reserved.</span>
        </span>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import StringInput from '@/components/customeStringInput.vue';
import { VarTree, createTreeFromConfig, cns, validators, } from '@/utils/VarTree';
import { login } from '@/api/auth';

// 定义 VarTree 结构
const formTree = createTreeFromConfig({
    varType: 'dict',
    nodeType: 'dict',
    name: 'form',
    children: [
        cns('string', 'leaf', 'username', '1', false, {
        validators: [{ creteria: validators.required, message: 'Username cannot be empty' }],
        classPrefix: 'username',
        hideLabel: false
        }, [], '用户名'),
        cns('string', 'leaf', 'password', '', false, {
        validators: [{ creteria: validators.required, message: 'Password cannot be empty' }],
        classPrefix: 'password',
        hideLabel: false
        }, [], '密码')
    ]
});

const isSubmitting = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error'>('success');
const router = useRouter();
const readonly = ref(false);

const username = ref("");
const password = ref("");

// 处理子组件发出的验证错误，统一显示在界面上
function handleValidationError(errorMessage: string) {
    if (errorMessage) {
        message.value = errorMessage;
        messageType.value = 'error';
    } else {
        // 如果子组件发送空字符串，表示验证通过，清除错误消息
        message.value = '';
    }
}

async function handleLogin() {
    // 每次点击登录时，清除之前的消息
    message.value = '';
    messageType.value = 'error'; // 默认设置为错误类型

    // 1. 更新 VarTree 节点的值 (可选，取决于你的 VarTree 如何使用)
    // 这是确保 VarTree 中的 currentValue 与 ref 同步的关键
    const usernameNode = formTree.findNodeByPath(['username'])!;
    const passwordNode = formTree.findNodeByPath(['password'])!;
    usernameNode.currentValue = username.value;
    passwordNode.currentValue = password.value;

    // 2. 执行表单验证
    // 遍历所有需要验证的节点，检查它们是否通过了 VarTree 定义的验证规则
    let isValid = true;
    const nodesToValidate = [usernameNode, passwordNode];

    for (const node of nodesToValidate) {
        if (node.config?.validators) {
            for (const validator of node.config.validators) {
                if (!validator.creteria(node.currentValue)) {
                    message.value = validator.message || `${node.name} 验证失败`;
                    isValid = false;
                    break; // 找到第一个错误就停止当前节点的验证
                }
            }
        }
        if (!isValid) break; // 如果有节点验证失败，就停止所有节点的验证
    }

    if (!isValid) {
        return; // 如果验证失败，停止登录流程
    }

    // 3. 提交数据到后端
    isSubmitting.value = true;
    try {
        const response = await login(username.value, password.value); // 使用 ref 的值
        isSubmitting.value = false;
        message.value = response.message;
        messageType.value = response.success ? 'success' : 'error';

        if (response.success) {
            localStorage.setItem('token', response.token ?? ''); // 存储 token
            setTimeout(() => router.push('/'), 1000); // 登录成功后跳转到首页
        }
    } catch (error: any) {
        isSubmitting.value = false;
        // 处理网络错误或其他未知错误
        message.value = error.response?.data?.message || '登录失败，请稍后再试。';
        messageType.value = 'error';
        console.error('Login error:', error);
    }
}
</script>

<style scoped>
.login-button {
    width: 100%;
    display: inline-flex; /* 使内容居中更方便 */
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
    margin: 1%;
    padding: 8px 25px;
    border: 2px solid transparent; /* 初始透明边框 */
    border-radius: 5px;
    background-color: var(--btn-default-bg); 
    color:var(--btn-default-text);
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    text-decoration: none; /* 移除可能的下划线（如果是a标签）*/
    cursor:default;
    outline: none; /* 移除默认焦点轮廓 */
    transition: all 0.3s ease; /* 平滑过渡所有属性 */
}

.login-button:hover {
    background-color: var(--btn-hover-bg); /* 悬停时改变背景色 */
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15); /* 悬停时加深阴影 */
    transform: translateY(-2px); /* 悬停时轻微上浮 */
    color: var(--btn-hover-text); /* 悬停时改变文字颜色 */
}

.login-button:active {
    background-color: var(--btn-active-bg); /* 点击时改变背景色 */
    box-shadow: 0 2px 4px var(--btn-active-shadow);
    transform: translateY(0); /* 点击时恢复位置 */
}

.login-button:focus {
    border-color: var(--btn-focus-border); /* 获得焦点时显示蓝色边框 */
    box-shadow: 0 0 0 0.2rem var(--btn-focus-shadow); /* 焦点光晕 */
}

.account-input {
    width: 100%;
    padding-bottom:15px;
    margin:0%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

#welcome-page-up {
    width: 100%;
    padding-top:60px;
    padding-bottom:40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--login-bg-1);
    color: var(--login-text);
}

#welcome-page-down {
    width:100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--login-text);
    height: 100%;
}
</style>