<template>
  <div>
    <el-card>
      <h2>分类/标签管理</h2>
      <el-row :gutter="40">
        <el-col :xs="24" :sm="12" :lg="12" :span="12" style="padding: 10px 20px">
          <el-card class="card-category">
            <div slot="header">
              <span>分类列表</span>
              <el-button
                type="info"
                @click="handleSave('category')"
                style="float: right;padding: 7px 1pc 6px 17px;color:#fff"
              >添加</el-button>
            </div>
            <!-- 列表 -->
            <el-table
              ref="category"
              :data="entity.category"
              border
              tooltip-effect="dark"
              style="width: 100%"
            >
              <el-table-column
                prop="id"
                align="center"
                sortable
                label="编号"
                show-overflow-tooltip
                width="80"
              ></el-table-column>
              <el-table-column
                align="center"
                prop="name"
                label="分类名称"
                width="200"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    icon="el-icon-delete"
                    size="mini"
                    type="danger"
                    @click="handleDelete('category',scope.row.id)"
                  >删除</el-button>
                  <el-button
                    style="margin-left:0;"
                    size="mini"
                    icon="el-icon-edit"
                    type="warning"
                    @click="handleEdit('category',scope.row.id)"
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
        </el-col>
        <el-col :xs="24" :sm="12" :lg="12" :span="12" style="padding: 10px 20px">
          <el-card class="card-tags">
            <div slot="header">
              <span>标签列表</span>
              <el-button
                type="info"
                @click="handleSave('tags')"
                style="float: right;padding: 7px 1pc 6px 17px;color:#fff;"
              >添加</el-button>
            </div>
            <!-- 列表 -->
            <el-table
              ref="tags"
              :data="entity.tags"
              border
              tooltip-effect="dark"
              style="width: 100%"
            >
              <el-table-column
                prop="id"
                align="center"
                sortable
                label="编号"
                show-overflow-tooltip
                width="80"
              ></el-table-column>
              <el-table-column
                align="center"
                prop="name"
                label="标签名称"
                width="200"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    icon="el-icon-delete"
                    size="mini"
                    type="danger"
                    @click="handleDelete('tags',scope.row.id)"
                  >删除</el-button>
                  <el-button
                    style="margin-left:0;"
                    size="mini"
                    icon="el-icon-edit"
                    type="warning"
                    @click="handleEdit('tags',scope.row.id)"
                  >编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
            <br />
            <!-- 分页 -->
            <div class="pagination">
              <el-pagination
                background
                @size-change="t_handleSizeChange"
                @current-change="t_handleCurrentChange"
                :current-page="pageConf.t_pageCode"
                :page-sizes="pageConf.t_pageOption"
                :page-size="pageConf.t_pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageConf.t_totalPage"
              ></el-pagination>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <!-- 分类添加 -->
    <el-dialog
      :title="'新增' + dialogFlag"
      :visible.sync="dialogVisible"
      width="30%"
      :append-to-body="true"
      :before-close="handleClose"
    >
      <span>
        <el-input :placeholder="'请输入' + dialogFlag + '名称'" v-model="editor.name">
          <template slot="prepend">{{dialogFlag}}名称</template>
        </el-input>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleGo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/category.js";
