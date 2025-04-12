<template>
  <div class="container">
    <h1 class="page-title">成員設定//這個功能還不能用</h1>
    <div class="card-actions">
      <router-link to="/groupParticipants" class="btn btn-primary">
        <i class="icon">👥</i> 參與者設定
      </router-link>
      <router-link to="/groupAccount" class="btn btn-primary">
        <i class="icon">📝</i> 記帳
      </router-link>
      <router-link to="/groupExpenseHistory" class="btn btn-primary">
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
import { ref, onMounted } from 'vue'

const participants = ref([])
const newParticipant = ref('')

// 你的 spreadsheet 設定
const SPREADSHEET_ID = '1WSbh1i4cLgBJCiB8OfMgkDu3NxXHKWSvAGiUQClwM-Y'
const SHEET_NAME = '成員'

// 取得 gapi client
const getGapiClient = () => new Promise((resolve, reject) => {
  gapi.load('client', async () => {
    try {
      await gapi.client.init({
        clientId: '1056221600668-kkq5mt4kep715fak92pscbqbp04v362h.apps.googleusercontent.com',
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        scope: 'https://www.googleapis.com/auth/spreadsheets'
      })

      const authInstance = gapi.auth2.getAuthInstance()
      if (!authInstance || !authInstance.isSignedIn.get()) {
        await authInstance.signIn()
      }

      resolve(gapi.client)
    } catch (err) {
      console.error('GAPI 初始化失敗：', err)
      reject(err)
    }
  })
})

const loadParticipants = async () => {
  const gapiClient = await getGapiClient()
  const range = `${SHEET_NAME}!A:A`

  const res = await gapiClient.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range
  })

  const values = res.result.values || []
  participants.value = values.map(row => row[0]).filter(Boolean)
}

const addParticipant = async () => {
  const name = newParticipant.value.trim()
  if (!name) return
  if (participants.value.includes(name)) {
    alert('該成員已存在！')
    return
  }

  try {
    const gapiClient = await getGapiClient()

    await gapiClient.sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:A`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [[name]]
      }
    })

    participants.value.push(name)
    newParticipant.value = ''
  } catch (err) {
    console.error('新增成員失敗', err)
    alert('新增失敗，請稍後再試')
  }
}

const removeParticipant = async (index) => {
  const name = participants.value[index]
  if (!confirm(`確定要移除 ${name} 嗎？`)) return

  const gapiClient = await getGapiClient()

  // 找出整張表格資料（需要知道 row index 才能刪除）
  const res = await gapiClient.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:A`
  })

  const values = res.result.values || []
  const rowIndex = values.findIndex(row => row[0] === name)
  if (rowIndex === -1) return alert('找不到該成員')

  // 發出刪除該列的 batchUpdate 請求
  await gapiClient.sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    resource: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId: await getSheetId(SHEET_NAME),
            dimension: 'ROWS',
            startIndex: rowIndex,
            endIndex: rowIndex + 1
          }
        }
      }]
    }
  })

  participants.value.splice(index, 1)
}

// 輔助函式：取得 sheetId（注意不是名稱，是數字）
const getSheetId = async (sheetName) => {
  const gapiClient = await getGapiClient()
  const res = await gapiClient.sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID })
  const sheet = res.result.sheets.find(s => s.properties.title === sheetName)
  return sheet?.properties.sheetId
}

onMounted(loadParticipants)
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
