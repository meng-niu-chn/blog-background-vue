<template>
  <div>
    <el-card>
      <h2>友链管理</h2>

      <!-- 添加框 -->
      <el-card class="card-category">
        <div slot="header">
          <span>保存友链</span>
        </div>
        <div>
          <el-form :inline="true" :model="saver" class="demo-form-inline">
            <el-form-item prop="name" label="友链名称">
              <el-input style="width: 300px" v-model="saver.name" placeholder="请输入友链名称"></el-input>
            </el-form-item>
            <el-form-item prop="url" label="链接地址">
              <el-input style="width: 300px" v-model="saver.url" placeholder="请输入链接地址"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="save">保存友链</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>

      <!-- 列表 -->
      <el-table ref="link" :data="links" border tooltip-effect="dark" style="width: 100%">
        <el-table-column
          prop="id"
          align="center"
          sortable
          label="编号"
          show-overflow-tooltip
          width="80"
        ></el-table-column>
        <el-table-column align="center" prop="name" label="友链名称" width="300" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="url" label="链接地址" width="300" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-delete"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)"
            >删除</el-button>
            <el-button
              style="margin-left:0;"
              size="mini"
              icon="el-icon-edit"
              type="warning"
              @click="handleEdit(scope.row.id)"
            >编辑</el-button>
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
    </el-card>

    <!-- 编辑 -->
    <el-dialog
      title="编辑友链信息"
      :visible.sync="editDialog"
      width="30%"
      :append-to-body="true"
      :before-close="handleClose"
    >
      <span>
        <el-form :inline="true" :model="editor">
          <el-form-item
            required
            prop="name"
            :rules="[{ required: true, message: '请输入友链名称'}]"
            label="友链名称"
          >
            <el-input style="width: 300px" v-model="editor.name" placeholder="请输入友链名称"></el-input>
          </el-form-item>
          <el-form-item
            required
            prop="url"
            :rules="[{ required: true, message: '请输入链接地址'}]"
            label="链接地址"
          >
            <el-input style="width: 300px" v-model="editor.url" placeholder="请输入链接地址"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/link.js";
export default {
  data() {
    return {
      links: [
        {
          id: "",
          name: "",
          url: ""
        }
      ],
      editor: {
        id: "",
        name: "",
        url: ""
      },
      saver: {
        id: "",
        name: "",
        url: ""
      },
      pageConf: {
        //设置一些初始值(会被覆盖)
        pageCode: 1, //当前页
        pageSize: 5, //每页显示的记录数
        totalPage: 12, //总记录数
        pageOption: [5, 10, 20] //分页选项
      },
      defaultActive: "8",
      editDialog: false,
    };
  },
  created() {
    window.onload = function() {
      app.changeDiv();
    };
    window.onresize = function() {
      app.changeDiv();
    };
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
      api.getByPage(pageCode, pageSize).then(response => {
        this.links = response.data.records;
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
          api.delete(ids).then(response => {
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
              this._notify(response.msg, "error");
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

    //保存
    save() {
      if (
        this.saver.name == null ||
        this.saver.name == "" ||
        this.saver.url == null ||
        this.saver.url == ""
      ) {
        this.reloadList();
        this._notify("输入的信息不能为空", "warning");
        return;
      } else {
        api.save(this.saver).then(response => {
          this.reloadList();
          if (response.code == 200) {
            this.saver.links = {};
            this._notify(response.msg, "success");
          } else {
            this._notify(response.msg, "error");
          }
        });
      }
      this.saver = {};
    },

    //触发编辑按钮
    handleEdit(id) {
      this.editDialog = true;
      this.editor = {}; //清空表单
      //查询当前id对应的数据
      api.getById(id).then(response => {
        this.editor = response.data;
      });
    },
    edit() {
      this.editDialog = false;
      //查询当前id对应的数据
      api.update(this.editor).then(response => {
        this.reloadList();
        if (response.code == 200) {
          this._notify(response.msg, "success");
        } else {
          this._notify(response.msg, "error");
        }
      });
      this.editor = {};
    },
  }
};
</script>

<style>
.card-category {
  margin-bottom: 35px;
}
.card-category > .el-card__header {
  background-color: #409eff;
  font-size: 15px;
  color: #fff;
}
</style>

