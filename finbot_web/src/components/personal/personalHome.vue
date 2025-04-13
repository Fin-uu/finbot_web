<template>
  <div class="container">
    <div class="card">
      <h1 class="title">個人模式</h1>
      <div class="welcome-text">
        <p>這個模式的紀錄會存在你的瀏覽器裡，</p>
        <p>只有你自己看的到。</p>
        <p>「 想消滅曾經奢侈的過去，</p>
        <p>把瀏覽紀錄刪了就可以 ~</p>
        <p>但刪除之前，記得還錢哦 ! 」</p>
        <p></p>
      </div>

      <div class="btn-group">
        <router-link to="/participants" class="btn btn-moss">
          <i class="icon">👥</i> 參與者設定
        </router-link>
        <router-link to="/accounting" class="btn btn-bluegrey">
          <i class="icon">📝</i> 記帳
        </router-link>
        <router-link to="/expenseHistory" class="btn btn-rose">
          <i class="icon">📊</i> 紀錄
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// 可以在這裡添加首頁邏輯
</script>

<style scoped>
/* 背景 */
.container {
  background: linear-gradient(135deg, #f3f1ee, #f3f1ee);
  min-height: 100vh;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 卡片 */
.card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  text-align: center;
  animation: fadeIn 0.6s ease;
  box-sizing: border-box; 
}

/* 標題 */
.title {
  font-size: 28px;
  margin-bottom: 20px;
  color: #3e3e3e;
}

/* 說明文字 */
.welcome-text p {
  margin: 10px 0;
  font-size: 16px;
  color: #666;
}

/* 按鈕群組 */
.btn-group {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%; 
}

/* 通用按鈕 */
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
  min-width: 200px;
  font-weight: bold;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  width: 100%; /* 確保按鈕不超出父元素 */
  box-sizing: border-box; /* 確保 padding 不會增加元素寬度 */
  word-break: break-word; /* 避免長文字造成溢出 */
}

/* 莫蘭迪風格按鈕色彩 */
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

.icon {
  margin-right: 10px;
  font-style: normal;
  flex-shrink: 0;
}

/* 動畫 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* RWD */
@media (max-width: 600px) {
  .card {
    padding: 30px 20px;
  }
  .btn {
    width: 100%;
  }
}
</style>
