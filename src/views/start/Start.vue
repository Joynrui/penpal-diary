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
            @click="clickButton()"
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
import NormalUserLayout from "../layout/NormalUserLayout.vue";
import NavBar from "../navbar/NavBar.vue";
import Cookie from "js-cookie";
export default {
  data() {
    return {
      startButtonDate: {
        name: "main",
        label: "用户首页",
        children: [
          {
            path: "/user",
            name: "user",
            label: "普通用户首页",
          },
          {
            path: "/admin",
            name: "admin",
            label: "管理员首页",
          },
        ],
      },
    };
  },
  components: {
    NormalUserLayout,
    NavBar,
  },
  methods: {
    async clickButton() {
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
          console.log("本地token无效,跳转登录");
          this.$router.push("/login");
          return;
        }
        Cookie.set("userType", res.data.data.userType);
        // token有效, 读取cookie用户类型，若为管理员则跳转到管理员首页,否则跳转到普通用户首页
        let userType = Cookie.get("userType");
        console.log("本地cookie用户类型为: " + userType);
        if (userType == "admin") {
          // 挑战至管理员首页
          this.$message.success("本地token有效,跳转到管理员首页");
          console.log("本地token有效,跳转到管理员首页");
          this.$router.push("/admin");
        } else {
          this.$message.success("本地token有效,跳转到用户首页");
          console.log("本地token有效,跳转到用户首页");
          this.$router.push("/user");
        }
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
