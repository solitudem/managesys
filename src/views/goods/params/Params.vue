<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区 -->
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 警告 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
      <!-- 级联选择器 -->
      <el-form>
        <el-form-item label="选择商品分类">
          <el-cascader
            v-model="selectedCateId"
            :options="cateList"
            :props="cascaderProps"
            clearable
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <!-- 属性与参数 -->
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="!isClick" @click="showParamsDialog">添加参数</el-button>
          <!-- 参数表格 -->
          <el-table :data="manyTable" style="width: 100%">
            <el-table-column type="expand">
              <!-- 标签 -->
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="deletePro(index,scope.row)">{{item}}</el-tag>

                <!-- 动态编辑标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="!isClick" @click="showParamsDialog">添加属性</el-button>
          <el-table :data="onlyTable" style="width: 100%">
            <el-table-column type="expand">
              <!-- 标签 -->
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="deletePro(index,scope.row)">{{item}}</el-tag>

                <!-- 动态编辑标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog :title="'添加'+titleText" :visible.sync="paramsDialogVisible" width="50%">
      <el-form :model="paramsForm" :rules="paramsRules" ref="paramsFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="paramsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="paramsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog :title="'修改'+titleText" :visible.sync="editDialogVisible" width="50%">
      <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover"
      },
      selectedCateId: [],
      activeName: "many",
      manyTable: [],
      onlyTable: [],

      // add dialog
      paramsDialogVisible: false,
      paramsForm: {
        attr_name: ""
      },
      paramsRules: {
        attr_name: [{ required: true, message: "请输入参数", trigger: "blur" }]
      },

      //edit dialog
      editDialogVisible: false,
      editForm: {},
      editRules: {
        attr_name: [{ required: true, message: "请输入参数", trigger: "blur" }]
      },

      //标签
      inputVisible:false,
      inputValue:'',
      
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 3 }
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类列表失败!");
      }
      this.cateList = res.data;
      //   console.log(this.cateList);
    },
    tabClick() {
      this.getParamsList();
    },
    async getParamsList() {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("请选择分类!");
      }
      //   this.goodsParams = res.data;
      //    console.log(this.cateId);
      res.data.forEach(item => {
        //将attr_vals字符串转换为数组,以空格分割
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        //给每个item一个自己的inputVisible, inputValue
        item.inputVisible = false
        item.inputValue = ''
      });

      if (this.activeName === "many") {
        this.manyTable = res.data;
      } else {
        this.onlyTable = res.data;
      }
    },

    //必须选择三类
    handleChange() {
      if (this.selectedCateId.length !== 3) {
        this.selectedCateId = [];
        this.manyTable = []
        this.onlyTable = []
        return;
      }
      this.getParamsList();
    },

    //添加参数
    showParamsDialog() {
      this.paramsDialogVisible = true;
    },
    dialogClosed() {
      this.$refs.paramsFormRef.resetFields();
    },
    addParams() {
      this.$refs.paramsFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.paramsForm.attr_name,
            attr_sel: this.activeName
          }
        );
        // console.log(res);

        if (res.meta.status !== 201) {
          this.$message.error("添加参数失败!");
        }
        this.$message.success("添加参数成功!");
        this.getParamsList();
        this.paramsDialogVisible = false;
      });
    },

    //修改参数
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        );

        if (res.meta.status !== 200) {
          this.$message.error("修改参数失败!");
        }
        this.$message.success("修改参数成功!");
        this.getParamsList();
        this.editDialogVisible = false;
      });
    },
    async showEditDialog(id) {
      //获取参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`,
        {
          params: { attr_sel: this.activeName }
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("查询失败!");
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },

    //删除参数
    async deleteParams(id) {
      const confirmRes = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmRes !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete(`categories/${this.cateId}
                        /attributes/${id}`);
      if (res.meta.status !== 200) {
        this.$message.error("删除失败!");
      }
      this.$message.success("删除成功!");
      this.getParamsList();
    },

    //标签
    handleInputConfirm(row){
        //如果输入的是无效的字符,失去焦点时清空
        if(row.inputValue.trim().length === 0){
            row.inputValue = ''
            row.inputVisible = false
            return
        }
        //如果是有效的字符,则要提交给服务器
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false
        this.saveVals(row)

    },
    deletePro(i,row){
        row.attr_vals.splice(i,1)
        this.saveVals(row)
    },
    async saveVals(row){
        const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
            attr_name:row.attr_name,
            attr_sel:row.attr_sel,
            attr_vals:row.attr_vals.join(' ')
        })
        if(res.meta.status !== 200){
            return this.$message.error('更新失败!')
        }
        this.$message.success('更新成功!')
    },
    showInput(row){
        row.inputVisible = true
        //$nextTick()页面重新渲染时执行
        //自动获取焦点
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        })
    }
  },

  computed: {
    cateId() {
      if (this.selectedCateId.length === 3) {
        return this.selectedCateId[2];
      }
      return null;
    },
    isClick() {
      return this.selectedCateId.length === 3;
    },
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    }
  }
};
</script>

<style scoped>
.el-tag {
  margin-right: 5px;
}
.input-new-tag{
    width: 120px;
}
</style>