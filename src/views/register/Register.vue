<template>
  <div class="register-container">
    <div class="head-title">
      <span>账户注册</span>
    </div>
    <!-- register form -->
    <el-form v-model="form" :rules="rules">
      <el-radio-group v-model="form.registerUserType" size="mini">
        <!-- click在此处无效，必须使用click.native -->
        <el-radio-button
          label="user"
        ></el-radio-button>
        <el-radio-button
          label="admin"
        ></el-radio-button>
      </el-radio-group>

      <el-form-item label="用户名" prop="registerUserName">
        <el-input
          v-model="form.registerUserName"
          placeholder="请输入您的用户名"
        ></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="registerUserAlias">
        <el-input
          v-model="form.registerUserAlias"
          placeholder="请输入您的昵称"
        ></el-input>
      </el-form-item>

      <!-- setting password -->
      <el-form-item label="密码" prop="registerUserPassword">
        <el-input
          type="password"
          v-model="form.registerUserPassword"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <!-- comfirm password -->
      <el-form-item label="确认密码" prop="registerUserComfirmPassword">
        <el-input
          type="password"
          v-model="registerUserComfirmPassword"
          placeholder="请确认密码"
        ></el-input>
      </el-form-item>
      <el-form-item class="submit">
        <el-button type="primary" @click="register">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 提交表单
      form: {
        registerUserName: "",
        registerUserAlias: "",
        registerUserPassword: "",
        registerUserType: "",
      },
      // 确认密码
      registerUserComfirmPassword: "",
      // 输入规则
      rules: {
        registerUserType: [
          { required: true, message: "请选择用户类型", trigger: "change" },
        ],
        registerUserName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        registerUserAlias: [
          { required: true, message: "请输入昵称", trigger: "blur" },
        ],
        registerUserPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
        ],
        registerUserComfirmPassword: [
          { required: true, message: "请确认密码", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    async register() {
      //请求数据对象
      const requestBody = {
        registerUserName: this.form.registerUserName,
        registerUserAlias: this.form.registerUserAlias,
        registerUserPassword: this.form.registerUserPassword,
        registerUserType: this.form.registerUserType,
      };
      //   // 表单验证
      //   try {
      //     // 使用vue的refs获取表单组件，调用validate方法进行验证
      //     await this.$refs.form.validate();
      //   } catch (error) {
      //     return console.log(error);
      //   }
      // 表单验证通过，发送请求
      try {
        // 验证密码是否一致
        if (requestBody.registerUserPassword !== this.registerUserComfirmPassword) {
          return this.$message.error("密码不一致");
        } else {
          // 发送注册请求
          let res = await this.$http.post("/api/register", requestBody);
          console.log(requestBody);
          //   // 注册成功，获取返回的token
          //   const token = response.data.data.token;
          //   // 将token存储到本地Cookie中
          //   Cookie.set("token", token);
          // 提示注册成功
          this.$message.success("注册成功");
          // 跳转到登录页面
          await this.$router.push("/login");
        }
      } catch (error) {
        return console.log(error);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.register-container {
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