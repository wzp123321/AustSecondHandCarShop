<template>
  <div class="carwrap">
    <a-tabs defaultActiveKey="1" @change="callback">
      <a-tab-pane tab="已审核车辆" key="1"></a-tab-pane>
      <a-tab-pane tab="未审核车辆" key="0" forceRender></a-tab-pane>
    </a-tabs>
    <el-table :data="carDatas" border>
      <el-table-column label="缩略图">
        <template slot-scope="scope">
          <img :src="scope.row.carAvatar" style="width:90px;height:60px;border-radius:5px">
        </template>
      </el-table-column>
      <el-table-column prop="brand" label="汽车品牌"></el-table-column>
      <el-table-column prop="series" label="汽车车系"></el-table-column>
      <el-table-column prop="vehicle" label="汽车车型"></el-table-column>
      <el-table-column prop="truePrice" label="售价(万元)"></el-table-column>
      <el-table-column prop="registrationTime" label="上牌时间"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <a v-if="scope.row.status*1===1" style="color:green">审核通过</a>
          <a-popconfirm
            title="是否确认车辆合格?"
            @confirm="checkCar(scope.row.carId)"
            @cancel="cancel"
            okText="确认"
            cancelText="取消"
          >
            <a v-if="scope.row.status*1===0" style="color:red">待审核</a>
          </a-popconfirm>
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
import { Modal } from "ant-design-vue";
import bus from "../../../../../static/js/bus.js";

export default {
  data() {
    return {
      carDatas: [],
      current: 1,
      total: 10,
      status: 1
    };
  },
  methods: {
    callback(key) {
      this.status = key;
      this.selectCars();
    },
    checkCar(id) {
      http.getCarsChecked({ carId: id }).then(response => {
        if (response.data.code === 200) {
          this.$message.success("审核成功");
          this.selectCars(this.current);
        } else {
          this.$message.error("审核失败");
        }
      });
    },
    cancel (e) {
      this.$message.error('已取消操作')
    },
    selectCars() {
      const loading = this.$loading({
        lock: true,
        text: "加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      http
        .getCarsByStatus({
          status: this.status*1,
          currentpage: this.current
        })
        .then(response => {
          const carDatas = response.data.data.data;
          this.carDatas = carDatas;
          const total = response.data.data.total;
          this.total = total;
          if (this.status*1 === 0) {
            bus.$emit("toheader", total);
          }
          setTimeout(() => {
            loading.close();
          }, 400);
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

