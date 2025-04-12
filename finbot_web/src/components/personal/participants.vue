<template>
  <div class="container">
    <h1 class="page-title">成員設定</h1>

    <div class="card-actions">
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

    <div class="card">
      <h2 class="section-title">成員管理</h2>

      <div class="form-group">
        <label for="new-member">新增成員</label>
        <div class="input-row">
          <input 
            id="new-member"
            v-model="newParticipant" 
            type="text" 
            placeholder="輸入成員名稱" 
            @keyup.enter="addParticipant"
          />
          <button class="btn btn-moss" @click="addParticipant">
            <i class="icon">+</i> 新增
          </button>
        </div>
      </div>

      <div class="participants-section" v-if="participants.length">
        <h3 class="list-title">成員列表</h3>
        <div class="participant-list">
          <div 
            v-for="(p, index) in participants" 
            :key="index"
            class="participant-item"
          >
            <span class="participant-name">{{ p }}</span>
            <button class="btn btn-danger btn-small" @click="removeParticipant(index)">
              <i class="icon">×</i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const participants = ref([])
const newParticipant = ref('')

const saveToLocalStorage = () => {
  localStorage.setItem('participants', JSON.stringify(participants.value))
}

const loadFromLocalStorage = () => {
  const saved = localStorage.getItem('participants')
  if (saved) {
    participants.value = JSON.parse(saved)
  }
}

const addParticipant = () => {
  const name = newParticipant.value.trim()
  if (!name) return
  if (!participants.value.includes(name)) {
    participants.value.push(name)
    newParticipant.value = ''
  } else {
    alert('該成員已存在！')
  }
}

const removeParticipant = (index) => {
  if (confirm(`確定要移除 ${participants.value[index]} 嗎？`)) {
    participants.value.splice(index, 1)
  }
}

watch(participants, saveToLocalStorage, { deep: true })
onMounted(loadFromLocalStorage)
</script>

<style scoped>
/* 背景與版面 */
.container {
  background: linear-gradient(135deg, #f3f1ee, #e9ecef);
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

/* 按鈕群組 */
.card-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

/* 按鈕樣式 */
.btn {
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
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

.btn-danger {
  background-color: #e07474;
}
.btn-danger:hover {
  background-color: #c05c5c;
}

.btn-small {
      padding: 5px;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 16px;
}
.btn-small .icon {
      margin-right: 0;
}

/* 圖示 */
.icon {
  margin-right: 6px;
}

/* 表單區塊 */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  font-weight: bold;
  display: block;
  margin-bottom: 8px;
}

.input-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #a2b1b6;
  outline: none;
  box-shadow: 0 0 5px rgba(162, 177, 182, 0.2);
}

/* 成員區塊 */
.participants-section {
  margin-top: 30px;
}

.list-title {
  font-size: 1.2rem;
  margin-bottom: 15px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
}

.participant-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.participant-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f8ec;
  padding: 10px 14px;
  border-left: 4px solid #a3bfa7;
  border-radius: 10px;
}

.participant-name {
  font-weight: 500;
}

/* 動畫 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 響應式設計 */
@media (max-width: 600px) {
  .input-row {
    flex-direction: column;
  }
  .btn {
    width: 100%;
  }
}
</style>
