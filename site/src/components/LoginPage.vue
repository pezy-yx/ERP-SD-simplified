<template>
  <div class="login-page-wrapper">
    <div class="login-container">
      <h1 class="welcome-text">Welcome to Log in</h1>

      <div class="input-group">
        <input
          type="text"
          v-model="username"
          placeholder="Username"
          class="login-input"
        />
      </div>

      <div class="input-group">
        <input
          type="password"
          v-model="password"
          placeholder="Password"
          class="login-input"
        />
        <a href="#" class="forgot-password">Forgot Password ?</a>
      </div>

      <button @click="handleLogin" class="login-button">Log in</button>
    </div>

    <div class="info-section">
      <h2 class="team-ccc-title">TeamCCC</h2>
      <p class="description-text">
        Our Sales & Distribution (SD) System empowers businesses with end-to-end automation,
        from customer inquiries to payment collection. Manage customers, orders, shipments,
        and finances seamlessly in one integrated platform. Boost efficiency, reduce errors,
        and gain real-time insights—making global sales faster and smarter than ever.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage', // 组件名称
  data() {
    return {
      username: '', // 绑定用户名输入框
      password: ''  // 绑定密码输入框
    };
  },
  methods: {
    handleLogin() {
      // 在这里处理登录逻辑
      // 真实项目中，你会发送一个请求到后端验证用户名和密码
      console.log('尝试登录...');
      console.log('用户名:', this.username);
      console.log('密码:', this.password);

      // 示例：简单验证，实际项目中不应在前端硬编码密码
      if (this.username === 'admin' && this.password === '123456') {
        alert('登录成功！');
        // 真实项目中会进行路由跳转或其他操作，例如：
        // this.$router.push('/dashboard');
      } else {
        alert('用户名或密码错误。');
      }
    }
  }
};
</script>

<style scoped>
/* 整个页面容器 */
.login-page-wrapper {
  display: flex;
  flex-direction: column; /* 垂直布局 */
  min-height: 100vh; /* 保证页面至少和视口一样高 */
  font-family: Arial, sans-serif;
  color: #fff; /* 全局文本颜色为白色 */
}

/* 上半部分：登录区域 */
.login-container {
  flex: 2; /* 占据更多空间 */
  background-color: #25484c; /* 顶部背景色 */
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中 */
  justify-content: center; /* 垂直居中 */
  padding: 50px 20px;
}

.welcome-text {
  font-size: 2.5em; /* 字体大小 */
  margin-bottom: 40px; /* 标题下方间距 */
  color: #eeeed4; /* 欢迎文本颜色 */
}

.input-group {
  width: 100%;
  max-width: 350px; /* 输入框最大宽度 */
  margin-bottom: 20px; /* 输入组下方间距 */
  position: relative; /* 用于忘记密码的定位 */
}

.login-input {
  width: 100%;
  padding: 15px 20px;
  border: none;
  border-radius: 5px; /* 圆角 */
  background-color: rgba(255, 255, 255, 0.2); /* 半透明白色背景 */
  color: #fff; /* 输入文字颜色 */
  font-size: 1.1em;
  outline: none; /* 移除选中时的外边框 */
  box-sizing: border-box; /* 边框和内边距包含在宽度内 */
}

.login-input::placeholder {
  color: rgba(255, 255, 255, 0.7); /* 占位符颜色 */
}

.forgot-password {
  position: absolute;
  right: 0;
  bottom: -25px; /* 定位到输入框下方 */
  font-size: 0.9em;
  color: rgba(255, 255, 255, 0.7); /* 忘记密码文本颜色 */
  text-decoration: none; /* 移除下划线 */
  margin-top: 5px;
}

.forgot-password:hover {
  text-decoration: underline; /* 鼠标悬停时显示下划线 */
}

.login-button {
  width: 100%;
  max-width: 350px; /* 按钮最大宽度 */
  padding: 15px 20px;
  margin-top: 35px; /* 按钮上方间距 */
  background-color: #e6e1ce; /* 按钮背景色，类似图片中的浅米色 */
  color: #25484c; /* 按钮文字颜色 */
  border: none;
  border-radius: 5px;
  font-size: 1.2em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease; /* 过渡效果 */
}

.login-button:hover {
  background-color: #d1d0c4; /* 鼠标悬停时的背景色 */
}

/* 下半部分：信息区域 */
.info-section {
  flex: 1; /* 占据剩余空间 */
  background-color: #e6f0d7; /* 底部背景色，与按钮颜色一致 */
  color: #3b5952; /* 底部文本颜色 */
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中 */
  justify-content: center; /* 垂直居中 */
  padding: 40px 20px;
  text-align: center;
}

.team-ccc-title {
  font-size: 2.2em;
  margin-bottom: 20px;
  font-weight: bold;
}

.description-text {
  max-width: 800px; /* 文本最大宽度 */
  line-height: 1.6;
  font-size: 1em;
}
</style>