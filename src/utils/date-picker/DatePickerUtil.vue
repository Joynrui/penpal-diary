<template>
  <div>
    <el-date-picker
      v-model="choiceDate"
      align="right"
      type="date"
      placeholder="选择日期"
      size="large"
      format="yyyy 年 MM 月 dd 日"
      value-format="yyyy-MM-dd"
      :picker-options="pickerOptions"
      @change="emitChoiceDate"
    >
    </el-date-picker>
    <br />
    <span class="choice-date">{{ choiceDate }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
      choiceDate: "",
    };
  },
  methods: {
    emitChoiceDate() {
      this.$emit("update:choiceDate", this.choiceDate);
    },
  },
};
</script>

<style lang="less" scoped>
.choice-date {
  font-weight: bold;
}
</style>