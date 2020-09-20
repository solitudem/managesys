<template>
        <el-container class="home-container">
            <!-- 头部 -->
            <el-header>
                <div class="header">
                    <img src="../../assets/img/heima.png" alt="">
                    <span>电商后台管理系统</span>
                </div>
                <el-button type="info" @click="logout">退出</el-button>
            </el-header>
            <el-container>
                <!-- 侧边栏 -->
                <el-aside :width="isCollapse ? '64px' : '200px'">
                    <div class="toggle" @click="toggleCollapse">|||</div>
                    <el-menu 
                        background-color="#333744"
                        text-color="#fff"
                        active-text-color="#409eff" unique-opened 
                        :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
                        <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                            <template slot="title">
                            <i :class="iconObj[item.id]" class="iconfont"></i>
                            <span>{{item.authName}}</span>
                            </template>
                            <el-menu-item :index="'/' + subItem.path" @click="saveNavState('/' + subItem.path)" v-for="subItem in item.children" :key="subItem.id">
                                <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                            </template>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
</template>

<script>
export default {
    name:'Home',
    data(){
        return {
            menuList:[],
            iconObj:{
                '125':'iconfont icon-user',
                '145':'iconfont icon-baobiao',
                '101':'iconfont icon-shangpin',
                '102':'iconfont icon-danju',
                '103':'iconfont icon-tijikongjian'
            },
            isCollapse:false,
            // 被激活的链接地址
            activePath:''
        }
    },
    created(){
        //获取菜单数据
        this.getMenuList()
        this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods:{
        logout(){
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        //获取菜单数据
        async getMenuList(){
            const {data:res} = await this.$http.get('menus')
            if(res.meta.status!== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.menuList = res.data
        },
        toggleCollapse(){
            this.isCollapse = !this.isCollapse
        },
        //保存链接的状态
        saveNavState(activePath){
            window.sessionStorage.setItem('activePath',activePath)
            this.activePath = activePath
        }
    }
}
</script>

<style scoped>
.home-container{
    height: 100%;
}
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content:space-between;
    align-items: center;
    padding-left: 0;
    color: #fff;
    font-size: 20px;
}
.el-header .header{
    display: flex;
    align-items: center;
}
.el-header .header span{
    margin-left: 15px;
}

.el-aside{
    background-color: #333744;
}
.toggle{
    line-height: 24px;
    font-size: 12px;
    background-color: #4a5064;
    letter-spacing: 0.2em;
    color: #fff;
    text-align: center;
    cursor: pointer;
}
.el-aside .el-menu{
    border-right: none;
}
.iconfont{
    margin-right: 5px;
}
.el-main{
    background-color: #eaedf1;
}

</style>