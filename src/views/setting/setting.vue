<template>
  <div>
    <el-card>
      <blockquote>基础设置</blockquote>
      <br />
      <el-row :gutter="80">
        <el-col :span="12">
          <el-card class="card-category">
            <div slot="header">
              <span>全局设置</span>
            </div>
            <div>
              <el-form ref="form" :model="setting" label-width="80px">
                <el-form-item
                  required
                  prop="siteName"
                  :rules="[{ required: true, message: '请输入站点名称'}]"
                  label="网站名称"
                >
                  <el-input placeholder="请输入站点名称" v-model="setting.siteName"></el-input>
                </el-form-item>
                <!-- <el-form-item
                        required
                        prop="siteMusic"
                        :rules="[{ required: true, message: '请输入音乐ID'}]"
                        label="音乐ID"
                      >
                        <el-input placeholder="请输入音乐ID" v-model="setting.siteMusic"></el-input>
                </el-form-item>-->
                <el-form-item label="社交连接" v-for="item in setting.siteLinks" :key="item.key">
                  <el-input placeholder="连接名称" v-model="item.key">
                    <template slot="prepend">Key</template>
                  </el-input>
                  <el-input placeholder="连接URL" v-model="item.value">
                    <template slot="prepend">Http://</template>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button @click="update('form')" type="primary" style="float:right;">保存设置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="card-tags">
            <div slot="header">
              <span>捐赠信息</span>
            </div>
            <div>
              <el-form label-width="100px">
                <el-form-item>
                  <div
                    class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition"
                  >
                    <div class="el-table__header-wrapper">
                      <table
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        class="el-table__header"
                        style="width: 686px;"
                      >
                        <thead>
                          <tr>
                            <th
                              v-for="item in setting.siteDonation"
                              :key="item.key"
                              colspan="1"
                              rowspan="1"
                              class="el-table_column"
                            >
                              <div class="cell">{{item.key}}</div>
                            </th>
                          </tr>
                        </thead>
                      </table>
                    </div>
                    <div class="el-table__body-wrapper is-scrolling-none">
                      <table
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        class="el-table__body"
                        style="width: 686px;"
                      >
                        <tbody>
                          <tr class="el-table__row">
                            <td
                              v-for="item in setting.siteDonation"
                              class="el-table_column"
                              :key="item.key"
                            >
                              <div class="cell">
                                <div class="avatar-uploader">
                                  <div @click="handleEditAvatar(item.key)" class="el-upload">
                                    <img
                                      v-if="item.value"
                                      :src="item.value"
                                      class="avatar"
                                      width="200"
                                      height="400"
                                    />
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <!-- <el-upload>
                              <div v-if="!donation.value" class="el-upload__text">点我上传本地头像</div>
                      </el-upload>-->
                    </div>
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <br />
      <blockquote>关于我</blockquote>
      <br />
      <div id="article">
        <!-- <textarea
                id="article-editor-md"
                ref="articleEditorMd"
                name="article-editor-md"
                v-model="setting.aboutMd"
        ></textarea>-->
        <mavonEditor
            v-model="setting.aboutMd"
            @change="autoSave"
            @imgAdd="imgAdd"
            @imgDel="imgDel"
            ref="mavon"
          ></mavonEditor>
      </div>
      <br />
      <div style="float: right;margin-bottom: 15px;">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :lg="24" :span="12">
            <el-button @click="update('form')" type="primary" style="float:right;">保存设置</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-dialog
      title="上传图片"
      :visible.sync="avatarDialog"
      width="40%"
      :before-close="handleClose"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div class="modal-body">
        <!-- <form>
          <div class="row default_avatars_list">
            <img
              v-for="item in avatarList"
              :key="item"
              :src="item.url"
              @click="changeAvatar(item.url)"
              title="点击更换！"
            />
          </div>
        </form>-->
        <el-upload
          class="avatar-uploader"
          action="http://localhost:8899/user/uploadAvatar"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="donation.value" :src="donation.value" class="avatar" height="200px" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div v-if="!donation.value" class="el-upload__text">点我上传本地头像</div>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeDon()">确 定</el-button>
        <el-button @click="avatarDialog = false;_notify('取消修改','Error');init()">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/setting.js";
