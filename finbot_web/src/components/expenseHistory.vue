<template>
  <div class="container">
    <h1 class="title">紀錄</h1>
    
    <!-- 支出紀錄 -->
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

    <!-- 結算結果 -->
    <div class="card settlement" v-if="settlement.length > 0">
      <h2 class="card-title">結算結果</h2>
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
      <h2 class="card-title">付款指示</h2>
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
import { ref, onMounted, computed } from 'vue'

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
  }
}

const calculateSettlement = () => {
  const totalAmount = expenses.value.reduce((sum, expense) => sum + expense.amount, 0)
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
}

  onMounted(() => {
    loadExpenses()
    calculateSettlement()
    // 監聽 localStorage 的變化（跨組件）
    window.addEventListener('storage', (e) => {
      if (e.key === 'expenses') {
        loadExpenses()
        calculateSettlement()
      }
    })
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
</style>
