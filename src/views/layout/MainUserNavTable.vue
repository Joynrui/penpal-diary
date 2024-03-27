<template>
  <div>
    <el-radio-group v-model="isCollapse" style="margin-bottom: 5px">
      <el-radio-button :label="false">展开</el-radio-button>
      <el-radio-button :label="true">收起</el-radio-button>
    </el-radio-group>
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
    >
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-edit"></i>
          <span slot="title">日记</span>
        </template>
        <el-menu-item index="1-1" @click="pushToDiaryList">{{
          submenuDiaryData.label
        }}</el-menu-item>
        <el-menu-item index="1-2">{{
          submenuEidtDiaryData.label
        }}</el-menu-item>
      </el-submenu>

      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span slot="title">账户管理</span>
        </template>
        <el-menu-item index="2-1">账户信息</el-menu-item>
        <el-menu-item index="2-2">体验反馈</el-menu-item>
      </el-submenu>


      <!-- <el-menu-item index="3">
        <i class="el-icon-document"></i>
        <span slot="title">导航三</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span slot="title">导航四</span>
      </el-menu-item> -->
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: true,
      submenuDiaryData: {
        path: "user/diary-list",
        name: "diary",
        label: "日记列表",
      },
      submenuEidtDiaryData: {
        path: "user/diary-edit",
        name: "diary-edit",
        label: "写日记",
      },
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    pushToDiaryList() {
      this.$router.push("/diary-list");
    },
  },
};
</script>

<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.diary-span {
  margin-right: 5px;
}
</style>