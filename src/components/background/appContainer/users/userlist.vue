<script>
import Vue from "vue";
import { Decrypt, Encrypt } from "../../../../../static/js/utils.js";
import http from "@/assets/api/index.js";
import {
  Table,
  Button,
  Input,
  Select,
  Modal,
  Popconfirm,
  Form
} from "ant-design-vue";
import store from "@/store/index";
import { mapGetters } from "vuex";

export default {
  name: "UserList",
  components: {
    Table,
    Button,
    Select,
    Option: Select.Option,
    Modal,
    Popconfirm,
    Form,
    Input
  },
  store,
  data() {
    return {
      tableColumn: [
        {
          title: "序号",
          key: "index",
          dataIndex: "index",
          customRender: (text, record, index) => {
            return (this.pagination.current - 1) * 10 + index + 1;
          }
        },
        {
          title: "用户名",
          key: "userName",
          dataIndex: "userName",
          customRender: (text, record, index) => {
            return <span>{text}</span>;
          }
        },
        {
          title: "角色",
          key: "authority",
          dataIndex: "authority;",
          customRender: (text, record, index) => {
            return (
              <span>
                {record.authority === 2 ? "超级管理员" : "普通管理员"}
              </span>
            );
          }
        },
        {
          title: "状态",
          key: "status",
          dataIndex: "status",
          customRender: (text, record, index) => {
            return (
              <Popconfirm
                title={record.status === 0 ? "你确认禁用？" : "你确认启用？"}
                onConfirm={() => {
                  this.confirmStatus(record.userId, record.status);
                }}
                onCancel={() => {
                  this.cancelStatus;
                }}
                okText="确认"
                cancelText="取消"
              >
                <span style={{ color: "#06a5ff" }}>
                  {" "}
                  {record.status === 0 ? "启用" : "禁用"}
                </span>
              </Popconfirm>
            );
          }
        },

        {
          title: "操作",
          key: "action",
          dataIndex: "action",
          customRender: (text, record, index) => {
            return (
              <Popconfirm
                title="你确认删除吗？"
                onConfirm={() => {
                  this.confirmDelete(record.userId);
                }}
                onCancel={() => {
                  this.cancelStatus;
                }}
                okText="确认"
                cancelText="取消"
              >
                <a
                  style={{
                    color: this.userName !== record.userName ? "#06a5ff" : ""
                  }}
                  disabled={this.userName == record.userName}
                >
                  删除
                </a>
              </Popconfirm>
            );
          }
        }
      ],
      loading: false,
      dataSource: [], // 数据源
      userInfo: {},
      userId: "",
      pagination: {
        current: 1,
        total: 10
      },
      searchParams: {},
      addvisible: false,
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
  computed: mapGetters(["userName"]),
  methods: {
    // 查询所有管理员
    async selectAllAdmin() {
      this.loading = true;
      this.searchParams = Object.assign(this.searchParams, {
        currentpage: this.pagination.current,
        limit: 10
      });
      const res = await http.getAdminList(this.searchParams);
      if (res && res.data.code === 200) {
        const dataSource = res.data.data.data;
        const total = res.data.data.total;
        this.dataSource = dataSource;
        this.pagination.total = total;
        this.loading = false;
        // 如果查询当前页没有数据 则查询前一页  若为第一页在不查
        if (dataSource.length === 0 && total > 10) {
          this.pagination.current--;
          this.selectAllAdmin();
        }
      } else {
        this.$message.error("查询出错");
      }
    },
    // 删除
    async confirmDelete(userId) {
      const res = await http.getAdminDelete({ userId });
      if (res && res.data.code === 200) {
        this.$message.success("删除成功");
        this.selectAllAdmin();
      }
    },
    // 改变用户状态
    async confirmStatus(userId, status) {
      const res = await http.getAdminChangeStatus({
        userId,
        status
      });
      if (res && res.data.code === 200) {
        this.$message.success("修改成功");
        //调用获取数据的方法
        this.selectAllAdmin();
      } else {
        this.$message.error("修改失败");
      }
    },
    cancelStatus() {},
    // 下拉框筛选
    handleStatusChange(status) {
      if (status === 2) {
        Vue.delete(this.searchParams, "status");
      } else {
        this.searchParams = Object.assign(this.searchParams, { status });
      }
      this.selectAllAdmin();
    },
    //   表格改变
    onTableChange(pagination, filters, sorter, extra) {
      this.pagination.current = pagination.current;
      this.selectAllAdmin();
    },
    // 新增对话框
    showAddModal() {
      this.addvisible = true;
    },
    // 隐藏新增对话框
    async handleModalOk() {
      const res = await http.getAdminAdd({
        userId: this.userId
      });
      if (res && res.data.code === 200) {
        this.$message.success("新增成功");
        this.userId = "";
        this.addvisible = false;
        this.userInfo = {};
        this.selectAllAdmin();
      }
    },
    // 对话框确认
    hideAddModal() {
      this.userId = "";
      this.addvisible = false;
    },
    inputChange(e) {
      this.userId = e.target.value;
    },
    async searchUser() {
      // getAdminAdd
      const res = await http.getUserInfobyid({
        userId: this.userId
      });
      if (res && res.data.code === 200) {
        const userInfo = res.data.data;
        this.userInfo = userInfo;
        this.handleModalOk();
      }
    }
  },

  created() {
    this.$nextTick(() => {
      this.selectAllAdmin();
    });
  },
  render(h) {
    const {
      dataSource,
      tableColumn,
      statuses,
      pagination,
      onTableChange,
      loading
    } = this;
    return (
      <div style={{ width: "100%", positive: "relative" }}>
        <div
          style={{
            padding: "0 10px 10px 10px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <a-select
            style={{ width: "120px" }}
            placeholder="请选择"
            onChange={this.handleStatusChange}
          >
            {statuses.map((item, index) => {
              return (
                <a-select-option key={index + item} value={item.key}>
                  {item.value}
                </a-select-option>
              );
            })}
          </a-select>
          <Button
            type="primary"
            style={{ width: "80px" }}
            onClick={this.showAddModal}
          >
            新增
          </Button>
        </div>
        <Table
          style={{ marginLeft: "10px" }}
          bordered
          loading={loading}
          onChange={onTableChange}
          pagination={pagination}
          columns={tableColumn}
          dataSource={dataSource}
        />
        ,
        <Modal
          title="新增管理员"
          visible={this.addvisible}
          onOk={this.handleModalOk}
          onCancel={this.hideAddModal}
        >
          <div style={{ width: "300px", margin: "0 auto" }}>
            <Input
              style={{ width: "200px", marginRight: "20px" }}
              placeholder="请输入搜索条件"
              onChange={this.inputChange}
            />
            <Button type="primary" onClick={this.searchUser}>
              搜索
            </Button>
            {JSON.stringify(this.userInfo) !== "{}" ? (
              <div style={{ marginTop: "10px" }}>
                <span>{this.userInfo.userName}</span>---
                <span>{this.userInfo.userId}</span>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </Modal>
      </div>
    );
  }
};
</script>