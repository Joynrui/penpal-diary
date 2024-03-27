<template>
  <div>
    <el-container>
      <el-header>
        <NormalUserNavBar></NormalUserNavBar>
      </el-header>
        <router-view ></router-view>
    </el-container>
  </div>
</template>

<script>
import NormalUserNavBar from '../navbar/UserNavBar.vue';
export default {
    components:{
        NormalUserNavBar,
    }
};
</script>

<style lang="less" scoped>
.el-header{
    padding: 0
}
</style>