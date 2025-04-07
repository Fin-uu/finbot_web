<template>
  <div class="container">
    <h1 class="title">多人分帳系統</h1>
    
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
          <div v-for="(p, index) in participants" :key="'checkbox-' + index" class="checkbox-item">
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
      <div class="card-actions">
        <button class="btn btn-danger" @click="clearExpense">
          <i class="icon">×</i> 清空紀錄
        </button>
      </div>
    </div>
    
    <div class="card settlement" v-if="hasSettlements">
      <h2 class="card-title">結算結果</h2>
      <div class="settlement-list">
        <div 
          v-for="(amount, person) in settlements" 
          :key="person"
          class="settlement-item"
          :class="{ 'receive': amount > 0, 'pay': amount < 0 }"
        >
          <div class="person">{{ person }}</div>
          <div class="amount-label">
            <span v-if="amount > 0">應收</span>
            <span v-else>應付</span>
          </div>
          <div class="amount">{{ Math.abs(amount).toFixed(1) }}</div>
        </div>
      </div>
    </div>
    
    <div class="card payment-instructions" v-if="hasSettlements">
      <h2 class="card-title">付款指示</h2>
      <div class="payment-list">
        <div v-for="(payment, index) in paymentInstructions" :key="index" class="payment-item">
          <div class="payment-arrow">
            <span class="from">{{ payment.from }}</span>
            <span class="arrow">→</span>
            <span class="to">{{ payment.to }}</span>
          </div>
          <div class="payment-amount">{{ payment.amount.toFixed(1) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

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

// 計算結算結果
const settlements = computed(() => {
  const result = {}
  
  // 初始化所有參與者的金額為 0
  participants.value.forEach(p => {
    result[p] = 0
  })
  
  // 計算每筆支出後，誰欠誰多少
  expenses.value.forEach(expense => {
    const amountPerPerson = expense.amount / expense.participants.length
    result[expense.payer] += expense.amount
    
    expense.participants.forEach(p => {
      result[p] -= amountPerPerson
    })
  })
  
  return result
})

// 計算誰付給誰
const paymentInstructions = computed(() => {
  const instructions = [];
  const settlementsValue = settlements.value;
  
  // 複製結算資料
  const balance = {};
  for (const person in settlementsValue) {
    if (Math.abs(settlementsValue[person]) > 0.1) { // 忽略極小的金額差異
      balance[person] = settlementsValue[person];
    }
  }
  
  // 找出債務人和債權人
  const debtors = Object.keys(balance).filter(person => balance[person] < 0)
    .sort((a, b) => balance[a] - balance[b]); // 由小到大排序（最大負債在前）
    
  const creditors = Object.keys(balance).filter(person => balance[person] > 0)
    .sort((a, b) => balance[b] - balance[a]); // 由大到小排序（最大債權在前）
  
  // 計算債務人付款給債權人
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    
    // 債務金額（正數）和債權金額
    const debt = Math.abs(balance[debtor]);
    const credit = balance[creditor];
    
    // 計算轉帳金額
    const amount = Math.min(debt, credit);
    
    if (amount > 0.1) { // 忽略極小的金額
      instructions.push({
        from: debtor,
        to: creditor,
        amount: amount
      });
    }
    
    // 更新餘額
    balance[debtor] += amount;
    balance[creditor] -= amount;
    
    // 如果債務或債權已清償，移至下一位
    if (Math.abs(balance[debtor]) < 0.1) i++;
    if (Math.abs(balance[creditor]) < 0.1) j++;
  }
  
  return instructions;
});

// 檢查是否有結算資料
const hasSettlements = computed(() => {
  return Object.keys(settlements.value).length > 0
})

// 清空紀錄
const clearExpense = () => {
  if (confirm('要把紀錄清掉囉!')) {
    expenses.value = []
    // 清空 LocalStorage
    localStorage.removeItem('expenses')
  }
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

input, select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus, select:focus {
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

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background-color: #c0392b;
}

.icon {
  margin-right: 5px;
  font-weight: bold;
}

.table-container {
  overflow-x: auto;
}

.expense-table {
  width: 100%;
  border-collapse: collapse;
}

.expense-table th, .expense-table td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.expense-table th {
  background-color: #f8f9fa;
  color: #555;
}

.expense-table tr:hover {
  background-color: #f8f9fa;
}

.expense-table .amount {
  text-align: right;
  font-weight: bold;
}

.settlement-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.settlement-item {
  padding: 15px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.settlement-item .person {
  font-weight: bold;
  margin-bottom: 5px;
}

.settlement-item .amount {
  font-size: 1.4rem;
  font-weight: bold;
}

.settlement-item.receive {
  background-color: #e6f7ee;
  border-left: 4px solid #2ecc71;
}

.settlement-item.pay {
  background-color: #fdeaea;
  border-left: 4px solid #e74c3c;
}

.amount-label {
  font-size: 0.85rem;
  color: #777;
  margin-bottom: 2px;
}

.participant-checkboxes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

.checkbox-item {
  background-color: #f8f9fa;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.checkbox-item:hover {
  background-color: #e9ecef;
}

/* 新增的付款指示樣式 */
.payment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #3498db;
  transition: background-color 0.2s;
}

.payment-item:hover {
  background-color: #e9ecef;
}

.payment-arrow {
  display: flex;
  align-items: center;
  gap: 8px;
}

.payment-arrow .from {
  font-weight: bold;
  color: #e74c3c;
}

.payment-arrow .to {
  font-weight: bold;
  color: #2ecc71;
}

.payment-arrow .arrow {
  font-size: 1.2rem;
  color: #7f8c8d;
}

.payment-amount {
  font-weight: bold;
  font-size: 1.2rem;
  color: #3498db;
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
    padding: 15px;
    margin-bottom: 15px;
  }
  
  .card-title {
    font-size: 1.2rem;
  }
  
  .settlement-list {
    grid-template-columns: 1fr;
  }
  
  .expense-table th, .expense-table td {
    padding: 8px;
    font-size: 14px;
  }
  
  .settlement-item .amount {
    font-size: 1.2rem;
  }
  
  .btn {
    padding: 8px 12px;
    font-size: 14px;
  }
  
  .participant-checkboxes {
    grid-template-columns: 1fr;
  }
  
  .payment-arrow {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
  
  .payment-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .payment-amount {
    align-self: flex-end;
  }
}
</style>