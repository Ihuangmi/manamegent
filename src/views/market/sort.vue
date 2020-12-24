<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        placeholder="用户"
        clearable
        style="width: 150px;"
        class="filter-item"
        size="small"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.nick_name"
        placeholder="昵称"
        clearable
        style="width: 150px;"
        class="filter-item"
        size="small"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.account_number"
        placeholder="账号"
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
      border
      fit
      highlight-current-row
    >
      <el-table-column label="用户" width="160">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" width="160">
        <template slot-scope="{row}">
          <span>{{ row.nick_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号" width="120">
        <template slot-scope="{row}">
          <span>{{ row.account_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="利润" align="right">
        <template slot-scope="{row}">
          <span>{{ row.profit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="净值" prop="subscription" align="right">
        <template slot-scope="{row}">
          <span>{{ row.equity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="余额" align="right">
        <template slot-scope="{row}">
          <span>{{ row.balance }}</span>
        </template>
      </el-table-column>
      <el-table-column label="浮动盈亏" align="right">
        <template slot-scope="{row}">
          <span>{{ row.float_profit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="风险等级" align="right">
        <template slot-scope="{row}">
          <span>{{ row.risk_level }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最大回撤" align="right">
        <template slot-scope="{row}">
          <span>{{ row.max_dd }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单杠杆" align="right">
        <template slot-scope="{row}">
          <span>{{ row.leverage }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="更新时间">
        <template slot-scope="{row}">
          <span>{{ row.update_time | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="赛事精选">
        <template slot-scope="{row}">
          <span>{{ row.game_select }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { sortList } from "@/api/market";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: "1", type: "1" },
  { key: "2", type: "2" },
  { key: "3", type: "3" },
  { key: "4", type: "4" },
  { key: "5", type: "5" }
];

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.type;
  return acc;
}, {});

export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    }
  },
  data() {
    return {
      pickerOptions0: {
        // disabledDate是一个函数,参数是当前选中的日期值,这个函数需要返回一个Boolean值,
        disabledDate: time => {
          // 限制开始日期不能大于结束日期
          if (this.listQuery.end_date !== "") {
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
      list: [],
      loadlist: [],
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
      sortList(this.listQuery).then(
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
      this.listQuery.page = 1;
      var addedTime = this.listQuery.start_date;
      var endTime = this.listQuery.end_date;
      this.listQuery.start_date =
        addedTime && parseFloat(new Date(addedTime).getTime());
      this.listQuery.end_date =
        endTime && parseFloat(new Date(endTime).getTime());
      this.getList();
    },
    getDownloadList() {
      this.listQuery.download = 1;
      sortList(this.listQuery).then(
        response => {
          this.loadlist = response;
          this.downloadLoading = true;
          import("@/vendor/Export2Excel").then(excel => {
            const tHeader = [
              "账号",
              "用户",
              "昵称",
              "利润",
              "净值",
              "余额",
              "浮动盈亏",
              "最大回撤",
              "下单杠杆",
              "风险等级",
              "赛事精选"
            ];
            const filterVal = [
              "account_number",
              "username",
              "nick_name",
              "profit",
              "equity",
              "balance",
              "float_profit",
              "max_dd",
              "leverage",
              "risk_level",
              "game_select"
            ];
            const data = this.formatJson(filterVal);
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: "用户选择排序信息表"
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
          if (j === "update_time") {
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
