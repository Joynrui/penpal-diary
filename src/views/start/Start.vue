<template>
  <div>
    <el-container>
      <el-header> </el-header>
      <el-main>
        <h1>Pen Pal Diary Platform</h1>
        <el-button class="" @click="clickButton(buttonData)" type="primary" round
          >start~</el-button
        >
        <router-view></router-view>
      </el-main>
      <el-footer>
        <div>
          <i>Copyright ©2023 CyberBase Corporation, All Rights Reserved.</i>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import MainUserLayout from "../layout/MainUserLayout.vue";
export default {
  data() {
    return {
      buttonData: {
        path: "/Main",
        name: "main",
        label: "用户首页",
        url: "Main",
      },
    };
  },
  components: {
    MainUserLayout,
  },
  methods: {
    clickButton(item) {
      console.log(item)
      this.$router.push(item.path);
    },
  },
};
</script>

<style>
</style>