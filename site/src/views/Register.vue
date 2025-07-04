<template>
    <div style="max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #dcdcdc;">
        <h2>注册</h2>
        <string-input
            :tree="formTree"
            :nodePath="['username']"
            :node="formTree.findNodeByPath(['username'])"
            v-model="username"
            placeholder="请输入用户名"
            :readonly="false"
        />
        <string-input
            :tree="formTree"
            :nodePath="['password']"
            :node="formTree.findNodeByPath(['password'])"
            v-model="password"
            placeholder="请输入密码"
            :readonly="true"
            @blur="handlePasswordBlur"
            @enter="handlePasswordEnter"
        >
            <template v-slot:form-password--simple="{handleEnter,allProps }">
                <input
                    type="password"
                    v-model="allProps.modelValue"
                    @keyup.enter="handleEnter"
                    :placeholder="allProps.placeholder"
                    :readonly="allProps.readonly"
                    class="string-input"
                />
            </template>
        </string-input>
        <button
            @click="handleRegister"
            :disabled="isSubmitting"
            style="padding: 10px 20px; background: #409EFF; color: white; border: none;"
        >
            {{ isSubmitting ? '注册中...' : '注册' }}
        </button>
        <div v-if="message" :style="{ color: messageType === 'error' ? 'red' : 'green', marginTop: '10px' }">
            {{ message }}
        </div>
        <div style="margin-top: 10px;">
            已有账号？<router-link to="/login">去登录</router-link>
        </div>
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
// 验证函数
function validateUsername(value: any): boolean {
    if (!validators.required(value)) return false;
    if (value.length < 3) {
        message.value = '用户名至少3个字符';
        messageType.value = 'error';
        return false;
    }
    return true;
}

function validatePassword(value: any): boolean {
    if (!validators.required(value)) return false;
    if (value.length < 6) {
        message.value = '密码至少6个字符';
        messageType.value = 'error';
        return false;
    }
    return true;
}

// 如果你需要在父组件处理 password 的 blur 或 enter 事件，在这里定义
function handlePasswordBlur(value: string) {
    console.log('Password input blurred:', value);
    // 这里可以添加密码失去焦点时的特定逻辑，例如格式校验
}

function handlePasswordEnter(value: string) {
    console.log('Password input entered:', value);
    // 这里可以添加密码回车时的特定逻辑，例如直接触发表单提交
    handleRegister();
}


async function handleRegister() {
    const usernameNode = formTree.findNodeByPath(['username'])!;
    const passwordNode = formTree.findNodeByPath(['password'])!;
    const username = usernameNode.currentValue as string;
    const password = passwordNode.currentValue as string;

    if (!validateUsername(username) || !validatePassword(password)) {
        return;
    }

    isSubmitting.value = true;
    const response = await register(username, password);
    isSubmitting.value = false;
    message.value = response.message;
    messageType.value = response.success ? 'success' : 'error';
    if (response.success) {
        setTimeout(() => router.push('/login'), 1000); // 注册成功后跳转
    }
}
</script>