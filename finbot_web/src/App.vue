<script setup>
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
        <i class="icon">📊</i> 紀錄
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
}
</style>
