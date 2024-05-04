<template>
  <div>
    <el-card class="box-card">
      <div class="match-sign">
        <img
          src="https://cyberbase-diary-platform.oss-cn-chengdu.aliyuncs.com/match-sign%28350px_x_350px%29%20.png"
          alt="match-sign"
        />
      </div>
      <!-- 显示逻辑：如果用户未匹配，则显示两个按钮；
            如果用户点击了随机匹配，则显示 “正在匹配...”，两个按钮消失；
            如果用户点击了定向匹配，跳出提示框输入用户名，输入完成则显示“已发送匹配请求, 请等待...”  -->

      <!-- 新逻辑设计：组件初始化开始检查后端用户匹配状态，
            vuex准备两个个参数：matchStatus；mot_matched/matching/matched，默认为mot_matched; 
            matchMethod: randomMatching/TargetedMatching,默认为null
            当matchStatus为 matching时，检查match-->

      <!-- 当用匹配状态为 未匹配 notMatched -->
      <div v-if="matchingStatus === 'notMatched'" class="match-buttons">
        <el-button @click="randomMatch">随机匹配</el-button>
        <!-- 点击定向匹配，显示定向匹配对话框 -->
        <el-button @click="showTargetedMatchDialog = true">定向匹配</el-button>
      </div>
      <!-- 当前状态为正在匹配：随机匹配 -->
      <div v-if="matchingStatus === 'randomMatching'" class="match-status">
        正在随机匹配...
      </div>

      <!-- 点击定向匹配后显示 -->
      <div v-if="matchingStatus === 'targetedMatching'" class="match-status">
        已发送匹配请求，请等待...
        <br />
        <el-button @click="cancelTargetedMatchRequest">取消匹配</el-button>
      </div>

      <div v-if="matchingStatus === 'matched'" class="match-status">
        已匹配用户：{{ matchNormalUserName }}
      </div>
      <!-- 定向匹配请求对话框 -->
      <el-dialog
        :visible.sync="showTargetedMatchDialog"
        title="定向匹配"
        width="70%"
      >
        <span>请输入想要匹配的用户名:</span>
        <el-input
          v-model="requestTargetedNormalUserName"
          placeholder="用户名"
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showTargetedMatchDialog = false">取消</el-button>
          <el-button type="primary" @click="targetedMatch">确定</el-button>
        </span>
      </el-dialog>
    </el-card>
    <!-- 定向匹配请求目标用户对话框 -->
    <el-dialog
      :visible.sync="showTargetedMatchRequestTargetNormalUserDialog"
      title="提示"
    >
      <span
        >{{
          targetedMatchingRequestNormalUserName
        }}&nbsp;请求与您匹配，是否同意？</span
      >
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            showTargetedMatchRequestTargetNormalUserDialog = false;
            denyTargetedMatchRequest;
          "
          >拒绝</el-button
        >
        <el-button
          type="primary"
          @click="
            this.showTargetedMatchRequestTargetNormalUserDialog = false;
            agreeTargetedMatchRequest;
          "
          >同意</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import Cookie from "js-cookie";
