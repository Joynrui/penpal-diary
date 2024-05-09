<template>
  <div>
    <!-- 标题栏 -->
    <div class="title-bar">
      <el-input
        id="diaryTitle"
        v-model="diaryTitle"
        placeholder="输入日记标题"
      />
      <div class="secret-spot-radio">
        <!-- 树洞日记状态选择 -->
        <span>是否为树洞日记：</span>
        <el-radio v-model="secretSpotDiary" label="1">是</el-radio>
        <el-radio v-model="secretSpotDiary" label="0">否</el-radio>
      </div>
      <div class="operate-button">
        <div></div>
        <el-button @click="refreshPage">刷新</el-button>
        <!-- 如果diaryCode为1，则当前diary为编辑激活状态 -->
        <div v-if="this.$store.state.diaryEditActiveCode === true">
          <el-button @click="updateDiary">更新</el-button>
        </div>
        <!--  如果diaryCode为0，则当前diary为非编辑状态 -->
        <div v-else>
          <el-button @click="uploadDiary">上传</el-button>
        </div>
      </div>
    </div>
    <!-- TinyMCE编辑器 -->
    <!-- <textarea id="diaryEditor" cols="30" rows="37"></textarea> -->
    <editor
      :init="{
        selector: '#diaryEditor',
        height: 500,
        menubar: true,
        plugins: 'link image code hr',
        toolbar:
          'undo redo | bold italic | alignleft aligncenter alignright hr | code | image link',
      }"
      cols="30"
      ref="diaryEditor"
    ></editor>
  </div>
</template>

<script>
import Cookie from "js-cookie";
import axios from "axios";
import Editor from "@tinymce/tinymce-vue";
// 使用CDN加载TInyMCE
// import loadTinymce from "@/utils/dynamicLoadScript";
// const tinyCDN =
//   "https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js";
export default {
  components: {
    editor: Editor,
  },
  data() {
    return {
      // 当前组件日记标题
      diaryTitle: "",
      // 当前组件日记实例
      diary: "",
      // 当前组件editor实例
      // editorInstance: {},
      // 当前组件日记实例内容
      diaryContent: "",
      // 当前日记树洞状态:整型, 0为否，1为是，默认为0
      secretSpotDiary: "0",
    };
  },

  methods: {
    /**
     *  上传新日记
     */
    async uploadDiary() {
      // 获取当前Cookie中的uid
      const cookieUid = Cookie.get("uid");
      //获取日记内容（不可为空）
      let requestDiaryContent;
      //获取当前diary实例
      this.diary = this.$store.state.diary;
      // 获取当前TinyMCE编辑器实例
      if (this.diary !== "") {
        //从当前editor实例中获取日记内容作为请求字段（不可为空）
        requestDiaryContent = this.$refs.diaryEditor.editor.getContent();
        console.log("保存日记：", this.diaryTitle, requestDiaryContent);
      }
      // 构建请求体对象
      const requestBody = {
        uid: cookieUid,
        //获取日记标题（可以为空）
        title: this.diaryTitle,
        // 设置请求体中的content
        content: requestDiaryContent,
        // 树洞日记状态
        secretSpotDiary: this.secretSpotDiary,
      };
      console.log("requestBody:", requestBody);
      // 发送保存日记的请求
      const res = await axios.post("/api/diary/upload-diary", requestBody);
      //处理响应
      if (res.data.status === true) {
        console.log("上传成功");
        // 保存成功后，可以跳转到其他页面或执行其他操作
        this.$router.push("/diary-list");
        this.$message.success("上传成功");
      }
      if (res.data.status === false) {
        console.log("上传失败");
        this.$message.error("上传失败");
      }
    },
    /**
     * 更新日记
     */
    async updateDiary() {
      // 获取日记rid
      const rid = this.$store.state.diary.rid;
      // 获取日记标题
      const title = this.diaryTitle;
      // 获取日记内容
      const content = this.$refs.diaryEditor.editor.getContent();
      // 获取树洞日记状态
      const secretSpotDiary = this.secretSpotDiary;
      // 构建请求体对象
      const requestBody = {
        rid: rid,
        title: title,
        content: content,
        secretSpotDiary: secretSpotDiary,
      };
      // 发送更新日记的请求，使用axios
      const res = await axios.put("/api/diary/update-diary", requestBody);
      // 处理响应
      if (res.data.status === true) {
        this.$router.push("/diary-list");
        console.log("更新成功");
        this.$message.success("更新成功");
      }
      if (res.data.status === false) {
        console.log("更新失败");
        this.$message.error("更新失败");
      }
    },

    /**
     * 获取当前用户存储的diary对象
     */
    getStoreDiary() {
      // 挂载时，尝试读取vuex store中存储的diary实例，
      // 如果diary对象不为空，则将diary内容填充到富文本编辑器中
      const diary = this.$store.state.diary;
      if (this.$store.state.diaryEditActiveCode === true) {
        console.log(
          "diaryEditActiveCode 为 true,当前store中diary为编辑状态日记"
        );
        console.log("被编辑日记为:", diary);
        // 获取编辑器实例
        if (this.$refs.diaryEditor.editor) {
          // 设置编辑器内容
          this.$refs.diaryEditor.editor.setContent(diary.content);
        }
        // 设置日记标题
        this.diaryTitle = diary.title;
        // 设置日记的树洞日记状态
        this.secretSpotDiary = diary.secretSpotDiary;
      } else {
        console.log(
          "diaryEditActiveCode 为 false,当前store中diary为非编辑状态日记"
        );
      }
      // 在Promise链中执行函数，确保editor实例已经初始化
      return Promise.resolve();
    },

    // const editorInstance = this.$refs.diaryEditor.editor;
    // editorInstance.setContent(diary.content);

    /**
     * @deprecated 初始化tinymce编辑器
     */
    initTinymce() {
      window.tinymce.init({
        selector: "#diaryEditor",
        toolbar:
          "undo redo | bold italic | alignleft aligncenter alignright hr | code | image link",
        plugins: "hr image",
        language: "zh-Hans",
      });
      return Promise.resolve();
    },

    /**
     * 刷新页面：清除store diary实体
     */
    refreshPage() {
      //
      if (this.$store.state.diaryEditActiveCode === 1) {
        console.log("store diary实体存在,置空diary");
        this.$store.commit("diaryEditActiveCode", {
          code: false,
        });
      } else {
        console.log("store diary实体不存在,无需置空");
      }

      // 刷新页面：重新渲染所有本路由相关组件
      this.$router.go(0);
    },
  },
  mounted() {
    // this.initTinymce()
    //   .then(() => {
    //     const rid = this.$route.query.rid;
    //     const title = this.$route.query.title || "";
    //     const content = this.$route.query.content || "";

    //     tinymce.get("diaryEditor").setContent(content);
    //     this.diaryTitle = title;
    //   })
    //   .catch((err) => console.log(err));
    this.getStoreDiary();
  },
};
</script>

<style lang="less" scoped>
.title-bar {
  display: flex;
  // justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f0f0f0;
  .secret-spot-radio {
    margin-left: 10px;
    // display: flex;
    // justify-content: space-between;
  }
  .operate-button {
    display: flex;
    // margin-right: 40px;
    // margin-left: 10px;
  }
}
</style>
