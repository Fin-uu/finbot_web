<template>
  <div class="container">
    <h1 class="page-title">成員設定</h1>

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
          <button class="btn btn-primary" @click="addParticipant">
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
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
  color: #2c3e50;
}

.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  padding: 30px;
  margin-bottom: 30px;
}

.section-title {
  font-size: 1.5rem;
  color: #3498db;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  font-weight: bold;
  color: #555;
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
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.2);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
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
  padding: 6px 10px;
  font-size: 0.9rem;
}

.icon {
  margin-right: 6px;
  font-weight: bold;
}

.participants-section {
  margin-top: 30px;
}

.list-title {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: #555;
  border-bottom: 1px solid #eee;
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
  background: #f9f9f9;
  padding: 10px 14px;
  border-left: 4px solid #3498db;
  border-radius: 6px;
}

.participant-name {
  font-weight: 500;
  color: #333;
}

@media (max-width: 600px) {
  .input-row {
    flex-direction: column;
  }
}
</style>
