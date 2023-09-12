<template>
  <div class="header-container">
    <div class="l-content">
      <el-menu class="el-menu-demo clarity" mode="horizontal" :router="true"
      >
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
      <!-- <el-dropdown>
        <span class="el-dropdown-link">
          <img class="user-head"  src="@/assets/headpicture_saber.jpg" alt="myImage">
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuData: [
        {
          path: "/diary",
          name: "diary",
          label: "日记",
          url: "User/Diary",
        },
        {
          path: "/match",
          name: "match",
          label: "匹配",
          url: "User/Match",
        },
      ],
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
  background: linear-gradient(to right, rgb(255, 238, 240), rgb(229, 217, 255));
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .clarity {
    background-color: rgba(0, 0, 0, 0);
  }
  .r-content {
    .user-head {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }
}
</style>