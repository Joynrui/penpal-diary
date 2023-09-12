<template>
  <div>
    <el-container>
      <el-header>
        <UserNavBar></UserNavBar>
      </el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import UserNavBar from '../navbar/UserNavBar.vue';
export default {
    components:{
        UserNavBar,
    }
};
</script>

<style lang="less" scoped>
.el-header{
    padding: 0
}
</style>