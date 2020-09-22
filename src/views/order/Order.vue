<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表 -->
      <el-table :data="orderList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="80px"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="80px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80px">
          <template slot-scope="scope">
            <span>{{scope.row.is_send}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="155px">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="modifyAddr"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProcess"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[6, 10, 15, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>

    <el-dialog title="修改地址" :visible.sync="addrDialogVisible" width="50%" @close="addrDialogClosed">
      <el-form :model="addrForm" :rules="addrFormRules" ref="addrFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="addr1">
          <el-cascader v-model="addrForm.addr1" :options="cityList"></el-cascader>
          <!-- <el-input v-model="addrForm.addr1"></el-input> -->
        </el-form-item>
        <el-form-item label="详细地址" prop="addr2">
          <el-input v-model="addrForm.addr2"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 物流进度 -->
    <el-dialog title="物流进度" :visible.sync="processDialogVisible" width="50%">
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in processData"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityList from "./citydata";

export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      cityList,

      addrDialogVisible: false,
      addrForm: {
        addr1: [],
        addr2: ""
      },
      addrFormRules: {
        addr1: [
          { required: true, message: "请选择省市区/县", trigger: "blur" }
        ],
        addr2: [{ required: true, message: "请填写详细地址", trigger: "blur" }]
      },

      processDialogVisible: false,
      processData: []
    };
  },
  created() {
    this.getOrders();
  },
  methods: {
    async getOrders() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        this.$message.error("获取订单列表失败!");
      }
      this.orderList = res.data.goods;
      this.total = res.data.total;
      //   console.log(this.orderList);
    },

    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrders();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrders();
    },

    modifyAddr() {
      this.addrDialogVisible = true;
    },
    addrDialogClosed() {
      this.$refs.addrFormRef.resetFields();
    },

    async showProcess() {
      const { data: res } = await this.$http.get("/kuaidi/1106975712662");
      if (res.meta.status !== 200) {
        return this.$message.error("获取物流信息失败!");
      }
      this.processData = res.data;
    //   console.log(this.processData);
      this.processDialogVisible = true;
    }
  }
};
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>