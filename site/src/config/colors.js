// src/config/colors.js

/**
 * 这是一个 JavaScript 映射，用于从 CSS 变量中获取颜色值。
 * 主要用于 JS 运行时需要颜色值（如 Canvas, 图表库配置等）的场景。
 * 在 CSS 中，请直接使用 var(--your-color-name)。
 *
 * 注意：这些值在 DOM 完全加载并 CSS 渲染后才能正确获取。
 * 如果在组件挂载前尝试获取，可能会得到空字符串。
 */
export const colors = {
  // --- 通用颜色 (如果你的 _variables.css 中有，这里也应该有对应的映射) ---
  // get colorTextDark() { return getComputedStyle(document.documentElement).getPropertyValue('--color-text-dark').trim(); },
  // get colorTextLight() { return getComputedStyle(document.documentElement).getPropertyValue('--color-text-light').trim(); },

  // --- 登录页颜色集合 ---
  get loginBg1() { return getComputedStyle(document.documentElement).getPropertyValue('--login-bg-1').trim(); },
  get loginBg2() { return getComputedStyle(document.documentElement).getPropertyValue('--login-bg-2').trim(); },
  get loginText() { return getComputedStyle(document.documentElement).getPropertyValue('--login-text').trim(); },
  get loginInputBg() { return getComputedStyle(document.documentElement).getPropertyValue('--login-input-bg').trim(); },
  get loginLinkHover() { return getComputedStyle(document.documentElement).getPropertyValue('--login-link-hover').trim(); },
  get loginLinkText() { return getComputedStyle(document.documentElement).getPropertyValue('--login-link-text').trim(); },
  get loginTextPlaceholder() { return getComputedStyle(document.documentElement).getPropertyValue('--login-text-placeholder').trim(); },


  // --- 按钮状态颜色集 (基于 #25484c 的通用按钮) ---

  // 默认状态
  get btnDefaultBg() { return getComputedStyle(document.documentElement).getPropertyValue('--btn-default-bg').trim(); },
  get btnDefaultText() { return getComputedStyle(document.documentElement).getPropertyValue('--btn-default-text').trim(); },
  get btnDefaultBorder() { return getComputedStyle(document.documentElement).getPropertyValue('--btn-default-border').trim(); },
  get btnDefaultShadow() { return getComputedStyle(document.documentElement).getPropertyValue('--btn-default-shadow').trim(); },

  // 悬停 (Hover) 状态
  get btnHoverBg() { return getComputedStyle(document.documentElement).getPropertyValue('--btn-hover-bg').trim(); },
  get btnHoverText() { return getComputedStyle(document.documentElement).getPropertyValue('--btn-hover-text').trim(); },
  get btnHoverBorder() { return getComputedStyle(document.documentElement).getPropertyValue('--btn-hover-border').trim(); },
  get btnHoverShadow() { return getComputedStyle(document.documentElement).getPropertyValue('--btn-hover-shadow').trim(); },

  // 激活 (Active) 状态
  get btnActiveBg() { return getComputedStyle(document.documentElement).getPropertyValue('--btn-active-bg').trim(); },
  get btnActiveText() { return getComputedStyle(document.documentElement).getPropertyValue('--btn-active-text').trim(); },
  get btnActiveBorder() { return getComputedStyle(document.documentElement).getPropertyValue('--btn-active-border').trim(); },
  get btnActiveShadow() { return getComputedStyle(document.documentElement).getPropertyValue('--btn-active-shadow').trim(); },

  // 禁用 (Disabled) 状态
  get btnDisabledBg() { return getComputedStyle(document.documentElement).getPropertyValue('--btn-disabled-bg').trim(); },
  get btnDisabledText() { return getComputedStyle(document.documentElement).getPropertyValue('--btn-disabled-text').trim(); },
  get btnDisabledBorder() { return getComputedStyle(document.documentElement).getPropertyValue('--btn-disabled-border').trim(); },
  get btnDisabledShadow() { return getComputedStyle(document.documentElement).getPropertyValue('--btn-disabled-shadow').trim(); },

  // 聚焦 (Focus) 状态
  get btnFocusBorder() { return getComputedStyle(document.documentElement).getPropertyValue('--btn-focus-border').trim(); },
  get btnFocusShadow() { return getComputedStyle(document.documentElement).getPropertyValue('--btn-focus-shadow').trim(); },
  get btnFocusOutline() { return getComputedStyle(document.documentElement).getPropertyValue('--btn-focus-outline').trim(); },
};