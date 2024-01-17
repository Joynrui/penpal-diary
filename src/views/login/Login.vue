<!--language: JavaScript-->
<template>
  <div class="login-container">
    <div class="head-title">
      <span>账户登录</span>
    </div>

    <el-form v-model="form" :rules="rules">
      <el-radio-group v-model="form.loginUserType" size="mini">
        <!-- click在此处无效，必须使用click.native -->
        <el-radio-button
          label="user"
        ></el-radio-button>
        <el-radio-button
          label="admin"
        ></el-radio-button>
      </el-radio-group>

      <el-form-item label="用户名" prop="loginUserName">
        <el-input
          v-model="form.loginUserName"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="loginUserPassword">
        <el-input
          type="password"
          v-model="form.loginUserPassword"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>

      <el-form-item class="submit">
        <el-button type="primary" @click="login">登录</el-button>
      </el-form-item>

      <el-form-item class="register">
        <el-button type="text">没有账号？ 创建一个！</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Cookie from "js-cookie";
export default {
  data() {
    return {
      // 表单数据
      form: {
        // 用户类型
        loginUserType: "",
        loginUserName: "",
        loginUserPassword: "",
      },
      rules: {
        loginUserType: [
          { required: true, message: "请选择用户类型", trigger: "change" },
        ],
        loginUserName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        loginUserPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    /**
     * async login() 是一个JavaScript方法，它使用了async关键字，表示该方法是一个异步函数。
     * 异步函数允许在函数内部使用await关键字来等待异步操作的完成，而不会阻塞后续的代码执行。
     * async login() 是用于处理用户登录操作的方法。它被标记为异步，因为通常用户
     * 登录操作涉及到网络请求或其他可能需要一些时间来完成的异步操作，如发送HTTP请求并等待响应。
     * 当你在一个异步函数中使用await关键字来等待某个异步操作的完成时，JavaScript会在等待的同时
     * 允许其他代码继续执行，这可以提高应用的响应性。在你的情况下，async login() 方法用于发送
     * 登录请求到后端API，并等待响应。当响应返回后，你可以在try块中处理成功的情况，或者在catch块
     * 中处理可能出现的错误情况。这样，你的应用可以在等待登录请求完成时继续响应用户的操作，而不会
     * 阻塞整个应用。
     */
    async login() {
      try {
        // Combine loginUserType and form data into a single object 将用户类型和表单数据合并为一个对象
        const requestBody = {
          loginUserType: this.loginUserType,
          loginUserName: this.form.loginUserName,
          loginUserPassword: this.form.loginUserPassword,
        };

        // Send a POST request to the backend API 向后端发送登录请求
        const response = await this.$http.post("/api/login", requestBody);
        console.log(requestBody);
        // Extract the token from the response 提取响应中的令牌
        const token = response.data.data.token;
        // Extract the token from the response and store it in a cookie
        Cookie.set("token", token);
        console.log(token);


      } catch (error) {
        // Handle any errors that occur during the request
        console.error(error);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  width: 350px;
  border: 1px solid #eee;
  // set login container in the center of the page
  margin: 10% auto;
  padding: 30px 30px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 0 10px #eee;
  .head-title {
    display: flex;
    justify-content: center;
    font-weight: bold;
  }
  .submit {
    display: flex;
    justify-content: center;
  }
  .register {
    display: flex;
    justify-content: right;
  }
}
</style>