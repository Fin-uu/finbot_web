<template>
  <div class="container">
    <h1 class="title">紀錄</h1>
    
    <!-- 改進的導航菜單 -->
    <div class="nav-tabs">
      <router-link to="/groupAccount" class="nav-tab">
        <i class="icon">📝</i> <span>記帳</span>
      </router-link>
      <router-link to="/groupExpenseHistory" class="nav-tab active">
        <i class="icon">📊</i> <span>紀錄</span>
      </router-link>
    </div>
    
    <!-- 支出紀錄 -->
    <div class="content-area">
      <div class="card expense-records" v-if="expenses.length > 0">
        <h2 class="card-title">支出紀錄</h2>
        <div class="table-container">
          <table class="expense-table">
            <thead>
              <tr>
                <th>品項</th>
                <th class="amount-column">轉換後金額</th>
                <th>付款人</th>
                <th>參與者</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(expense, index) in expenses" :key="index">
                <td>{{ expense.item }}</td>
                <td class="amount">$ {{ expense.amount }}</td>
                <td>{{ expense.payer }}</td>
                <td>
                  <div class="participant-tags">
                    <span 
                      v-for="(participant, pIndex) in expense.participants" 
                      :key="pIndex"
                      class="participant-tag"
                    >
                      {{ participant }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 結算結果 -->
      <div class="card settlement" v-if="settlement.length > 0">
        <h2 class="card-title">結算結果</h2>
        <div class="table-container">
          <table class="expense-table">
            <thead>
              <tr>
                <th>參與者</th>
                <th class="amount-column">應付金額</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in settlement" :key="index">
                <td>{{ item.name }}</td>
                <td class="amount" 
                  :class="{ 'positive': parseFloat(item.amount) > 0, 'negative': parseFloat(item.amount) < 0 }">
                  $ {{ item.amount }}
                </td>
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
              $ {{ item.amount }} 元
            </div>
          </div>
        </div>
      </div>
      
      <!-- 無資料提示 -->
      <div class="card empty-state" v-if="expenses.length === 0">
        <div class="empty-icon">📊</div>
        <h3 class="empty-title">尚無支出紀錄</h3>
        <p class="empty-message">請前往記帳頁面新增支出</p>
        <div class="card-actions">
          <router-link to="/groupAccount" class="btn btn-primary">
            <i class="icon">📝</i> 前往記帳
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

// Google Sheets 設定
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;
const sheetName = import.meta.env.VITE_SHEET_NAME_sasa; 
const RANGE = `${sheetName}!A2:D`;


const expenses = ref([])
const settlement = ref([])
const paymentInstructions = ref([])

// 從 Google Sheets 載入資料
const loadExpenses = async () => {
  try {
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    })
    const rows = response.result.values

    if (rows && rows.length) {
      expenses.value = rows.map(row => ({
        item: row[0] || '', // 品項
        amount: parseFloat(row[1]) || 0, // 金額
        payer: row[2] || '', // 付款人
        participants: row[3] ? row[3].split(',').map(name => name.trim()) : [], // 參與者（以逗號分隔）
      }))
    } else {
      expenses.value = []
    }
  } catch (error) {
    console.error('讀取 Google Sheets 資料時發生錯誤:', error)
  }
}


const calculateSettlement = () => {
  const balances = {}

  expenses.value.forEach(expense => {
    const share = expense.amount / expense.participants.length

    expense.participants.forEach(participant => {
      balances[participant] = (balances[participant] || 0) - share
    })

    balances[expense.payer] = (balances[expense.payer] || 0) + expense.amount
  })

  settlement.value = Object.entries(balances).map(([name, amount]) => ({
    name,
    amount: amount.toFixed(2)
  }))

  generatePaymentInstructions(balances)
}

const generatePaymentInstructions = (balances) => {
  const creditors = []
  const debtors = []

  for (const [name, amount] of Object.entries(balances)) {
    const value = parseFloat(amount.toFixed(2))
    if (value > 0.01) creditors.push({ name, amount: value })
    else if (value < -0.01) debtors.push({ name, amount: -value })
  }

  paymentInstructions.value = []

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

onMounted(async () => {
  await loadExpenses()
  calculateSettlement()

  window.addEventListener('storage', async (e) => {
    if (e.key === 'expenses') {
      await loadExpenses()
      calculateSettlement()
    }
  })
})

watch(expenses, () => {
  calculateSettlement()
}, { deep: true })
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
  background-color: #f3f1ee;
  min-height: 100vh;
}

.title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 2rem;
  font-weight: 600;
  padding-bottom: 10px;
}

