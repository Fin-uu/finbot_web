<template>
  <div class="container">
    <h1 class="page-title">紀錄</h1>

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
    
    <!-- 支出紀錄 -->
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
      <div class="card-actions">
        <button class="btn btn-danger" @click="clearExpense">
          <i class="icon">×</i> 清空紀錄
        </button>
      </div>
    </div>

    <!-- 結算結果 -->
    <div class="card settlement" v-if="settlement.length > 0">
      <h2 class="section-title">結算結果</h2>
      <div class="settlement-table">
        <table class="expense-table">
          <thead>
            <tr>
              <th>參與者</th>
              <th>應付金額</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in settlement" :key="index">
              <td>{{ item.name }}</td>
              <td class="amount">{{ item.amount }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 付款指示 -->
    <div class="card payment-instructions" v-if="paymentInstructions.length > 0">
      <h2 class="section-title">付款指示</h2>
      <div class="payment-list">
        <div v-for="(item, index) in paymentInstructions" :key="index" class="payment-item">
          <div class="payment-arrow">
            <span class="from">{{ item.from }}</span>
            <span class="arrow">→</span>
            <span class="to">{{ item.to }}</span>
          </div>
          <div class="payment-amount">
            {{ item.amount }} 元
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'

// 建立 reactive 的紀錄陣列
const expenses = ref([])

// 結算結果
const settlement = ref([])

// 付款指示
const paymentInstructions = ref([])

// 讀取 localStorage 中的資料
const loadExpenses = () => {
  const stored = localStorage.getItem('expenses')
  if (stored) {
    try {
      expenses.value = JSON.parse(stored)
    } catch (e) {
      console.error('讀取支出資料時發生錯誤:', e)
    }
  }
}

// 清空資料的函式
const clearExpense = () => {
  if (confirm('確定要清空所有紀錄嗎？')) {
    expenses.value = []
    localStorage.removeItem('expenses')
    // 同時清空付款指示
    paymentInstructions.value = []
    localStorage.removeItem('paymentInstructions')
    // 清空結算結果
    settlement.value = []
  }
}

const calculateSettlement = () => {
  const participants = new Set()
  const balances = {}

  // 收集所有參與者與初始化餘額
  expenses.value.forEach(expense => {
    const share = expense.amount / expense.participants.length
    expense.participants.forEach(participant => {
      participants.add(participant)
      balances[participant] = (balances[participant] || 0) - share
    })
    balances[expense.payer] = (balances[expense.payer] || 0) + expense.amount
  })

  // 建立結算資料
  settlement.value = Object.entries(balances).map(([name, amount]) => ({
    name,
    amount: amount.toFixed(2)
  }))

  // 根據餘額產生付款指示
  generatePaymentInstructions(balances)
}

const generatePaymentInstructions = (balances) => {
  const creditors = []
  const debtors = []

  // 分為應收與應付兩組
  for (const [name, amount] of Object.entries(balances)) {
    const value = parseFloat(amount.toFixed(2))
    if (value > 0.01) creditors.push({ name, amount: value })
    else if (value < -0.01) debtors.push({ name, amount: -value })
  }

  // 初始化付款指示
  paymentInstructions.value = []

  // 配對付款
  while (creditors.length && debtors.length) {
    const payer = debtors[0]
    const receiver = creditors[0]
    const payAmount = Math.min(payer.amount, receiver.amount)

    paymentInstructions.value.push({
      from: payer.name,
      to: receiver.name,
      amount: payAmount.toFixed(2)
    })

    payer.amount -= payAmount
    receiver.amount -= payAmount

    if (payer.amount < 0.01) debtors.shift()
    if (receiver.amount < 0.01) creditors.shift()
  }

  // 保存到 localStorage
  localStorage.setItem('paymentInstructions', JSON.stringify(paymentInstructions.value))
}

onMounted(() => {
  loadExpenses()
  
  // 先載入之前的付款指示 (如果有的話)
  const storedInstructions = localStorage.getItem('paymentInstructions')
  if (storedInstructions) {
    try {
      paymentInstructions.value = JSON.parse(storedInstructions)
    } catch (e) {
      console.error('讀取付款指示時發生錯誤:', e)
      // 如果發生錯誤，重新計算
      calculateSettlement()
    }
  } else {
    // 如果沒有儲存的付款指示，則計算新的
    calculateSettlement()
  }

  // 監聽 localStorage 的變化（跨組件）
  window.addEventListener('storage', (e) => {
    if (e.key === 'expenses') {
      loadExpenses()
      calculateSettlement()
    } else if (e.key === 'paymentInstructions') {
      const storedInstructions = localStorage.getItem('paymentInstructions')
      if (storedInstructions) {
        try {
          paymentInstructions.value = JSON.parse(storedInstructions)
        } catch (e) {
          console.error('讀取付款指示時發生錯誤:', e)
        }
      }
    }
  })
})

// 監聽 expenses 的變化，當有變化時重新計算結算結果
watch(expenses, () => {
  calculateSettlement()
}, { deep: true })
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

/* 章節標題 */
.section-title {
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 20px;
  color: #3e3e3e;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
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

/* 圖示 */
.icon {
  margin-right: 6px;
}

/* 表格樣式 */
.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch; /* 提升 iOS 滑動體驗 */
}

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

.expense-table tr:hover {
  background-color: #f8f8ec;
}

.expense-table .amount {
  text-align: right;
  font-weight: bold;
}

/* 付款指示樣式 */
.payment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-item {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background-color: #f8f8ec;
  border-radius: 12px;
  border-left: 4px solid #a3bfa7;
  transition: background-color 0.2s;
}

.payment-item:hover {
  background-color: #f1f3e8;
}

.payment-arrow {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.payment-arrow .from {
  font-weight: bold;
  color: #e07474;
}

.payment-arrow .to {
  font-weight: bold;
  color: #9ba39b;
}

.payment-arrow .arrow {
  font-size: 1.2rem;
  color: #a2b1b6;
}

.payment-amount {
  font-weight: bold;
  font-size: 1.2rem;
  color: #3e3e3e;
}

/* 響應式設計 */
@media (max-width: 600px) {
  .container {
    padding: 20px 15px;
  }
  
  .card {
    padding: 20px;
  }
  
  .payment-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .payment-arrow {
    margin-bottom: 8px;
  }
  
  .btn {
    width: 100%;
  }
}
</style>