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
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
  padding: 10px 0;
}

.btn {
  padding: 15px 20px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  background-color: #3498db;
  color: white;
  box-shadow: 0 2px 5px rgba(52, 152, 219, 0.3);
  min-width: 200px;
  text-align: center;
}

.btn:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.4);
}

.icon {
  margin-right: 8px;
  font-style: normal;
}

@media (max-width: 600px) {
  .container {
    padding: 10px;
    text-align: center;
  }

  .btn {
    font-size: 18px;
    padding: 15px 20px;
    width: auto;
    margin: 10px auto;
    display: inline-block;
  }

  .icon {
    margin-right: 8px;
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
