<template>
    <div class="login">
        <div class="login-box">
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login-form">
                <!-- 用户名输入框 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!-- 密码输入框 -->
                <el-form-item prop="password">
                    <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="loginFormReset">重置</el-button>
                </el-form-item >
            </el-form>
            
        </div>
    </div>
</template>

<script>
export default {
    name:'Login',
    data(){
        return {
            //表单数据对象
            loginForm:{
                username:'admin',
                password:'123456'
            },
            
            loginFormRules:{
                //用户名验证
                username:[
                    {required:true, message:'请输入登录名', trigger:'blur'},
                    {min:3,max:10, message:'请输入3~10个字符', trigger:'blur' }
                ],
                //密码验证
                password:[
                    {require:true, message:'请输入密码', trigger:'blur'},
                    {min:6,max:15, message:'请输入6~15位密码', trigger:'blur' }
                ]
            },
            

        }
    },
    methods:{
        //reset
        loginFormReset(){
            this.$refs.loginFormRef.resetFields()           
        },
        //login
        login(){
            this.$refs.loginFormRef.validate(async valid => {
                if(!valid){
                    return
                }
                const {data:res} = await this.$http.post('login',this.loginForm)
                if(res.meta.status !== 200){
                    return this.$message.error('登录失败');
                }
                this.$message.success('登录成功')

                //将登录成功后返回的token保存到sessionStorage中
                window.sessionStorage.setItem('token',res.data.token)
                //登录成功后跳转到home页面
                this.$router.replace('/home')
            })
        }
    }
}
</script>

<style scoped>
    .login{
        position: relative;
        height: 100%;
        background-color: #2b4b6b;
    }
    .login-box{
        position: absolute;
        width: 450px;
        height: 300px;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        border-radius: 4px;
        background-color: #fff;
    }
    .login-form{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 100%;
        padding: 0 20px;
    }
    .btns{
        text-align: center;
    }
</style>