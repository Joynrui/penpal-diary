<template>
  <div class="header-container">
    <div class="l-content">
      <el-menu class="el-menu-demo clarity" mode="horizontal" :router="true">
        <!-- <el-menu-item>
          <img class="logo" src="@/assets/logo.png" alt="logo" />
        </el-menu-item> -->
        <!-- 不含子菜单 -->
        <el-menu-item
          v-for="item in noChildren"
          :key="item.name"
          :index="item.name"
        >
          <i :class="`el-icon-${item.icon}`"></i>
          <span slot="title">{{ item.label }}</span>
        </el-menu-item>
        <!-- 包含子菜单 -->
        <el-submenu
          v-for="item in hasChildren"
          :key="item.label"
          :index="item.label"
        >
          <template slot="title">
            <i :class="`el-icon-${item.icon}`"></i>
            <span slot="title">{{ item.label }}</span>
          </template>
          <!-- 二级子菜单 -->
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
      <el-dropdown>
        <span class="el-dropdown-link">
          <img
            class="user-head"
            src="@/assets/headpicture_saber.jpg"
            alt="myImage"
          />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuData: [
        {
          name: "diary",
          label: "日记",
          icon: "edit",
          children: [
            {
              path: "/diary-list",
              name: "diary-list",
              label: "日记列表",
              icon: "more",
            },
            {
              path: "/diary-edit",
              name: "diary-edit",
              label: "写日记",
              icon: "document",
            },
          ],
        },
        {
          name: "account",
          label: "账户管理",
          icon: "menu",
          children: [
            {
              path: "/account-info",
              name: "account-info",
              label: "账户信息",
              icon: "tickets",
            },
            {
              path: "/feedback",
              name: "feedback",
              label: "体验反馈",
              icon: "bell",
            },
          ],
        },
        {
          path: "/secretspot",
          name: "secretspot",
          label: "树洞空间",
          icon: "news",
        },
        {
          path: "/match",
          name: "match",
          label: "匹配",
          icon: "share",
        },
      ],
    };
  },
  methods: {
    async logout() {
      // 清除本地Cookie
      Cookie.remove("uid");
      Cookie.remove("token");
      Cookie.remove("userType");
      
      this.$router.push("/login");
      this.$message.success("退出成功");
    },

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
  .l-content {
    .logo {
      width: 230px;
    }
    .logo-padding {
      padding: 0px;
    }
    .clarity {
      background-color: rgba(0, 0, 0, 0);
    }
  }

  .r-content {
    .user-head {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    .el-dropdown {
      margin-right: 20px;
    }
  }
}
</style>