export default {
  data() {
    return {
      entity: {
        category: [
          {
            id: "",
            name: ""
          }
        ],
        tags: [
          {
            id: "",
            name: ""
          }
        ]
      },
      editor: {
        id: "",
        name: ""
      },

      //分页选项
      pageConf: {
        //设置一些初始值(会被覆盖)
        pageCode: 1, //当前页
        pageSize: 5, //每页显示的记录数
        totalPage: 12, //总记录数
        pageOption: [5, 10, 20], //分页选项

        t_pageCode: 1,
        t_pageSize: 5,
        t_totalPage: 12,
        t_pageOption: [5, 10, 20]
      },

      dialogVisible: false,
      dialogFlag: "",
      dialogType: true, //dialog分类：true：新增，false：修改
      defaultActive: "5"
    };
  },
  created() {
    this.search("category", this.pageConf.pageCode, this.pageConf.pageSize);
    this.search("tags", this.pageConf.t_pageCode, this.pageConf.t_pageSize);
  },
  methods: {
    _notify(message, type) {
      this.$message({
        message: message,
        type: type
      });
    },
    handleClose(key, keyPath) {
      this.dialogVisible = false;
    },

    //刷新列表
    reloadList(flag) {
      if (flag == "category") {
        this.search(flag, this.pageConf.pageCode, this.pageConf.pageSize);
      } else {
        this.search(flag, this.pageConf.t_pageCode, this.pageConf.t_pageSize);
      }
    },
    //条件查询
    search(flag, pageCode, pageSize) {
      if (flag == "category") {

        api.getCategorysByPage(pageCode, pageSize).then(response => {
          this.entity.category = response.data.records;
          this.pageConf.totalPage = response.data.total;
        });
      }

      if (flag == "tags") {

        api.getTagsByPage(pageCode, pageSize).then(response => {
          this.entity.tags = response.data.records;
          this.pageConf.t_totalPage = response.data.total;
        });
      }
    },

    //pageSize改变时触发的函数
    handleSizeChange(val) {
      this.search("category", this.pageConf.pageCode, val);
    },
    t_handleSizeChange(val) {
      this.search("tags", this.pageConf.t_pageCode, val);
    },
    //当前页改变时触发的函数
    handleCurrentChange(val) {
      this.pageConf.pageCode = val;
      this.search("category", val, this.pageConf.pageSize);
    },
    t_handleCurrentChange(val) {
      this.pageConf.t_pageCode = val;
      this.search("tags", val, this.pageConf.t_pageSize);
    },

    //删除
    sureDelete(flag, ids) {
      this.$confirm("你确定永久删除此信息？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          if (flag == "category") {
            api.deleteCategorys(ids).then(response => {
              if (response.code == 200) {
                if (
                  (this.pageConf.totalPage - 1) / this.pageConf.pageSize ===
                  this.pageConf.pageCode - 1
                ) {
                  this.pageConf.pageCode = this.pageConf.pageCode - 1;
                }
                this._notify(response.msg, "success");
                this.reloadList(flag);
              } else {
                this._notify(response.msg, "error");
                this.reloadList(flag);
              }
            });
          } else if (flag == "tags") {
            console.log("deleteTagsinddffffffgggggg")
            api.deleteTags(ids).then(response => {
              if (response.code == 200) {
                if (
                  (this.pageConf.t_totalPage - 1) / this.pageConf.t_pageSize ===
                  this.pageConf.t_pageCode - 1
                ) {
                  this.pageConf.t_pageCode = this.pageConf.t_pageCode - 1;
                }
                this._notify(response.msg, "success");
                this.reloadList(flag);
              } else {
                this._notify(response.data.msg, "error");
                this.reloadList(flag);
              }
            });
          }
        })
        .catch(() => {
          this._notify("已取消删除", "info");
        });
    },

    //删除按钮
    handleDelete(flag, id) {
      var ids = new Array();
      ids.push(id);
      this.sureDelete(flag, ids);
    },
    //新增按钮
    handleSave(flag) {
      this.editor = {};
      this.dialogVisible = true;
      if (flag == "category") {
        this.dialogFlag = "分类";
      }
      if (flag == "tags") {
        this.dialogFlag = "标签";
      }
      this.dialogType = true;
    },
    //更新按钮
    handleEdit(flag, id) {
      this.dialogVisible = true;

      if (flag == "category") {
        api.getCategoryById(id).then(response => {
          console.log("data::" + response.data);
          this.editor = response.data;
        });
      } else if (flag == "tags") {
        api.getTagById(id).then(response => {
          console.log("data::" + response.data);
          this.editor = response.data;
        });
      }

      this.dialogType = false; //更新
      if (flag == "category") {
        this.dialogFlag = "分类";
      }
      if (flag == "tags") {
        this.dialogFlag = "标签";
      }
    },
    handleGo() {
      //新增、更新公用
      this.dialogVisible = false;
      if (this.editor.name == null || this.editor.name == "") {
        this._notify("输入的信息不能为空", "error");
        return false;
      }
      var url = "";
      var flag = "";
      if (this.dialogType) {
        //新增
        if (this.dialogFlag == "分类") {
          flag = "category";
          url = "http://localhost:8899/category/save";

          // this.axios.post(url, this.editor).then(response => {});

          api.saveCategory(this.editor).then(response => {
            if (response.code == 200) {
              this._notify(response.msg, "success");
            } else {
              this._notify(response.msg, "error");
            }
            this.reloadList(flag);
          });
        } else if (this.dialogFlag == "标签") {
          flag = "tags";
          url = "http://localhost:8899/tag/save";

          // this.axios.post(url, this.editor).then(response => {

          // });

          api.saveTag(this.editor).then(response => {
            if (response.code == 200) {
              this._notify(response.msg, "success");
            } else {
              this._notify(response.msg, "error");
            }
            this.reloadList(flag);
          });
        }
      } else {
        //更新
        if (this.dialogFlag == "分类") {
          flag = "category";
          url = "http://localhost:8899/category/update";

          //   this.axios.post(url, this.editor).then(response => {

          // });

          api.updateCategory(this.editor).then(response => {
            if (response.code == 200) {
              this._notify(response.msg, "success");
            } else {
              this._notify(response.msg, "error");
            }
            this.reloadList(flag);
          });
        } else if (this.dialogFlag == "标签") {
          flag = "tags";
          url = "http://localhost:8899/tag/update";

          api.updateTag(this.editor).then(response => {
            if (response.code == 200) {
              this._notify(response.msg, "success");
            } else {
              this._notify(response.msg, "error");
            }
            this.reloadList(flag);
          });
        }
      }
    }
  }
};
</script>
<style>
.card-category > .el-card__header {
  background-color: #409eff;
  font-size: 15px;
  color: #fff;
}

.card-tags > .el-card__header {
  background-color: #f56c6c;
  font-size: 15px;
  color: #fff;
}
</style>


