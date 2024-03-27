<template>
  <div>
    <!-- 三个分栏 -->
    <!-- gutter用于指定组件间隔 -->
    <el-row :gutter="5">
      <!-- 登录用户日记列表 -->
      <el-col :span="1">
        <el-button type="success" plain @click="newDiary">+</el-button>
      </el-col>
      <el-col :span="7">
        <div class="grid-content bg">
          <!-- 如果userDiaries数组长度大于0，则显示日记列表-->
          <div class="diary-list" v-if="userDiaries.length > 0">
            <div
              class="diary-card"
              v-for="diary in userDiaries"
              :key="diary.rid"
            >
              <div class="diary-card-content-layout">
                <div>
                  <div class="createTime">{{ diary.createTime }}</div>
                  <div class="lastModifiedTime">
                    {{ diary.lastModifiedTime }}
                  </div>
                  <div class="title">{{ diary.title }}</div>
                </div>
                <div>
                  <el-button type="success" plain @click="editDiary(diary.rid)"
                    >编辑</el-button
                  >
                  <el-button type="danger" plain @click="deleteDiary(diary.rid)"
                    >删除</el-button
                  >
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="button-location">
              <el-button type="success" plain @click="newDiary">
                添加日记
              </el-button>
            </div>
          </div>
        </div>
      </el-col>
      <!-- 匹配用户日记列表 -->
      <el-col :span="7">
        <div class="grid-content bg">
          <div
            class="diary-card"
            v-for="diary in matchedUserDiaries"
            :key="diary.rid"
          >
            <div class="diary-card-content-layout">
              <div>
                <div class="createTime">{{ diary.createTime }}</div>
                <div class="lastModifiedTime">
                  {{ diary.lastModifiedTime }}
                </div>
                <div class="title">{{ diary.title }}</div>
              </div>
              <div>
                <el-button
                  type="success"
                  plain
                  @click="
                    displayDiary(diary.rid);
                    diaryDialogVisible = true;
                  "
                  >查看</el-button
                >
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <!-- 日历查询：此处显示登录用户与匹配用户的日记 -->
      <el-col :span="8">
        <div class="grid-content bg">
          <div class="date-picker-location">
            <DatePickerUtil
              class="date-picker-margin-left"
              :choiceDate.sync="localChoiceDate"
            />
            <el-button
              class="search-diary-button-margin-right"
              type="success"
              plain
              @click="getDiaryByDate"
              >查询</el-button
            >
          </div>

          <div class="search-diary-list">
            <div
              class="diary-card"
              v-for="diary in dateSearchDiaries"
              :key="diary.rid"
            >
              <div class="diary-card-content-layout">
                <div v-if="diary.ownerType === 'current'">
                  <div>
                    <div class="createTime">{{ diary.createTime }}</div>
                    <div class="lastModifiedTime">
                      {{ diary.lastModifiedTime }}
                    </div>
                    <div class="title">{{ diary.title }}</div>
                  </div>
                  <div>
                    <el-button
                      type="success"
                      plain
                      @click="editDiary(diary.rid)"
                      >编辑</el-button
                    >
                    <el-button
                      type="danger"
                      plain
                      @click="deleteDiary(diary.rid)"
                      >删除</el-button
                    >
                  </div>
                </div>
                <div v-if="diary.ownerType === 'matched'">
                  <div>
                    <div class="createTime">{{ diary.createTime }}</div>
                    <div class="lastModifiedTime">
                      {{ diary.lastModifiedTime }}
                    </div>
                    <div class="title">{{ diary.title }}</div>
                  </div>
                  <div>
                    <el-button
                      type="success"
                      plain
                      @click="
                        displayDiary(diary.rid);
                        diaryDialogVisible = true;
                      "
                      >查看</el-button
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <el-dialog
            :title="selectedDiary ? selectedDiary.title : '标题'"
            :visible.sync="diaryDialogVisible"
            width="50%"
            center
          >
            <!-- 使用v-html渲染日记内容 -->
            <div v-if="selectedDiary" v-html="selectedDiary.content"></div>
            <!-- 当没有选中的日记时显示默认文本 -->
            <span v-else>日记内容</span>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="diaryDialogVisible = false"
                >关闭</el-button
              >
            </span>
          </el-dialog>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import Cookie from "js-cookie";
