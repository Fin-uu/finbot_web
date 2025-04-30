<template> 
  <div class="container">
    <h1 class="page-title">多人模式</h1>

    <div class="card welcome-card">
      <h2 class="section-title">功能選單</h2>
      <div class="welcome-text">
        <p></p>
        <p></p>
      </div>

      <div class="quick-actions">
        <router-link to="/xinAccount" class="btn btn-bluegrey">
          <i class="icon">📝</i> 開始記帳
        </router-link>
        <router-link to="/xinExpenseHistory" class="btn btn-rose">
          <i class="icon">📊</i> 查看紀錄
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// 可以在這裡添加首頁邏輯
</script>

<style scoped>
/* 背景與版面 */
.container {
  background: linear-gradient(135deg, #f3f1ee, #f3f1ee);
  min-height: 100vh;
  padding: 40px 20px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #3e3e3e;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #ccc;
  padding-bottom: 10px;
}

/* 卡片樣式 */
.card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  padding: 30px;
  margin-bottom: 30px;
  animation: fadeIn 0.5s ease;
}

/* 章節標題 */
.section-title {
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 20px;
  color: #3e3e3e;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

/* 歡迎文字 */
.welcome-text {
  text-align: center;
  font-size: 1.1rem;
  color: #5a6c7d;
  margin-bottom: 25px;
  line-height: 1.6;
}

/* 按鈕群組 */
.card-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.quick-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

/* 按鈕樣式 */
.btn {
  padding: 15px 20px;
  font-size: 18px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  width: 100%; /* 確保按鈕不超出父元素 */
  box-sizing: border-box; /* 確保 padding 不會增加元素寬度 */
  word-break: break-word; /* 避免長文字造成溢出 */
}

.btn-moss {
  background-color: #9ba39b;
}
.btn-moss:hover {
  background-color: #869087;
}

.btn-bluegrey {
  background-color: #a2b1b6;
}
.btn-bluegrey:hover {
  background-color: #8e9ca1;
}

.btn-rose {
  background-color: #d8a7a7;
}
.btn-rose:hover {
  background-color: #c29292;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.btn:active {
  transform: translateY(0);
}

/* 圖示 */
.icon {
  margin-right: 6px;
}

/* 響應式設計 */
@media (max-width: 600px) {
  .container {
    padding: 20px 15px;
  }
  
  .card {
    padding: 20px;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
  
  .quick-actions {
    flex-direction: column;
    gap: 12px;
  }
}
</style>