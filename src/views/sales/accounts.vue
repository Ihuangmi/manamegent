<template>
  <div class="app-container">
    <account-filter :query="listQuery" @handleFilter="getList" @handleDownload="getDownloadList" />

    <account-table :loading="listLoading" :list="list" />

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { accountsList } from "@/api/sales";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import AccountFilter from "./components/AccountFilter";
import AccountTable from "./components/AccountTable";

export default {
  name: "ComplexTable",
  components: { Pagination, AccountFilter, AccountTable },
  directives: { waves },

  data() {
    return {
      list: [],
      loadlist: [],
      total: 0,
      listLoading: false,
      listQuery: {},
      // downloadLoading: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      accountsList(this.listQuery).then(
        response => {
          this.list = response.results;
          this.total = response.count;
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
    // getIndex() {
    //   var data = this.list;
    //   var spanArr = [];
    //   var index = 0;
    //   for (var i = 0; i < data.length; i++) {
    //     if (i === 0) {
    //       spanArr.push(1);
    //       index = 0;
    //     } else {
    //       // 判断当前元素与上一个元素是否相同
    //       if (data[i].id === data[i - 1].id) {
    //         spanArr[index] += 1;
    //         spanArr.push(0);
    //       } else {
    //         spanArr.push(1);
    //         index = i;
    //       }
    //     }
    //   }
    //   this.spanArr = spanArr;
    //   this.index = index;
    // },
    // // 合并表格方法
    // arraySpanMethod({ row, column, rowIndex, columnIndex }) {
    //   if (columnIndex === 0 || columnIndex === 1) {
    //     const _row = this.spanArr[rowIndex];
    //     const _col = _row > 0 ? 1 : 0;
    //     return [_row, _col];
    //   }
    // },
    getDownloadList() {
      this.listQuery.download = 1;
      accountsList(this.listQuery).then(
        response => {
          this.loadlist = response;
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
              "id",
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
            this.listQuery.download = false;
          });
        }
      );
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