import DatePickerUtil from "@/utils/date-picker/DatePickerUtil.vue";
export default {
  components: { DatePickerUtil },
  data() {
    return {
      userDiaries: [], // 当前用户的日记列表
      matchedUserDiaries: [], // 与当前用户匹配的用户的日记列表
      hasMatchedUsers: false, // 判断当前用户是否匹配其他用户
      dateSearchDiaries: [], // 日期搜索结果
      localChoiceDate: "选择日期", //可以设置默认值，或不设置
      // ownerType: "all", // 用户状态，all表示全部用户，current表示登录用户，matched表示匹配用户
      selectedDiary: null, // 用于存储当前选中的日记对象
      diaryDialogVisible: false, // 控制编辑对话框的显示与隐藏
    };
  },
  methods: {
    /**
     * 创建新日记,跳转至/diary-edit 页面
     */
    newDiary() {
      this.$router.push("/diary-edit");
    },
    /**
     * 获取当前用户的日记列表
     */
    async getUserDiaries() {
      const cookieUid = Cookie.get("uid");
      let res = await axios.get("/api/diary/select-user-all-diary", {
        params: { uid: cookieUid },
      });
      if (res.data.status) {
        // 更新this.userDiaries
        this.userDiaries = res.data.data.diary;
        // 给userDiaries的每个diary对象添加一个属性
        console.log(res.data.message);
        console.log(this.userDiaries);
        this.$message.success(res.data.message);
      }
      if (!res.data.status) {
        console.log(res.data.message);
        this.$message.error(res.data.message);
      }
    },
    /**
     * 获取匹配用户日记列表
     */
    async getMatchedUserDiaries() {
      if (Cookie.get("matchedNormalUserUid")) {
        const matchedNormalUserUid = Cookie.get("matchedNormalUserUid");
        const res = await axios.get("/api/diary/select-user-all-diary", {
          params: { uid: matchedNormalUserUid },
        });
        if (res.data.status) {
          this.matchedUserDiaries = res.data.data.diary;
          console.log(res.data.message);
          console.log(this.matchedUserDiaries);
          this.$message.success(res.data.message);
        }
        if (!res.data.status) {
          console.log(res.data.message);
          this.$message.error(res.data.message);
        }
      }
      if (!Cookie.get("matchedNormalUserUid")) {
        console.log("没有匹配用户日记");
      }
    },

    /**
     * 编辑日记
     * @param {*} rid 日记的rid
     */
    editDiary(rid) {
      // 将rid对应的diary实例传递给/diary-edit 页面
      const diary = this.userDiaries.find((item) => item.rid === rid);
      // Vuex store 存储此diary对象
      this.$store.commit("setDiary", diary);
      this.$store.commit("setDiaryEditActiveCode", {
        code: true,
      });
      // 跳转至/diary-edit 页面
      this.$router.push({
        path: "/diary-edit",
      });
    },

    /**
     * 删除日记
     */
    deleteDiary(rid) {
      this.$confirm("此操作将永久删除该日记, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let res = await axios.delete("/api/diary/delete-diary", {
          params: { rid: rid },
        });
        if (res.data.status === true) {
          // 更新this.userDiaries
          this.getUserDiaries();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        } else {
          this.$message({
            type: "error",
            message: "删除失败!",
          });
        }
      });
    },
    /**
     * 处理日期参数
     */
    handleChoiceDateChange(newChoiceDate) {
      this.localChoiceDate = newChoiceDate;
      console.log(newChoiceDate);
    },
    /**
     * 从userDiaries[] 与matchedUserDiaries[]中过滤出对应日期的日记
     */
    async getDiaryByDate() {
      // 匹配日期，将日历输出的日期localChoiceDate设置为过滤条件
      // 日期格式： yyyy-MM-dd
      // 向后端发送查询请求
      if (this.localChoiceDate === "选择日期") {
        this.$message.error("请选择日期");
      }
      if (this.localChoiceDate !== "选择日期") {
        // 此处过滤需要两个用户对应日期的日记
        // 分别过滤出登录用户与匹配用户的日记
        // 登录用户的日记可以操作，匹配用户的日记无法操作

        let userDiariesDateFilterResult = this.userDiaries
          .filter((diary) => {
            // 根据 createTime 属性进行日期匹配,createTime 的格式为 'yyyy-MM-dd'
            const diaryDate = diary.createTime.substring(0, 10);
            return diaryDate === this.localChoiceDate;
          })
          .map((diary) => ({
            ...diary,
            ownerType: "current",
          }));

        let matchedUserDiariesDateFilterResult = this.matchedUserDiaries
          .filter((diary) => {
            // 根据 createTime 属性进行日期匹配,createTime 的格式为 'yyyy-MM-dd'
            const diaryDate = diary.createTime.substring(0, 10);
            return diaryDate === this.localChoiceDate;
          })
          .map((diary) => ({
            ...diary,
            ownerType: "matched",
          }));
        // 将过滤结果赋值给dateSearchDiaries
        this.dateSearchDiaries = userDiariesDateFilterResult.concat(
          matchedUserDiariesDateFilterResult
        );
      } else {
        // 如果日期无效，清空搜索结果
        this.dateSearchDiaries = [];
      }
    },
    /**
     * 显示日记详情
     */
    displayDiary(rid) {
      this.selectedDiary = this.matchedUserDiaries.find(
        (diary) => diary.rid === rid
      );
      this.diaryDialogVisible = true; // 显示对话框
    },
  },
  mounted() {
    // 获取当前用户的日记列表和匹配用户的日记列表
    this.getUserDiaries();
    this.getMatchedUserDiaries();
    // 更新this.matchedUserDiaries和this.hasMatchedUsers的值
  },
};
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
  .el-col {
    border-radius: 4px;
    .bg {
      background: #ffffff;
    }
    .addDiaryButton {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .grid-content {
      border-radius: 4px;
      height: 90vh;
      border: 1px solid #ccc;
      .button-location {
        display: flex;
        // flex-direction: column;
        // align-items: center;
        // justify-content: center;
        margin-top: 50%;
        margin-left: 40%;
      }
      .date-picker-location {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 5vh;
      }
    }
  }
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.diary-list {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-top: 5px;
  max-height: 87vh; /* 设置最大高度，超过该高度将显示滚动条 */
  overflow-y: auto; /* 显示垂直滚动条 */
}
.search-diary-list {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-top: 5px;
  max-height: 80vh; /* 设置最大高度，超过该高度将显示滚动条 */
  overflow-y: auto; /* 显示垂直滚动条 */
}
.diary-card {
  background-color: #add8e6;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  margin-bottom: 20px;
  .diary-card-content-layout {
    display: flex;
    // 元素横向展示
    flex-direction: row;
    justify-content: space-between;
    .title {
      font-size: 20px;
    }
    .createTime {
      font-weight: bold;
      font-size: 16px;
    }
    .lastModifiedTime{
      font-size: 14px;
    }
  }
}
</style>
