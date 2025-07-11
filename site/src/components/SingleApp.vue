<template>
    <div class="single-app-card" @click="handleClick">
        <div class="card-content">
        <slot name="text">
            <span class="app-text">{{ pageName }}</span>
        </slot>
        </div>
        
        <div class="card-icon">
        <slot name="icon">
            <img :src="resolvedIconPath" alt="App Icon" class="default-icon"/>
        </slot>
        </div>
    </div>
</template>

<script>
import { defineComponent,computed } from 'vue';
import { useRouter } from 'vue-router';

// **关键改动：使用 require.context() 预加载所有可能的图标**
// 这段代码放在组件定义外部，确保它只执行一次，预加载所有图标。
// 如果放在 setup() 内部，虽然也能工作，但每次组件实例化都会重新创建 context 和 map，效率较低。
// - 第一个参数: 要扫描的目录。这里使用了 '@' 别名。
// - 第二个参数: 是否扫描子目录 (false 表示只扫描当前目录)。
// - 第三个参数: 匹配文件名的正则表达式 (/\.svg$/ 匹配所有 .svg 文件)。
const iconContext = require.context('@/assets/icons/', false, /\.svg$/);

// 创建一个映射表，将原始的 '@' 别名路径映射到 Webpack 解析后的实际图片 URL
const iconsMap = {};
iconContext.keys().forEach(key => {
  // `key` 通常是 './文件名.svg' 这种形式。我们需要将其转换为 '@/assets/icons/文件名.svg'
  const aliasPath = `@/assets/icons/${key.substring(2)}`; // 移除 './'
  iconsMap[aliasPath] = iconContext(key); // 调用 context 函数获取图片资源的 URL
});

export default defineComponent({
    name: 'SingleApp',
    props: {
        /**
         * @description 页面的名称，将作为默认显示的文字
         * @type {string}
         */
        pageName: {
        type: String,
        required: true,
        },
        /**
         * @description 点击时跳转的路由路径
         * @type {string}
         */
        pagePath: {
        type: String,
        required: true,
        },
        /**
         * @description 
         * @type {string}
         */
        iconPath: {
        type: String,
        required: false,
        },
    },
    setup(props) {
        console.log(iconsMap); // 输出 iconsMap 以便调试

        const router = useRouter();

        // 使用 computed 属性来动态解析 iconPath
        const resolvedIconPath = computed(() => {
            // 首先尝试从 iconsMap 中查找 props.iconPath 对应的图片 URL
            if (props.iconPath && iconsMap[props.iconPath]) {
                return iconsMap[props.iconPath];
            } else {
                // 如果 props.iconPath 不存在，或者在 iconsMap 中找不到对应的图标
                // 则回退到默认图标
                console.log(`Could not resolve icon: ${props.iconPath}. Using default icon.`);
                const defaultIconPath = '@/assets/icons/default-app-icon.svg';
                
                // 确保默认图标也存在于 iconsMap 中
                if (iconsMap[defaultIconPath]) {
                    return iconsMap[defaultIconPath];
                } else {
                    // 如果连默认图标也找不到，则可能是路径错误或未被 require.context() 包含
                    console.error('Default icon itself could not be resolved! Please check "@/assets/icons/default-app-icon.svg" path and require.context configuration.');
                    return ''; // 返回空字符串，防止图片加载失败的破碎图标显示
                }
            }
        });

        const handleClick = () => {
            // 检查 pagePath 是否存在，然后进行路由跳转
            if (props.pagePath) {
                router.push(props.pagePath);
            } else {
                console.warn(`SingleApp: pagePath for "${props.pageName}" is not defined. Cannot navigate.`);
            }
        };

        return {
            handleClick,
            resolvedIconPath, 
        };
    },
});
</script>

<style scoped>
.single-app-card {
    width: 90%; /* 固定宽度 */
    height: 180px; /* 固定高度 */
    background-color: var(--theme-color-contrast); /* 背景颜色，可自定义 */
    border-top:1px solid white; /* 边框颜色，可自定义 */
    border-left:1px solid white; /* 边框颜色，可自定义 */
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* 内容在垂直方向上两端对齐 */
    align-items: flex-start; /* 文字内容左对齐 */
    padding: 15px;
    position: relative; /* 启用定位上下文，用于图标的绝对定位 */
    overflow: hidden; /* 隐藏超出边界的内容，确保图标在右下角不溢出 */
    cursor: pointer; /* 鼠标悬停时显示手型，表示可点击 */
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out; /* 悬停动画 */
}

.single-app-card:hover {
    transform: translateY(-5px); /* 鼠标悬停时轻微上浮 */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); /* 阴影加深 */
}

.card-content {
    flex-grow: 1; /* 让内容区域占据大部分空间 */
    display: flex;
    align-items: flex-start; /* 文字顶部对齐 */
    color: var(--theme-color-card-text); /* 文字颜色 */
    font-size: 1.1em;
    font-weight: bold;
    text-align: left;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    width:60%;
}

.app-text {
    /* 默认文字样式 */    
    color: var(--theme-color-card-text); /* 可自定义文字颜色 */
}

.card-icon {
    position: absolute; /* 绝对定位 */
    right: 15px; /* 距离右侧 15px */
    bottom: 15px; /* 距离底部 15px */
    width: 40px; /* 图标容器宽度 */
    height: 40px; /* 图标容器高度 */
    display: flex;
    justify-content: center;
    align-items: center;
    /* background-color: rgba(255, 255, 255, 0.1); /* 可选：图标背景，调试时很有用 */
    border-radius: 5px;
}

.default-icon {
    width: 100%; /* 默认图标填充容器 */
    height: 100%;
    object-fit: contain; /* 保持图片比例 */
    /* filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.3)); */
}
</style>