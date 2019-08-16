<template>
  <div >
    <h1>这是articlemng组件</h1>

    <el-card>
      <h3>文章管理</h3>
      <!-- 功能按钮 -->
      <el-row :gutter="20">
        <el-col :xs="12" :sm="12" :lg="6" :span="6" style="display: flex">
          <el-input
            placeholder="请输入文章标题查询"
            size="small"
            v-model="searchEntity"
            @keyup.native="search(pageConf.pageCode, pageConf.pageSize)"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-button
            @click="search(pageConf.pageCode, pageConf.pageSize)"
            plain
            size="small"
            style="margin-left:12px;"
            icon="el-icon-search"
          ></el-button>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" :span="6" style="float: right;text-align: right">
          <el-button size="small" plain type="primary" @click="handleAdd" icon="el-icon-plus"></el-button>
          <el-button
            type="primary"
            plain
            size="small"
            @click="search(pageConf.pageCode, pageConf.pageSize)"
            icon="el-icon-refresh"
          ></el-button>
          <!-- <el-button
                  type="primary"
                  plain
                  size="small"
                  @click="handleExcel"
                  icon="el-icon-printer"
          ></el-button>-->
        </el-col>
      </el-row>
      <br />
      <!-- 列表 -->
      <el-table ref="article" :data="article" border tooltip-effect="dark" style="width: 100%">
        <el-table-column
          prop="id"
          align="center"
          sortable
          show-overflow-tooltip
          label="编号"
          width="80"
        ></el-table-column>
        <el-table-column align="center" prop="title" label="文章标题" width="360" show-overflow-tooltip></el-table-column>
        <el-table-column
          align="center"
          prop="author"
          show-overflow-tooltip
          label="文章作者"
          width="120"
        ></el-table-column>
        <el-table-column align="center" label="浏览量" width="170">
          <template slot-scope="scope">
            <el-tag type="success">{{scope.row.views}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="editTime" label="最后编辑时间" width="170"></el-table-column>
        <el-table-column
          align="center"
          prop="category"
          show-overflow-tooltip
          label="文章分类"
          width="130"
        ></el-table-column>
        <el-table-column align="center" prop="state" sortable label="状态" width="120">
          <template slot-scope="scope">
            <el-tag>{{scope.row.state == '1' ? '已发布':'存入草稿'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-delete"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)"
            >删除</el-button>
            <a :href="'/#/articleedit/' + scope.row.id">
              <el-button size="mini" icon="el-icon-edit" type="warning">编辑</el-button>
            </a>
            <a :href="'/article/' + scope.row.id" target="_blank">
              <el-button size="mini" icon="el-icon-view" type="primary">预览</el-button>
            </a>
          </template>
        </el-table-column>
      </el-table>
      <br />
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageConf.pageCode"
          :page-sizes="pageConf.pageOption"
          :page-size="pageConf.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageConf.totalPage"
        ></el-pagination>
      </div>
      <br />
    </el-card>
  </div>
</template>

<script>
import api from "@/api/article.js";
export default {
  data() {
    return {
      article: [
        {
          id: "",
          title: "",
          titlePic: "",
          category: "",
          author: "",
          content: "",
          state: "",
          publishTime: "",
          editTime: "",
          createTime: ""
        }
      ],
      //分页选项
      pageConf: {
        //设置一些初始值(会被覆盖)
        pageCode: 1, //当前页
        pageSize: 5, //每页显示的记录数
        totalPage: 12, //总记录数
        pageOption: [5, 10, 20] //分页选项
      },
      defaultActive: "3",

      //条件查询单独封装的对象
      searchEntity: "",

    };
  },
  created() {
    this.search(this.pageConf.pageCode, this.pageConf.pageSize);
  },
  methods: {

    _notify(message, type) {
      this.$message({
        message: message,
        type: type
      });
    },
    //刷新列表
    reloadList() {
      this.search(this.pageConf.pageCode, this.pageConf.pageSize);
    },
    //条件查询
    search(pageCode, pageSize) {

      api
        .getByPage(
          this.pageConf.pageCode,
          this.pageConf.pageSize,
          this.searchEntity
        )
        .then(response => {
          this.article = response.data.records;
          console.log(response.data.records);
          this.pageConf.totalPage = response.data.total;
        });
    },
    //pageSize改变时触发的函数
    handleSizeChange(val) {
      this.search(this.pageConf.pageCode, val);
    },
    //当前页改变时触发的函数
    handleCurrentChange(val) {
      this.pageConf.pageCode = val; //为了保证刷新列表后页面还是在当前页，而不是跳转到第一页
      this.search(val, this.pageConf.pageSize);
    },

    //删除
    sureDelete(ids) {
      this.$confirm("你确定永久删除此用户信息？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          // 调用删除的接口(这里必须将数据转换成JSON格式，不然接收不到值，并且后端要用@RequestBody注解标识)
          // this.axios
          //   .post("http://localhost:8899/article/delete",ids)
          api.delete(ids).then(response => {
            console.log(JSON.stringify(ids));
            if (response.code == 200) {
              this._notify(response.msg, "success");
              if (
                (this.pageConf.totalPage - 1) / this.pageConf.pageSize ===
                this.pageConf.pageCode - 1
              ) {
                this.pageConf.pageCode = this.pageConf.pageCode - 1;
              }
              this.reloadList();
            } else {
              this._notify(response.data.msg, "error");
              //刷新列表
              this.reloadList();
            }
          });
        })
        .catch(() => {
          this._notify("已取消删除", "info");
        });
    },

    //删除按钮
    handleDelete(id) {
      var ids = new Array();
      ids.push(id);
      this.sureDelete(ids);
    },

    handleAdd() {
      window.location.href = "/#/admin/articlepub";
    },
  }
};
</script>

<style>
</style>


