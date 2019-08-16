<template>
  <div>
    <el-card>
      <h3>发布文章</h3>
      <el-form :model="article" ref="form">
        <div style="margin-bottom: 6px;">
          <el-row :gutter="100">
            <el-col :xs="24" :sm="12" :lg="8" :span="8">
              <el-form-item required prop="title" :rules="[{ required: true, message: '请输入文章标题'}]">
                <el-input v-model="article.title" placeholder="请输入文章标题">
                  <template slot="prepend">文章标题</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="8" :span="8">
              <el-form-item required prop="origin" :rules="[{ required: true, message: '请输入文章来源'}]">
                <el-input v-model="article.origin" placeholder="请输入文章来源，默认来自本系统">
                  <template slot="prepend">文章来源</template>
                  <span v-text="article.origin"></span>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="8" :span="8" style="padding-top:10px;">
              <el-radio v-model="article.type" label="0">原创</el-radio>
              <el-radio v-model="article.type" label="1">转载</el-radio>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :xs="24" :sm="12" :lg="8" :span="8" class="category" style="padding-top:10px;">
              <el-tooltip class="item" effect="dark" content="下拉框中没有？可直接键入" placement="top-start">
                <el-form-item
                  required
                  prop="category"
                  :rules="[{ required: true, message: '请选择文章分类'}]"
                >
                  <el-select
                    v-model="article.category"
                    allow-create
                    filterable
                    placeholder="请选择文章分类"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-tooltip>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="8" :span="8" style="padding-top:10px;">
              <div>
                <el-form-item>
                  <el-tag
                    :key="tag"
                    v-for="tag in dynamicTags"
                    closable
                    :disable-transitions="false"
                    @close="handleCloseTag(tag)"
                    v-text="tag"
                  ></el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="article.tags"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                  ></el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput()">+文章标签</el-button>
                </el-form-item>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="8" :span="8" style="padding-top:10px;">
              <div>
                <el-form-item>
                  <el-upload
                    class="upload-demo"
                    action="http://localhost:8899/user/uploadAvatar"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <el-input v-model="article.cover" placeholder="url">
                      <template slot="prepend">
                        <el-button size="small" type="primary">点击上传</el-button>
                      </template>
                    </el-input>
                  </el-upload>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </div>
        <div id="article">
          <mavonEditor
            v-model="article.contentMd"
            @change="autoSave"
            @imgAdd="imgAdd"
            @imgDel="imgDel"
            ref="mavon"
          ></mavonEditor>
        </div>
        <p></p>
        <div style="float: right;margin-bottom: 15px;">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :lg="24" :span="12">
              <el-button type="primary" @click="publishBtn('form', 0)">存入草稿</el-button>
              <el-button type="warning" @click="publishBtn('form', 1)">发布文章</el-button>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import $route from "vue-router";
import api from "@/api/article.js";

import mavonEditor from "@/components/MarkdownEditor/index";
export default {
  components: {
    mavonEditor
  },
  data() {
    return {
      value: "",
      defaultData: "preview",
      article: {
        id: "",
        title: "",
        titlePic: "",
        category: "",
        cover: "",
        tags: "",
        author: "",
        type: "0",
        content: "",
        contentMd: "",
        origin: "http://iguxue.cn"
      },
      category: [
        {
          id: "",
          name: ""
        }
      ],

      defaultActive: "2",
      //tags
      dynamicTags: [],
      inputVisible: false,
      options: [
        {
          value: "",
          label: ""
        }
      ]
    };
  },
  created() {
    this.init();
  },
  methods: {
    imgAdd(pos, file) {
      var formdata = new FormData();
      formdata.append("file", file);
      api.picupload(formdata).then(response => {
        // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
        // $vm.$img2Url 详情见本页末尾
        if (response.code == 200) {
          var url = response.data.url;

          // mavonEditor.$img2Url(pos, url);
          this.$refs.mavon.$refs.editor.$img2Url(pos, url);
        }
      });
    },
    imgDel(filename) {
      console.log("imgDel:::::::");
      console.log(filename);
      console.log(filename[0].split("/")[5]);
      var name = filename[0].split("/")[5];
      var formdata = new FormData();
      formdata.append("filename", name);

      api.picdelete(formdata).then(response => {
        if (response.code == 200) {
        }
      });
    },

    autoSave(value, render) {
      console.log(render);
      this.article.contentMd = value;
      this.article.content = render;
    },
    save(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          // this.article.content = window.markdownContent.getHTML(); //给content赋值
          this.article.tags = JSON.stringify(this.dynamicTags); //给tags字段赋值
          console.log(this.dynamicTags);
          var url = "";

          if (this.article.id > 0) {
            // url = "http://localhost:8899/article/update";

            // this.axios.post(url,this.article)
            api.update(this.article).then(response => {
              window.location.reload();
              if (response.code == 200) {
                this.$message({
                  showClose: true,
                  message: response.msg,
                  type: "success"
                });
              } else {
                this.$message({
                  showClose: true,
                  message: response.msg,
                  type: "error"
                });
              }
            });
          } else {
            // url = "http://localhost:8899/article/save";
            api.save(this.article).then(response => {
              window.location.reload();
              if (response.code == 200) {
                this.$message({
                  showClose: true,
                  message: response.msg,
                  type: "success"
                });
              } else {
                this.$message({
                  showClose: true,
                  message: response.msg,
                  type: "error"
                });
              }
            });
          }
          console.log(this.article);
        } else {
          return false;
        }
      });
    },
    _notify(message, type) {
      this.$message({
        message: message,
        type: type
      });
    },
    //文件上传前的前的钩子函数
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isGIF = file.type === "image/gif";
      const isPNG = file.type === "image/png";
      const isBMP = file.type === "image/bmp";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.$message.error("上传图片必须是JPG/GIF/PNG/BMP 格式!");
      }
      return (isJPG || isBMP || isGIF || isPNG) && isLt2M;
    },
    //文件上传成功的钩子函数
    handleAvatarSuccess(res, file, fileList) {
      this._notify("图片上传成功", "success");
      if (res.code == 200) {
        this.article.cover = res.data.url;
      }
    },
    //点击发布文章
    publishBtn(form, state) {
      this.article.state = state; //0:存入草稿；1:发布
      this.save(form);
    },

    handleCloseTag(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      var inputValue = this.article.tags;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.article.tags = "";
    },

    init() {
      if (this.$route.params.id > 0) {
        console.log(this.$route.params.id);

        api.getById(this.$route.params.id).then(response => {
          if (response.code == 200) {
            var a = response.data;
            this.article.id = a.id;
            this.article.title = a.title;
            this.article.cover = a.cover;
            this.article.category = a.category;
            this.article.author = a.author;
            this.article.type = String(a.type);

            this.article.content = a.content;
            this.article.contentMd = a.contentMd;
            this.article.origin = a.origin;

            this.dynamicTags = JSON.parse(a.tags);
          }
        });
      } else {
        console.log("undefindeddd");
      }
      // this.axios.get("http://localhost:8899/category/getAll")
      api.getCategory().then(response => {
        this.options = [];
        response.data.forEach(category => {
          if (category.name != null) {
            this.options.push({
              value: category.name.toString(),
              label: category.name
            });
          }
        });
      });
    }
  }
};
</script>

<style>
.category {
  padding-right: 0 !important;
}
.tags {
  padding-left: 0 !important;
  padding-top: 4px !important;
}
</style>
