<script setup>
</script>

<template>
  <div class="container">
    <div class="card-actions">
      <div class="nav-tabs">
        <router-link to="/" class="nav-tab">
          <i class="icon">📝</i> <span>切換模式</span>
        </router-link>
      </div>
    </div>
  </div>

  <!-- 👇 顯示對應畫面 -->
  <router-view></router-view>
</template>

<!-- ✅ Scoped：只限本元件使用的樣式 -->
<style scoped>
.nav-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  width: 100%;
}

.nav-tab {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-radius: 12px;
  text-decoration: none;
  color: #5a5a5a;
  font-weight: 500;
  background: linear-gradient(145deg, #ffffff, #f0eeeb);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.nav-tab:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  background: linear-gradient(145deg, #ffffff, #f5f3f0);
}

.nav-tab .icon {
  margin-right: 8px;
  font-size: 18px;
}

/* 讓按鈕在手機上也好看 */
@media (max-width: 600px) {
  .nav-tab {
    padding: 10px 16px;
    font-size: 16px;
  }
}
</style>

<!-- ✅ 全域樣式（背景統一色） -->
<style>
body {
  margin: 0;
  padding: 0;
  background-color: #f3f1ee; /* 莫蘭迪灰白 */
  font-family: 'Helvetica Neue', Arial, sans-serif;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  background-color: #f3f1ee; /* 跟 body 一樣 */
}
</style>
