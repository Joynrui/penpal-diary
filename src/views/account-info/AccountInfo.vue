<template>
  <div>
    <div class="content-area">
      <!-- card1：头像昵称card -->
      <el-card class="box-card card-content-layout">
        <img class="avatar content-item" :src="avatarUrl" alt="User Avatar" />
        <br />
        <!-- 此action请求地址不是axios请求 -->
        <!-- 用于请求图片,请求必须携带当前登录用户的uid与要上传的图片 -->
        <input
          class="content-item"
          type="file"
          name="file"
          @change="fileChange"
        />
        <br />
        <el-button class="content-item" type="primary" @click="submitAvatar"
          >上传头像</el-button
        >
      </el-card>

      <!-- card2: 个人信息card -->
      <el-card class="box-card">
        <div class="text">
          <span>用户id:</span>
          <el-input
            placeholder="用户id（不可更改）"
            v-model="input"
            :disabled="true"
          >
          </el-input>
        </div>
        <div class="text">
          <span>用户名:</span>
          <el-input
            placeholder="用户名（不可更改）"
            v-model="input"
            :disabled="true"
          >
          </el-input>
        </div>
        <div class="text">
          <span>密码:</span>
          <el-input placeholder="密码" v-model="input" :disabled="false">
          </el-input>
        </div>
        <div class="text">
          <span>昵称:</span>
          <el-input placeholder="昵称" v-model="input" :disabled="false">
          </el-input>
        </div>
        <div class="text">
          <span>性别:</span>
          <el-input placeholder="性别" v-model="input" :disabled="false">
          </el-input>
        </div>
        <div class="text">
          <span>年龄:</span>
          <el-input placeholder="年龄" v-model="input" :disabled="false">
          </el-input>
        </div>
        <div class="text">
          <span>邮箱:</span>
          <el-input placeholder="邮箱" v-model="input" :disabled="false">
          </el-input>
        </div>
        <div class="comfirm">
          <el-button type="success" plain>保存信息</el-button>
          <el-button type="info" plain @click="logout">退出登录</el-button>
          <el-button type="danger" plain @click="dialogVisible = true"
            >注销账户</el-button
          >
          <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose"
          >
            <span>确定注销账户信息吗</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button
                type="primary"
                @click="
                  deleteUser();
                  dialogVisible = false;
                "
                >确 定</el-button
              >
            </span>
          </el-dialog>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Cookie from "js-cookie";

let _fileObj;
export default {
  data() {
    return {
      // 默认头像URL：如果请求头像失败，则显示默认头像
      avatarUrl:
        "https://cyberbase-diary-platform.oss-cn-chengdu.aliyuncs.com/headpicture_saber.jpg",
      input: "",
      dialogVisible: false,
    };
  },
  methods: {
    async fileChange(e) {
      let file = e.target.files[0];
      _fileObj = file;
    },
    /**
     * 上传用户头像
     */
    async submitAvatar() {
      // 将头像文件上传到ALiyunOSS
      // 创建FormData对象
      let _formData = new FormData();
      // 发起后端请求：调用AliunOSS接口上传头像
      // 请求字段名必须与请求属性参数保持一致
      _formData.append("uid", Cookie.get("uid"));
      _formData.append("normalUserAvatar", _fileObj);
      try {
        const res = await axios.post("/api/user/update-user-avatar", _formData);
        // 当请求成功后，发送read请求，更新显示头像的url
        if (res.data.status) {
          const res = await axios.get("/api/user/read-user-avatar", {
            params: { uid: Cookie.get("uid") },
          });
          if (res.data.status) {
            this.avatarUrl = res.data.data.avatar.normalUserAvatarFileFullName;
            console.log("头像读取成功");
          } else {
            console.log("头像读取失败");
          }
        } else {
          console.log("头像上传失败");
        }
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },

    async deleteUser() {
      try {
        const uid = Cookie.get("uid");
        const res = await axios.delete("/api/user/delete-user", {
          data: { uid },
        });
        console.log(res);
        if (res.data.status) {
          // 清除cookie中的所有信息
          Cookie.remove("uid");
          Cookie.remove("token");
          Cookie.remove("userType");
          if (Cookie.get("normalUserName")) {
            Cookie.remove("normalUserName");
          }
          if (Cookie.get("adminUserName")) {
            Cookie.remove("adminUserName");
          }
          if (Cookie.get("matchNormalUserName")) {
            Cookie.remove("matchNormalUserName");
          }
          if (Cookie.get("matchedNormalUserUid")) {
            Cookie.remove("matchedNormalUserUid");
          }
          // 重定向到登录页
          this.$router.push("/login");
          this.$message.success("账号已成功注销,请重新登录");
          console.log("账号已成功注销，请重新登录");
        } else {
          // 处理失败逻辑
          this.$message.error("注销失败，请稍后再试");
          console.log("注销失败，请稍后再试");
        }
      } catch (error) {
        console.error(error);
        console.log("发生错误，请联系管理员");
        this.$message.error("发生错误，请联系管理员");
      }
    },

    /**
     * 退出登录
     */
    async logout() {
      Cookie.remove("uid");
      Cookie.remove("token");
      Cookie.remove("userType");
      if (Cookie.get("normalUserName")) {
        Cookie.remove("normalUserName");
      }
      if (Cookie.get("adminUserName")) {
        Cookie.remove("adminUserName");
      }
      if (Cookie.get("matchNormalUserName")) {
        Cookie.remove("matchNormalUserName");
      }
      if (Cookie.get("matchedNormalUserUid")) {
        Cookie.remove("matchedNormalUserUid");
      }
      this.$message.success("退出成功");
      this.$router.push("/login");
    },
    /**
     * 注销账号提示框
     */
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.content-area {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .card-content-layout {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 50%;
    height: 50%;
    // 项目竖向间隔20px
    .content-item {
      margin-bottom: 20px;
    }
  }
  .box-card {
    width: 480px;
    margin: 20px;
  }
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .upload-avatar {
    margin-top: 20px;
  }

  .text {
    font-size: 14px;
    padding: 18px 0;
    display: flex;
    flex-direction: row;
  }
  .comfirm {
    // 将内容放置在行中央，上下保持20px
    display: flex;
    justify-content: center;
    margin-top: 20px;
    margin-bottom: 20px;
  }
}
</style>
