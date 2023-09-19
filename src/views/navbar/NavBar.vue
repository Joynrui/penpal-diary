<template>
  <div class="header-container">
    <div class="l-content">
      <el-menu class="el-menu-demo clarity" mode="horizontal" :router="true">
        <!-- no children item -->
        <el-menu-item
          v-for="item in noChildren"
          :key="item.name"
          :index="item.path"
        >
          <span slot="title">{{ item.label }}</span>
        </el-menu-item>

        <!-- has children item -->
        <el-submenu
          v-for="item in hasChildren"
          :key="item.label"
          :index="item.label"
        >
          <template slot="title">
            <span slot="title">{{ item.label }}</span>
          </template>
          <el-menu-item-group
            v-for="subItem in item.children"
            :key="subItem.name"
          >
            <el-menu-item :index="subItem.name">{{
              subItem.label
            }}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </div>
    
    <div class="r-content">
      <el-button round>{{buttonData_1}}</el-button>
      <el-button  type="primary" round>{{buttonData_2}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuData: [
        {
          path: "/start",
          name: "start",
          label: "首页",
          url: "start",
        },
      ],
      buttonData_1: "登录",
      buttonData_2: "注册",
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
  computed: {
    // 没有子菜单
    noChildren() {
      return this.menuData.filter((item) => !item.children);
    },
    // 有子菜单
    hasChildren() {
      return this.menuData.filter((item) => item.children);
    },
  },
};
</script>

<style lang="less" scoped>
.header-container {
  border-bottom: 1px solid #e6e6e6;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;

  .clarity {
    background-color: rgba(0, 0, 0, 0);
  }
  .r-content {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .el-button {
      margin-right: 10px;
    }
  }
}

</style>