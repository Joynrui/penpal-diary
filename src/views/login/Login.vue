<template>
  <el-form class="login-container" v-model="form" :rules="rules">
    <div class="head-title">
      <span>账户登录</span>
    </div>

    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username" placeholder="请输入账号"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input
        type="password"
        v-model="form.password"
        placeholder="请输入密码"
      ></el-input>
    </el-form-item>
    <el-form-item class="submit">
      <el-button type="primary">登录</el-button>
    </el-form-item>
    <el-form-item class="register">
      <el-button type="text">没有账号？ 创建一个！</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    // submit() {
    //   // token
    //   const token = Mock.Random.guid();
    //   // token信息存入Cookie用于不同页面的登录验证
    //   Cookie.set("token", token);

    //   // 模拟登录成功
    //   this.$router.push("/home");
    // },
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