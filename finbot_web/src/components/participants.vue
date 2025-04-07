<template>
  <div class="card participant-form">
    <h2 class="card-title">成員管理</h2>
    <div class="form-group">
      <label>新增成員</label>
      <div class="input-with-button">
        <input 
          v-model="newParticipant" 
          type="text" 
          placeholder="輸入成員名稱" 
          @keyup.enter="addParticipant"
        />
        <button class="btn btn-primary" @click="addParticipant">
          <i class="icon">+</i> 新增
        </button>
      </div>
    </div>
    
    <div class="participants-list" v-if="participants.length > 0">
      <h3>成員列表</h3>
      <div class="participant-items">
        <div 
          v-for="(p, index) in participants" 
          :key="index"
          class="participant-item"
        >
          <div class="participant-name">{{ p }}</div>
          <button class="btn btn-small btn-danger" @click="removeParticipant(index)">
            <i class="icon">×</i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

// 資料存儲
const participants = ref([])  // 儲存所有參與者
const newParticipant = ref('') // 新增參與者輸入框

// 儲存資料到 LocalStorage
const saveToLocalStorage = () => {
  localStorage.setItem('participants', JSON.stringify(participants.value))
}

// 從 LocalStorage 讀取資料
const loadFromLocalStorage = () => {
  const savedParticipants = localStorage.getItem('participants')
  
  if (savedParticipants) {
    participants.value = JSON.parse(savedParticipants)
  }
}

// 新增參與者
const addParticipant = () => {
  if (!newParticipant.value.trim()) {
    return
  }
  
  // 檢查是否已存在相同名稱的參與者
  if (!participants.value.includes(newParticipant.value.trim())) {
    participants.value.push(newParticipant.value.trim())
    newParticipant.value = '' // 清空輸入框
  } else {
    alert('該成員已存在！')
  }
}

// 移除參與者
const removeParticipant = (index) => {
  if (confirm(`確定要移除 ${participants.value[index]} 嗎？`)) {
    participants.value.splice(index, 1)
  }
}

// 監聽資料變化，自動保存
watch(participants, () => {
  saveToLocalStorage()
}, { deep: true })

// 頁面加載時讀取資料
onMounted(() => {
  loadFromLocalStorage()
})
</script>

<style scoped>
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
  margin-bottom: 20px;
  color: #3498db;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.input-with-button {
  display: flex;
  gap: 10px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 200px;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background-color: #c0392b;
}

.btn-small {
  padding: 5px 10px;
  font-size: 14px;
}

.icon {
  margin-right: 5px;
  font-weight: bold;
}

.participants-list {
  margin-top: 20px;
}

.participants-list h3 {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.participant-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

.participant-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  padding: 8px 12px;
  border-radius: 4px;
  border-left: 3px solid #3498db;
}

.participant-name {
  font-weight: 500;
}

@media (max-width: 600px) {
  .card {
    padding: 15px;
    margin-bottom: 15px;
  }
  
  .card-title {
    font-size: 1.2rem;
  }
  
  .participant-items {
    grid-template-columns: 1fr;
  }
  
  .btn {
    padding: 8px 12px;
    font-size: 14px;
  }
  
  .input-with-button {
    flex-direction: column;
    gap: 5px;
  }
}
</style>