<template>
  <div>
    <users
      :list="list"
      :loadlist="loadlist"
      :query="query"
      :loading="loading"
      @confirmEdit="update"
      @handleFilter="getList"
      @handleDownload="getDownloadList"
    />
    <pagination v-show="total>0" :total="total" :page.sync="query.page" @pagination="getList" />
  </div>
</template>

<script>
import { usersList, updateNote } from "@/api/financial";
import Users from "@/components/Table/users"; // secondary package based on el-table
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { parseTime } from "@/utils";

export default {
  name: "UsersTable",
  components: { Users, Pagination },
  data() {
    return {
      list: [],
      loadlist: [],
      total: 0,
      loading: true,
      query: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      usersList(this.query).then(
        response => {
          this.total = response.count;
          var list = response.results;
          this.loading = false;
          this.list = list.map(v => {
            this.$set(v, "edit", false); // https://vuejs.org/v2/guide/reactivity.html
            v.originalNote = v.financial_note; //  will be used when user click the cancel botton
            v.note = v.financial_note;
            return v;
          });
        },
        error => {
          console.log(error);
          this.loading = false;
        }
      );
    },
    getDownloadList() {
      usersList(this.query).then(response => {
        this.loadlist = response;
        this.downloadLoading = true;
        import("@/vendor/Export2Excel").then(excel => {
          const tHeader = [
            "用户名",
            "昵称",
            "钱包余额",
            "冻结钱包余额",
            "关联账户数量",
            "注册时间",
            "上次登录",
            "真实姓名",
            "所在城市",
            "邀请码",
            "邮箱",
            "备注"
          ];
          const filterVal = [
            "username",
            "nick_name",
            "wallet_amount",
            "frost_wallet",
            "link_account",
            "date_joined",
            "last_date",
            "real_name",
            "city",
            "invite_code",
            "email",
            "financial_note"
          ];
          const data = this.formatJson(filterVal);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: "用户信息表"
          });
          this.downloadLoading = false;
          this.query.download = false;
        });
      });
    },
    formatJson(filterVal) {
      return this.loadlist.map(v =>
        filterVal.map(j => {
          if (j === "date_joined" || j === "last_date") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    update(msg) {
      var data = { id: msg.id, financial_note: msg.note };
      updateNote(data).then(response => {
        this.$message({
          message: "修改成功",
          type: "success"
        });
      });
    }
  }
};
</script>

