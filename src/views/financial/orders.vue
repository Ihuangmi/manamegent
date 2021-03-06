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
      <el-table-column label="用户" width="180">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" width="150">
        <template slot-scope="{row}">
          <span>{{ row.nick_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易金额" align="right">
        <template slot-scope="{row}">
          <span>{{ row.amount | toFixd }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货币类型" width="80">
        <template slot-scope="{row}">
          <span>{{ row.currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" width="120">
        <template slot-scope="{row}">
          <span>{{ row.order_status_display }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" width="120">
        <template slot-scope="{row}">
          <span>{{ row.payment_method_display }}</span>
        </template>
      </el-table-column>
      <el-table-column label="URL Q" width="220">
        <template slot-scope="{row}">
          <span>{{ row.url_q }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付时间" width="160">
        <template slot-scope="{row}">
          <span>{{ row.payment_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邀请码" align="right">
        <template slot-scope="{row}">
          <span>{{ row.invite_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参考" width="220">
        <template slot-scope="{row}">
          <span>{{ row.reference }}</span>
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
import { ordersList } from "@/api/financial";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: "RMB", type: "RMB" },
  { key: "USD", type: "USD" }
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
      total: 0,
      listLoading: false,
      listQuery: {},
      downloadLoading: false,
      calendarTypeOptions
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
      ordersList(this.listQuery).then(
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
      var start_date = this.listQuery.start_date;
      var end_date = this.listQuery.end_date;
      this.listQuery.start_date =
        start_date && parseFloat(new Date(start_date).getTime());
      this.listQuery.end_date =
        end_date && parseFloat(new Date(end_date).getTime());
      this.getList();
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "link_account") {
        this.sortByAccount(order);
      } else if (prop === "register_date") {
        this.sortByStartDt(order);
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
    sortByStartDt(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+register_date";
      } else if (order === "descending") {
        this.listQuery.sort = "-register_date";
      } else {
        this.listQuery.sort = null;
      }
      this.handleFilter();
    },
    getDownloadList() {
      this.listQuery.download = 1;
      ordersList(this.listQuery).then(
        response => {
          this.loadlist = response;
          this.downloadLoading = true;
          import("@/vendor/Export2Excel").then(excel => {
            const tHeader = [
              "用户",
              "交易金额",
              "货币类型",
              "订单状态",
              "支付方式",
              "URL Q",
              "支付时间",
              "邀请码",
              "参考"
            ];
            const filterVal = [
              "username",
              "amount",
              "currency",
              "order_status_display",
              "payment_method_display",
              "url_q",
              "payment_time",
              "invite_code",
              "reference"
            ];
            const data = this.formatJson(filterVal);
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: "订单表"
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
          if (j === "payment_time") {
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
