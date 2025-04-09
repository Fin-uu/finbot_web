<template>
  <div class="container">
    <h1 class="title">記帳</h1>

    <div class="card expense-form">
      <h2 class="card-title">新增支出</h2>
      <div class="form-group">
        <label>品項</label>
        <input v-model="itemname" type="text" placeholder="例如: 晚餐、計程車" />
      </div>
      <div class="form-group">
        <label>金額</label>
        <input v-model="expenseAmount" type="number" placeholder="輸入金額" />
      </div>
      <div class="form-group">
        <label>付款人</label>
        <select v-model="expensePayer">
          <option disabled value="">請選擇付款人</option>
          <option v-for="(p, index) in participants" :key="index" :value="p">
            {{ p }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label>參與者</label>
        <div class="participant-checkboxes">
          <div v-for="(p, index) in participants" :key="'checkbox-' + index" 
               class="checkbox-item" 
               :class="{ 'selected': selectedParticipants.includes(p) }">
            <label>
              <input type="checkbox" :value="p" v-model="selectedParticipants" />
              {{ p }}
            </label>
          </div>
        </div>
      </div>
      <div class="card-actions">
        <button class="btn btn-primary" @click="addExpense">
          <i class="icon">+</i> 新增支出
        </button>
      </div>
    </div>

    <div class="card expense-records" v-if="expenses.length > 0">
      <h2 class="card-title">支出紀錄</h2>
      <div class="table-container">
        <table class="expense-table">
          <thead>
            <tr>
              <th>品項</th>
              <th>金額</th>
              <th>付款人</th>
              <th>參與者</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(expense, index) in expenses" :key="index">
              <td>{{ expense.itemname }}</td>
              <td class="amount">{{ expense.amount }}</td>
              <td>{{ expense.payer }}</td>
              <td>{{ expense.participants.join(', ') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

// 資料存儲
const expenses = ref([])  // 儲存所有支出紀錄
const participants = ref([])  // 儲存所有參與者
const selectedParticipants = ref([]);

// 表單欄位
const itemname = ref('')  // 品項
const expenseAmount = ref('')  // 金額
const expensePayer = ref('')  // 付款人

// 儲存資料到 LocalStorage
const saveToLocalStorage = () => {
  localStorage.setItem('expenses', JSON.stringify(expenses.value))
}

// 從 LocalStorage 讀取資料
const loadFromLocalStorage = () => {
  const savedExpenses = localStorage.getItem('expenses')
  const savedParticipants = localStorage.getItem('participants')

  if (savedExpenses) {
    expenses.value = JSON.parse(savedExpenses)
  }
  if (savedParticipants) {
    participants.value = JSON.parse(savedParticipants)
  }
}

// 新增支出
const addExpense = () => {
  if (!expenseAmount.value || !expensePayer.value || selectedParticipants.value.length === 0 || !itemname.value) {
    alert('請填寫完整資訊')
    return
  }

  // 解析參與者
  const participantsList = [...selectedParticipants.value];

  // 新增支出紀錄
  expenses.value.push({
    itemname: itemname.value,
    amount: parseFloat(expenseAmount.value),
    payer: expensePayer.value,
    participants: participantsList,
  })

  // 清空表單欄位
  itemname.value = ''
  expenseAmount.value = ''
  expensePayer.value = ''
  selectedParticipants.value = []
}

// 監聽資料變化，自動保存
watch(expenses, () => {
  saveToLocalStorage()
}, { deep: true })

// 載入參與者資料
const loadParticipants = () => {
  const savedParticipants = localStorage.getItem('participants')
  if (savedParticipants) {
    participants.value = JSON.parse(savedParticipants)
  }
}

// 監聽 LocalStorage 變化，更新參與者列表
window.addEventListener('storage', (event) => {
  if (event.key === 'participants') {
    loadParticipants()
  }
})

// 頁面加載時讀取資料
onMounted(() => {
  loadFromLocalStorage()

  // 定期檢查 participants 更新
  setInterval(() => {
    loadParticipants()
  }, 2000)
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 15px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
}

.title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.8rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  width: 100%;
}

.card-title {
  font-size: 1.3rem;
  margin-top: 0;
  margin-bottom: 15px;
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

input,
select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
  -webkit-appearance: none; /* 改善 iOS 上的樣式 */
}

input:focus,
select:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
}

/* 改善移動設備上的 select 外觀 */
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='5' viewBox='0 0 10 5'%3E%3Cpath fill='%23333' d='M0 0h10L5 5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 10px 5px;
  padding-right: 30px;
}

.btn {
  padding: 12px 16px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  min-width: 120px;
}

.card-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.icon {
  margin-right: 5px;
  font-weight: bold;
}

.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch; /* 提升 iOS 滑動體驗 */
}

.expense-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 300px; /* 確保在小螢幕上可以水平滾動 */
}

.expense-table th,
.expense-table td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #eee;
  font-size: 0.95rem;
}

.expense-table th {
  background-color: #f8f9fa;
  color: #555;
  position: sticky;
  top: 0;
}

.expense-table tr:hover {
  background-color: #f8f9fa;
}

.expense-table .amount {
  text-align: right;
  font-weight: bold;
}

.participant-checkboxes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
}

.checkbox-item {
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.checkbox-item:hover {
  background-color: #e9ecef;
}

/* 選中的樣式 */
.checkbox-item.selected {
  background-color: #2c3e50;
  color: white;
}

.checkbox-item label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 0;
  width: 100%;
}

.checkbox-item input[type="checkbox"] {
  width: auto;
  margin: 0;
}

/* 響應式樣式 */
@media (max-width: 600px) {
  .container {
    padding: 10px;
  }

  .title {
    font-size: 1.6rem;
    margin-bottom: 15px;
  }

  .card {
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 6px;
  }

  .card-title {
    font-size: 1.1rem;
    margin-bottom: 12px;
  }

  .form-group label {
    font-size: 0.95rem;
  }

  input, select {
    padding: 10px;
    font-size: 15px;
  }

  .btn {
    width: 100%;
    padding: 10px 12px;
    font-size: 15px;
  }

  .expense-table th,
  .expense-table td {
    padding: 8px 6px;
    font-size: 0.85rem;
  }
  
  .participant-checkboxes {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  
  .checkbox-item {
    padding: 8px;
  }
}

/* 修復 Safari 上的一些輸入樣式問題 */
@supports (-webkit-overflow-scrolling: touch) {
  input {
    font-size: 16px; /* 防止 iOS 上的縮放 */
  }
  
  select {
    font-size: 16px;
  }
}
</style>