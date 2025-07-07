export default defineEventHandler(async (event) => {
  // Enhanced DevTools view using UI Kit design patterns
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Feature Flags DevTools</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <script src="https://unpkg.com/@vueuse/shared@11.2.0/index.iife.min.js"></script>
  <script src="https://unpkg.com/@vueuse/core@11.2.0/index.iife.min.js"></script>
  <script src="https://unpkg.com/@nuxt/devtools-kit@1.7.0/dist/iframe-client.global.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/@unocss/reset@0.59.4/tailwind.css">
  <script src="https://unpkg.com/@unocss/runtime@0.59.4/uno.global.js"></script>
  <style>
    :root {
      color-scheme: dark;
      --nui-c-context: 125, 125, 125;
      --nui-c-bg-base: 26, 26, 26;
      --nui-c-bg-active: 42, 42, 42;
      --nui-c-border: 51, 51, 51;
      --nui-c-text-primary: 229, 229, 229;
      --nui-c-text-secondary: 156, 163, 175;
      --nui-c-primary: 0, 220, 130;
      --nui-c-green: 16, 185, 129;
      --nui-c-red: 239, 68, 68;
      --nui-c-yellow: 245, 158, 11;
      --nui-c-blue: 59, 130, 246;
    }
    
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: rgb(var(--nui-c-bg-base));
      color: rgb(var(--nui-c-text-primary));
      min-height: 100vh;
    }
    
    /* Official UI Kit component styles */
    .n-bg-base { background: rgb(var(--nui-c-bg-base)); }
    .n-border-base { border-color: rgb(var(--nui-c-border)); }
    
    .n-card { 
      background: rgb(var(--nui-c-bg-active)); 
      border: 1px solid rgb(var(--nui-c-border)); 
      border-radius: 8px; 
    }
    
    .n-button {
      background: rgb(var(--nui-c-bg-active));
      color: rgb(var(--nui-c-text-primary));
      border: 1px solid rgb(var(--nui-c-border));
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .n-button:hover { 
      background: rgb(var(--nui-c-context));
      border-color: rgb(var(--nui-c-context));
    }
    .n-button:disabled { opacity: 0.5; cursor: not-allowed; }
    .n-button.n-green { background: rgb(var(--nui-c-green)); color: #000; }
    .n-button.n-green:hover { background: rgb(16, 185, 129, 0.8); }
    .n-button.n-sm { padding: 4px 8px; font-size: 14px; }
    
    .n-tip {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 14px;
    }
    .n-tip.n-green { background: rgb(var(--nui-c-green)); color: #000; }
    .n-tip.n-yellow { background: rgb(var(--nui-c-yellow)); color: #000; }
    .n-tip.n-red { background: rgb(var(--nui-c-red)); color: #fff; }
    .n-tip.n-blue { background: rgb(var(--nui-c-blue)); color: #fff; }
    
    .n-badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
    }
    .n-badge.n-green { background: rgb(var(--nui-c-green)); color: #000; }
    .n-badge.n-red { background: rgb(var(--nui-c-red)); color: #fff; }
    .n-badge.n-blue { background: rgb(var(--nui-c-blue)); color: #fff; }
    
    .text-primary { color: rgb(var(--nui-c-primary)); }
    .text-secondary { color: rgb(var(--nui-c-text-secondary)); }
    .text-gray { color: rgb(var(--nui-c-text-secondary)); }
    
    .border-base { border-color: rgb(var(--nui-c-border)); }
    .bg-active { background: rgb(var(--nui-c-bg-active)); }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    
    .flag-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border: 1px solid rgb(var(--nui-c-border));
      border-radius: 8px;
      margin-bottom: 8px;
      transition: background-color 0.2s;
      background: rgb(var(--nui-c-bg-active));
    }
    .flag-item:hover { 
      background: rgba(var(--nui-c-context), 0.1); 
    }
    
    /* Icons using Carbon Design System */
    .i-carbon-flag::before { content: "🚩"; }
    .i-carbon-checkmark::before { content: "✓"; }
    .i-carbon-warning::before { content: "⚠"; }
    .i-carbon-warning-alt::before { content: "⚠"; }
    .i-carbon-refresh::before { content: "🔄"; }
    .i-carbon-information::before { content: "ℹ"; }
    .i-carbon-toggle-on::before { content: "🔛"; }
    .i-carbon-toggle-off::before { content: "🔘"; }
    .i-carbon-locked::before { content: "🔒"; }
    .i-carbon-time::before { content: "⏰"; }
    .i-carbon-circle-dash::before { content: "◐"; }
    
    .icon { width: 1em; height: 1em; display: inline-block; }
    
    .n-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div id="app"></div>

  <script>
    const { createApp, ref, computed, onMounted } = Vue
    const { useDevtoolsClient } = window.DevtoolsKit
    
    // UI Kit-inspired components
    const NButton = {
      props: ['n', 'icon', 'disabled', 'title'],
      template: \`
        <button 
          class="n-button"
          :class="[n ? 'n-' + n : '', { 'n-icon-button': !$slots.default }]"
          :disabled="disabled"
          :title="title"
          v-bind="$attrs"
        >
          <span v-if="icon" :class="['icon', icon]"></span>
          <slot />
        </button>
      \`
    }
    
    const NCard = {
      props: ['class'],
      template: \`
        <div class="n-card" :class="$props.class">
          <slot />
        </div>
      \`
    }
    
    const NTip = {
      props: ['n', 'icon'],
      template: \`
        <div class="n-tip" :class="n ? 'n-' + n : ''">
          <span v-if="icon" :class="['icon', icon]"></span>
          <div><slot /></div>
        </div>
      \`
    }
    
    const NBadge = {
      props: ['n'],
      template: \`
        <span class="n-badge" :class="n ? 'n-' + n : ''">
          <slot />
        </span>
      \`
    }
    
    const NLoading = {
      template: \`
        <div class="n-loading">
          <div class="icon i-carbon-circle-dash animate-spin text-4xl"></div>
          <slot>Loading...</slot>
        </div>
      \`
    }
    
    const NIcon = {
      props: ['icon'],
      template: \`<div class="icon" :class="icon" />\`
    }
    
    const NIconTitle = {
      props: ['icon', 'text'],
      template: \`
        <div style="display: flex; align-items: center; gap: 12px;">
          <div v-if="icon" class="icon" :class="icon"></div>
          <slot><div>{{ text }}</div></slot>
        </div>
      \`
    }
    
    const App = {
      components: {
        NButton,
        NCard,
        NTip,
        NBadge,
        NLoading,
        NIcon,
        NIconTitle
      }
    }

    createApp(App).mount('#app')
  </script>
</body>
</html>

  // Vue SPA using official Nuxt DevTools UI Kit
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Feature Flags DevTools</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <script src="https://unpkg.com/@vueuse/shared@11.2.0/index.iife.min.js"></script>
  <script src="https://unpkg.com/@vueuse/core@11.2.0/index.iife.min.js"></script>
  <script src="https://unpkg.com/@nuxt/devtools-kit@1.7.0/dist/iframe-client.global.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/@unocss/reset@0.59.4/tailwind.css">
  <script src="https://unpkg.com/@unocss/runtime@0.59.4/uno.global.js"></script>
  <style>
    :root {
      color-scheme: dark;
      --nui-c-context: 125, 125, 125;
      --nui-c-bg-base: 26, 26, 26;
      --nui-c-bg-active: 42, 42, 42;
      --nui-c-border: 51, 51, 51;
      --nui-c-text-primary: 229, 229, 229;
      --nui-c-text-secondary: 156, 163, 175;
      --nui-c-primary: 0, 220, 130;
      --nui-c-green: 16, 185, 129;
      --nui-c-red: 239, 68, 68;
      --nui-c-yellow: 245, 158, 11;
      --nui-c-blue: 59, 130, 246;
      --nui-c-gray: 107, 114, 128;
    }
    
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: rgb(var(--nui-c-bg-base));
      color: rgb(var(--nui-c-text-primary));
      min-height: 100vh;
    }
    
    /* Official UI Kit base classes */
    .n-card {
      background: rgb(var(--nui-c-bg-active));
      border: 1px solid rgb(var(--nui-c-border));
      border-radius: 8px;
    }
    
    .n-button {
      background: rgb(var(--nui-c-bg-active));
      color: rgb(var(--nui-c-text-primary));
      border: 1px solid rgb(var(--nui-c-border));
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }
    .n-button:hover { background: rgba(var(--nui-c-context), 0.1); }
    .n-button:disabled { opacity: 0.5; cursor: not-allowed; }
    .n-button.green { background: rgb(var(--nui-c-green)); color: #000; }
    .n-button.green:hover { background: rgba(var(--nui-c-green), 0.8); }
    .n-button.sm { padding: 4px 8px; font-size: 12px; }
    
    .n-tip {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 14px;
      border: 1px solid rgb(var(--nui-c-border));
    }
    .n-tip.green { background: rgb(var(--nui-c-green)); color: #000; }
    .n-tip.yellow { background: rgb(var(--nui-c-yellow)); color: #000; }
    .n-tip.red { background: rgb(var(--nui-c-red)); color: #fff; }
    .n-tip.blue { background: rgb(var(--nui-c-blue)); color: #fff; }
    
    .n-badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      background: rgb(var(--nui-c-context));
      color: rgb(var(--nui-c-text-primary));
    }
    .n-badge.green { background: rgb(var(--nui-c-green)); color: #000; }
    .n-badge.red { background: rgb(var(--nui-c-red)); color: #fff; }
    .n-badge.blue { background: rgb(var(--nui-c-blue)); color: #fff; }
    
    .n-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    
    /* Utility classes */
    .text-primary { color: rgb(var(--nui-c-primary)); }
    .text-secondary { color: rgb(var(--nui-c-text-secondary)); }
    .text-gray { color: rgb(var(--nui-c-gray)); }
    .text-blue { color: rgb(var(--nui-c-blue)); }
    .border-base { border-color: rgb(var(--nui-c-border)); }
    
    /* Custom styling for specific layouts */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    
    .flag-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border: 1px solid rgb(var(--nui-c-border));
      border-radius: 8px;
      margin-bottom: 8px;
      transition: background-color 0.2s;
      background: rgb(var(--nui-c-bg-base));
    }
    .flag-item:hover { 
      background: rgb(var(--nui-c-bg-active)); 
    }
    
    /* Icon support with Carbon Design System icons via UnoCSS */
    [class^="i-carbon-"], [class*=" i-carbon-"] {
      display: inline-block;
      width: 1em;
      height: 1em;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      vertical-align: text-bottom;
    }
    
    .i-carbon-refresh { 
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3e%3cpath fill='currentColor' d='M18 28A12 12 0 1 0 6 16v6.2l-3.6-3.6L1 20l6 6l6-6l-1.4-1.4L8 22.2V16a10 10 0 1 1 10 10Z'/%3e%3c/svg%3e");
    }
    
    .i-carbon-flag { 
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3e%3cpath fill='currentColor' d='M6 30h2V16h18l-4-5l4-5H6v24zm2-26h14.34l-2.4 3l2.4 3H8V4z'/%3e%3c/svg%3e");
    }
    
    .i-carbon-checkmark { 
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3e%3cpath fill='currentColor' d='m14 21.414l-5-5.001L10.413 15L14 18.586L21.585 11L23 12.415z'/%3e%3c/svg%3e");
    }
    
    .i-carbon-warning { 
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3e%3cpath fill='currentColor' d='M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2Zm0 26a12 12 0 1 1 12-12a12 12 0 0 1-12 12Z'/%3e%3cpath fill='currentColor' d='M15 8h2v11h-2zm1 14a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 16 22z'/%3e%3c/svg%3e");
    }
    
    .i-carbon-warning-alt { 
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3e%3cpath fill='currentColor' d='M30.865 25.917L17.429 4.101a2 2 0 0 0-3.428 0L.565 25.917A2 2 0 0 0 2.279 29h26.442a2 2 0 0 0 1.714-3.083ZM2.279 27L15.715 5.383L29.151 27Z'/%3e%3cpath fill='currentColor' d='M15 11h2v10h-2zm1 12a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 16 23z'/%3e%3c/svg%3e");
    }
    
    .i-carbon-information { 
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3e%3cpath fill='currentColor' d='M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2Zm0 26a12 12 0 1 1 12-12a12 12 0 0 1-12 12Z'/%3e%3cpath fill='currentColor' d='M15 8h2v2h-2zm0 4h2v10h-2z'/%3e%3c/svg%3e");
    }
    
    .i-carbon-toggle-on { 
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3e%3cpath fill='currentColor' d='M20 13a7 7 0 1 1-7-7a7 7 0 0 1 7 7Zm-2 0a5 5 0 1 0-5 5a5 5 0 0 0 5-5Z'/%3e%3cpath fill='currentColor' d='M21 6a13 13 0 1 0 13 13A13 13 0 0 0 21 6Zm0 24a11 11 0 1 1 11-11a11 11 0 0 1-11 11Z'/%3e%3c/svg%3e");
    }
    
    .i-carbon-toggle-off { 
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3e%3cpath fill='currentColor' d='M13 26a13 13 0 1 1 13-13a13 13 0 0 1-13 13Zm0-24A11 11 0 1 0 24 13A11 11 0 0 0 13 2Z'/%3e%3cpath fill='currentColor' d='M13 19a6 6 0 1 1 6-6a6 6 0 0 1-6 6Zm0-10a4 4 0 1 0 4 4a4 4 0 0 0-4-4Z'/%3e%3c/svg%3e");
    }
    
    .i-carbon-locked { 
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3e%3cpath fill='currentColor' d='M21 2a8.998 8.998 0 0 0-9 9v3H6v16h20V14h-6v-3A8.998 8.998 0 0 0 21 2zM14 11a7 7 0 0 1 14 0v3h-4v-3a3 3 0 0 0-6 0v3h-4v-3zm10 17H8V16h16v12z'/%3e%3c/svg%3e");
    }
    
    .i-carbon-time { 
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3e%3cpath fill='currentColor' d='M16 30a14 14 0 1 1 14-14a14 14 0 0 1-14 14Zm0-26a12 12 0 1 0 12 12A12 12 0 0 0 16 4Z'/%3e%3cpath fill='currentColor' d='m20.59 22l-5.59-5.59V8h2v7.41l5 5L20.59 22z'/%3e%3c/svg%3e");
    }
    
    .i-carbon-circle-dash { 
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3e%3cpath fill='currentColor' d='M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2Zm6 15H10v-2h12v2Z'/%3e%3c/svg%3e");
    }
    
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div id="app"></div>

  <script>
    const { createApp, ref, computed, onMounted, h } = Vue
    const { useDevtoolsClient } = window.DevtoolsKit
    
    // Simple UI Kit-styled components that mimic the official ones
    const NButton = {
      props: ['n', 'icon', 'disabled'],
      template: \`
        <button 
          class="n-button n-button-base active:n-button-active focus-visible:n-focus-base hover:n-button-hover n-transition n-disabled:n-disabled"
          :class="[n, { 'n-icon-button': !$slots.default }]"
          :disabled="disabled"
          v-bind="$attrs"
        >
          <span v-if="icon" :class="['n-button-icon', icon]"></span>
          <slot />
        </button>
      \`
    }
    
    const NCard = {
      template: \`
        <div class="n-card n-card-base">
          <slot />
        </div>
      \`
    }
    
    const NTip = {
      props: ['n', 'icon'],
      template: \`
        <div class="n-tip n-tip-base" :class="n">
          <span v-if="icon" :class="['n-tip-icon', icon]"></span>
          <div><slot /></div>
        </div>
      \`
    }
    
    const NBadge = {
      props: ['n'],
      template: \`
        <span class="n-badge" :class="n">
          <slot />
        </span>
      \`
    }
    
    const NLoading = {
      template: \`
        <div class="n-loading n-panel-grids-center">
          <div class="flex flex-col animate-pulse items-center text-lg">
            <div class="i-carbon-circle-dash animate-spin text-4xl op50" />
            <slot>Loading...</slot>
          </div>
        </div>
      \`
    }
    
    const NIcon = {
      props: ['icon'],
      template: \`<div class="n-icon" :class="icon" />\`
    }
    
    const NIconTitle = {
      props: ['icon', 'text'],
      template: \`
        <div class="flex items-center gap-3">
          <div v-if="icon" :class="icon" />
          <slot><div>{{ text }}</div></slot>
        </div>
      \`
    }
    
    const App = {
      components: {
        NButton,
        NCard,
        NTip,
        NBadge,
        NLoading,
        NIcon,
        NIconTitle
      },
      
      setup() {
        const client = useDevtoolsClient ? useDevtoolsClient() : ref(null)
        const isConnected = computed(() => !!client.value)
        
        // State
        const flags = ref({})
        const status = ref({ totalFlags: 0, enabledFlags: 0 })
        const loading = ref(true)
        const error = ref('')
        const notification = ref('')
        
        let rpc = null
        
        onMounted(async () => {
          if (client.value) {
            rpc = client.value.devtools.extendClientRpc('nuxt-feature-flags', {
              showNotification(message) {
                showNotification(message)
              },
              refreshFlags() {
                loadData()
              }
            })
            
            await loadData()
            setInterval(loadData, 5000)
          } else {
            await loadDataFallback()
          }
        })
        
        async function loadData() {
          if (!rpc) return
          
          try {
            loading.value = true
            error.value = ''
            
            const [config, statusData] = await Promise.all([
              rpc.getFeatureFlagsConfig(),
              rpc.getFeatureFlagsStatus()
            ])
            
            flags.value = config.flags || {}
            status.value = statusData
          } catch (err) {
            console.error('Error loading data:', err)
            error.value = 'Failed to load feature flags data'
          } finally {
            loading.value = false
          }
        }
        
        async function loadDataFallback() {
          try {
            loading.value = true
            error.value = ''
            
            const response = await fetch('/api/_feature-flags/feature-flags')
            const data = await response.json()
            
            flags.value = data.flags || {}
            
            const totalFlags = Object.keys(flags.value).length
            const enabledFlags = Object.values(flags.value).filter(flag => {
              if (typeof flag === 'boolean') return flag
              if (typeof flag === 'object' && flag !== null && 'enabled' in flag) {
                return flag.enabled
              }
              return true
            }).length
            
            status.value = { totalFlags, enabledFlags }
          } catch (err) {
            console.error('Error loading fallback data:', err)
            error.value = 'Failed to load feature flags data'
          } finally {
            loading.value = false
          }
        }
        
        async function toggleFlag(flagName) {
          if (!rpc) {
            error.value = 'DevTools RPC not available. Toggle functionality requires DevTools connection.'
            return
          }
          
          try {
            const newState = await rpc.toggleFlag(flagName)
            
            if (flags.value[flagName] && typeof flags.value[flagName] === 'object') {
              flags.value[flagName].enabled = newState
            } else {
              flags.value[flagName] = newState
            }
            
            setTimeout(() => loadData(), 300)
            showNotification('Feature flag "' + flagName + '" ' + (newState ? 'enabled' : 'disabled'))
          } catch (err) {
            console.error('Error toggling flag:', err)
            error.value = 'Failed to toggle flag "' + flagName + '"'
          }
        }
        
        function showNotification(message) {
          notification.value = message
          setTimeout(() => {
            notification.value = ''
          }, 3000)
        }
        
        function canToggleFlag(flag) {
          return !(typeof flag === 'object' && flag !== null && 'variants' in flag)
        }
        
        function getFlagVariants(flag) {
          if (typeof flag === 'object' && flag !== null && flag.variants) {
            return Object.keys(flag.variants)
          }
          return []
        }
        
        function getFlagEnabled(flag) {
          if (typeof flag === 'boolean') return flag
          if (typeof flag === 'object' && flag !== null && 'enabled' in flag) {
            return flag.enabled
          }
          return true
        }
        
        function getFlagValue(flag) {
          if (typeof flag === 'boolean') return flag
          if (typeof flag === 'object' && flag !== null) {
            return flag.value !== undefined ? flag.value : flag.enabled
          }
          return flag
        }
        
        const disabledFlags = computed(() => status.value.totalFlags - status.value.enabledFlags)
        
        return {
          isConnected,
          flags,
          status,
          loading,
          error,
          notification,
          loadData,
          toggleFlag,
          canToggleFlag,
          getFlagVariants,
          getFlagEnabled,
          getFlagValue,
          disabledFlags
        }
      },
      
      template: \`
        <div class="p-6 min-h-screen">
          <!-- Header -->
          <div class="mb-6 pb-4 border-b border-base">
            <NIconTitle icon="i-carbon-flag" text="Feature Flags DevTools" class="text-2xl font-semibold mb-2 text-primary" />
            <p class="text-secondary">Monitor and manage your feature flags during development</p>
          </div>

          <!-- Connection Status -->
          <div class="mb-4">
            <NTip v-if="isConnected" n="green" icon="i-carbon-checkmark">
              Connected to DevTools - Real-time updates enabled
            </NTip>
            <NTip v-else n="yellow" icon="i-carbon-warning">
              DevTools not connected - Using fallback mode
            </NTip>
          </div>

          <!-- Error Display -->
          <div v-if="error" class="mb-4">
            <NTip n="red" icon="i-carbon-warning-alt">{{ error }}</NTip>
          </div>

          <!-- Notification -->
          <div v-if="notification" class="fixed top-4 right-4 z-50">
            <NTip n="green" icon="i-carbon-checkmark">{{ notification }}</NTip>
          </div>

          <!-- Stats Overview -->
          <div class="stats-grid mb-6">
            <NCard class="p-4 text-center">
              <div class="text-3xl font-bold mb-2 text-primary">
                {{ loading ? '-' : status.totalFlags }}
              </div>
              <div class="text-sm text-secondary">Total Flags</div>
            </NCard>
            
            <NCard class="p-4 text-center">
              <div class="text-3xl font-bold mb-2 text-blue">
                {{ loading ? '-' : status.enabledFlags }}
              </div>
              <div class="text-sm text-secondary">Enabled Flags</div>
            </NCard>
            
            <NCard class="p-4 text-center">
              <div class="text-3xl font-bold mb-2 text-gray">
                {{ loading ? '-' : disabledFlags }}
              </div>
              <div class="text-sm text-secondary">Disabled Flags</div>
            </NCard>
          </div>

          <!-- Flags List -->
          <NCard class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold">Flag Details</h2>
              <NButton n="green" icon="i-carbon-refresh" @click="loadData" :disabled="loading">
                Refresh
              </NButton>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-8">
              <NLoading>Loading feature flags...</NLoading>
            </div>

            <!-- Empty State -->
            <div v-else-if="Object.keys(flags).length === 0" class="text-center py-8">
              <div class="text-6xl mb-4">🚩</div>
              <p class="text-secondary">No feature flags configured</p>
            </div>

            <!-- Flags Grid -->
            <div v-else>
              <div v-for="(flag, name) in flags" :key="name" class="flag-item">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <h3 class="font-medium">{{ name }}</h3>
                    
                    <!-- Variant badges -->
                    <NBadge 
                      v-for="variant in getFlagVariants(flag)" 
                      :key="variant" 
                      n="blue"
                      class="text-xs"
                    >
                      {{ variant }}
                    </NBadge>
                  </div>
                  
                  <div class="text-sm font-mono mb-1 text-secondary">
                    Value: <code>{{ JSON.stringify(getFlagValue(flag)) }}</code>
                  </div>
                  
                  <div v-if="getFlagVariants(flag).length > 0" class="text-xs text-gray">
                    Variant system active - values determined at runtime
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <!-- Status Badge -->
                  <NBadge :n="getFlagEnabled(flag) ? 'green' : 'red'" class="text-xs">
                    {{ getFlagEnabled(flag) ? 'ENABLED' : 'DISABLED' }}
                  </NBadge>

                  <!-- Toggle Button -->
                  <NButton 
                    v-if="canToggleFlag(flag)"
                    n="sm"
                    @click="toggleFlag(name)"
                    :title="'Toggle ' + name"
                    :icon="getFlagEnabled(flag) ? 'i-carbon-toggle-on' : 'i-carbon-toggle-off'"
                  >
                    Toggle
                  </NButton>
                  
                  <NButton 
                    v-else
                    n="sm" 
                    disabled
                    title="Cannot toggle flags with variants"
                    icon="i-carbon-locked"
                  >
                    Toggle
                  </NButton>
                </div>
              </div>
            </div>
          </NCard>

          <!-- Help Section -->
          <NCard class="mt-6 p-4">
            <details>
              <summary class="font-medium cursor-pointer mb-3 flex items-center gap-2">
                <NIcon icon="i-carbon-information" />
                Development Tips
              </summary>
              <div class="space-y-3 text-sm ml-4">
                <div>
                  <h4 class="font-medium mb-1 flex items-center gap-2">
                    <NIcon icon="i-carbon-refresh" />
                    Real-time Updates
                  </h4>
                  <p class="text-secondary">
                    When connected to DevTools, flags are automatically refreshed every 5 seconds to show live changes.
                  </p>
                </div>
                
                <div>
                  <h4 class="font-medium mb-1 flex items-center gap-2">
                    <NIcon icon="i-carbon-toggle-on" />
                    Interactive Toggles
                  </h4>
                  <p class="text-secondary">
                    Simple boolean flags can be toggled directly. Flags with variants cannot be toggled as they require complex assignment logic.
                  </p>
                </div>
                
                <div>
                  <h4 class="font-medium mb-1 flex items-center gap-2">
                    <NIcon icon="i-carbon-locked" />
                    Toggle Limitations
                  </h4>
                  <p class="text-secondary">
                    Flags with variants, context-dependent flags, and environment flags cannot be toggled for safety and consistency.
                  </p>
                </div>
                
                <div>
                  <h4 class="font-medium mb-1 flex items-center gap-2">
                    <NIcon icon="i-carbon-time" />
                    Session Persistence
                  </h4>
                  <p class="text-secondary">
                    Flag toggles only affect the current session and don't persist across server restarts.
                  </p>
                </div>
              </div>
            </details>
          </NCard>
        </div>
      \`
    }

    createApp(App).mount('#app')
  </script>
</body>
</html>
  `

  setHeader(event, 'content-type', 'text/html')
  return html
})
