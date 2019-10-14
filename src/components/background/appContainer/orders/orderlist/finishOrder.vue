<template>
  <div class="orderwrap">
    <el-table :data="orders" border>
      <el-table-column prop="orderId" label="订单标识"></el-table-column>
      <el-table-column prop="buyer.trueName" label="买家"></el-table-column>
      <el-table-column prop="seller.trueName" label="卖家"></el-table-column>
      <el-table-column label="汽车品牌" width="350">
        <template slot-scope="scope">{{scope.row.car.series}}{{scope.row.car.vehicle}}</template>
      </el-table-column>
      <el-table-column prop="dealprice" label="成交价(万元)"></el-table-column>
      <el-table-column prop="dealdate" label="交易日期"></el-table-column>
      <el-table-column label="状态" width="170">
        <template slot-scope="scope">
          <a v-if="scope.row.status===1" style="color:red">待看车</a>
          <a v-if="scope.row.status===2" style="color:red">待付款</a>
          <a v-if="scope.row.status===3" style="color:red">代收款</a>
          <a v-if="scope.row.status===4" @click="checkCar(scope.row.orderId)" style="color:red">待审核</a>
          <a v-if="scope.row.status===5" style="color:#22ac38">交易完成</a>
        </template>
      </el-table-column>
    </el-table>
    <b-col class="text-right" style="margin-top:20px;">
      <template>
        <a-pagination v-model="current" :total="total" @change="handlePagination"/>
      </template>
    </b-col>
  </div>
</template>
<script>
import http from "@/assets/api/index.js";
import qs from "qs";
import bus from "../../../../../../static/js/bus.js";

export default {
  data() {
    return {
      orders: [],
      current: 1,
      total: 10
    };
  },
  methods: {
    selectCars() {
      const loading = this.$loading({
        lock: true,
        text: "加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      http
        .getAllOrder({
          currentpage: this.current
        })
        .then(response => {
          const orders = response.data.data.data;
          const total = response.data.data.total;
          this.orders = orders;
          this.total = total;
          setTimeout(() => {
            loading.close();
          }, 400);
        });
    },
    checkCar(id) {
      const that = this;
      this.$confirm({
        title: "是否审核订单通过?",
        onOk() {
          http.getOrderAssess({ orderId: id }).then(response => {
            if (response.data.code === 200) {
              that.$message.success("审核成功");
              http.getStatusPages({ status: 4 }).then(response => {
                const ordercount = response.data.data;
                bus.$emit("toheaderorder", ordercount);
              });
              that.selectCars();
            } else {
              that.$message.error("审核失败");
            }
          });
        },
        onCancel() {}
      });
    },
    handlePagination(value) {
      this.current = value;
      this.selectCars();
    }
  },
  mounted() {
    this.selectCars();
  }
};
</script>
<style>
</style>

