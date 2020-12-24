<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.lower_hand_nick_name"
        placeholder="低手昵称"
        clearable
        style="width: 130px;"
        class="filter-item"
        size="small"
      />
      <el-input
        v-model="listQuery.master_hand_nick_name"
        placeholder="高手昵称"
        clearable
        style="width: 130px;"
        class="filter-item"
        size="small"
      />
      <el-input
        v-model="listQuery.lower_hand_account_number"
        placeholder="低手账号"
        clearable
        style="width: 130px;"
        class="filter-item"
        size="small"
      />
      <el-input
        v-model="listQuery.master_hand_account_number"
        placeholder="高手账号"
        clearable
        style="width: 130px;"
        class="filter-item"
        size="small"
      />
      <el-select
        v-model="listQuery.documentary_type"
        placeholder="跟单类型"
        clearable
        class="filter-item"
        size="small"
        style="width: 130px"
      >
        <el-option
          v-for="item in calendarTypeOptions"
          :key="item.key"
          :label="item.type"
          :value="parseInt(item.key)"
        />
      </el-select>
      <el-date-picker
        v-model="listQuery.start_date"
        placeholder="创建时间"
        :picker-options="pickerOptions0"
        style="width: 140px;"
        size="small"
      />
      <el-date-picker
        v-model="listQuery.end_date"
        placeholder="创建时间"
        :picker-options="pickerOptions1"
        style="width: 140px;"
        size="small"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        size="small"
        @click="getList"
      >搜索</el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        style="width: 73px"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        size="small"
        :disabled="noneClick"
        @click="getDownloadList"
      >{{ expor }}</el-button>
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
      <el-table-column label="低手昵称">
        <template slot-scope="{row}">
          <span>{{ row.lower_hand_nick_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="低手邀请码" >
        <template slot-scope="{row}">
          <span>{{ row.lower_hand_invite_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="高手昵称">
        <template slot-scope="{row}">
          <span>{{ row.master_hand_nick_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="高手邀请码" >
        <template slot-scope="{row}">
          <span>{{ row.master_hand_invite_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="低手账号" align="left">
        <template slot-scope="{row}">
          <span>{{ row.lower_hand_account_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="高手账号" align="left">
        <template slot-scope="{row}">
          <span>{{ row.master_hand_account_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="跟单大小" align="left">
        <template slot-scope="{row}">
          <span>{{ row.documentary_size }}</span>
        </template>
      </el-table-column>
      <el-table-column label="跟单费" align="left">
        <template slot-scope="{row}">
          <span>{{ row.documentary_fee }}</span>
        </template>
      </el-table-column>
      <el-table-column label="跟单类型">
        <template slot-scope="{row}">
          <span>{{ row.documentary_type_display }}</span>
        </template>
      </el-table-column>
      <el-table-column label="跟单创建时间">
        <template slot-scope="{row}">
          <span>{{ row.add_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="到期时间">
        <template slot-scope="{row}">
          <span>{{ row.expiration_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="删除标记" align="center">
        <template slot-scope="{row}">
          <span>{{ row.is_delete }}</span>
        </template>
      </el-table-column>
      <el-table-column label="删除时间" >
        <template slot-scope="{row}">
          <span>{{ row.delete_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" @pagination="getList" />
  </div>
</template>

<script>
import { documentList } from "@/api/sales";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 3, type: "手数百分比" },
  { key: 1, type: "固定手数" },
  { key: 2, type: "百分比" }
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
      expor: "导出",
      timer: null,
      noneClick: false,
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
      return this.list;
    }
  },
  destroyed() {
    clearInterval(this.timer);
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      documentList(this.listQuery).then(
        response => {
          this.list = response.results;
          this.total = response.count;
          this.listLoading = false;
        },
        error => {
          console.log(error);
          this.listLoading = false;
        }
      );
    },
    sortChange(data) {
      const { prop, order } = data;
      if (order === "ascending") {
        this.listQuery.ordering = prop;
      } else if (order === "descending") {
        this.listQuery.ordering = `-${prop}`;
      } else {
        this.listQuery.ordering = null;
      }
      this.getList();
    },
    getDownloadList() {
      this.noneClick = true;
      var time = 5;

      this.timer = setInterval(() => {
        this.expor = `${time--}s`;

        if (time < 0) {
          this.expor = "导出";
          this.noneClick = false;
        }
      }, 1000);
      this.listQuery.download = 1;
      documentList(this.listQuery).then(response => {
        this.loadlist = response;
        this.downloadLoading = true;
        import("@/vendor/Export2Excel").then(excel => {
          const tHeader = [
            "低手",
            "高手",
            "低手账号",
            "高手账号",
            "跟单类型",
            "跟单大小",
            "添加时间",
            "到期时间",
            "删除标记",
            "删除时间"
          ];
          const filterVal = [
            "lower_hand_nick_name",
            "master_hand_nick_name",
            "lower_hand_account_number",
            "master_hand_account_number",
            "documentary_type_display",
            "documentary_size",
            "add_time",
            "expiration_time",
            "is_delete",
            "delete_time"
          ];
          const data = this.formatJson(filterVal);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: "跟单表"
          });
          this.downloadLoading = false;
          this.listQuery.download = false;
        });
      });
    },
    formatJson(filterVal) {
      return this.loadlist.map(v =>
        filterVal.map(j => {
          if (
            j === "add_time" ||
            j === "expiration_time" ||
            j === "delete_time"
          ) {
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
