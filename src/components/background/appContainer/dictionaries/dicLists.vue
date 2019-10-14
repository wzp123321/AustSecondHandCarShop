<template>
  <div class="dicwrap">
    <b-row class="headerrow">
      <b-col xl="3">
        <el-select v-model="key" @change="handleKeyChange">
          <el-option
            v-for="(item,index) in typecodes"
            :key="index"
            :label="item.description"
            :value="item.typeCode"
          ></el-option>
        </el-select>
      </b-col>
      <b-col xl="1" offset-xl="8">
        <a-button type="primary" @click="showAddModal">新增</a-button>
        <a-modal
          :title="editflag ? '字典编辑' : '字典新增'"
          :visible="addvisible"
          @ok="handleOk"
          :confirmLoading="addconfirmLoading"
          @cancel="handleCancel"
          okText="确认"
          cancelText="取消"
        >
          <div class="row add-div">
            <span class="add-span">类别</span>
            <el-select
              v-model="usertypecode"
              @change="handleUserKeyChange"
              class="add-input"
              :disabled="editflag"
            >
              <el-option
                v-for="(item,index) in addtypecodes"
                :key="index"
                :label="item.description"
                :value="item.typeCode"
              ></el-option>
            </el-select>
          </div>
          <div class="row add-div" v-show="usertypecode===1001 || usertypecode===1002">
            <span class="add-span" v-text="usertypecode===1002 ? '所属车系' : '所属品牌'"></span>
            <el-select v-model="secondusertypecode" class="add-input" :disabled="editflag">
              <el-option
                v-for="(item,index) in addsecondtypes"
                :key="index"
                :label="item.value"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="row add-div" v-show="usertypecode===1002">
            <span class="add-span">售价(万元)</span>
            <el-input v-model="userinputprice" placeholder="请输入汽车价格" style="width:300px;"></el-input>
            <span v-show="pricemessage!==''" class="errormsg">{{pricemessage}}</span>
          </div>
          <div class="row add-div">
            <span class="add-span">key值</span>
            <a-input class="add-input" v-model="addkey" placeholder="35个字符以内" maxlength="35"/>
            <span v-show="addkeymessage!==''" class="errormsg">{{addkeymessage}}</span>
          </div>
          <div class="row add-div">
            <span class="add-span">value值</span>
            <a-input class="add-input" v-model="addvalue" placeholder="25个字符以内" maxlength="35"/>
            <span v-show="addvaluemessage!==''" class="errormsg">{{addvaluemessage}}</span>
          </div>
        </a-modal>
      </b-col>
    </b-row>
    <a-table
      :columns="columns"
      :dataSource="data"
      :pagination="pagination"
      bordered
      @change="handlePagination"
    >
      <template slot="name" slot-scope="index">{{index}}</template>
      <template slot="action" slot-scope="text,record">
        <span>
          <a @click="editdic(record)" style="color:#06a5ff">编辑</a>
        </span>
      </template>
    </a-table>
  </div>
