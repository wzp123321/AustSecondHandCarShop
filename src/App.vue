<template>
  <transition name="slide-left">
    <div id="app">
      <a-locale-provider :locale="locale">
        <router-view/>
      </a-locale-provider>
    </div>
  </transition>
</template>

<script>
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
export default {
  name: "App",
  data() {
    return {
      locale: zhCN
    };
  }
};
</script>

<style lang="less">
@import "../static/css/common.less";
#app {
  height: 100%;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.slide-right,
.slide-left {
  position: absolute;
  left: 0;
  right: 0;
}
.slide-left-enter-active {
  transition: all 0.4s ease;
}
.slide-left-leave-active {
  transition: all 0.2s cubic-bezier(2, 0.5, 0.8, 1);
}
.slide-left-enter {
  left: 0;
  right: 0;
  transform: translateX(300px);
  opacity: 0;
}
.slide-left-leave-to {
  left: 0;
  right: 0;
  opacity: 0;
}
.slide-right-enter-active {
  transition: all 0.2s ease;
}
.slide-right-leave-active {
  transform: translateX(300px);
  transition: all 0.3s ease-out;
}
.slide-right-enter {
  left: 0;
  right: 0;
  opacity: 0;
}
.slide-right-leave-to {
  left: 0;
  right: 0;
  opacity: 0;
}
</style>
