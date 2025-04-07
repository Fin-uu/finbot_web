
import { createRouter, createWebHistory } from 'vue-router'

// 引入你的組件
import HelloWorld from '../components/HelloWorld.vue'
import Participants from '../components/participants.vue'
import Accounting from '../components/accounting.vue'
import ExpenseHistory from '../components/expenseHistory.vue'

// 設定路由
const routes = [
  { path: '/', component: HelloWorld },
  { path: '/participants', component: Participants },
  { path: '/accounting', component: Accounting },
  { path: '/expenseHistory', component: ExpenseHistory}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 確保這裡使用 `default` 匯出
export default router;
