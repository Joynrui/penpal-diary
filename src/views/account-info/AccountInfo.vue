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
        <el-button
          class="content-item"
          type="primary"
          plain
          @click="submitAvatar()"
          >上传头像</el-button
        >
      </el-card>
      <!-- card2: 个人信息card -->
      <el-card class="box-card">
        <div class="text-line">
          <span>用户id:</span>
          <el-input :placeholder="uid" v-model="uid" :disabled="true">
          </el-input>
        </div>
        <div class="text-line">
          <span>用户名:</span>
          <el-input
            :placeholder="normalUserName"
            v-model="normalUserName"
            :disabled="true"
          >
          </el-input>
        </div>
        <div class="text-line">
          <span>昵称:</span>
          <el-input
            :placeholder="normalUserAlias"
            v-model="normalUserAlias"
            :disabled="false"
          >
          </el-input>
        </div>
        <div class="text-line">
          <span>性别:</span>
          <el-select
            v-model="normalUserGender"
            clearable
            :placeholder="normalUserGender"
          >
            <el-option
              v-for="item in genderOptions"
              :key="item.normalUserGender"
              :label="item.label"
              :value="item.normalUserGender"
            >
            </el-option>
          </el-select>
        </div>
        <div class="text-line">
          <span>年龄:</span>
          <el-input
            :placeholder="normalUserAge"
            v-model="normalUserAge"
            :disabled="false"
          >
          </el-input>
        </div>
        <div class="text-line">
          <span>邮箱:</span>
          <el-input
            :placeholder="normalUserEmail"
            v-model="normalUserEmail"
            :disabled="false"
          >
          </el-input>
        </div>
        <!-- 确认按钮 -->
        <div class="confirm">
          <el-button type="success" plain @click="submit()">保存信息</el-button>
          <el-button
            type="primary"
            plain
            @click="modifyPasswordDialogVisible = true"
            >修改密码</el-button
          >
          <el-button type="info" plain @click="logout">退出登录</el-button>
          <el-button type="danger" plain @click="dialogVisible = true"
            >注销账户</el-button
          >
          <!-- 注销账号对话框 -->
          <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose"
          >
            <span>确定注销账户信息吗</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button
                type="primary"
                @click="
                  deleteUser();
                  dialogVisible = false;
                "
                >确定</el-button
              >
            </span>
          </el-dialog>
          <!-- 修改密码对话框 -->
          <el-dialog
            title="修改密码"
            :visible.sync="modifyPasswordDialogVisible"
            width="30%"
          >
            <div class="text-line">
              <span>原始密码：</span>
              <el-input
                v-model="normalUserOriginPassword"
                placeholder="请输入原始密码"
              ></el-input>
            </div>
            <div class="text-line">
              <span>新密码：</span>
              <el-input
                v-model="normalUserNewPassword"
                placeholder="请输入新密码"
              ></el-input>
            </div>
            <div class="text-line">
              <span>确认密码：</span>
              <el-input
                v-model="normalUserconfirmPassword"
                placeholder="请输入确认密码"
              ></el-input>
            </div>
            <div class="confirm">
              <el-button @click="modifyPasswordDialogVisible = false"
                >取消</el-button
              >
              <el-button
                type="primary"
                @click="
                  updatePassword();
                  modifyPasswordDialogVisible = false;
                "
                >确定</el-button
              >
            </div>
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
      // 用户uid
      uid: "",
      // 用户名
      normalUserName: "",
      // 昵称
      normalUserAlias: "",
      // 性别属性
      normalUserGender: "",
      // 性别选项
      genderOptions: [
        {
          normalUserGender: "male",
          label: "男",
        },
        {
          normalUserGender: "female",
          label: "女",
        },
        {
          normalUserGender: "unknown",
          label: "秘密",
        },
      ],
      // 年龄
      normalUserAge: "",
      // 邮箱
      normalUserEmail: "",
      // 对话框显示
      dialogVisible: false,
      // 修改密码对话框
      modifyPasswordDialogVisible: false,
      // 原始密码
      normalUserOriginPassword: "",
      // 更改的新密码
      normalUserNewPassword: "",
      // 确认密码
      normalUserconfirmPassword: "",
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
     * 保存信息
     */
    async submit() {
      let submitBody = {
        uid: this.uid,
        normalUserAlias: this.normalUserAlias,
        normalUserGender: this.normalUserGender,
        normalUserAge: this.normalUserAge,
        normalUserEmail: this.normalUserEmail,
      };
      const submitRes = await axios.put("/api/user/update-user", submitBody);

      if (submitRes.data.status) {
        console.log(submitRes.data.message);
        this.$message.success(submitRes.data.message);
      } else {
        console.log(submitRes.data.message);
        this.$message.success(submitRes.data.message);
      }
    },
    /**
     * 修改密码
     */
    async updatePassword() {
      // 检查原始密码是否正确
      const checkPasswordRes = await axios.get(
        "/api/user/select-normal-user-by-user-name",
        {
          params: {
            normalUserName: Cookie.get("normalUserName"),
          },
        }
      );
      if (checkPasswordRes.data.status) {
        // 如果原始密码正确，则开始记录新密码
        if (
          this.normalUserOriginPassword ==
          checkPasswordRes.data.data.normalUser.normalUserPassword
        ) {
          // 确认密码和新密码相等，则发送更新请求
          if (this.normalUserconfirmPassword == this.normalUserNewPassword) {
            const updateRes = await axios.put("/api/user/update-user", {
              uid: Cookie.get("uid"),
              normalUserPassword: this.normalUserNewPassword,
            });
            if (updateRes.data.status) {
              console.log("密码修改成功");
              this.$message.success("密码修改成功");
            } else {
              console.log("密码修改失败");
              this.$message.success("密码修改失败");
            }
          } else {
            console.log("新密码与确认密码不同，请检查");
            this.$message.error("新密码与确认密码不同，请检查");
          }
        } else {
          console.log("原始密码不正确，请检查");
          this.$message.error("原始密码不正确，请检查");
        }
      }
      if (!checkPasswordRes.data.status) {
        console.log("请求错误");
        this.$message.error("请求错误");
      }

      // 若相等则向数据库发送更新请求
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
    /**
     * 获取用户的个人信息
     */
    async getNormalUserInfo() {
      // 从Cookie中获取用户的uid，用户名
      this.uid = Cookie.get("uid");
      this.normalUserName = Cookie.get("normalUserName");

      //发起请求获取用户的其他信息
      const getInfoRes = await axios.get(
        "/api/user/select-normal-user-by-user-name",
        {
          params: {
            normalUserName: Cookie.get("normalUserName"),
          },
        }
      );
      if (getInfoRes.data.status) {
        this.normalUserAlias = getInfoRes.data.data.normalUser.normalUserAlias;
        this.normalUserGender =
          getInfoRes.data.data.normalUser.normalUserGender;
        this.normalUserAge = getInfoRes.data.data.normalUser.normalUserAge;
        this.normalUserEmail = getInfoRes.data.data.normalUser.normalUserEmail;
        // 如果用户自定义头像存在，则渲染
        if (
          getInfoRes.data.data.normalUser.normalUserAvatarFileFullName != null
        ) {
          this.avatarUrl =
            getInfoRes.data.data.normalUser.normalUserAvatarFileFullName;
        }

        // const avatarRes = await axios.get("/api/user/read-user-avatar", {
        //   params: { uid: Cookie.get("uid") },
        // });
        // if (avatarRes.data.status) {
        //   this.avatarUrl = avatarRes.data.data.avatar.normalUserAvatarFileFullName;
        // } else {
        //   console.log("头像读取失败");
        // }
        console.log("用户信息获取成功");
      } else {
        console.log("用户信息获取失败");
      }
    },
  },
  mounted() {
    this.getNormalUserInfo();
  },
  created() {},
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
    // justify-content: center;
    align-items: center;
    flex-direction: column;
    // width: 50%;
    height: 500px;
    padding-top: 80px;
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
    width: 250px;
    height: 250px;
    border-radius: 50%;
  }
  .upload-avatar {
    margin-top: 20px;
  }

  .text-line {
    font-size: 14px;
    padding: 18px 0;
    display: flex;
    flex-direction: row;
  }
  .confirm {
    // 将内容放置在行中央，上下保持20px
    display: flex;
    justify-content: center;
    margin-top: 20px;
    margin-bottom: 20px;
  }
}
</style>
