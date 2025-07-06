<template>
    <div id="register-page-up">
        <div style="width:25% ; margin: 50px auto; padding: 20px;
            display: flex;flex-direction: column;align-items: center;">
            <h1 style="margin-bottom: 40px;font-size:39px;">WELCOME TO US!</h1>
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
                    @validation-error="handleValidationError"
                    @enter="handlePasswordEnter"
                    @blur="handlePasswordBlur">
                    <template v-slot:form-password--simple="{handleEnter,allProps,internalValue,inputTypeRef,handleInput,togglePasswordVisibility}">
                        <div class="password-input-wrapper">
                            <input
                                class="password-input"
                                :type="inputTypeRef.value" v-model="internalValue.value" @keyup.enter="handleEnter"
                                :placeholder="allProps.placeholder"
                                :readonly="allProps.readonly"
                                @input="handleInput"
                            />
                            <span
                                class="password-toggle-icon"
                                @click="togglePasswordVisibility">
                                    <!-- {{ inputTypeRef.value === 'password' ? '👁️' : '🔒' }} -->
                                    <Transition name="fade" mode="out-in">
                                        <img
                                            v-if="inputTypeRef.value === 'password'"
                                            key = "open-eye" src="@/assets/icons/open-eye.svg" alt="显示密码"
                                            class="password-icon"
                                        />
                                        <img
                                            v-else
                                            key = "closed-eye" src="@/assets/icons/closed-eye.svg" alt="隐藏密码"
                                            class="password-icon"
                                        />
                                    </Transition>
                            </span>
                        </div>
                    </template>
                </string-input>
            </div>
            <div style="width:100%;margin-top: 10px;margin-bottom: 20px;display: flex;">
                <div style="margin-left:auto;display: flex;">
                    <p style="color: var(--color-link-default);">Already have an account?&nbsp;</p>
                    <router-link to="/login">Go login!</router-link>
                </div>
            </div>
            <button
                @click="handleRegister"
                :disabled="isSubmitting"
                class="register-button"
            >
                {{ isSubmitting ? 'Register...' : 'Register' }}
            </button>
            <div v-if="message" :style="{ color: messageType === 'error' ? 'red' : 'white', marginTop: '10px' }">
                {{ message }}
            </div>
        </div>
    </div>
    <div id="register-page-down">
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
import StringInput from '@/components/varbox/inputs/StringInput.vue';
import { VarTree, createTreeFromConfig, cns, validators } from '@/utils/VarTree';
import { register } from '@/api/auth';

// 定义 VarTree 结构
const formTree = createTreeFromConfig({
    varType: 'dict',
    nodeType: 'dict',
    name: 'form',
    children: [
        cns('string', 'leaf', 'username', '', false, {
        validators: [{ creteria: validators.required, message: '用户名不能为空' }],
        classPrefix: 'username',
        hideLabel: false
        }, [], '用户名'),
        cns('string', 'leaf', 'password', '', false, {
        validators: [{ creteria: validators.required, message: '密码不能为空' }],
        classPrefix: 'password',
        hideLabel: false
        }, [], '密码')
    ]
});

const isSubmitting = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error'>('success');
const router = useRouter();
const username = ref('');
const password = ref('');
const readonly = ref(false); // 设置为只读

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

// 如果你需要在父组件处理 password 的 blur 或 enter 事件，在这里定义
function handlePasswordBlur(value: string) {
    console.log('Password input blurred:', value);
    // 这里可以添加密码失去焦点时的特定逻辑，例如格式校验
}

function handlePasswordEnter(value: string) {
    console.log('Password input entered:', value);
    handleRegister();
}


async function handleRegister() {
    // 每次点击注册时，清除之前的消息
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
        return; // 如果验证失败，停止注册流程
    }

    // 3. 提交数据到后端
    isSubmitting.value = true;
    try {
        const response = await register(username.value, password.value); // 使用 ref 的值
        isSubmitting.value = false;
        message.value = response.message;
        messageType.value = response.success ? 'success' : 'error';

        if (response.success) {
            setTimeout(() => router.push('/login'), 1000);
        }
    } catch (error: any) {
        isSubmitting.value = false;
        // 处理网络错误或其他未知错误
        message.value = error.response?.data?.message || 'Registration failed, please try again later.';
        messageType.value = 'error';
        console.error('Register error:', error);
    }
}
</script>

<style scoped>
#register-page-up {
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

#register-page-down {
    width:100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--login-text);
    height: 100%;
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

.password-input-wrapper {
    width: 100%;
    padding: 10px;
    background-color: var(--login-input-bg);
    border-radius: 5px;
    font-size: 14px;
    color:white;
    transition: border-color 0.2s;
    display: flex;
}

.password-input::placeholder {
    color:var(--login-text-placeholder); /* 你想要的占位符颜色，例如一个浅灰色 */
    opacity: 1; /* 某些浏览器会默认给占位符设置透明度，设置 opacity: 1 可以确保颜色完全显示 */
}

.password-input {
    flex-grow: 1; /* 允许输入框增长并占据可用空间 */
}

.password-toggle-icon {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0px; /* 图标周围的内边距 */
    position: relative; /* 为内部绝对定位的子元素建立定位上下文 */
    width: 30px; /* 图标容器的固定宽度，防止布局偏移 */
    overflow: hidden; /* 在过渡期间隐藏任何溢出内容 */
}

.password-icon {
    width: 20px; /* 图片的固定宽度 */
    height: 20px; /* 图片的固定高度 */
    display: block; /* 移除行内图片下方的额外空间 */
    object-fit: contain; /* 确保图片内容在其边界内正确缩放 */

    /* Vue <Transition> 组件所需：用于渐变效果的定位 */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* Vue <Transition> 组件的 CSS 类，用于渐变效果 */
.fade-enter-from,
.fade-leave-to {
    opacity: 0; /* 进入动画的起始状态和离开动画的结束状态：透明度为0 */
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease-in-out; /* 透明度属性在 0.3 秒内平滑过渡 */
}

.register-button {
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

.register-button:hover {
    background-color: var(--btn-hover-bg); /* 悬停时改变背景色 */
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15); /* 悬停时加深阴影 */
    transform: translateY(-2px); /* 悬停时轻微上浮 */
    color: var(--btn-hover-text); /* 悬停时改变文字颜色 */
}

.register-button:active {
    background-color: var(--btn-active-bg); /* 点击时改变背景色 */
    box-shadow: 0 2px 4px var(--btn-active-shadow);
    transform: translateY(0); /* 点击时恢复位置 */
}

.register-button:focus {
    border-color: var(--btn-focus-border); /* 获得焦点时显示蓝色边框 */
    box-shadow: 0 0 0 0.2rem var(--btn-focus-shadow); /* 焦点光晕 */
}
</style>