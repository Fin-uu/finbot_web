<template> 
  <div class="container">
    <h1 class="page-title">記帳</h1>

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

    <div class="card expense-form">
      <h2 class="section-title">新增支出</h2>
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
        <button class="btn btn-moss" @click="addExpense">
          <i class="icon">+</i> 新增支出
        </button>
      </div>
    </div>

    <div class="card expense-records" v-if="expenses.length > 0">
      <h2 class="section-title">支出紀錄</h2>
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
  padding: 6px 10px;
  font-size: 0.9rem;
}

/* 圖示 */
.icon {
  margin-right: 6px;
}

/* 表單區塊 */
.form-group {
  margin-bottom: 20px;
  max-width: 600px; /* 限制最大寬度 */
  margin-left: auto;
  margin-right: auto;
}

.form-group label {
  font-weight: bold;
  display: block;
  margin-bottom: 8px;
}

input,
select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px; 
  font-size: 16px;
  box-sizing: border-box;
  max-width: 100%; 
}


input:focus,
select:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
}

.participant-checkboxes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  padding: 8px;
  background: #f8f8ec;
  border-radius: 10px;
  border-left: 4px solid #a3bfa7;
}

.checkbox-item.selected {
  background-color: #2c3e50;
  color: white;
}

/* 支出紀錄 */
.expense-table {
  width: 100%;
  border-collapse: collapse;
}

.expense-table th,
.expense-table td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #eee;
}

.expense-table th {
  background-color: #f8f9fa;
  color: #555;
}

.expense-table .amount {
  text-align: right;
  font-weight: bold;
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
