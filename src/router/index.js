import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import('../views/login/Login')
const Home = () => import('../views/home/Home')

const routes = [
    {
        path:'',
        redirect:'/login'
    },
    {
        path:'/login',
        component:Login
    },
    {
        path:'/home',
        component:Home
    }
]
const router = new VueRouter({
    routes,
    mode:'history'
})


//为路由对象配置导航守卫
//使用户未登录时强制跳转到登录页
router.beforeEach((to,from,next) => {
    //to 将要访问的路径
    //from 代表从哪个路径跳转而来
    //next 是一个函数 表示放行
    if(to.path === '/login') {
        return next()
    }
    //获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if(!tokenStr){
        return next('/login')
    }
    next()
})

export default router