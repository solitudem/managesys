<template>
  <div>
    <el-dialog title="添加分类" :visible.sync="isShow" width="50%">
      <el-cascader
        v-model="selectedKeys"
        :options="parentCateList"
        :props="cascaderProps"
        @change="selectedChange"
        clearable
      ></el-cascader>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      parentCateList: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        
        checkStrictly:true
      },
      selectedKeys: [],
      isShow:true
    }
  },
  created(){
      this.getParentCate()
  },
  methods:{
      async getParentCate() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类列表失败!");
      }
      this.parentCateList = [res.data[0],res.data[1],res.data[2]];
    },
    selectedChange() {console.log(this.selectedKeys);
    },
  }
};
</script>

<style>
</style>