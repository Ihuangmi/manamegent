<template>
  <div class="app-container" style="height: 100%">
    <div class="filter-container">
      <el-input
        v-model="query.username"
        placeholder="用户名"
        clearable
        style="width: 150px"
        class="filter-item"
        size="small"
      />
      <el-input
        v-model="query.nickname"
        placeholder="昵称"
        clearable
        style="width: 150px"
        class="filter-item"
        size="small"
      />
      <el-input
        v-model="query.email"
        placeholder="邮箱"
        clearable
        style="width: 150px"
        class="filter-item"
        size="small"
      />
      <el-input
        v-model="query.remarks"
        placeholder="备注"
        clearable
        style="width: 150px"
        class="filter-item"
        size="small"
      />
      <el-date-picker
        v-model="query.start_date"
        placeholder="开始注册时间"
        :picker-options="pickerOptions0"
        style="width: 150px"
        size="small"
      />
      <el-date-picker
        v-model="query.end_date"
        placeholder="注册结束时间"
        :picker-options="pickerOptions1"
        style="width: 150px"
        size="small"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        size="small"
        @click="$emit('handleFilter')"
        >搜索</el-button
      >
      <el-button
        v-waves
        :loading="downloadLoading"
        style="width: 73px"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        size="small"
        :disabled="noneClick"
        @click="handleDownload()"
        >{{ expor }}</el-button
      >
    </div>
    <el-table
      :key="tableKey"
      v-loading="loading"
      :data="tables"
      border
      fit
      highlight-current-row
      @sort-change="sortChange"
    >
      <el-table-column label="用户名" width="150">
        <template slot-scope="{ row }">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column label="昵称" width="150">
        <template slot-scope="{ row }">
          <span>{{ row.nick_name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="真实姓名" width="90">
        <template slot-scope="{ row }">
          <span>{{ row.real_name }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="280px" label="备注">
        <template slot-scope="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.note" class="edit-input" size="mini" />
            <el-button
              class="cancel-btn"
              size="mini"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            />
          </template>
          <span v-else>{{ row.note }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="邀请码"
        prop="invite_code"
        sortable="custom"
        align="right"
        width="90"
      >
        <template slot-scope="{ row }">
          <span>{{ row.invite_code }}</span>
        </template>
      </el-table-column>

      <el-table-column label="邮箱" width="185">
        <template slot-scope="{ row }">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="钱包余额"
        prop="wallet_amount"
        sortable="custom"
        width="110"
        align="right"
      >
        <template slot-scope="{ row }">
          <span>{{ row.wallet_amount }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="冻结钱包余额"
        prop="frost_wallet"
        width="130"
        align="right"
      >
        <template slot-scope="{ row }">
          <span>{{ row.frost_wallet }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="关联账户数量"
        prop="link_account"
        sortable="custom"
        width="130"
        align="right"
      >
        <template slot-scope="{ row }">
          <span>{{ row.link_account }}</span>
        </template>
      </el-table-column>

      <el-table-column label="所在城市" width="110">
        <template slot-scope="{ row }">
          <span>{{ row.city }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="注册时间"
        prop="date_joined"
        sortable="custom"
        width="150"
      >
        <template slot-scope="{ row }">
          <span>{{ row.date_joined | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>

      <el-table-column label="上次登录" prop="last_date" width="150">
        <template slot-scope="{ row }">
          <span>{{ row.last_date | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" fixed="right" label="操作" width="120">
        <template slot-scope="{ row }">
          <el-button
            v-if="row.edit"
            type="success"
            size="mini"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(row)"
            >Ok</el-button
          >
          <el-button
            v-else
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="row.edit = !row.edit"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";

export default {
  name: "UsersTable",
  directives: { waves },

  props: {
    list: {
      type: Array,
      default: null,
    },
    loadlist: {
      type: Array,
      default: null,
    },
    loading: {
      type: Boolean,
      default: true,
    },
    query: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      expor: "导出",
      timer: null,
      noneClick: false,
      pickerOptions0: {
        // disabledDate是一个函数,参数是当前选中的日期值,这个函数需要返回一个Boolean值,
        disabledDate: (time) => {
          // 限制开始日期不能大于结束日期
          if (this.query.end_date) {
            return (
              time.getTime() > Date.now() ||
              time.getTime() > this.query.end_date
            );
          } else {
            // 设置选择今天之前的日期
            return time.getTime() > Date.now();
          }
        },
      },
      pickerOptions1: {
        disabledDate: (time) => {
          return time.getTime() > Date.now();
        },
      },
      tableKey: 0,
      downloadLoading: false,
    };
  },
  computed: {
    tables() {
      return this.list;
    },
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    // handleFilter() {
    //   this.$emit("handleFilter");
    // },
    cancelEdit(row) {
      row.note = row.originalNote;
      row.edit = false;
    },
    confirmEdit(row) {
      row.edit = false;
      if (row.originalNote === row.note) {
        return;
      } else {
        this.$emit("confirmEdit", { id: row.id, note: row.note });
      }
    },
    sortChange(data) {
      const { prop, order } = data;
      if (order === "ascending") {
        this.query.ordering = prop;
      } else if (order === "descending") {
        this.query.ordering = `-${prop}`;
      } else {
        this.query.ordering = null;
      }
      // this.handleFilter();
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
      this.query.download = 1;
      this.$emit("handleDownload");
    },
  },
};
</script>
<style scoped>
.edit-input {
  padding-right: 70px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
