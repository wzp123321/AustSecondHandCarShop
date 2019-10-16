<template>
  <a-form :form="form" class="login-form" @submit="handleSubmit">
    <a-form-item>
      <span class="signin-header">管理后台登录界面</span>
    </a-form-item>
    <a-form-item>
      <a-input
        v-decorator="[
          'userName',
          { rules: [{ required: true, message: '请输入用户名!' }] },
        ]"
        placeholder="请输入用户名"
      >
        <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input
        v-decorator="[
          'password',
          { rules: [{ required: true, message: '请输入密码!' }] },
        ]"
        type="password"
        placeholder="请输入密码"
      >
        <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
      </a-input>
    </a-form-item>
    <a-form-item style="text-align:left">
      <a-checkbox :checked="rememberpwd" @click="()=>{rememberpwd= !rememberpwd}">记住密码</a-checkbox>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit" class="login-form-button">登录</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import { Decrypt, Encrypt } from "../../../static/js/utils.js";
import http from "@/assets/api/index.js";

import store from "@/store/index";
import { mapActions } from "vuex";

import { Form, Input, Button, Icon } from "ant-design-vue";

export default {
  store,
  components: {
    "a-form": Form,
    "a-form-item": Form.Item,
    "a-input": Input,
    "a-button": Button,
    "a-icon": Icon
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  data() {
    return {
      rememberpwd: false
    };
  },

  methods: {
    ...mapActions(["setUserName","setPassWord"]),
    // 登录表单提交
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.getUserLogin(values.userName, values.password);
        }
      });
    },
    // 用户登录
    async getUserLogin(username, password) {
      const res = await http.getAdminLogin({
        username,
        password
      });
      console.log("res", res);
      if (res && res.data.code === 200) {
        this.$message.success("登陆成功！");
        window.localStorage.setItem("loginname", Encrypt(username));
        window.localStorage.setItem("token", "Bearer" + res.data.data.token);
        this.setUserName(Encrypt(username));
        this.setPassWord(Encrypt(password));
        window.sessionStorage.setItem("adminLogin", true);
        if (this.rememberpwd) {
          window.localStorage.setItem("username", Encrypt(username));
          window.localStorage.setItem("password", Encrypt(password));
        }
        this.$router.push("/");
      } else if (res.data.code === 403) {
        this.$message.error("权限不足!");
      } else {
        this.$message.error(res.data.message);
      }
    }
  },
  mounted() {
    const userName = Decrypt(window.localStorage.getItem("username") || "");
    const password = Decrypt(window.localStorage.getItem("password") || "");
    this.form.setFieldsValue({ userName: userName, password: password });
  }
};
</script>
<style lang="less" scoped>
.login-form {
  width: 570px;
  margin: 0 auto;
  padding: 20px 100px 50px 100px;
  border: 1px solid #999;
  border-radius: 5px;
  text-align: center;
  .signin-header {
    font-size: 27px;
    border-bottom: 1px solid #aaa;
    display: inline-block;
    width: 100%;
    padding-bottom: 10px;
  }
  .login-form-button {
    width: 100%;
  }
}
</style>
