<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card class="box-card">
            <!-- 添加角色 -->
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 角色列表 -->
            <el-table :data="roleList" stripe border>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom',i1 === 0 ? 'bdtop' : '','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                            <!-- 一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="deleteRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 二级和三级权限 -->
                            <el-col :span="19">
                                <el-row :class="[i2 === 0 ? '' : 'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="deleteRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag v-for="(item3,i3) in item2.children" :key="item3.id" type="warning" closable @close="deleteRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template> 
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" prop="level" width="300px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button> 
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 分配权限对话框 -->
        <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%">
            <el-tree :data="rightsList" :props="treeProps" show-checkbox default-expand-all
            node-key="id" :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="setRights">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name:'Roles',
    data(){
        return {
            roleList:[],
            rightsList:[],
            setRightDialogVisible:false,
            treeProps:{
                label:'authName',
                children:"children"
            },
            defKeys:[],
            //保存分配权限角色的id
            roleId:''
        }
        
    },
    created(){
        this.getRoleList()
    },
    methods:{
        async getRoleList(){
            const {data:res} = await this.$http.get('roles')
            if(res.meta.status !== 200){
                return this.$message.error('获取角色列表失败!')
            }
            this.roleList = res.data
        },
        //删除权限
        async deleteRightById(role,rightId){
            const confirmRes = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            if(confirmRes !== 'confirm'){
                return this.$message.info('已取消删除')
            }
            const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            if(res.meta.status !== 200){
                return this.$message.error('删除权限失败!')
            }
            //this.getRoleList()会导致刷新页面
            role.children = res.data
            this.$message.success('删除权限成功!')
        },

        //分配权限对话框
        async showSetRightDialog(role){
            const {data:res} = await this.$http.get('rights/tree')
            if(res.meta.status !== 200){
                return this.$message.error('获取权限失败!')
            }
            this.rightsList = res.data
            // console.log(this.rightsList);
            //将之前保存的id清空
            this.defKeys = []
            this.getDefKeys(role,this.defKeys)
            //console.log(this.defKeys);
            //保存当前分配权限角色的id
            this.roleId = role.id
            this.setRightDialogVisible = true
        },

        //通过递归的方法获取角色下所有的三级权限的id
        //保存到数组defKeys中
        getDefKeys(node,arr){
            
            if(!node.children){
                return arr.push(node.id)
            }
            node.children.forEach(item => {
                this.getDefKeys(item,arr)
            });
        },

        //提交分配权限的请求
        async setRights(){
            const keys = [...this.$refs.treeRef.getCheckedKeys(),
                            ...this.$refs.treeRef.getHalfCheckedKeys()        
                        ]
            const isStr = keys.join(',')
            const {data:res} = await this.$http.post(
                `roles/${this.roleId}/rights`,{rids:isStr}
            )
            if(res.meta.status !== 200){
                return this.$message.error('分配权限失败!')
            }
            this.getRoleList()
            this.$message.success('分配权限成功!')
            this.showSetRightDialog = false
        }
        

    }
}
</script>

<style scoped>
.el-tag{
    margin: 7px;
}
.bdbottom{
    border-bottom: 1px solid #eee;
}
.bdtop{
    border-top: 1px solid #eee;
}
.vcenter{
    display: flex;
    align-items: center;
}
</style>