<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        placeholder="用户名"
        clearable
        style="width: 200px;"
        class="filter-item"
        size="small"
      />
      <!-- <el-input
        v-model="listQuery.nick_name"
        placeholder="昵称"
        clearable
        style="width: 200px;"
        class="filter-item"
        size="small"
      />-->
      <el-input
        v-model="listQuery.account_number"
        placeholder="账号"
        clearable
        style="width: 200px;"
        class="filter-item"
        size="small"
      />
      <el-input
        v-model="listQuery.platform_server"
        placeholder="服务器"
        clearable
        style="width: 200px;"
        class="filter-item"
        size="small"
      />
      <el-input
        v-model="listQuery.mt4_id"
        placeholder="核心id"
        clearable
        style="width: 200px;"
        class="filter-item"
        size="small"
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
      <el-table-column label="核心ID" width="320">
        <template slot-scope="{row}">
          <span>{{ row.mt4_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="跟单费用" align="right">
        <template slot-scope="{row}">
          <span>{{ row.subscribe_fee }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态账户类型" width="110">
        <template slot-scope="{row}">
          <span>{{ row.account_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号登入类型" width="110">
        <template slot-scope="{row}">
          <span>{{ row.login_type }}</span>
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
import { accountsList } from "@/api/market";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: "MT4", type: "MT4" },
  { key: "MT5", type: "MT5" }
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
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    }
  },
  data() {
    return {
      search: "",
      list: [],
      loadlist: [],
      tableKey: 0,
      total: 0,
      listLoading: false,
      listQuery: {},
      calendarTypeOptions,
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
      accountsList(this.listQuery).then(
        response => {
          this.total = response.count;
          this.list = response.results;
          // this.getIndex();
          this.listLoading = false;
        },
        error => {
          console.log(error);
          this.listLoading = false;
        }
      );
    },
    // 处理表格数据
    getIndex() {
      var data = this.list;
      var spanArr = [];
      var index = 0;
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          spanArr.push(1);
          index = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].mt4_id === data[i - 1].mt4_id) {
            spanArr[index] += 1;
            spanArr.push(0);
          } else {
            spanArr.push(1);
            index = i;
          }
        }
      }
      this.spanArr = spanArr;
      this.index = index;
    },
    // 合并表格方法
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return [_row, _col];
      }
    },
    handleFilter() {
      this.getList();
    },
    getDownloadList() {
      this.listQuery.download = 1;
      accountsList(this.listQuery).then(response => {
        this.loadlist = response;
        this.downloadLoading = true;
        import("@/vendor/Export2Excel").then(excel => {
          const tHeader = [
            "平台商",
            "服务器",
            "账号",
            "用户名",
            "是否展示",
            "是否主展示",
            "核心ID",
            "跟单费用",
            "状态账户类型",
            "账号登入类型"
          ];
          const filterVal = [
            "platform",
            "platform_server",
            "account_number",
            "username",
            "is_show",
            "is_master",
            "mt4_id",
            "subscribe_fee",
            "account_type",
            "login_type"
          ];
          const data = this.formatJson(filterVal);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: "关联信息表"
          });
          this.downloadLoading = false;
          this.listQuery.download = false;
        });
      });
    },
    formatJson(filterVal) {
      return this.loadlist.map(v =>
        filterVal.map(j => {
          if (j === "register_time" || j === "recent_time") {
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
