<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        placeholder="用户名"
        clearable
        style="width: 150px;"
        class="filter-item"
        size="small"
      />
      <el-input
        v-model="listQuery.nick_name"
        placeholder="昵称"
        clearable
        style="width: 200px;"
        class="filter-item"
        size="small"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.transaction_type"
        placeholder="交易类型"
        clearable
        class="filter-item"
        size="small"
        style="width: 130px"
      >
        <el-option
          v-for="item in calendarTypeOptions"
          :key="item.key"
          :label="item.type"
          :value="item.key"
        />
      </el-select>
      <el-date-picker
        v-model="listQuery.start_time"
        placeholder="添加时间"
        :picker-options="pickerOptions0"
        style="width: 150px;"
        size="small"
      />
      <el-date-picker
        v-model="listQuery.end_time"
        placeholder="添加时间"
        :picker-options="pickerOptions1"
        style="width: 150px;"
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
      @sort-change="sortChange"
    >
      <el-table-column label="用户名" width="150">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称">
        <template slot-scope="{row}">
          <span>{{ row.nick_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名">
        <template slot-scope="{row}">
          <span>{{ row.real_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="银行卡号" width="190">
        <template slot-scope="{row}">
          <span>{{ row.bank_account_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易金额" align="right">
        <template slot-scope="{row}">
          <span>{{ row.amount| toFixd }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易类型">
        <template slot-scope="{row}">
          <span>{{ row.transaction_type_display }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否处理">
        <template slot-scope="{row}">
          <span>{{ row.is_handle }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货币类型">
        <template slot-scope="{row}">
          <span>{{ row.currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" width="160">
        <template slot-scope="{row}">
          <span>{{ row.add_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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
import { extractList } from "@/api/market";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 1, type: "deposit" },
  { key: 2, type: "withdraw" },
  { key: 3, type: "系统退款" }
];

export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    toFixd(num) {
      return parseFloat(num).toFixed(2);
    }
  },
  data() {
    return {
      pickerOptions0: {
        // disabledDate是一个函数,参数是当前选中的日期值,这个函数需要返回一个Boolean值,
        disabledDate: time => {
          // 限制开始日期不能大于结束日期
          if (this.listQuery.end_date) {
            return time.getTime() > this.listQuery.end_date;
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
      extractList(this.listQuery).then(
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
          if (data[i].id === data[i - 1].id) {
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
      this.listQuery.page = 1;
      this.getList();
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "linkAccount") {
        this.sortByAccount(order);
      }
    },
    sortByAccount(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+linkAccount";
      } else {
        this.listQuery.sort = "-linkAccount";
      }
      this.handleFilter();
    },
    getDownloadList() {
      this.listQuery.download = 1;
      extractList(this.listQuery).then(response => {
        this.loadlist = response;
        this.downloadLoading = true;
        import("@/vendor/Export2Excel").then(excel => {
          const tHeader = [
            "用户名",
            "昵称",
            "真实姓名",
            "银行卡号",
            "交易金额",
            "交易类型",
            "是否处理",
            "货币类型",
            "添加时间"
          ];
          const filterVal = [
            "username",
            "nick_name",
            "real_name",
            "bank_account_number",
            "amount",
            "transaction_type_display",
            "is_handle",
            "currency",
            "add_time"
          ];
          const data = this.formatJson(filterVal);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: "用户充值提取信息"
          });
          this.downloadLoading = false;
          this.listQuery.download = false;
        });
      });
    },
    formatJson(filterVal) {
      return this.loadlist.map(v =>
        filterVal.map(j => {
          if (j === "add_time" || j === "recent_time") {
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
