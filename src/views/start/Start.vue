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
            Start ~
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
import Cookie from "js-cookie";
export default {
  data() {
    return {
      buttonData: {
        path: "/main",
        name: "main",
        label: "用户首页",
        url: "main",
      },
      startButtonDate: {},
    };
  },
  components: {
    MainUserLayout,
    NavBar,
  },
  methods: {
    async clickButton(item) {
      console.log(item);
      // 跳转之前先检查本地是否有有效token
      // 如果没有有效token，则跳转到登录页面
      // 如果有有效token，则跳转到用户首页

      if (Cookie.get("token") == null) {
        this.$message.error("没有令牌，请先登录");
        console.log("本地没有token,请登录");
        this.$router.push("/login");
        return;
      } else {
        this.$message.success("本地有令牌,无需登录");
        console.log("本地有token");

        // token有效则跳转到用户首页，无效则跳转到登录页面
        const localToken = Cookie.get("token");
        console.log("本地token获取成功,token为: " + localToken);
        // 请求后端token，验证使用
        let res = await this.$http.post("/parse-token", localToken);

        if (res.data.status == false) {
          // token无效,跳转登录
          this.$message.error("本地token无效,跳转登录");
          console.log("本地token无效,跳转登录");
          this.$router.push("/login");
          return;
        }
        // token有效, 跳转到用户首页
        this.$message.success("本地token有效,直接跳转");
        console.log("本地token有效,跳转到用户首页");
        this.$router.push(item.path);
        return;
      }
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
