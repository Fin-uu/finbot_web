<template>
  <div class="container">
    <div class="card">
      <h1 class="title">又花錢了?</h1>
      <div class="welcome-text">
        <p>錢乃身外之物。</p> 
        <p>如風，輕盈來去，無影無蹤。</p>
        <p>我們手中握著的，不過是時間的流轉與世間的交換。</p>

        <p>放開吧，讓錢隨風而行，讓心安於當下。</p> 
        <p>反正錢，是用來消失的。</p>
      </div>

      <!-- 點擊後顯示的文字 -->
      <p v-if="showMessage" class="turtle-message">戳什麼戳!!</p>

      <img 
        src="../assets/turtle.png" 
        alt="烏龜" 
        class="hero-image" 
        @click="handleTurtleClick"
      />

      <div class="btn-group">
        <router-link to="/personalHome" class="btn btn-moss">
          <i class="icon">📊</i> 個人使用
        </router-link>
        <button class="btn btn-bluegrey" @click="handleGroupAccess">
          <i class="icon">👫</i> 與朋友共用
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showMessage = ref(false)

function handleGroupAccess() {
  const password = prompt("請輸入通關密語：")
  if (password?.trim().toLowerCase() === "sasa") {
    router.push("/groupHome")
  } else {
    alert("你不能用這個功能喔!")
    router.push("/")
  }
}

  function handleTurtleClick() {
  showMessage.value = true
  setTimeout(() => {
    showMessage.value = false
  }, 1200)
  }

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
  align-items: stretch;
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
  font-weight: bold;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  width: 100%; /* 確保按鈕不超出父元素 */
  box-sizing: border-box; /* 確保 padding 不會增加元素寬度 */
  word-break: break-word; /* 避免長文字造成溢出 */
}

/* 莫蘭迪風格配色 */
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
.hero-image {
  width: 200px;
  height: auto;
  margin: 20px auto;
  display: block;
  animation: fadeIn 0.6s ease;
}
.turtle-message {
  margin-top: 10px;
  color: #cb3d3d;
  font-size: 30px;
  animation: fadeIn 0.3s ease-in-out;
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

/* 響應式 */
@media (max-width: 600px) {
  .card {
    padding: 30px 20px;
  }
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
