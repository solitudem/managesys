import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import('../views/login/Login')
const Home = () => import('../views/home/Home')
const Welcome = () => import('../views/home/children/Welcome')
const User = () => import('../views/user/User')
const Rights = () => import('../views/power/rights/Rights')
const Roles = () => import('../views/power/roles/Roles')
const Categories = () => import('../views/goods/cate/Categories')
const Params = () => import('../views/goods/params/Params')

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
        component:Home,
        redirect:'/welcome',
        //配置子路由
        children:[
            {
                path:'/welcome',
                component:Welcome
            },
            {
                path:'/users',
                component:User
            },
            {
                path:'/rights',
                component:Rights
            },
            {
                path:'/roles',
                component:Roles
            },
            {
                path:'/categories',
                component:Categories
            },
            {
                path:'/params',
                component:Params
            }
        ]
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