<template>
  <div>
    <el-container class="main-container">
      <el-header>
        <nav-bar></nav-bar>
      </el-header>
      <el-main>
        <div class="content">
          <div class="title">
            <span class="">Pen Pal Diary Platform</span>
          </div>
          <el-button
            class="startButton"
            @click="clickButton(buttonData)"
            type="primary"
            round
          >
            start~
          </el-button>
        </div>
      </el-main>
      <el-footer class="footer">
        <span>
          <i class="copyright">
            Copyright ©2023 CyberBase Corporation, All Rights Reserved.
          </i>
        </span>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import MainUserLayout from "../layout/MainUserLayout.vue";
import NavBar from "../navbar/NavBar.vue";
export default {
  data() {
    return {
      buttonData: {
        path: "/main",
        name: "main",
        label: "用户首页",
        url: "main",
      },
      startButtonDate:{}
    };
  },
  components: {
    MainUserLayout,
    NavBar,
  },
  methods: {
    clickButton(item) {
      console.log(item);
      this.$router.push(item.path);
    },
  },
};
</script>
<style lang="less" scoped>
.main-container {
  height: 100vh;
  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .title {
      margin-top: 10vh;
      font-size: xx-large;
    }
    .startButton {
      margin-top: 10vh;
    }
  }
  .el-footer {
    padding: 0;
  }
  .copyright {
    justify-content: center;
    display: flex;
    font-size: 12px;
  }
}
</style>
