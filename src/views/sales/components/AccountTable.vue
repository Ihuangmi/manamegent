<template>
  <div>
    <el-table :key="tablekey" v-loading="loading" :data="tables" border fit highlight-current-row>
      <el-table-column label="用户名" width="150">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号" align="left" width="120">
        <template slot-scope="{row}">
          <span>{{ row.account_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台商">
        <template slot-scope="{row}">
          <span>{{ row.platform }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务器" width="190">
        <template slot-scope="{row}">
          <span>{{ row.platform_server }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否展示" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.is_show === true ? "是": "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否主展示" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.is_master === true ? "是": "否" }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="核心ID" width="220">
        <template slot-scope="{row}">
          <span>{{ row.mt4_id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="跟单费用" align="right">
        <template slot-scope="{row}">
          <span>{{ row.subscribe_fee }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template slot-scope="{row}">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号登入类型">
        <template slot-scope="{row}">
          <span>{{ row.login_type }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "AccountTable",
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      tablekey: 0
    };
  },
  computed: {
    tables() {
      return this.list;
    }
  },
  methods: {
    // sortChange(data) {
    //   const { prop, order } = data;
    //   if (prop === "linkAccount") {
    //     this.sortByAccount(order);
    //   }
    // },
    // sortByAccount(order) {
    //   if (order === "ascending") {
    //     this.listQuery.ordering = "+linkAccount";
    //   } else {
    //     this.listQuery.ordering = "-linkAccount";
    //   }
    //   this.getList();
    // }
  }
};
</script>

<style lang="scss" scoped>
</style>
