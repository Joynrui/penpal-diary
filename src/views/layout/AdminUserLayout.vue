<template>
  <div>
    <el-container>
      <el-header>
        <AdminUserNavBar></AdminUserNavBar>
      </el-header>
        <router-view></router-view>
    </el-container>
  </div>
</template>

<script>
import AdminUserNavBar from '../navbar/AdminUserNavBar.vue';
export default {
    components:{
        AdminUserNavBar,
    }
};
</script>

<style lang="less" scoped>
.el-header{
    padding: 0
}
</style>