</template>
<script>
import { Decrypt, Encrypt } from "../../../../../static/js/utils.js";
import qs from "qs";
import http from "@/assets/api/index.js";
export default {
  data() {
    return {
      pagination: {
        current: 1,
        total: 1,
        pageSize: 10,
        showSizeChanger: true
      },
      addvisible: false,
      key: 9999, //下拉框
      usertypecode: "请选择",
      secondusertypecode: "请选择", // 新增字典的父级id
      addkey: "",
      addvalue: "",
      addkeymessage: "",
      editflag: false,
      id: 0, // 更新的字典的id
      addvaluemessage: "",
      userinputprice: "",
      pricemessage: "",
      typecodes: [
        { typeCode: 9999, description: "全部数据" },
        { typeCode: 1000, description: "汽车品牌" },
        { typeCode: 1001, description: "汽车车系" },
        { typeCode: 1002, description: "汽车车型" },
        { typeCode: 1003, description: "汽车标签" },
        { typeCode: 1004, description: "汽车座次" },
        { typeCode: 1005, description: "燃油类型" }
      ],
      addtypecodes: [
        { typeCode: 1000, description: "汽车品牌" },
        { typeCode: 1001, description: "汽车车系" },
        { typeCode: 1002, description: "汽车车型" },
        { typeCode: 1003, description: "汽车标签" },
        { typeCode: 1004, description: "汽车座次" },
        { typeCode: 1005, description: "燃油类型" }
      ],
      addsecondtypes: [], // 如果新增的是车型或者车系这里就有用
      addconfirmLoading: false,
      data: [],
      columns: [
        {
          title: "序号",
          key: "index",
          customRender: (text, record, index) =>
            (this.pagination.current - 1) * this.pagination.pageSize + 1 + index // 这里需要第二页接上第一页的序号
        },
        { key: "key", title: "key值", dataIndex: "key" },
        { key: "value", title: "value值", dataIndex: "value" },
        { key: "description", title: "描述", dataIndex: "description" },
        { key: "creator", title: "创建人", dataIndex: "creator" },
        {
          title: "创建时间",
          key: "createTime",
          dataIndex: "createTime"
        },
        {
          title: "action",
          dataIndex: "action",
          scopedSlots: { customRender: "action" }
        }
      ]
    };
  },
  methods: {
    // 表格分页
    handlePagination(pagination, filters, sorter) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.selectDicList();
    },
    // 编辑
    editdic(value) {
      // 初始化对话框数据
      this.editflag = true;
      this.addvisible = true;
      this.usertypecode = value.typeCode;
      this.secondusertypecode = value.parentValue;
      this.addkey = value.key.slice(value.key.indexOf("-") + 1);
      this.addvalue = value.value;
      this.id = value.id;
    },
    handleKeyChange(value) {
      this.selectDicList();
    },
    // 新增字典
    handleUserKeyChange(value) {
      this.secondusertypecode = "请选择";
      if (this.usertypecode == 1001 || this.usertypecode === 1002) {
        this.getdicBytypeCode(value);
      }
    },
    getdicBytypeCode(value) {
      // 如果value是车系或者车型则发请求
      const params =
        value === 1001
          ? {
              typeCode: 1000
            }
          : {
              typeCode: 1001
            };
      http.getSingletypeCode(params).then(response => {
        const addsecondtypes = response.data.data;
        this.addsecondtypes = addsecondtypes;
      });
    },
    // 显示新增管理员对话框
    showAddModal() {
      this.addvisible = true;
      this.editflag = false;
      this.usertypecode = "请选择";
      this.secondusertypecode = "请选择";
      this.addkey = "";
      this.addvalue = "";
    },
    // add对话框ok
    handleOk(e) {
      // 先校验输入框
      this.addkeymessage = "";
      this.addvaluemessage = "";
      this.pricemessage = "";
      this.addconfirmLoading = true;
      if (this.usertypecode === 1002) {
        var regex = /^(([1-9][0-9]*)|(([0]\.\d{0,3}|[1-9][0-9]*\.\d{0,3})))$/;
        if (!regex.test(this.userinputprice)) {
          this.pricemessage = "汽车价格只能为数字且不能以0开头!";
          this.addconfirmLoading = false;
          return;
        }
        if (this.userinputprice === "") {
          this.pricemessage = "汽车价格为空!";
          this.addconfirmLoading = false;
          return;
        }
      }
      if (this.addkey === "") {
        this.addkeymessage = "key值为空！";
        this.addconfirmLoading = false;
        return;
      }
      if (this.addvalue === "") {
        this.addvaluemessage = "value值为空！";
        this.addconfirmLoading = false;
        return;
      }
      switch (this.usertypecode) {
        case 1000:
          this.addkey = "Brand-" + this.addkey;
          break;
        case 1001:
          this.addkey = "Series-" + this.addkey;
          break;
        case 1002:
          this.addkey = "Vehicle-" + this.addkey;
          break;
        case 1003:
          this.addkey = "Tag-" + this.addkey;
          break;
        case 1004:
          this.addkey = "Seats-" + this.addkey;
          break;
        case 1005:
          this.addkey = "Oil-" + this.addkey;
          break;
      }
      let params = {};
      if (this.editflag) {
        //编辑
        params = {
          id: this.id,
          key: this.addkey,
          value: this.addvalue
        };
        http.getDicUpdate(params).then(response => {
          if (response.data.code === 200) {
            this.$message.success(response.data.message);
            this.addconfirmLoading = false;
            this.addvisible = false;
            this.selectDicList();
          }
        });
      } else {
        // 新增之前先校验
        params = {
          key: this.addkey
        };
        http.getDicCheck(params).then(response => {
          if (response.data.data === true) {
            this.addconfirmLoading = false;
            this.$message.error("key已存在");
          } else {
            this.dictionaryAdd();
          }
        });
      }
    },
    // 新增字典
    dictionaryAdd() {
      let params = {
        typeCode: this.usertypecode,
        key: this.addkey,
        value: this.addvalue,
        price: this.userinputprice === "" ? 0 : parseFloat(this.userinputprice),
        parentId:
          this.secondusertypecode === "请选择" ? 0 : this.secondusertypecode,
        creator: Decrypt(window.localStorage.getItem("loginname"))
      };
      http.getDicAdd(params).then(response => {
        if (response.data.code === 200) {
          this.$message.success("添加成功");
          this.selectDicList();
          this.emptyAdd(); // 清空数据
        } else {
          this.$message.error("添加失败");
          this.addconfirmLoading = false;
        }
      });
    },
    // 取消新增对话框
    handleCancel(e) {
      this.emptyAdd();
    },
    // 清空数据
    emptyAdd() {
      this.userinputprice = "";
      this.addkeymessage = "";
      this.addvaluemessage = "";
      this.usertypecode = 1000;
      this.addkey = "";
      this.addvalue = "";
      this.addvisible = false;
      this.addconfirmLoading = false;
      this.secondusertypecode = "请选择";
    },
    // 抽取出来的获取数据列表方法
    async selectDicList() {
      const loading = this.$loading({
        lock: true,
        text: "加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let params = {};
      if (this.key === 9999) {
        params = { currentpage: this.pagination.current, limit: this.pagination.pageSize };
      } else {
        params = {
          currentpage: this.pagination.current,
          typeCode: this.key,
          limit: this.pagination.pageSize
        };
      }
      await http.getDicList(params).then(response => {
        if (response.data.code === 200) {
          const data = response.data.data.data;
          const total = response.data.data.total;
          this.data = data;
          this.pagination.total = total;
          setTimeout(() => {
            loading.close();
          }, 400);
        } else {
          this.$message.error("查询失败");
        }
      });
    }
  },
  mounted() {
    this.selectDicList();
  }
};
</script>
<style lang="less" scoped>
.headerrow {
  margin-bottom: 5px;
  padding: 10px 5px;
  border-radius: 5px;
  background: #fff;
  margin-left: 2px;
}
.editable-row-operations a {
  margin-right: 8px;
}
.add-span {
  display: inline-block;
  width: 80px;
  text-align: center;
  padding: 5px;
}
.add-input {
  width: 300px;
  height: 40px;
}
.add-div {
  margin: 35px 0 20px 35px;
  .errormsg {
    color: red;
    display: inline-block;
    margin-left: 100px;
  }
}
</style>