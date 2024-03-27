<template>
  <div>
    <el-container>
      <el-aside width="215px" class=".el-aside">
        <router-view></router-view>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.el-aside{
  height: 100vh;
}
</style>