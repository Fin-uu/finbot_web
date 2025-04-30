<template>
  <div class="container">
    <h1 class="title">記帳</h1>
    
    <!-- Improved navigation menu -->
    <div class="nav-tabs">
      <router-link to="/xinAccount" class="nav-tab active">
        <i class="icon">📝</i> <span>記帳</span>
      </router-link>
      <router-link to="/xinExpenseHistory" class="nav-tab">
        <i class="icon">📊</i> <span>紀錄</span>
      </router-link>
    </div>
    
    <div v-if="!isSignedIn" class="card sign-in-card">
      <div class="sign-in-content">
        <div class="sign-in-icon">
          <i class="google-icon">G</i>
        </div>
        <div class="sign-in-text">
          <h3>請先登入</h3>
          <p>連接您的 Google 帳號以記錄和同步您的支出</p>
        </div>
      </div>
      <button class="btn btn-primary btn-sign-in" @click="signIn">
        登入 Google 帳號
      </button>
    </div>

    <div v-else class="content-area">
      <div class="sign-out-bar">
      <span>已登入：{{ user.getBasicProfile().getEmail() }}</span>
      <button class="btn btn-outline" @click="signOut">登出</button>
      </div>
      <div class="card expense-form">
        <h2 class="card-title">新增支出</h2>
        <!-- Improved form layout -->
        <div class="form-grid">

          <div class="form-group full-width">
            <label for="itemname">品項</label>
            <input 
              id="itemname"
              v-model="itemname" 
              type="text" 
              placeholder="例如: 晚餐、計程車" 
            />
          </div>
          <!-- <div class="form-group">
            <label for="amount">幣別</label>
            <div class="currency-buttons">
              <button 
                v-for="c in ['$', '₱']" 
                :key="c"
                :class="{ active: selectedCurrency === c }"
                @click="selectedCurrency = c"
              >
                {{ c }}
              </button>
            </div>
          </div> -->
          <div class="form-group">
            <label for="amount">金額</label>
            <div class="amount-input">
              <span class="currency-symbol">{{ selectedCurrency }}</span>
              <input 
                id="amount"
                v-model="expenseAmount" 
                type="number" 
                placeholder="輸入金額" 
              />
            </div>
          </div> 
        </div>
        <div class="form-group">
          <label for="payer">付款人</label>
          <select id="payer" v-model="expensePayer">
            <option disabled value="">請選擇付款人</option>
            <option v-for="(p, index) in participants" :key="index" :value="p">
              {{ p }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label>參與者</label>
          <div class="participant-selector">
            <div
              v-for="(p, index) in participants"
              :key="'checkbox-' + index"
              class="participant-chip"
              :class="{ selected: selectedParticipants.includes(p) }"
              @click="toggleParticipant(p)"
            >
              <span class="participant-name">{{ p }}</span>
              <span v-if="selectedParticipants.includes(p)" class="check-icon">✓</span>
            </div>
          </div>
        </div>
        
        <div class="card-actions">
          <button class="btn btn-primary" @click="addExpense">
            <i class="icon">+</i> 新增支出
          </button>
        </div>
      </div>

      <!-- Improved expenses table -->
      <div class="card expense-records" v-if="expenses.length > 0">
        <h2 class="card-title">支出紀錄</h2>
        <div class="table-container">
          <table class="expense-table">
            <thead>
              <tr>
                <th>品項</th>
                <th class="amount-column">金額</th>
                <!-- <th class="amount-column">轉換後金額</th> -->
                <th>付款人</th>
                <th>參與者</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(expense, index) in expenses" :key="index">
                <td>{{ expense.itemname }}</td>
                <td class="amount"> {{ expense.originAmount }}</td>
                <!-- <td class="amount">$ {{ expense.amount }}</td> -->
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
    </div>
  </div>
</template>

<script>
import { gapi } from "gapi-script";

export default {
  name: "ExpenseTracker",
  data() {
    return {
      isSignedIn: false,
      user: null,
      itemname: "",
      expenseAmount: "",
      expensePayer: "",
      selectedParticipants: [],
      expenses: [],
      participants: ['魚','奇葦'],
      selectedCurrency: '$',
//      convertedAmount:'',
    };
  },
  mounted() {
    this.initGoogleApi();
    console.log(import.meta.env);
  },
  methods: {
    async initGoogleApi() {
      const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      const SCOPES = import.meta.env.VITE_GOOGLE_SCOPES;
      
      // 使用完整 URL 方式載入 Sheets API
      const sheetsAPI = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

      return new Promise((resolve, reject) => {
        gapi.load("client:auth2", async () => {
          try {
            // 先初始化 auth
            await gapi.client.init({
              clientId: CLIENT_ID,
              scope: SCOPES
            });
            
            // 然後單獨載入 sheets API
            await gapi.client.load('sheets', 'v4');

            const auth = gapi.auth2.getAuthInstance();
            this.isSignedIn = auth.isSignedIn.get();
            
            if (this.isSignedIn) {
              this.user = auth.currentUser.get();
            }

            auth.isSignedIn.listen((status) => {
              this.isSignedIn = status;
              if (status) {
                this.user = auth.currentUser.get();
              } else {
                this.user = null;
              }
            });

            resolve();
          } catch (error) {
            console.error("初始化 Google API 失敗:", error);
            reject(error);
          }
        });
      });
    },
    signIn() {
      const auth = gapi.auth2.getAuthInstance();
      auth.signIn().then((user) => {
        this.user = user;
        this.isSignedIn = true;
      });
    },

    toggleParticipant(participant) {
      if (this.selectedParticipants.includes(participant)) {
        this.selectedParticipants = this.selectedParticipants.filter(p => p !== participant);
      } else {
        this.selectedParticipants.push(participant);
      }
    },

    addExpense() {
      if (
        !this.itemname ||
        !this.expenseAmount ||
        !this.expensePayer ||
        this.selectedParticipants.length === 0
      ) {
        alert("請填寫所有欄位！");
        return;
      }


      //匯率轉換
      if(this.selectedCurrency=='$'){
        this.convertedAmount=this.expenseAmount;
      }else{
        this.convertedAmount=this.expenseAmount*0.625;
      }

      const newExpense = {
        itemname: this.itemname,
        amount: parseFloat(this.convertedAmount.toFixed(2)),
        payer: this.expensePayer,
        participants: [...this.selectedParticipants],
        originAmount:this.selectedCurrency+this.expenseAmount,
      };

      this.expenses.push(newExpense);

      // 清空表單
      this.itemname = "";
      this.expenseAmount = "";
      this.expensePayer = "";
      this.selectedParticipants = [];

      // 寫入 Google Sheet
      if (this.isSignedIn) {
        this.appendToSheet(newExpense);
      } else {
        alert("請先登入 Google 帳號！");
      }
    },

    async appendToSheet(expense) {
      const spreadsheetId = import.meta.env.VITE_SPREADSHEET_ID;
      const sheetName = import.meta.env.VITE_SHEET_NAME_xin; 
      const range = `${sheetName}!A:F`;
      const values = [
        [
          expense.itemname,
          expense.amount,
          expense.payer,
          expense.participants.join(", "),
          this.user.getBasicProfile().getName(),
          new Date().toLocaleString(),
          expense.originAmount,
        ],
      ];
      try {
        await gapi.client.sheets.spreadsheets.values.append({
          spreadsheetId,
          range,
          valueInputOption: "RAW",
          insertDataOption: "INSERT_ROWS",
          resource: { values },
        });
        console.log("✅ 寫入成功");
      } catch (err) {
        console.error("❌ 寫入失敗", err);
        alert("❌ 寫入 Google Sheets 失敗！");
      }
    },
    signOut() {
      const auth = gapi.auth2.getAuthInstance();
      auth.signOut().then(() => {
        this.isSignedIn = false;
        this.user = null;
      });
    },
  },
};
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

/* 導航樣式 */
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

/* 登入卡片樣式 */
.sign-in-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
}

