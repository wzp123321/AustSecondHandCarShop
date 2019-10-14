<template>
  <div class="clearfix">
    <div class="header-h1 bounceInLeft animated">二手车管理后台</div>
    <div class="userico fr">
      <span class="iconspan">
        <i class="iconfont icon-home" @click="todashboard"/>
      </span>
      <span class="iconspan">
        <a-badge :count="carcount">
          <i class="iconfont icon-chexiandingdan" @click="touncheckcar"/>
        </a-badge>
      </span>
      <span class="iconspan">
        <a-badge :count="ordercount">
          <i class="iconfont icon-dingdan1" @click="toorder"/>
        </a-badge>
      </span>
      <span>{{userName}}</span>
      <span size="small" @click="signout" class="last-col-span">
        <a-icon type="logout" style="font-size:16px;"/>退出账户
      </span>
    </div>
  </div>
</template>
<script>
import http from "@/assets/api/index.js";
import { Decrypt, Encrypt } from "../../../../static/js/utils.js";
import bus from "../../../../static/js/bus.js";

export default {
  data() {
    return {
      userName: Decrypt(window.localStorage.getItem("loginname")),
      carcount: window.localStorage.getItem("carcount") || 0,
      ordercount: 0
    };
  },
  methods: {
    signout() {
      //  删除存储在本地的登录标识符
      sessionStorage.removeItem("adminLogin");
      localStorage.removeItem("token");
      location.href = "/";
    },
    todashboard() {
      location.href = "/";
    },
    touncheckcar() {
      this.$router.push("/background/container/cars/uncheckcarslist");
    },
    toorder() {
      this.$router.push("/background/container/orders/finish");
    },
    getuncheckcarcount() {
      http
        .getCarsByStatus({
          status: 0
        })
        .then(response => {
          const carcount = response.data.data.total;
          this.carcount = carcount;
        });
    },
    getordercount() {
      http.getStatusPages({ status: 4 }).then(response => {
        const ordercount = response.data.data;
        this.ordercount = ordercount;
      });
    }
  },
  mounted() {
    this.getuncheckcarcount();
    this.getordercount();
  },
  created() {
    bus.$on("toheader", function(data)  {
      this.carcount = data;
    }.bind(this));
    bus.$on("toheaderorder", function(data) {
      this.ordercount = data;
    }.bind(this));
  }
};
</script>
<style lang="less">
.header-h1 {
  font-size: 50px;
  font-family: cursive;
  color: #fff;
  margin-top: 15px;
  display: inline-block;
}
.userico {
  margin-top: 15px;
  color: #fff;
  .iconspan {
    display: inline-block;
    margin: 0 20px;
    .iconfont{
font-size:23px;
    }
  }
  .iconspan:hover {
    cursor: pointer;
  }
}
.last-col-span:hover {
  cursor: pointer;
}
@media only screen and (max-width: 1440px) {
  .header-h1 {
  font-size: 42px;
}
}
</style>