/* 改進的導航 */
.nav-tabs {
  display: flex;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  overflow: hidden;
}

.nav-tab {
  flex: 1;
  text-align: center;
  padding: 14px 8px;
  color: #5a6c7d;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 3px solid transparent;
}

.nav-tab .icon {
  font-size: 1.5rem;
  margin-bottom: 4px;
}

.nav-tab.active {
  color: #3498db;
  border-bottom: 3px solid #3498db;
  background-color: rgba(52, 152, 219, 0.05);
}

.nav-tab:hover:not(.active) {
  background-color: #f8f9fa;
}

/* 內容區域 */
.content-area {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 20px;
  width: 100%;
}

.card-title {
  font-size: 1.3rem;
  margin-top: 0;
  margin-bottom: 20px;
  color: #2c3e50;
  font-weight: 600;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

/* 表格樣式 */
.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 0 -20px;
  padding: 0 20px;
}

.expense-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  min-width: 500px;
}

.expense-table th,
.expense-table td {
  text-align: left;
  padding: 12px 10px;
  border-bottom: 1px solid #eee;
  font-size: 0.95rem;
}

.expense-table th {
  background-color: #f8f9fa;
  color: #5a6c7d;
  font-weight: 600;
  position: sticky;
  top: 0;
}

.expense-table tr:hover {
  background-color: #f8f9fa;
}

.expense-table .amount {
  text-align: right;
  font-weight: 600;
  color: #2c3e50;
}

.expense-table .amount.positive {
  color: #2ecc71;
}

.expense-table .amount.negative {
  color: #e74c3c;
}

.amount-column {
  text-align: right;
}

.participant-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.participant-tag {
  background-color: #f0f2f5;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.85rem;
  display: inline-block;
}

/* 按鈕樣式 */
.btn {
  padding: 12px 18px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  min-width: 120px;
}

.card-actions {
  display: flex;
  justify-content: center;
  margin-top: 25px;
}

.btn-primary {
  background-color: #3498db;
  color: white;
  box-shadow: 0 2px 5px rgba(52, 152, 219, 0.3);
}

.btn-primary:hover {
  background-color: #2980b9;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.4);
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
  box-shadow: 0 2px 5px rgba(231, 76, 60, 0.3);
}

.btn-danger:hover {
  background-color: #c0392b;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(231, 76, 60, 0.4);
}

.btn:active {
  transform: translateY(0);
}

.icon {
  margin-right: 5px;
}

/* 付款指示樣式 */
.payment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #3498db;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.payment-item:hover {
  background-color: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.payment-arrow {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.payment-arrow .from {
  font-weight: 600;
  color: #e74c3c;
  background-color: rgba(231, 76, 60, 0.1);
  padding: 5px 10px;
  border-radius: 20px;
}

.payment-arrow .to {
  font-weight: 600;
  color: #2ecc71;
  background-color: rgba(46, 204, 113, 0.1);
  padding: 5px 10px;
  border-radius: 20px;
}

.payment-arrow .arrow {
  font-size: 1.2rem;
  color: #7f8c8d;
}

.payment-amount {
  font-weight: 600;
  font-size: 1.1rem;
  color: #3498db;
  background-color: rgba(52, 152, 219, 0.1);
  padding: 5px 12px;
  border-radius: 20px;
  min-width: 100px;
  text-align: center;
}

/* 空數據狀態 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  color: #95a5a6;
}

.empty-title {
  font-size: 1.3rem;
  color: #2c3e50;
  margin: 0 0 10px 0;
}

.empty-message {
  color: #7f8c8d;
  margin-bottom: 20px;
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
  
  .nav-tab {
    padding: 10px 5px;
    font-size: 0.8rem;
  }
  
  .nav-tab .icon {
    font-size: 1.3rem;
  }

  .card {
    padding: 15px;
    border-radius: 10px;
  }

  .card-title {
    font-size: 1.1rem;
    margin-bottom: 15px;
  }

  .expense-table th,
  .expense-table td {
    padding: 10px 8px;
    font-size: 0.85rem;
  }
  
  .payment-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 12px;
  }
  
  .payment-arrow {
    margin-bottom: 8px;
  }
  
  .payment-amount {
    align-self: flex-end;
  }
  
  .btn {
    width: 100%;
    padding: 12px;
    font-size: 15px;
  }
  
  .empty-state {
    padding: 30px 15px;
  }
}

/* Fix for Safari */
@supports (-webkit-overflow-scrolling: touch) {
  input, button {
    font-size: 16px;
  }
}
</style>
