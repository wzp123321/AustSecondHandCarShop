<template>
  <div>
    <b-row>
      <b-col class="parentcol1 fadeInUp animated">
        <b-row>
          <span>
            <i class="iconfont icon-caidan" />快捷进入
          </span>
        </b-row>
        <b-row class="first-row">
          <b-col
            xl="4"
            v-for="(lie,index) in liebiaos"
            :key="index"
            :class="`liecol col${index+1}`"
          >
            <i :class="`iconfont ${lie.icon}`" />
            <span>
              <router-link :to="lie.path">{{lie.title}}</router-link>
            </span>
          </b-col>
        </b-row>
      </b-col>
      <b-col class="parentcol2 fadeInUp animated">
        <b-row>
          <span>
            <i class="iconfont icon-daiban" /> 待办事项
          </span>
        </b-row>
        <b-row class="first-row">
          <b-col xl="4" v-for="(d,index) in daiban" :key="index" class="third-span">
            {{d.title}}
            <span>
              <countTo
                :style="`color:${d.color};font-size:42px`"
                :startVal="startVal"
                :endVal="d.count"
                :duration="duration"
              ></countTo>
            </span>条
          </b-col>
        </b-row>
      </b-col>
      <b-col class="parentcol3 fadeInUp animated">
        <b-row>
          <span>
            <i class="iconfont icon-banben" /> 系统版本
          </span>
        </b-row>
        <b-row class="row1">
          <b-col class="banbencol" xl="4" v-for="(b,index) in banben" :key="index">
            <div>
              <i :class="`iconfont ${b.icon}`" />
            </div>
            <div>{{b.title}}</div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row style="margin-left:30px;margin-top:20px">
      <div>
        <!-- 折线图 -->
        <div id="chartmainline"></div>
      </div>
    </b-row>
  </div>
</template>
<script>
import countTo from "vue-count-to";
import bus from "../../../../static/js/bus.js";
import http from "@/assets/api/index.js";

