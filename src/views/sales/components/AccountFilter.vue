<template>
  <div class="filter-container">
    <el-input
      v-model="query.username"
      placeholder="用户名"
      clearable
      style="width: 200px;"
      class="filter-item"
      size="small"
    />
    <el-input
      v-model="query.account_number"
      placeholder="账号"
      clearable
      style="width: 200px;"
      class="filter-item"
      size="small"
    />
    <el-input
      v-model="query.platform_server"
      placeholder="服务器"
      clearable
      style="width: 200px;"
      class="filter-item"
      size="small"
    />
    <!-- <el-input
      v-model="query.mt4_id"
      placeholder="核心id"
      clearable
      style="width: 200px;"
      class="filter-item"
      size="small"
    /> -->
    <el-button
      class="filter-item"
      type="primary"
      icon="el-icon-search"
      size="small"
      @click="handleFilter"
    >搜索</el-button>
    <el-button
      style="width: 73px"
      class="filter-item"
      type="primary"
      icon="el-icon-download"
      size="small"
      :disabled="noneClick"
      @click="handleDownload"
    >{{ expor }}</el-button>
  </div>
</template>

<script>
const calendarTypeOptions = [
  { key: "MT4", type: "MT4" },
  { key: "MT5", type: "MT5" }
];
export default {
  name: "AccountFilter",
  props: {
    query: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      expor: "导出",
      timer: null,
      noneClick: false,
      calendarTypeOptions
    };
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    handleFilter() {
      this.$emit("handleFilter");
    },
    handleDownload() {
      this.noneClick = true;
      var time = 5;

      this.timer = setInterval(() => {
        this.expor = `${time--}s`;

        if (time < 0) {
          this.expor = "导出";
          this.noneClick = false;
        }
      }, 1000);
      this.$emit("handleDownload");
    }
  }
};
</script>
