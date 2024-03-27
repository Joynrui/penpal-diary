<template>
  <div class="header-container">
    <div class="l-content">
      <el-menu class="el-menu-demo clarity" mode="horizontal" :router="true">
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
          <el-dropdown-item>退出登录</el-dropdown-item>
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
          name: "admin-account",
          label: "账户管理",
          icon: "menu",
          children: [
            {
              path: "/admin-account-info",
              name: "admin-account-info",
              label: "账户信息",
              icon: "tickets",
            },
            {
              path: "/feedback-handle",
              name: "feedback-handle",
              label: "反馈处理",
              icon: "bell",
            },
          ],
        },
        {
          name: "system-monitor",
          label: "系统监控",
          icon: "view",
          children: [
            {
                path: "/normal-user-manage",
                name:"normal-user-manage",
                label:"普通用户管理",
                icon: "sort",
            },
            {
              path: "/content-investigate",
              name: "content-investigate",
              label: "内容审查",
              icon: "circle-close-outline",
            },
            {
              path: "/monitor-log",
              name: "monitor-log",
              label: "监控日志",
              icon: "service",
            },
          ],
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