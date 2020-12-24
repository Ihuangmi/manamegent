<template>
  <div class="app-container">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="tables"
      border
      fit
      highlight-current-row
      @sort-change="sortChange"
    >
      <el-table-column label="ID">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态">
        <template slot-scope="{row}">
          <span>{{ row.order_status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退款时间" width="160">
        <template slot-scope="{row}">
          <span>{{ row.refund_dt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="事务ID">
        <template slot-scope="{row}">
          <span>{{ row.transaction_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="父事务ID">
        <template slot-scope="{row}">
          <span>{{ row.ptransaction_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退款金额" align="left">
        <template slot-scope="{row}">
          <span>{{ row.amount | toFixd }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货币类型">
        <template slot-scope="{row}">
          <span>{{ row.currency }}</span>
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
import { refundList } from "@/api/financial";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: "MT4", type: "MT4" },
  { key: "MT5", type: "MT5" }
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
      refundList(this.listQuery).then(
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
      refundList(this.listQuery).then(
        response => {
          this.loadlist = response;
          this.downloadLoading = true;
          import("@/vendor/Export2Excel").then(excel => {
            const tHeader = [
              "ID",
              "订单状态",
              "退款时间",
              "事务ID",
              "父事务ID",
              "退款金额",
              "货币类型"
            ];
            const filterVal = [
              "id",
              "order_status",
              "refund_dt",
              "transaction_id",
              "ptransaction_id",
              "amount",
              "currency"
            ];

            const data = this.formatJson(filterVal);
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: "订单退款表"
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
          if (j === "refund_dt") {
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
