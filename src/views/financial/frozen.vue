<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.lower_hand_account_number"
        placeholder="低手账号"
        clearable
        style="width: 150px;"
        class="filter-item"
        size="small"
      />
      <el-input
        v-model="listQuery.master_hand_account_number"
        placeholder="高手账号"
        clearable
        style="width: 150px;"
        class="filter-item"
        size="small"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        size="small"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        size="small"
        @click="getDownloadList"
      >导出</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="tables"
      :default-sort="{prop: 'subscription', order: 'descending'}"
      border
      fit
      highlight-current-row
      @sort-change="sortChange"
    >
      <el-table-column label="低手账号">
        <template slot-scope="{row}">
          <span>{{ row.lower_hand_account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="高手账号">
        <template slot-scope="{row}">
          <span>{{ row.master_hand_account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="高手冻结资金" align="right">
        <template slot-scope="{row}">
          <span>{{ row.master_money | toFixd }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台收取手续费" align="right">
        <template slot-scope="{row}">
          <span>{{ row.platform_money | toFixd }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否处理" align="center">
        <template slot-scope="{row}">
          <span>{{ row.is_solve | toBool }}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间">
        <template slot-scope="{row}">
          <span>{{ row.add_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" @pagination="getList" />
  </div>
</template>

<script>
import { frozenList } from "@/api/financial";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: "lots", type: "lots" },
  { key: "percent", type: "percent" }
];

export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    toFixd(num) {
      return parseFloat(num).toFixed(2);
    },
    toBool(value) {
      if (value === 1) {
        return '是';
      } else if (value === 0) {
        return '否';
      }
    }
  },
  data() {
    return {
      pickerOptions0: {
        // disabledDate是一个函数,参数是当前选中的日期值,这个函数需要返回一个Boolean值,
        disabledDate: time => {
          // 限制开始日期不能大于结束日期
          if (this.listQuery.end_date) {
            return (
              time.getTime() > Date.now() ||
              time.getTime() > this.listQuery.end_date
            );
          } else {
            return time.getTime() > Date.now();
          }
        }
      }, // 日期设置对象
      pickerOptions1: {
        disabledDate: time => {
          // 设置选择今天之前的日期
          return time.getTime() > Date.now();
        }
      },
      search: "",
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      calendarTypeOptions,
      listQuery: {},
      downloadLoading: false
    };
  },
  computed: {
    tables() {
      var search = this.search;
      if (search) {
        return this.list.filter(function(dataNews) {
          return Object.keys(dataNews).some(function(key) {
            return String(dataNews[key]).indexOf(search) > -1;
          });
        });
      }
      return this.list;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      frozenList(this.listQuery).then(
        response => {
          this.total = response.count;
          this.list = response.results;
          this.listLoading = false;
        },
        error => {
          console.log(error);
          this.listLoading = false;
        }
      );
    },
    handleFilter() {
      this.getList();
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "link_account") {
        this.sortByAccount(order);
      }
    },
    sortByAccount(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+link_account";
      } else if (order === "descending") {
        this.listQuery.sort = "-link_account";
      } else {
        this.listQuery.sort = null;
      }
      this.handleFilter();
    },
    getDownloadList() {
      this.listQuery.download = 1;
      frozenList(this.listQuery).then(
        response => {
          this.loadlist = response;
          this.downloadLoading = true;
          import("@/vendor/Export2Excel").then(excel => {
            const tHeader = [
              "高手",
              "低手",
              "高手冻结资金",
              "平台收取手续费",
              "是否处理",
              "添加时间"
            ];
            const filterVal = [
              "master_hand_account",
              "lower_hand_account",
              "master_money",
              "platform_money",
              "is_solve",
              "add_time"
            ];
            const data = this.formatJson(filterVal);
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: "冻结钱包记录"
            });
            this.downloadLoading = false;
            this.listQuery.download = false;
          });
        }
      );
    },
    formatJson(filterVal) {
      return this.loadlist.map(v =>
        filterVal.map(j => {
          if (j === "add_time") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>
