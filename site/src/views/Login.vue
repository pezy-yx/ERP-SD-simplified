<template>
    <div style="max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #dcdcdc;">
        <h2>登录</h2>
        <string-input
            :node="formTree.findNodeByPath(['username'])"    
            :tree="formTree"
            :nodePath="['username']"
            v-model="username"
            placeholder="请输入用户名"
            :readonly="readonly"
            @update:modelValue="modelValueUpdate_username"
        />
        <string-input
            :node="formTree.findNodeByPath(['password'])"    
            :tree="formTree"
            :nodePath="['password']"
            v-model="password"
            placeholder="请输入密码"
            :readonly="readonly"
            @update:modelValue="modelValueUpdate_password"
        />
        <button
            @click="handleLogin"
            :disabled="isSubmitting"
            style="padding: 10px 20px; background: #409EFF; color: white; border: none;"
        >
            {{ isSubmitting ? '登录中...' : '登录' }}
        </button>
        <div v-if="message" :style="{ color: messageType === 'error' ? 'red' : 'green', marginTop: '10px' }">
            {{ message }}
        </div>
        <div style="margin-top: 10px;">
            没有账号？<router-link to="/register">去注册</router-link>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import StringInput from '@/components/varbox/inputs/StringInput.vue';
import { VarTree, createTreeFromConfig, cns, validators, } from '@/utils/VarTree';
import { login } from '@/api/auth';

// 定义 VarTree 结构
const formTree = createTreeFromConfig({
    varType: 'dict',
    nodeType: 'dict',
    name: 'form',
    children: [
        cns('string', 'leaf', 'username', '1', false, {
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
const readonly = ref(false);
const username = ref("admin");
const password = ref("123456");

// 验证函数
function validateUsername(value: any): boolean {
    if (!validators.required(value)) {
        message.value = '用户名不能为空';
        messageType.value = 'error';
        return false;
    }
    return true;
}

function modelValueUpdate_username(newModelValue: string) {
    console.log("modelValueUpdate_username called with newModelValue:", newModelValue);
    username.value = newModelValue;
    const usernameNode = formTree.findNodeByPath(['username'])!;
    usernameNode.currentValue = newModelValue;
}

function modelValueUpdate_password(newModelValue: string) {
    console.log("modelValueUpdate_password called with newModelValue:", newModelValue);
    password.value = newModelValue;
    const passwordNode = formTree.findNodeByPath(['password'])!;
    passwordNode.currentValue = newModelValue;
}

function validatePassword(value: any): boolean {
    if (!validators.required(value)) {
        message.value = '密码不能为空';
        messageType.value = 'error';
        return false;
    }
    return true;
}

async function handleLogin() {
    const usernameNode = formTree.findNodeByPath(['username'])!;
    const passwordNode = formTree.findNodeByPath(['password'])!;
    const username = usernameNode.currentValue as string;
    const password = passwordNode.currentValue as string;

    if (!validateUsername(username) || !validatePassword(password)) {
        return;
    }

    isSubmitting.value = true;
    const response = await login(username, password);
    isSubmitting.value = false;
    message.value = response.message;
    messageType.value = response.success ? 'success' : 'error';
    if (response.success) {
        localStorage.setItem('token', response.token ?? ''); // 存储 token
        setTimeout(() => router.push('/'), 1000); // 登录成功后跳转到首页
    }
}
</script>