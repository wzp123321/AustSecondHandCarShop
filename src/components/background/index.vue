<template>
  <a-layout class="mainlayout">
    <a-layout-header class="header">
      <Header></Header>
    </a-layout-header>
    <a-layout class="maincontent">
      <a-layout-sider class="slide">
        <asidebar style></asidebar>
      </a-layout-sider>
      <a-layout-content class="content">
        <Container></Container>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import Header from "./appHeader/index.vue";
import Asidebar from "./appAside/index.vue";
import Container from "./appContainer/index.vue";
export default {
  components: {
    Header,
    Container,
    Asidebar
  }
};
</script>
<style lang="less" scoped>
.mainlayout {
  display: flex;
  flex-direction: column;
  height: 100%;
  .header {
    height: 100px;
    background: #252525;
  }
  .maincontent {
    flex: 1;
    height: 100%;
    .slide {
      height: 100%;
      background: #fff;
    }
    .content {
      margin-top: 20px;
    }
  }
}

.ant-layout-sider-dark {
  max-width: 256px !important;
  min-width: 256px !important;
  background: #fff !important;
}
</style>
