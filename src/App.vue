<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
/* 表格对齐 */
body .el-table th.gutter {
  display: table-cell !important;
}
/* 设置搜索栏对其 */
.filter-container .filter-item {
  display: inline-block;
  vertical-align: baseline;
  margin-bottom: 0;
}

/* 设置table header的背景颜色 */

.el-table__header th,
.el-table__header tr {
  /* background-color: rgb(241, 241, 241); */
  color: #666;
  /* font-weight: 400; */
}
/* .el-table .sort-caret.ascending {
  border-bottom-color: rgb(66, 185, 131);
  top: 5px;
}
.el-table .sort-caret.descending {
  border-top-color: rgb(66, 185, 131);
  bottom: 7px;
} */
/* 设置表主体的高度 */

/* .el-table__body td,
.el-table__body th {
  padding: 10px;
} */

/* 设置表头的高度 */

/* .el-table__header td,
.el-table__header th {
  padding: 15px 0px;
} */

/* 设置分页器的高度 */

.pagination-container[data-v-72233bcd] {
  padding: 0 20px !important;
}
.pagination-container{
  margin-top: 20px !important;
}
</style>
