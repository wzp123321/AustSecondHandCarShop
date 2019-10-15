<template>
  <div>
    <b-container>
      <b-col class="signindiv" xl="6" offset-xl="3">
        <div>
          <span class="signindiv-header">管理后台登录界面</span>
        </div>
        <p>
          <span class="login-span">用户名</span>
          <el-input v-model="username" placeholder="请输入用户名" class="logininput"></el-input>
        </p>
        <p>
          <span class="login-span">密码</span>
          <el-input v-model="password" type="password" placeholder="请输入密码" class="logininput"></el-input>
        </p>
        <div class="loginmessage">{{loginmessage}}</div>
        <div class="remember">
          <a-radio value="rememberPass" :checked="rememberPass" @click="RememberPassword">记住密码</a-radio>
        </div>
        <a-button class="login-btn" type="primary" @click="UserLogin">登录</a-button>
      </b-col>
    </b-container>
  </div>
</template>
<script>
import { Decrypt, Encrypt } from "../../../static/js/utils.js";
import http from "@/assets/api/index.js";
import qs from "qs";

import store from "@/store/index";
import {mapActions} from "vuex";

export default {
  store,
  data() {
    return {
      rememberPass: false,
      loginmessage: "",
      username: "",
      password: ""
    };
  },
  
  methods: {
    ...mapActions(['setUserName']),
    RememberPassword() {
      this.rememberPass = !this.rememberPass;
    },
    // 校验用户输入
    checkUserInput() {
      this.loginmessage = "";
      if (this.username === "") {
        this.loginmessage = "用户名为空！";
      }
      if (this.password === "") {
        this.loginmessage = "密码为空！";
      }
    },
    // 用户登录
    UserLogin() {
      this.checkUserInput();
      if (this.loginmessage === '') {
        const loading = this.$loading({
          lock: true,
          text: "加载中...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        http
          .getAdminLogin({
            username: this.username,
            password: this.password
          })
          .then(response => {
            if (response.data.code === 200) {
              setTimeout(() => {
                loading.close();
              }, 400);
              this.$message.success("登陆成功！");
              window.localStorage.setItem("loginname", Encrypt(this.username));
              window.localStorage.setItem(
                "token",
                "Bearer" + response.data.data.token
              );
              window.sessionStorage.setItem("adminLogin", true);
              if (this.rememberPass) {
                window.localStorage.setItem("username", Encrypt(this.username));
                window.localStorage.setItem("password", Encrypt(this.password));
              }
              location.href = "/";
            } else if (response.data.code === 403) {
              this.$message.error("权限不足!");
            } else {
              this.$message.error(response.data.message);
            }
          });
      }
    }
  },
  mounted() {
    if (localStorage.getItem("username")) {
      this.username = Decrypt(window.localStorage.getItem("username"));
      this.password = Decrypt(window.localStorage.getItem("password"));
    }
  }
};
</script>
<style lang="less" scoped>
.signindiv {
  margin-top: 150px;
  border: 1px solid #999;
  border-radius: 5px;
  div {
    .signindiv-header {
      font-size: 27px;
      text-align: center;
      display: inline-block;
      margin-left: 66px;
      padding: 22px 90px;
      border-bottom: 1px solid #aaa;
    }
  }
  .loginmessage {
    color: red;
    padding: 0 70px;
    text-align: left;
    margin-bottom: 15px;
  }
  p {
    .logininput {
      width: 300px;
    }
  }
}

.login-span {
  display: inline-block;
  width: 100px;
  text-align: center;
}
.signindiv > p {
  margin-top: 25px;
  padding: 5px 33px;
}
.remember {
  margin: 0 0 20px 72px;
}
.login-btn {
  margin: 10px 60px 30px 70px;
  width: 380px;
}
</style>
