<template>
  <div class="navigation-bar">
    <div class="nav-left">
      <div class="icon-wrapper" @click="goToUserProfile">
        <img src="../assets/user.png" alt="User" class="nav-icon" />
      </div>
      <div class="icon-wrapper" @click="goBack">
        <img src="../assets/back.png" alt="Back" class="nav-icon" />
      </div>
      <div class="icon-wrapper" @click="goToHomePage">
        <img src="../assets/home.png" alt="Home" class="nav-icon" />
      </div>
    </div>

    <div class="nav-title">
      {{ pageTitle }}
    </div>

    <div class="nav-right">
      <div class="search-container">
        <input
          v-if="showSearchInput"
          type="text"
          v-model="searchQuery"
          placeholder="Search Apps..."
          class="search-input"
          @keyup.enter="performSearch"
          @blur="showSearchInput = false"
        />
        <div class="icon-wrapper search-icon" @click="toggleSearchInput">
          <img src="../assets/search.png" alt="Search" class="nav-icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
const router = useRouter(); 
export default {
  name: 'NavigationBar',
  props: {
    pageTitle: {
      type: String,
      default: '页面标题'
    }
  },
  data() {
    return {
      showSearchInput: false,
      searchQuery: ''
    };
  },
  methods: {
    goToUserProfile() {
      // TODO: 跳转到用户主页的逻辑
      console.log('点击用户图标：跳转到用户主页');
      alert('跳转到用户主页功能待实现');
    },
    goBack() {
      // TODO: 返回上一个页面的逻辑
      console.log('点击返回箭头：返回上一个页面');
      window.history.back(); // 简单回退浏览器历史记录
    },
    goToHomePage() {
      // 检查当前是否在application路由下
      if (0 && this.$route.path.startsWith('/application')) {
        const homePageUrl = '/application'; // 跳转到应用程序目录
        console.log(`点击主页图标：回到应用程序目录 (${homePageUrl})`);
        this.$router.push(homePageUrl);
      } else {
        const homePageUrl = '/home'; // 原有路径
        console.log(`点击主页图标：回到系统主页 (${homePageUrl})`);
        this.$router.push(homePageUrl);
      }
    },
    toggleSearchInput() {
      this.showSearchInput = !this.showSearchInput;
      if (this.showSearchInput) {
        this.$nextTick(() => {
          this.$el.querySelector('.search-input').focus();
        });
      }
    },
    performSearch() {
      // TODO: 执行搜索的逻辑
      console.log('执行搜索，搜索内容:', this.searchQuery);
      alert(`执行搜索：${this.searchQuery} (功能待实现)`);
      this.$emit('search', this.searchQuery);
    }
  }
};
</script>

<style scoped>

.navigation-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #25484C;
  color: #EEEED4;
  padding: 0 16px;
  height: 60px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
}

.nav-left, .nav-right {
  display: flex;
  align-items: center;
}

.icon-wrapper {
  padding: 8px;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.3s ease;
  display: flex; /* 让图片在wrapper中居中 */
  justify-content: center;
  align-items: center;
}

.icon-wrapper:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.nav-icon {
  width: 24px; /* 图标宽度 */
  height: 24px; /* 图标高度 */
  object-fit: contain; /* 保持图片比例 */
 
}

.nav-title {
  flex-grow: 1;
  text-align: center;
  position: absolute;
  left: 50%; 
  transform: translateX(-50%); 
  font-size: 1.4em;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-container {
  display: flex;
  align-items: center;
}

.search-input {
  background-color: rgba(255, 255, 255, 0.35);
  border: none;
  width: 150px; 
  border-radius: 5px;
  padding: 8px 12px;
  color: #eeeed4; 
  font-size: 1em;
  transition: width 0.3s ease, opacity 0.3s ease;
  margin-right: 10px;
  outline: none;
}

.search-input::placeholder {
  color:var(--placeholder); /* 占位符颜色 */
}

/* 当搜索输入框显示时 */
.search-input.v-enter-active, .search-input.v-enter-to,
.search-input.v-leave-active, .search-input.v-leave-to {
  width: 200px;
  opacity: 1;
}

.search-icon {
  margin-left: auto;
}
</style>