<template>
  <div>
    <el-row :gutter="5">
      <!-- 树洞日记列表 -->
      <el-col :span="12">
        <div class="grid-content bg">
          <div
            class="diary-card"
            v-for="diary in secretSpotDiaries"
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
                    displayDiaryVisible = true;
                    displayDiary(diary.rid);
                  "
                  >查看</el-button
                >
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <!-- 日记显示界面 -->
      <el-col :span="12">
        <div v-if="displayDiaryVisible">
          <div class="diary">
            <div class="title">{{ selectedDiary.title }}</div>
            <hr />
            <div class="content" v-html="selectedDiary.content"></div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import Cookie from "js-cookie";
export default {
  data() {
    return {
      // 树洞日记列表
      secretSpotDiaries: [],
      // 日记显示属性，默认为false
      displayDiaryVisible: false,
      // 当前选中日记
      selectedDiary: null,
    };
  },
  methods: {
    /**
     * 获取树洞日记
     */
    async getSecretSpotDiaries() {
      // 读取全部日记
      const cookieUid = Cookie.get("uid");
      let res = await axios.get("/api/diary/get-all-secret-spot-diary");
      if (res.data.status) {
        // 更新this.secretSpotDiaries
        this.secretSpotDiaries = res.data.data.diary;
        // 给secretSpotDiaries的每个diary对象添加一个属性
        console.log(res.data.message);
        console.log(this.secretSpotDiaries);
        this.$message.success(res.data.message);
      } else {
        console.log(res.data.message);
        this.$message.error(res.data.message);
      }
    },
    /**
     * 显示日记详情
     */
    displayDiary(rid) {
      this.selectedDiary = this.secretSpotDiaries.find(
        (diary) => diary.rid === rid
      );
      this.displayDiaryVisible = true; // 显示对话框
    },
  },
  mounted() {
    this.getSecretSpotDiaries();
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
    }
  }
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
      font-size: 14px;
    }
    .createTime {
      font-weight: bold;
      font-size: 16px;
    }
    .lastModifiedTime {
      font-size: 14px;
    }
  }
}
.diary {
  .title {
    margin-top: 30px;
    margin-bottom: 20px;
    text-align: center;
    font-weight: bold; /* 加粗 */
    font-size: 20px; /* 字号加大 */
  }
  .content {
    margin-top: 20px;
  }
}
</style>