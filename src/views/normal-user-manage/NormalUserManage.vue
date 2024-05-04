<template>
  <div>
    <!-- 普通用户列表 -->
    <el-table
      :data="
        normalUserDatas.filter(
          (data) =>
            !searchUser ||
            data.normalUserName.toLowerCase().includes(searchUser.toLowerCase())
        )
      "
      height="668"
      style="width: 100%"
    >
      <el-table-column prop="uid" label="uid"> </el-table-column>
      <el-table-column prop="uuid" label="uuid"> </el-table-column>
      <el-table-column prop="normalUserName" label="用户名"> </el-table-column>
      <el-table-column prop="normalUserPassword" label="密码">
      </el-table-column>
      <el-table-column prop="normalUserAlias" label="昵称"> </el-table-column>
      <el-table-column prop="normalUserGender" label="性别"> </el-table-column>
      <el-table-column prop="normalUserAge" label="年龄"> </el-table-column>
      <el-table-column prop="normalUserEmail" label="邮箱"> </el-table-column>
      <el-table-column prop="normalUserMatchingStatus" label="匹配状态">
      </el-table-column>
      <el-table-column prop="normalUserAvatarFileFullName" label="头像">
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column fixed="right" width="230">
        <!-- scope属性用于输入内容 -->
        <template slot="header" slot-scope="scope">
          <div class="header-bar">
            <el-input
              v-model="searchUser"
              size="mini"
              placeholder="搜索用户名"
            />
            <!-- 添加新用户 -->
            <el-button
              size="mini"
              type="success"
              @click="addDialogVisible = true"
              plain
              >+</el-button
            >
          </div>
        </template>
        <template slot-scope="scope">
          <div class="operate-button">
            <!-- scope.row:次参数名称不可改变 -->
            <el-button
              size="mini"
              type="primary"
              @click="
                updateDialogVisible = true;
                openUpdateDialog(scope.row);
              "
              >修改</el-button
            >
            <!-- 如果账户未封禁则显示封禁按钮,否则显示解封按钮 -->
            <el-button
              v-if="scope.row.isBanned == 'n'"
              size="mini"
              type="warning"
              @click="banUser(scope.row)"
              >封禁</el-button
            >
            <el-button
              v-else
              size="mini"
              type="warning"
              @click="unbanUser(scope.row)"
              >解封</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="
                deleteDialogVisible = true;
                openDeleteDialog(scope.row);
              "
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加新用户 -->
    <el-dialog title="添加新用户" :visible.sync="addDialogVisible" width="30%">
      <el-form :model="addUserItem" label-width="80px">
        <el-form-item label="用户名">
          <el-input
            v-model="addUserItem.normalUserName"
            placeholder="输入用户名"
            :disabled="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="addUserItem.normalUserPassword"
            placeholder="输入密码"
            :disabled="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input
            v-model="addUserItem.normalUserAlias"
            placeholder="输入昵称"
            :disabled="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select
            v-model="addUserItem.normalUserGender"
            clearable
            placeholder="选择性别"
          >
            <el-option
              v-for="item in genderOptions"
              :key="item.normalUserGender"
              :label="item.label"
              :value="item.normalUserGender"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input
            v-model="addUserItem.normalUserAge"
            placeholder="输入年龄"
            :disabled="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input
            v-model="addUserItem.normalUserEmail"
            placeholder="输入邮箱"
            :disabled="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-input
            v-model="addUserItem.normalUserAvatarFileFullName"
            placeholder="输入头像URL"
            :disabled="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="匹配状态">
          <el-select
            v-model="addUserItem.normalUserMatchingStatus"
            clearable
            placeholder="选择匹配状态"
          >
            <el-option
              v-for="item in matchOptions"
              :key="item.normalUserMatchingStatus"
              :label="item.label"
              :value="item.normalUserMatchingStatus"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- 取消按钮 -->
        <el-button plain type="primary" @click="addDialogVisible = false"
          >取消</el-button
        >
        <!-- 确认按钮 -->
        <el-button
          plain
          type="success"
          @click="
            addDialogVisible = false;
            addUser();
          "
          >确认</el-button
        >
      </div>
    </el-dialog>
    <!-- 修改用户信息 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="updateDialogVisible"
      width="30%"
    >
      <el-form :model="updateUserItem" label-width="80px">
        <el-form-item label="用户id">
          <el-input
            v-model="updateUserItem.uid"
            :placeholder="updateUserItem.uid"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input
            v-model="updateUserItem.normalUserName"
            :disabled="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="updateUserItem.normalUserPassword"
            placeholder="输入密码"
            :disabled="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input
            v-model="updateUserItem.normalUserAlias"
            :disabled="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select
            v-model="updateUserItem.normalUserGender"
            clearable
            :placeholder="updateUserItem.normalUserGender"
          >
            <el-option
              v-for="item in genderOptions"
              :key="item.normalUserGender"
              :label="item.label"
              :value="item.normalUserGender"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input
            v-model="updateUserItem.normalUserAge"
            :disabled="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input
            v-model="updateUserItem.normalUserEmail"
            :disabled="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-input
            v-model="updateUserItem.normalUserAvatarFileFullName"
            :disabled="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="匹配状态">
          <el-select
            v-model="addUserItem.normalUserMatchingStatus"
            clearable
            placeholder="选择匹配状态"
          >
            <el-option
              v-for="item in matchOptions"
              :key="item.normalUserMatchingStatus"
              :label="item.label"
              :value="item.normalUserMatchingStatus"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- 取消按钮 -->
        <el-button plain type="primary" @click="updateDialogVisible = false"
          >取消</el-button
        >
        <!-- 确认按钮 -->
        <el-button
          plain
          type="success"
          @click="
            updateDialogVisible = false;
            updateUser();
          "
          >确认</el-button
        >
      </div>
    </el-dialog>
    <!-- 删除用户信息 -->
    <el-dialog
      title="是否删除当前用户？"
      :visible.sync="deleteDialogVisible"
      width="30%"
    >
      <div slot="footer" class="dialog-footer">
        <!-- 取消按钮 -->
        <el-button plain type="primary" @click="deleteDialogVisible = false"
          >取消</el-button
        >
        <!-- 确认按钮 -->
        <el-button
          plain
          type="success"
          @click="
            deleteDialogVisible = false;
            deleteUser();
          "
          >确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      // 普通用户信息
      normalUserDatas: [],
      // 搜索用户名
      searchUser: "",
      // 添加新用户数据对象
      addUserItem: {
        normalUserName: "",
        normalUserPassword: "",
        normalUserAlias: "",
        normalUserGender: "",
        normalUserAge: "",
        normalUserEmail: "",
        normalUserAvatarFileFullName: "",
        normalUserMatchingStatus: "",
      },
      // 添加新用户对话框可视性
      addDialogVisible: false,
      // 更新请求对话框可视性
      updateDialogVisible: false,
      // 更新数据对象updateUserItem
      updateUserItem: {},
      //删除数据对象
      deleteUserUid: "",
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
      // 匹配选项
      matchOptions: [
        {
          normalUserMatchingStatus: "NOT_MATCHED",
          label: "未匹配",
        },
        {
          normalUserMatchingStatus: "RANDOM_MATCHING",
          label: "正在随机匹配",
        },
        {
          normalUserMatchingStatus: "TARGETED_MATCHING",
          label: "正在定向匹配",
        },
        {
          normalUserMatchingStatus: "TARGETED_MATCHING_HAS_BEEN_DENY",
          label: "定向匹配已被拒绝",
        },
        {
          normalUserMatchingStatus: "MATCHED",
          label: "已匹配",
        },
      ],
      // 删除用户对话框可视性
      deleteDialogVisible: false,
    };
  },
  methods: {
    /**
     * 添加新用户
     */
    async addUser() {
      let requestBody = {
        normalUserName: this.addUserItem.normalUserName,
        normalUserPassword: this.addUserItem.normalUserPassword,
        normalUserAlias: this.addUserItem.normalUserAlias,
        normalUserGender: this.addUserItem.normalUserGender,
        normalUserAge: this.addUserItem.normalUserAge,
        normalUserEmail: this.addUserItem.normalUserEmail,
        normalUserAvatarFileFullName:
          this.addUserItem.normalUserAvatarFileFullName,
        normalUserMatchingStatus: this.addUserItem.normalUserMatchingStatus,
      };
      console.log(requestBody);
      const addRes = await axios.post("/api/user/insert-user", requestBody);
      if (addRes.data.status) {
        this.$router.go(0);
      }
      if (!addRes.data.status) {
        this.$message.error("添加失败");
        console.log("添加失败");
      }
    },
    /**
     * 修改普通用户
     */
    async updateUser() {
      let normalUser = this.updateUserItem;
      const updateRes = await axios.put("/api/user/update-user", normalUser);
      if (updateRes.data.status) {
        this.$message.success(updateRes.data.message);
        // 刷新页面：重新渲染所有本路由相关组件
        this.$router.go(0);
      }
      if (!updateRes.data.status) {
        this.$message.error(updateRes.data.message);
      }
    },
    /**
     * 封禁普通用户
     * @param normalUser 按钮所在行的数据对象
     */
    async banUser(normalUser) {
      const banningRes = await axios.put("/api/user/update-user", {
        uid: normalUser.uid,
        isBanned: "y",
      });
      if (banningRes.data.status) {
        this.$router.go(0);
      }
      if (!banningRes.data.status) {
        this.$message.error("封禁失败");
        console.log(normalUser.normalUserName, "封禁失败");
      }
    },
    /**
     * 解封普通用户
     * @param normalUser 按钮所在行的数据对象
     */
    async unbanUser(normalUser) {
      const unbanningRes = await axios.put("/api/user/update-user", {
        uid: normalUser.uid,
        isBanned: "n",
      });
      if (unbanningRes.data.status) {
        this.$router.go(0);
      }
      if (!banningRes.data.status) {
        this.$message.error("解封失败");
        console.log(normalUser.normalUserName, "解封失败");
      }
    },
    /**
     * 删除普通用户
     */
    async deleteUser() {
      const deleteRes = await axios.delete("/api/user/delete-user", {
        data: { uid: this.deleteUserUid },
      });
      if (deleteRes.data.status) {
        this.$router.go(0);
      }
      if (!deleteRes.data.status) {
        this.$message.error(deleteRes.data.message);
        console.log(deleteRes.data.message);
      }
    },
    /**
     * 打开删除对话框,获取删除用户的uid
     */
    openDeleteDialog(normalUser) {
      this.deleteUserUid = normalUser.uid;
    },
    /**
     * 选中user对象:将获取的userInfo赋值给choiceUserInfo
     * @param normalUser 按钮所在行的数据对象
     */
    openUpdateDialog(normalUser) {
      this.updateUserItem = { ...normalUser };
    },
    /**
     * 获取所有普通用户信息
     */
    async getAllNormalUserInfo() {
      const getRes = await axios.get("/api/monitor/get-all-user-info");
      if (getRes.data.status) {
        this.normalUserDatas = getRes.data.data.normalUser;
        console.log(this.normalUserDatas);
        console.log("普通用户信息查询成功");
      } else {
        console.log("普通用户信息查询失败");
      }
    },
  },
  mounted() {
    this.getAllNormalUserInfo();
  },
};
</script>

<style lang="less" scoped>
.header-bar {
  display: flex;
  flex-direction: row;
}
.operate-button {
  display: flex;
  flex-direction: row;
  // gap: 5px; /* 间距可根据需要调整 */
}
.text-line {
  font-size: 14px;
  padding: 18px 0;
  display: flex;
  flex-direction: row;
}
</style>