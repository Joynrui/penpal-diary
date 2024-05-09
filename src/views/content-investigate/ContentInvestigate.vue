<template>
  <div>
    <!-- 树洞日记列表 -->
    <el-table
      :data="
        secretSpotDiaries.filter(
          (data) =>
            !searchDiary ||
            data.title.toLowerCase().includes(searchDiary.toLowerCase())
        )
      "
      height="668"
      style="width: 100%"
    >
      <el-table-column prop="rid" label="日记id"> </el-table-column>
      <el-table-column prop="uid" label="uid"> </el-table-column>
      <el-table-column prop="title" label="标题"> </el-table-column>
      <el-table-column prop="content" label="内容"> </el-table-column>
      <el-table-column prop="createTime" label="创建时间"> </el-table-column>
      <el-table-column prop="lastModifiedTime" label="最后修改时间">
      </el-table-column>
      <el-table-column prop="secretSpotDiary" label="是否为树洞日记">
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column fixed="right" width="230">
        <!-- scope属性用于输入内容 -->
        <template slot="header" slot-scope="scope">
          <div class="header-bar">
            <el-input
              v-model="searchDiary"
              size="mini"
              placeholder="搜索标题"
            />
            <!-- 添加新日记 -->
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
            <!--修改日记 （scope.row:次参数名称不可改变） -->
            <el-button
              size="mini"
              type="primary"
              @click="
                updateDialogVisible = true;
                openUpdateDialog(scope.row);
              "
              >修改</el-button
            >
            <!-- 删除日记 -->
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
    <!-- 添加日记 -->
    <el-dialog title="添加日记" :visible.sync="addDialogVisible" width="30%">
      <el-form :model="addDiaryItem" label-width="80px">
        <el-form-item label="uid">
          <el-input v-model="addDiaryItem.uid" :disabled="false"></el-input>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="addDiaryItem.title" :disabled="false"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="addDiaryItem.content" :disabled="false"></el-input>
        </el-form-item>
        <el-form-item label="是否为树洞日记">
          <el-select v-model="addDiaryItem.secretSpotDiary" clearable>
            <el-option
              v-for="item in secretSpotDiaryOptions"
              :key="item.secretSpotDiary"
              :label="item.label"
              :value="item.secretSpotDiary"
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
            addDiary();
          "
          >确认</el-button
        >
      </div>
    </el-dialog>
    <!-- 修改日记 -->
    <el-dialog
      title="修改日记信息"
      :visible.sync="updateDialogVisible"
      width="30%"
    >
      <el-form :model="updateDiaryItem" label-width="80px">
        <el-form-item label="日记id">
          <el-input
            v-model="updateDiaryItem.rid"
            :placeholder="updateDiaryItem.rid"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="uid">
          <el-input
            v-model="updateDiaryItem.uid"
            :placeholder="updateDiaryItem.uid"
            :disabled="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="标题">
          <el-input
            v-model="updateDiaryItem.title"
            :placeholder="updateDiaryItem.title"
            :disabled="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="updateDiaryItem.content"
            :placeholder="updateDiaryItem.content"
            :disabled="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否为树洞日记">
          <el-select
            v-model="updateDiaryItem.secretSpotDiary"
            clearable
            :placeholder="updateDiaryItem.secretSpotDiary"
          >
            <el-option
              v-for="item in secretSpotDiaryOptions"
              :key="item.secretSpotDiary"
              :label="item.label"
              :value="item.secretSpotDiary"
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
            updateDiary();
          "
          >确认</el-button
        >
      </div>
    </el-dialog>
    <!-- 删除日记 -->
    <el-dialog
      title="是否删除当前日记？"
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
            deleteDiary();
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
      // 树洞日记列表
      secretSpotDiaries: [],
      // 搜索日记
      searchDiary: "",
      // 添加新用户数据对象
      addDiaryItem: {
        uid: "",
        title: "",
        content: "",
        secretSpotDiary: "",
      },
      // 添加日记对话框可视性
      addDialogVisible: false,
      // 更新数据对象updateDiaryItem
      updateDiaryItem: {
        // uid: "",
        // title: "",
        // content: "",
        // secretSpotDiary: "",
      },
      // 修改日记对话框可视性
      updateDialogVisible: false,
      // 性别选项
      secretSpotDiaryOptions: [
        {
          secretSpotDiary: "0",
          label: "否",
        },
        {
          secretSpotDiary: "1",
          label: "是",
        },
      ],
      // 删除日记对话框可视性
      deleteDialogVisible: false,
      // 删除日记rid
      deleteDiaryRid: "",
    };
  },
  methods: {
    // 获取所有日记
    async getAllDiary() {
      const getRes = await axios.get("/api/diary/get-all-diary");
      if (getRes.data.status) {
        this.secretSpotDiaries = getRes.data.data.diary;
        console.log(getRes.data.message);
      }
      if (!getRes.data.status) {
        console.log(getRes.data.message);
      }
    },

    /**
     * 添加日记
     */
    async addDiary() {
      let diary = this.addDiaryItem;
      const addRes = await axios.post("/api/diary/upload-diary", diary);
      if (addRes.data.status) {
        this.$router.go(0);
      }
      if (!addRes.data.status) {
        this.$message.error(updateRes.data.message);
      }
    },
    /**
     * 打开更新日记对话框
     * @param diary 按钮所在行的数据对象
     */
    openUpdateDialog(diary) {
      this.updateDiaryItem = { ...diary };
      console.log("当前修改日记：", diary);
    },
    /**
     * 修改日记
     */
    async updateDiary() {
      let diary = this.updateDiaryItem;
      const updateRes = await axios.put("/api/diary/update-diary", diary);
      if (updateRes.data.status) {
        // 刷新页面：重新渲染所有本路由相关组件
        this.$router.go(0);
      }
      if (!updateRes.data.status) {
        this.$message.error(updateRes.data.message);
      }
    },
    /**
     * 打开删除对话框,获取删除用户的uid
     */
    openDeleteDialog(diary) {
      this.deleteDiaryRid = diary.rid;
    },
    /**
     * 删除日记
     */
    async deleteDiary() {
      let rid = this.deleteDiaryRid;
      const deleteRes = await axios.delete("/api/diary/delete-diary", {
        params: {
          rid: rid,
        },
      });
      if (deleteRes.data.status) {
        this.$router.go(0);
      }
      if (!deleteRes.data.status) {
        this.$message.error(deleteRes.data.message);
        console.log(deleteRes.data.message);
      }
    },
  },

  mounted() {
    this.getAllDiary();
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