export default {
  data() {
    return {
      // 默认为未匹配状态
      // 从vuex中取得, notMatched, randomMatching, targetedMatching, matched
      // matchingStatus: this.$store.state.matchingStatus,
      matchingStatus: "notMatched",
      // 默认不显示定向匹配对话框
      showTargetedMatchDialog: false,
      // 显示定向匹配请求目标用户提示框，默认为false
      showTargetedMatchRequestTargetNormalUserDialog: false,
      // 定向匹配对话框输入的用户名
      requestTargetedNormalUserName: "",
      // 定向匹配请求用户的用户名
      targetedMatchingRequestNormalUserName: "",
      // interval: null,
      matchNormalUserName: "",
    };
  },
  methods: {
    created() {},

    /**
     * 发送随机匹配请求
     */
    async randomMatch() {
      try {
        const res = await axios.post("/api/user/random-match", {
          normalUserName: Cookie.get("normalUserName"),
        });
        console.log(res.data);
        if (res.data.status) {
          // 请求发送成功，将匹配状态设置为正在随机匹配
          // this.$store.commit("setMatchingStatus", {
          //   matchingStatus: "randomMatching",
          // });
          this.matchingStatus = "randomMatching";
          this.$message.success(res.data.message);
        } else {
          console.log(res.data.message);
          this.$message.error(res.data.message);
        }
      } catch (error) {
        this.$message.error(error.res.data.message);
        // this.$store.commit("setMatchingStatus", {
        //     matchingStatus: "notMatched",
        //   });
        this.matchingStatus = "notMatched";
      }
    },
    /**
     * 发起定向匹配请求
     */
    async targetedMatch() {
      try {
        // 发送定向匹配之前检查输入的用户名是否存在
        const searchRes = await axios.get(
          "/api/user/select-normal-user-by-user-name",
          {
            params: {
              normalUserName: this.requestTargetedNormalUserName,
            },
          }
        );
        if (searchRes.data.status) {
          // 如果用户存在，检查此用户是否为未匹配状态
          const matchRes = await axios.get("/api/user/check-match-status", {
            params: { normalUserName: this.requestTargetedNormalUserName },
          });
          if (matchRes.data.status) {
            // 如果用户为未匹配状态，则开始发起定向匹配请求
            if (matchRes.data.data.matchStatus === "NOT_MATCHED") {
              const res = await axios.post("/api/user/targeted-match", {
                requestNormalUserName: Cookie.get("normalUserName"),
                targetedNormalUserName: this.requestTargetedNormalUserName,
              });
              if (res.data.status) {
                // 请求成功后，读取响应信息中的message
                this.matchingStatus = "targetedMatching";
                console.log(res.data.message);
                this.$message.success(res.data.message);
              }
            } else {
              //如果已经匹配或为其他状态，则返回错误信息
              console.log("无法匹配，目标用户正在匹配或已经匹配");
              this.$message.success("无法匹配，目标用户正在匹配或已经匹配");
            }
          }
          if (!matchRes.data.status) {
            console.log(res.data.message);
            this.$message.success(res.data.message);
          }
        }
        if (!searchRes.data.status) {
          console.log("用户名不存在");
          this.$message.error("用户名不存在");
          this.matchingStatus = "notMatched";
        }
      } catch (error) {
        this.$message.error("系统异常");
        this.matchingStatus = "notMatched";
      }
      this.showTargetedMatchDialog = false;
      // 函数执行结束后，清空定向匹配用户名属性
      this.requestTargetedNormalUserName = "";
    },

    /**
     * 取消定向匹配
     */
    async cancelTargetedMatchRequest() {
      const res = await axios.post("/api/user/cancel-targeted-match-request", {
        normalUserName: Cookie.get("normalUserName"),
      });
      if (res.data.status) {
        // 如果用户为定向匹配状态，则将用的匹配状态修改为未匹配状态
        // if (res.data.data.matchStatus === "TARGETED_MATCHING") {
        //   const res = await axios.post("");
        // }
        this.matchingStatus = "notMatched";
      }
    },

    /**
     * 检查当前用户的匹配状态（通过检查用户表的MatchStatus来确定页面是否执行checkRandomMatchRequest）
     */
    async checkMatchStatus() {
      const res = await axios.get("/api/user/check-match-status", {
        params: { normalUserName: Cookie.get("normalUserName") },
      });
      if (res.data.status) {
        if (res.data.data.matchStatus === "NOT_MATCHED") {
          console.log("当用户未匹配,无需执行检查");
        }
        if (res.data.data.matchStatus === "RANDOM_MATCHING") {
          console.log("当用户正在随机匹配，需要执行检查");
          this.matchingStatus = "randomMatching";
          // 检查匹配请求
          this.checkRandomMatchRequest();
        }

        if (res.data.data.matchStatus === "TARGETED_MATCHING") {
          console.log("当用户正在定向匹配，需要执行检查");
          this.matchingStatus = "targetedMatching";
        }

        if (res.data.data.matchStatus === "MATCHED") {
          console.log("当用户已匹配,无需执行检查");
          this.matchingStatus = "matched";
          const res = await axios.get("/api/user/find-match-normal-user", {
            params: { normalUserName: Cookie.get("normalUserName") },
          });
          // 当用户已匹配时，将匹配用户名存入Cookie
          Cookie.set("matchNormalUserName", res.data.data.matchNormalUserName);
          this.matchNormalUserName = res.data.data.matchNormalUserName;
          // 通过用户名获取uid
          const matchRes = await axios.get(
            "/api/user/select-normal-user-by-user-name",
            {
              params: {
                normalUserName: res.data.data.matchNormalUserName,
              },
            }
          );
          if (matchRes.data.status) {
            Cookie.set(
              "matchedNormalUserUid",
              matchRes.data.data.normalUser.uid
            );
          }
        }
        this.$message.success(res.data.message);
        console.log(res.data.message);
      }
    },
    /**
     * 检查随机匹配请求
     */
    async checkRandomMatchRequest() {
      const res = await axios.post("/api/user/check-random-match-request", {
        normalUserName: Cookie.get("normalUserName"),
      });

      if (res.data.status) {
        // 设置matchStatus为matched,用于显示已匹配用户
        //匹配成功，将matchingStatus设置为matched
        // this.$store.commit("setMatchingStatus", {
        //     matchingStatus: "matched",
        //   });
        this.matchingStatus = "matched";
        console.log(res.data);
        // 通过用户名获取uid
        const matchRes = await axios.get(
          "/api/user/select-normal-user-by-user-name",
          {
            params: {
              normalUserName: res.data.data.matchNormalUserName,
            },
          }
        );
        if (matchRes.data.status) {
          Cookie.set("matchedNormalUserUid", matchRes.data.data.normalUser.uid);
          // 获取匹配用户的用户名，将被匹配的用户名存入Cookie
          Cookie.set("matchNormalUserName", res.data.data.matchNormalUserName);
          this.matchNormalUserName = res.data.data.matchNormalUserName;
        } else {
          this.$message.error(matchRes.data.message);
          console.log(matchRes.data.message);
        }
        this.$message.success(res.data.message);
        console.log(res.data.message);
      } else {
        this.$message.error(res.data.message);
        console.log(res.data.message);
      }
    },

    /**
     * 检查当前登录用户是否为定向匹配请求目标用户
     */
    async checkTargetedMatchRequest() {
      try {
        // 发起查询请求，检查当前用户是否作为目标用户存在于定向匹配请求表中，若存在则返回请求用户用户名，
        // 若不存在则返回当前用户非定向请求目标用户
        const checkRes = await axios.get(
          "/api/user/check-targeted-match-request",
          {
            params: {
              normalUserName: Cookie.get("normalUserName"),
            },
          }
        );
        if (checkRes.data.status) {
          //如果当前用户为某一定向匹配请求的目标用户，则向当前用户展示请求用户的用户名。
          if (
            checkRes.data.data.targetedMatchingRequestNormalUserName != null
          ) {
            this.targetedMatchingRequestNormalUserName =
              checkRes.data.data.targetedMatchingRequestNormalUserName;
            this.showTargetedMatchRequestTargetNormalUserDialog = true;
          } else {
            //如果请求体中targetedMatchingRequestNormalUserName字段为空，说明当前用户非定向请求目标用户
            console.log("当前用户非定向请求目标用户");
            // 本地字段重新设置为空
            this.targetedMatchingRequestNormalUserName = "";
          }
        }
      } catch (error) {
        this.$message.warning("定向匹配请求查询异常");
        console.log("定向匹配请求查询异常");
      }
    },

    /**
     * 同意定向匹配请求
     */
    async agreeTargetedMatchRequest() {
      // 同意定向匹配请求
      // 已知定向匹配请求用户名
      let requestBody = {
        // 该定向匹配请求实例的目标用户为当前登录用户
        targetNormalUserName: Cookie.get("normalUserName"),
        // 该定向匹配请求实例的请求用户为定向匹配请求用户
        requestNormalUserName: this.targetedMatchingRequestNormalUserName,
      };
      const agreeRes = await axios.post(
        "/api/user/agree-targeted-match-request",
        requestBody
      );
      console.log();
      if (agreeRes.data.status) {
        // 设置前端匹配显示状态
        this.matchingStatus = "matched";
        console.log(agreeRes.data);
        // 通过用户名获取uid
        const matchRes = await axios.get(
          "/api/user/select-normal-user-by-user-name",
          {
            params: {
              normalUserName: this.targetedMatchingRequestNormalUserName,
            },
          }
        );
        if (matchRes.data.status) {
          Cookie.set("matchedNormalUserUid", matchRes.data.data.normalUser.uid);
          // 获取匹配用户的用户名，将被匹配的用户名存入Cookie
          Cookie.set(
            "matchNormalUserName",
            this.targetedMatchingRequestNormalUserName
          );
          this.matchNormalUserName = this.targetedMatchingRequestNormalUserName;
          // 关闭dialog
          // this.showTargetedMatchRequestTargetNormalUserDialog = false;
        } else {
          this.$message.error(matchRes.data.message);
          console.log(matchRes.data.message);
        }
        if (!matchRes.data.status) {
          this.$message.warning("匹配请求失败");
          console.log("匹配请求失败");
        }
      }
      if (!agreeRes.data.status) {
        this.$message.warning("同意请求失败");
        console.log("同意请求失败");
      }
    },
    /**
     * 拒绝定向匹配请求
     */
    async denyTargetedMatchRequest() {
      // 已知定向匹配用户的用户名
      // 向请求用户响应拒绝信息
      // 当前用户的匹配状态不变，将请求用户的的匹配状态设置为已经被拒状态
      // 定向请求结束，删除请求

    },
  },
  mounted() {
    // this.matchNormalUserName = Cookie.get("matchNormalUserName");
    // 此方法只执行一次
    this.checkMatchStatus();
    //此方法只执行一次
    this.checkTargetedMatchRequest();
  },
  beforeDestroy() {
    // 组件销毁前清除定时器
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
};
</script>

<style lang="less" scoped>
.box-card {
  // 让元素处于显示页面中央
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 386px;
  height: 550px;
  .match-sign {
    // 让此元素在父元素中宽度占比100%，高度占比60%
    // background-color: #409eff;
  }
  .random-matching-button {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  .targeted-matching-button {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
  .match-status {
  }
}
</style>