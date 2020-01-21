import Vue from 'vue'
import VueRouter from 'vue-router'

// 不使用路由懒加载
// import Login from '../components/Login'
// import Home from '../components/Home'
// import Welcome from '../components/Welcome'
// import Users from '../components/user/Users'
// import Rights from '../components/power/Rights'
// import Roles from '../components/power/Roles'

// 使用路由懒加载
const Login = () => import('../components/Login')
const Home = () => import('../components/Home')
const Welcome = () => import('../components/Welcome')
const Users = () => import('../components/user/Users')
const Rights = () => import('../components/power/Rights')
const Roles = () => import('../components/power/Roles')
const Report = () => import('../components/echarts/Report')

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login,
    meta: {
      title: '登陆'
    }
  },
  {
    path: '/home',
    component: Home,
    meta: {
      title: '主页'
    },
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome,
      meta: {
        title: '欢迎'
      }
    }, {
      path: '/users',
      component: Users,
      meta: {
        title: '用户'
      }
    }, {
      path: '/rights',
      component: Rights,
      meta: {
        title: '权限'
      }
    }, {
      path: '/roles',
      component: Roles,
      meta: {
        title: '角色'
      }
    }, {
      path: '/reports',
      component: Report,
      meta: {
        title: '数据报表'
      }
    }]
  }
]

const router = new VueRouter({
  routes,
  // 使用history路由模式，URL不带#
  mode: 'history'
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // 页面标签名及时修改
  document.title = to.matched[0].meta.title
  // to 将要访问的路径
  // from 从哪个路径跳转而来
  // next（）放行 ； next（‘/’）强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
