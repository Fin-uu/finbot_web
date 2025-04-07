<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div class="container">
        <div class="card-actions">
          <router-link to="/participants" class="btn btn-primary">
            <i class="icon">👥</i> 參與者設定
          </router-link>
          <router-link to="/accounting" class="btn btn-primary">
            <i class="icon">📝</i> 記帳
          </router-link>
          <router-link to="/expenseHistory" class="btn btn-primary">
            <i class="icon">📝</i> 紀錄觀看
          </router-link>
        </div>
  </div>

  <!-- 👇 顯示對應畫面 -->
  <router-view></router-view>
</template>

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
  margin-bottom: 30px;
  font-size: 2.2rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 40px;
  margin-bottom: 25px;
  width: 100%;
}

.card-title {
  font-size: 1.4rem;
  margin-top: 0;
  margin-bottom: 30px;
  color: #3498db;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  text-align: center;
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-actions {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  gap: 20px; 
}

.btn {
  padding: 15px 20px;
    border: none;
    border-radius: 6px;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    max-width: 250px;
}

.btn-primary {
  background-color: #3498db;
  color: white;
  box-shadow: 0 2px 5px rgba(52, 152, 219, 0.3);
}

.btn-primary:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.4);
}

.icon {
  margin-right: 10px;
  font-style: normal;
}

@media (max-width: 600px) {
  .container {
    padding: 10px;
  }

  .title {
    font-size: 1.8rem;
    margin-bottom: 20px;
  }

  .card {
    padding: 20px;
    margin-bottom: 15px;
  }

  .card-title {
    font-size: 1.2rem;
    margin-bottom: 20px;
  }

  .btn {
    padding: 12px 20px;
    font-size: 16px;
  }
}
</style>
