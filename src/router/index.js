import Vue from 'vue'
import VueRouter from 'vue-router'

// 设置异步路由，通过工厂函数
const Layout = () => import('@/views/Layout/LayoutPage.vue')
const Home = () => import('@/views/Home/HomePage.vue')
const Search = () => import('@/views/Search/SearchBox.vue')
const Rinking = () => import('@/components/home/HotRankList.vue')
const Play = () => import('@/views/Play/playMusic.vue')
const SongList = () => import('@/components/SongDetails.vue')
const Comment = () => import('@/views/Comment/CommentList.vue')
const Login = () => import('@/views/Login/LoginPage.vue')
const NewSongs = () => import('@/components/home/NewSongs.vue')
const RecSongs = () => import('@/components/home/dailyRec.vue')
const boutiqueList = () => import('@/components/home/boutiqueList.vue')
const Like = () => import('@/components/home/recentPlay.vue')
const SongerList = () => import('@/views/SongerList/SongerList.vue')
const RinkList = () => import('@/views/Rink/RinkList.vue')
const RinkDetails = () => import('@/components/rink/RinkDetails.vue')
const UserInfo = () => import('@/views/UserInfo/UserInfo.vue')
const SongerDetails = () => import('@/components/songer/SongerDetails.vue')
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/layout' },
  {
    path: '/layout',
    component: Layout,
    children: [
      { path: '/layout', redirect: 'home' },
      { path: 'home', component: Home },
      { path: 'search', component: Search },
      { path: 'songerlist', component: SongerList },
      { path: 'rinklist', component: RinkList }
    ]
  },
  { path: '/play', component: Play },
  { path: '/songlist', component: SongList },
  { path: '/comment', component: Comment },
  { path: '/rink', component: Rinking },
  { path: '/newsongs', component: NewSongs },
  { path: '/rinkdetails', component: RinkDetails },
  { path: '/user', component: UserInfo },
  { path: '/songer', component: SongerDetails },
  { path: '/like', component: Like },
  { path: '/login', component: Login },
  { path: '/recSongs', component: RecSongs },
  { path: '/boutiqueList', component: boutiqueList }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/user') {
    const cookieStr = window.localStorage.getItem('cookie')
    if (!cookieStr) return next('/login')
  }
  next()
})
export default router
