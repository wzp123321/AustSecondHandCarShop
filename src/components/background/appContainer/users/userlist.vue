<template>
  <div class="user-wrapcontent">
    <b-row class="headerrow">
      <b-col xl="3">
        <el-select v-model="status" @change="handleStatusChange">
          <el-option v-for="item in statuses" :key="item.key" :label="item.value" :value="item.key"></el-option>
        </el-select>
      </b-col>
      <b-col xl="1" offset-xl="8">
        <a-button type="primary" @click="showAddModal">新增</a-button>
        <a-modal
          title="用户新增"
          :visible="addvisible"
          @ok="handleOk"
          :confirmLoading="addconfirmLoading"
          @cancel="handleCancel"
          okText="确认"
          cancelText="取消"
        >
          <div class="row">
            <a-input type="text" class="modalinput" v-model="inputuserId"/>
            <a-button type="primary" @click="selectUser">查询</a-button>
          </div>
          <p class="select-p">
            {{user.userId}}
            <span>{{user.userName}}</span>
          </p>
        </a-modal>
      </b-col>
    </b-row>
    <el-table :data="admins" border>
      <el-table-column prop="userId" label="用户标识"></el-table-column>
      <el-table-column prop="userName" label="姓名"></el-table-column>
      <el-table-column label="角色">
        <template slot-scope="scope">{{scope.row.authority === 2 ? '超级管理员' : '普通管理员'}}</template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <a
            style="color:#06a5ff"
            @click="changeAdminStatus(scope.row)"
          >{{scope.row.status ===0 ? '启用' : '禁用'}}</a>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <a v-if="loginname===scope.row.userName" @click="deleteAdmin(scope.row)" disabled>删除</a>
          <a v-else @click="deleteAdmin(scope.row)" style="color:#06a5ff">删除</a>
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
import { Decrypt, Encrypt } from "../../../../../static/js/utils.js";
import http from "@/assets/api/index.js";
import qs from "qs";

export default {
  data() {
    return {
      loginname: Decrypt(window.localStorage.getItem("loginname")),
      admins: [],
      inputuserId: "",
      user: {},
      current: 1,
      status: 2,
      total: 10,
      addvisible: false,
      addconfirmLoading: false,
      statuses: [
        {
          key: 2,
          value: "全部数据"
        },
        {
          key: 0,
          value: "启用"
        },
        {
          key: 1,
          value: "禁用"
        }
      ]
    };
  },
  methods: {
    getParams() {
      return this.status === 2
        ? { currentpage: this.current }
        : { status: this.status, currentpage: this.current };
    },
    // 分页
    handlePagination(value) {
      this.current = value;
      this.selectAllAdmin(this.getParams());
    },
    // 删除管理员
    deleteAdmin(data) {
      const _this = this;
      this.$confirm({
        title: "删除用户",
        content: "确定删除" + data.userName + "?",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          let params = {
            userId: data.userId
          };
          http.getAdminDelete(params).then(response => {
            if (response.data.code === 200) {
              _this.$message.success("删除成功");
              const params =
                _this.status === 2
                  ? {
                      currentpage:
                        _this.admins.length === 1
                          ? _this.current - 1
                          : _this.current
                    }
                  : {
                      status: _this.status,
                      currentpage:
                        _this.admins.length === 1
                          ? _this.current - 1
                          : _this.current
                    };
              _this.selectAllAdmin(params);
              if (_this.admins.length === 1) {
                _this.current--;
              }
            } else {
              this.$message.error("删除失败");
            }
          });
        }
      });
    },
    // 下拉框改变
    handleStatusChange(value) {
      this.status = value;
      this.selectAllAdmin(this.getParams());
    },
    // 改变用户状态
    changeAdminStatus(data) {
      let params = {
        userId: data.userId,
        status: data.status
      };
      http.getAdminChangeStatus(params).then(response => {
        if (response.data.code === 200) {
          this.$message.success("修改成功");
          //调用获取数据的方法
          this.selectAllAdmin(this.getParams());
        } else {
          this.$message.error("修改失败");
        }
      });
    },
    // 显示新增管理员对话框
    showAddModal() {
      this.addvisible = true;
    },
    selectUser() {
      http
        .getUserInfobyid({
          userId: this.inputuserId
        })
        .then(response => {
          if (response.data.code == 200) {
            const user = response.data.data;
            this.user = user;
          }
        });
    },
    // add对话框ok
    handleOk(e) {
      this.addconfirmLoading = true;
      http
        .getAdminAdd({
          userId: this.user.userId
        })
        .then(response => {
          if (response.data.code == 200) {
            this.$message.success("新增成功");
            this.inputuserId = "";
            this.user = {};
            this.selectAllAdmin(this.getParams());
          } else {
            this.$message.error("新增失败");
          }
        });
      setTimeout(() => {
        this.addvisible = false;
        this.addconfirmLoading = false;
      }, 1000);
    },
    // 取消对话框
    handleCancel(e) {
      this.inputuserId = "";
      this.user = {};
      this.addvisible = false;
    },
    // 查询所有管理员
    selectAllAdmin(params) {
      const loading = this.$loading({
        lock: true,
        text: "加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      http.getAdminList(params).then(response => {
        if (response.data.code === 200) {
          const admins = response.data.data.data;
          const total = response.data.data.total;
          this.admins = admins;
          this.total = total;
          setTimeout(() => {
            loading.close();
          }, 400);
        } else {
          this.$message.error("查询出错");
        }
      });
    }
  },
  async mounted() {
    await this.selectAllAdmin(this.getParams());
  }
};
</script>
<style lang="less" scoped>
.user-wrapcontent {
  padding-left: 10px;
  .headerrow {
    margin-bottom: 5px;
    padding: 10px 5px;
    border-radius: 5px;
    background: #fff;
    margin-left: 2px;
    .ant-btn-primary {
      width: 120px;
      height: 36px;
    }
    .select-p {
      margin-top: 20px;
      font-size: 16px;
      padding-left: 10px;
      color: #06a5ff;
      span {
        display: inline-block;
        margin-left: 100px;
      }
    }
  }
}
.modalinput {
  width: 300px;
  margin-right: 100px;
  margin-left: 20px;
}
</style>