import store from "@/store/index";
import { mapActions } from "vuex";
import { Decrypt } from "../../../../static/js/utils";
export default {
  components: { countTo },
  store,
  data() {
    return {
      liebiaos: [
        {
          icon: "icon-drxx10",
          path: "/background/container/users/userslist",
          title: "管理员列表"
        },
        {
          icon: "icon-shujuzidian",
          path: "/background/container/dics/dicslist",
          title: "字典列表"
        },
        {
          icon: "icon-6",
          path: "/background/container/orders/finish",
          title: "订单列表"
        },
        {
          icon: "icon-linshicheliangjinru",
          path: "/background/container/cars/carslist",
          title: "已审核车辆"
        },
        {
          icon: "icon-linshichelianglikai",
          path: "/background/container/cars/uncheckcarslist",
          title: "未审核车辆"
        }
      ],
      banben: [
        {
          icon: "icon-xitong",
          title: "拼夕夕二手车交易系统管理后台"
        },
        {
          icon: "icon-cunchushebei",
          title: "Github"
        },
        {
          icon: "icon-ren",
          title: "wzp"
        },
        {
          icon: "icon-banbenxinxi",
          title: "1.0.0.1"
        },
        {
          icon: "icon-weibiaoti103",
          title: "wanzhipengx@163.com"
        }
      ],
      daiban: [
        {
          title: "待实地看车",
          count: 0,
          color: "#06a5ff"
        },
        {
          title: "待买家付款",
          count: 0,
          color: "#28a745"
        },
        {
          title: "待卖家收款",
          count: 0,
          color: "#fd7e14"
        },
        {
          title: "待审核订单",
          count: 0,
          color: "#dc3545"
        },
        {
          title: "待审核车辆",
          count: 0,
          color: "#6f42c1"
        }
      ],
      // 需要滚动的时间
      duration: 3000,
      // 初始值
      startVal: 0,
      optionline: {
        title: {
          text: "二手车交易系统月平均人流量统计"
        },
        tooltip: {},
        legend: {
          data: ["用户来源"]
        },
        xAxis: {
          data: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月"
          ]
        },
        yAxis: {},
        series: [
          {
            name: "访问量",
            type: "line", //设置图表主题
            data: [200, 300, 360, 800, 500, 160, 360, 100, 500, 600, 360, 1300]
          }
        ]
      }
    };
  },
  methods: {
    ...mapActions(["setUserName"]),
    ...mapActions(["setPassWord"]),
    getuncheckcarcount() {
      http
        .getCarsByStatus({
          status: 0
        })
        .then(response => {
          const surecar = response.data.data.total;
          this.daiban[4].count = surecar;
        });
    },
    getstatusordercount(status) {
      http.getStatusPages({ status: status }).then(response => {
        const count = response.data.data;
        this.daiban[status - 1].count = count;
      });
    },
    drawLine: function() {
      //基于准本好的DOM，初始化echarts实例
      let chartmainline = this.$echarts.init(
        document.getElementById("chartmainline")
      );
      //绘制图表
      chartmainline.setOption(this.optionline);
    }
  },
  mounted() {
    this.setUserName(Decrypt(window.localStorage.getItem("username")));
    this.getuncheckcarcount();
    this.getstatusordercount(1);
    this.getstatusordercount(2);
    this.getstatusordercount(3);
    this.getstatusordercount(4);
    this.drawLine();
  },
  created() {
    bus.$on("toheader", data => {
      this.surecar = data;
    });
  }
};
</script>
<style lang="less" scoped>
.parentcol1,
.parentcol2,
.parentcol3 {
  background: #fff;
  border: 1px solid #bdbdbd;
  margin: 0 30px;
  border-radius: 5px;
  min-height: 277px;
}
.parentcol1:hover,
.parentcol2:hover,
.parentcol3:hover {
  box-shadow: 6px 6px 5px #d1d1d1;
}
.parentcol1 {
  .first-row {
    span {
      font-size: 14px;
    }
    .liecol {
      padding: 40px 30px;
      text-align: center;
      span {
        a {
          color: black;
        }
      }
    }
    .liecol:hover {
      border-radius: 5px;
      color: #fff;
      font-weight: 400;
    }
    .col1:hover {
      background: #06a5ff;
    }
    .col2:hover {
      background: #28a745;
    }
    .col3:hover {
      background: #fd7e14;
    }
    .col4:hover {
      background: #dc3545;
    }
    .col5:hover {
      background: #6f42c1;
    }
    .iconfont {
      font-size: 30px;
    }
  }
}
.parentcol2 {
  .first-row {
    .third-span {
      padding: 31px 16px;
      font-size: 15px;
      text-align: center;
    }
  }
}
.parentcol3 {
  .row1 {
    text-align: center;
    margin: 30px 0 0 50px;
    .iconfont {
      font-size: 24px;
    }
    div {
      font-size: 14px;
    }
    .banbencol {
      padding: 25px 0;
    }
  }
}
#chartmainline {
  width: 1200px;
  height: 400px;
}

@media only screen and (max-width: 1440px) {
  .parentcol1,
  .parentcol2,
  .parentcol3 {
    margin: 0 15px;
  }
}
.parentcol1 {
  .first-row {
    span {
      font-size: 12px;
    }
    .col {
      padding: 35px 12px;
    }
    .iconfont {
      font-size: 27px;
    }
  }
}
.parentcol2 {
  .first-row {
    .col {
      padding: 16px 17px;
      font-size: 12px;
    }
  }
}
.parentcol3 {
  .row1 {
    margin-top: 15px;
    margin: 30px 0 0 0;
    .iconfont {
      font-size: 24px;
    }
    div {
      font-size: 14px;
    }
  }
}
#chartmainline {
  width: 800px;
  height: 400px;
}
</style>