.sign-in-content {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.sign-in-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #4285F4;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  margin-right: 15px;
}

.sign-in-text h3 {
  margin: 0 0 5px 0;
  color: #333;
}

.sign-in-text p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.btn-sign-in {
  width: 100%;
  max-width: 280px;
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

/* 表單優化 */
.full-width {
  grid-column: 1 / -1;
}

.form-grid {
  display: grid;
  grid-template-columns: 2fr;
  gap: 15px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #5a6c7d;
  font-size: 0.9rem;
}

.amount-input {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-symbol {
  position: absolute;
  left: 12px;
  color: #666;
  font-weight: 500;
}

input[type="number"] {
  padding-left: 25px !important;
}

input,
select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s;
  background-color: #f8f9fa;
}

input:focus,
select:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  background-color: white;
}

/* 參與者選擇器 */
.participant-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.participant-chip {
  background-color: #f0f2f5;
  padding: 10px 15px;
  border-radius: 30px;
  transition: all 0.2s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 80px;
}

.participant-chip:hover {
  background-color: #e6e9ed;
}

.participant-chip.selected {
  background-color: #3498db;
  color: white;
}

.check-icon {
  margin-left: 5px;
  font-weight: bold;
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

.btn-primary:active {
  transform: translateY(0);
}

.icon {
  margin-right: 5px;
}

/* 表格樣式優化 */
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

.sign-out-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ecf0f1;
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 0.9rem;
  color: #2c3e50;
}

.btn-outline {
  background-color: transparent;
  color: #3498db;
  border: 1px solid #3498db;
}

.btn-outline:hover {
  background-color: #3498db;
  color: white;
}

.currency-buttons button {
  margin-right: 8px;
  padding: 6px 12px;
  border: 1px solid #ccc;
  background-color: white;
  cursor: pointer;
}

.currency-buttons button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
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
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .card {
    padding: 15px;
    border-radius: 10px;
  }

  .card-title {
    font-size: 1.1rem;
    margin-bottom: 15px;
  }

  input, select {
    padding: 10px;
    font-size: 15px;
  }

  .btn {
    width: 100%;
    padding: 12px;
    font-size: 15px;
  }

  .expense-table th,
  .expense-table td {
    padding: 10px 8px;
    font-size: 0.85rem;
  }
}

/* Safari 瀏覽器修復 */
@supports (-webkit-overflow-scrolling: touch) {
  input {
    font-size: 16px;
  }
  
  select {
    font-size: 16px;
  }
}
</style>