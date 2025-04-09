<template>
  <div class="container">
    <h1 class="title">歡迎光臨🎉</h1>
    <div class="welcome-text">
      <p>這是一個可能不太好用的工具，</p>
      <p>請使用上方選單進行操作。</p>
    </div>
  </div>
</template>

<script setup>
// 可以在這裡添加首頁邏輯
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
}

.title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 2.2rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.welcome-text {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  font-size: 18px;
  line-height: 1.6;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

@media (max-width: 600px) {
  .title {
    font-size: 1.8rem;
  }

  .welcome-text {
    font-size: 16px;
    padding: 16px;
  }
}
</style>
