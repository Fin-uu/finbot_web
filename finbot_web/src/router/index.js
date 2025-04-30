
import { createRouter, createWebHistory } from 'vue-router'

// 引入你的組件
import HelloWorld from '../components/HelloWorld.vue'
//個人
import personalHome from '../components/personal/personalHome.vue'
import Participants from '../components/personal/participants.vue'
import Accounting from '../components/personal/accounting.vue'
import ExpenseHistory from '../components/personal/expenseHistory.vue'
//團體
import groupHome from '../components/group/groupHome.vue'
import groupAccount from '../components/group/groupAccount.vue'
import groupExpenseHistory from '../components/group/groupExpenseHistory.vue'
import groupParticipants from '../components/group/groupParticipants.vue'
//xin
import xinHome from '../components/xin/xinHome.vue'
import xinAccount from '../components/xin/xinAccount.vue'
import xinExpenseHistory from '../components/xin/xinExpenseHistory.vue'
// 設定路由
const routes = [
  { path: '/', component: HelloWorld },
  { path: '/personalHome', component: personalHome },
  { path: '/participants', component: Participants },
  { path: '/accounting', component: Accounting },
  { path: '/expenseHistory', component: ExpenseHistory },
  { path: '/groupAccount', component: groupAccount },
  { path: '/groupExpenseHistory', component: groupExpenseHistory },
  { path: '/groupParticipants', component: groupParticipants },
  { path: '/groupHome', component: groupHome },
  { path: '/xinHome', component: xinHome },
  { path: '/xinExpenseHistory', component: xinExpenseHistory },
  { path: '/xinAccount', component: xinAccount },
 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 確保這裡使用 `default` 匯出
export default router;
