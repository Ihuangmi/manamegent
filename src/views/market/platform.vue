<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.server_name"
        placeholder="服务器名"
        clearable
        style="width: 150px;"
        class="filter-item"
        size="small"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.company_name"
        placeholder="公司"
        clearable
        style="width: 150px;"
        class="filter-item"
        size="small"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.ip"
        placeholder="ip地址"
        clearable
        style="width: 150px;"
        class="filter-item"
        size="small"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.platform_type"
        placeholder="平台类型"
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
      <el-table-column label="ID" width="300">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台类型">
        <template slot-scope="{row}">
          <span>{{ row.platform_type_display }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务器名" width="280">
        <template slot-scope="{row}">
          <span>{{ row.server_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司" width="300">
        <template slot-scope="{row}">
          <span>{{ row.company_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP地址" width="280">
        <template slot-scope="{row}">
          <span>{{ row.server_address }}</span>
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
import { platList } from "@/api/market";
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
      platList(this.listQuery).then(
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
      platList(this.listQuery).then(
        response => {
          this.loadlist = response;
          this.downloadLoading = true;
          import("@/vendor/Export2Excel").then(excel => {
            const tHeader = ["id", "平台类型", "服务器名", "公司", "ip地址"];
            const filterVal = ["id", "platform_type_display", "server_name", "company_name", "server_address"];
            const data = this.formatJson(filterVal);
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: "平台商表"
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