import mavonEditor from "@/components/MarkdownEditor/index";
export default {
  components: {
    mavonEditor
  },
  data() {
    return {
      setting: {},
      donation: {
        key: null,
        value: null
      },
      defaultActive: "10",
      //localUpload: api.user.localUpload,
      avatarDialog: false,
      avatarList: [],

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
      this.setting.aboutMd = value;
      this.setting.about = render;
    },
    _notify(message, type) {
      this.$message({
        message: message,
        type: type
      });
    },
    init() {
      api.getSetting().then(response => {
        this.setting = response.data;
        this.setting.siteLinks = JSON.parse(this.setting.siteLinks);
        this.setting.siteDonation = JSON.parse(this.setting.siteDonation);
        console.log(this.setting);
      });
    },
    //触发关闭按钮
    handleClose() {
      this.avatarDialog = false;
    },
    handleEditAvatar(key) {
      this.donation.key = key;
      this.avatarDialog = true;
    },
    update(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          var obj = this.setting.siteDonation;
          for (var i = 0; i < obj.length; i++) {
            if (obj[i].key == this.donation.key) {
              obj[i].value = this.donation.value;
            }
          }
          this.setting.siteDonation = JSON.stringify(this.setting.siteDonation);
          this.setting.siteLinks = JSON.stringify(this.setting.siteLinks);
          console.log(this.setting);
          api.updateSetting(this.setting).then(response => {
            if (response.code == 200) {
              this._notify(response.msg, "success");
            } else {
              this._notify(response.msg, "error");
            }
            //window.location.reload();
            this.init();
          });
        }
      });
    },
    //更新捐赠数据
    changeDon() {
      var obj = this.setting.siteDonation;
      for (var i = 0; i < obj.length; i++) {
        if (obj[i].key == this.donation.key) {
          obj[i].value = this.donation.value;
        }
      }
      var data = {
        id: this.setting.id,
        siteDonation: JSON.stringify(this.setting.siteDonation)
      };
      api.updateSetting(data).then(response => {
        this.init();
        if (response.code == 200) {
          this._notify(response.msg, "success");
        } else {
          this._notify(response.msg, "error");
        }
        this.avatarDialog = false;
      });
    },
    /**
     * 图片上传
     * @param res
     * @param file
     * @param fileList
     */
    //文件上传成功的钩子函数
    handleAvatarSuccess(res, file, fileList) {
      this._notify("图片上传成功", "success");
      if (res.code == 200) {
        this.donation.value = res.data.url;
      }
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
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return (isJPG || isBMP || isGIF || isPNG) && isLt2M;
    },
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
.profile {
  display: flex;
  align-items: center;
  flex-direction: row;
}

.profile__img {
  padding: 5px;
  position: relative;
}

.profile__img img {
  max-width: 200px;
  border-radius: 2px;
}

img {
  vertical-align: middle;
  border-style: none;
}

.profile__img__edit {
  position: absolute;
  font-size: 1.2rem;
  top: 15px;
  left: 15px;
  background-color: rgba(0, 0, 0, 0.4);
  width: 30px;
  height: 30px;
  line-height: 29px !important;
  border-radius: 50%;
  text-align: center;
  color: #ffffff;
}

.card > .actions,
.card-header .actions {
  position: absolute;
  right: 40px;
  z-index: 2;
  top: 48px;
}

.profile__info {
  padding: 30px;
}

.icon-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.icon-list > li {
  position: relative;
  padding: 0.3rem 0;
}

.icon-list > li > i {
  width: 2.5rem;
  text-align: center;
  font-size: 1rem;
  top: 0.12rem;
  position: relative;
  margin-left: -0.5rem;
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 15px 30px;
  text-align: left;
}
.default_avatars_list {
  display: inline-block;
}
.row {
  margin-top: 15px;
  margin-bottom: 15px;
  margin-right: -15px;
  flex-wrap: wrap;
  margin-left: -15px;
}
.default_avatars_list img {
  display: inline;
  margin: 1rem;
  border-radius: 3px;
  cursor: pointer;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.el-upload__text {
  padding-bottom: 50px;
  margin-top: -70px;
}
.avatar-uploader .el-upload {
  cursor: pointer;
}
.el-upload input[type="file"] {
  display: none !important;
}
.el-upload__input {
  display: none;
}
*,
::after,
::before {
  -webkit-box-sizing: inherit;
  box-sizing: inherit;
}
.el-input {
  width: 45%;
}
blockquote {
  padding: 11px 15px;
  color: #666;
  border-left: 4px solid #ddd;
  margin: 0;
  height: 42px;
  background-color: #efeef5;
}
</style>
