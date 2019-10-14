<template>
  <div style="width: 256px">
    <a-menu mode="inline" v-for="(item, index) in menuData" :key="index">
      <a-sub-menu v-if="item.subMenu && item.subMenu.length > 0" :key="index">
        <span slot="title">
          <i :class="`iconfont ${item.icon}`"/>
          {{ item.title }}
        </span>
        <a-menu-item v-for="(subItem, m) in item.subMenu" :key="`${index}_${m}`">
          {{ item.path }}
          <router-link :to="subItem.path ? subItem.path : ''">
            {{
            subItem.title
            }}
          </router-link>
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuData: [
        {
          title: "用户管理",
          icon: "icon-person",
          subMenu: [
            {
              title: "用户列表",
              path: "/background/container/users"
            }
          ]
        },
        {
          title: "字典管理",
          icon: "icon-zidian",
          subMenu: [
            {
              title: "字典列表",
              path: "/background/container/dics"
            }
          ]
        },
        {
          title: "车辆管理",
          icon: "icon-cheliangguanli",
          subMenu: [
            {
              title: "车辆列表",
              path: "/background/container/cars/carslist"
            }
          ]
        },
        {
          title: "订单管理",
          icon: "icon-dingdan",
          subMenu: [
            {
              title: "订单列表",
              path: "/background/container/orders/finish"
            }
          ]
        }
      ]
    };
  }
};
</script>