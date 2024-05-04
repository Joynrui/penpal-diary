<!--language: JavaScript-->
<template>
  <div class="loginprehandle-container">
    <div class="head-title">
      <span>账户登录</span>
    </div>

    <el-form v-model="form" :rules="rules">
      <el-radio-group v-model="form.loginUserType" size="mini">
        <!-- click在此处无效，必须使用click.native -->
        <el-radio-button label="user"></el-radio-button>
        <el-radio-button label="admin"></el-radio-button>
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
        <el-button type="primary" @click="loginPreHandle()">登录</el-button>
      </el-form-item>

      <el-form-item class="register">
        <el-button type="text" @click="pushToRegister"
          >没有账号？ 创建一个！</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Cookie from "js-cookie";
import axios from "axios";
import { AxiosResponse } from "axios";
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
     * 登录预处理
     */
    async loginPreHandle() {
      // 如果登录类型为user,则在登录前检查当前用户是否已经封禁
      if (this.form.loginUserType == "user") {
        console.log("用户类型为：", this.form.loginUserType);
        const checkRes = await axios.get(
          "/api/user/select-normal-user-by-user-name",
          {
            params: {
              normalUserName: this.form.loginUserName,
            },
          }
        );
        if (checkRes.data.status) {
          if (checkRes.data.data.normalUser.isBanned == "y") {
            this.$message.warning("该账户已封禁，无法登录，请联系管理员");
          }
          if (checkRes.data.data.normalUser.isBanned == "n") {
            //执行登录
            this.login();
          }
        }
        if (!checkRes.data.status) {
          this.$message.error("用户名不存在，请检查");
          console.log("用户名不存在，请检查");
        }
      }
      if (this.form.loginUserType == "admin") {
        console.log("用户类型为：", this.form.loginUserType);
        this.login();
      }
    },
    /**
     * 登录
     */
    async login() {
      let requestBody = {
        loginUserType: this.form.loginUserType,
        loginUserName: this.form.loginUserName,
        loginUserPassword: this.form.loginUserPassword,
      };
      let res = await axios.post("/api/login", requestBody);
      // 获取S端token
      let localToken = res.data.data.token;
      // 获取服务端用户类型
      let localUserType = res.data.data.userType;
      //获取服务端用户uid
      let localUid = res.data.data.uid;
      let localUserName;
      if (localUserType == "user") {
        localUserName = res.data.data.normalUserName;
      }
      if (localUserType == "admin") {
        localUserName = res.data.data.adminUserName;
      }
      // 获取服务响应状态
      let localStatus = res.data.status;
      if (localStatus === false) {
        // 登录失败，提示用户
        return this.$message.error("登录失败，请检查用户名和密码");
      } else {
        Cookie.set("token", localToken);
        Cookie.set("userType", localUserType);
        Cookie.set("uid", localUid);
        if (localUserType == "user") {
          Cookie.set("normalUserName", localUserName);
        }
        if (localUserType == "admin") {
          Cookie.set("adminUserName", localUserName);
        }
        // 判断登录身份，跳转至不同的主页
        if (requestBody.loginUserType === "user") {
          this.$message.success("普通用户登录成功");
          await this.$router.push("/user");
        } else {
          this.$message.success("管理员登录成功");
          await this.$router.push("/admin");
        }
      }
    },

    pushToRegister() {
      this.$router.push("/register");
    },
  },
};
</script>

<style lang="less" scoped>
.loginprehandle-container {
  width: 350px;
  border: 1px solid #eee;
  // set loginprehandle container in the center of the page
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