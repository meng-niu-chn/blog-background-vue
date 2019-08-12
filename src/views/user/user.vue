<template>
  <div>
    <el-card>
      <h2>个人设置</h2>
      <el-row :gutter="200">
        <el-col :xs="24" :sm="12" :lg="12" :span="12" style="padding-bottom: 20px;">
          <el-card class="card-category">
            <div slot="header">
              <span>个人信息</span>
            </div>
            <el-form label-width="80px" :model="user" ref="user">
              <el-form-item
                required
                prop="username"
                :rules="[{ required: true, message: '请输入用户账号'}]"
                label="账号"
              >
                <el-input placeholder="账号" v-model="user.username" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item
                required
                prop="introduce"
                :rules="[{ required: true, message: '请输入用户介绍'}]"
                label="介绍"
              >
                <el-input placeholder="介绍" v-model="user.introduce"></el-input>
              </el-form-item>
              <el-form-item
                required
                prop="remark"
                :rules="[{ required: true, message: '请输入用户备注'}]"
                label="备注"
              >
                <el-input placeholder="备注" v-model="user.remark"></el-input>
              </el-form-item>
              <el-form-item prop="avatar" v-model="user.avatar" label="头像">
                <div class="avatar-uploader">
                  <div @click="handleEditAvatar" class="el-upload">
                    <img
                      v-if="user.avatar"
                      :src="user.avatar"
                      class="avatar"
                      width="200"
                      height="200"
                    />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </div>
                </div>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="save" style="float:right;">保存信息</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="12" :span="12">
          <el-card class="card-tags">
            <div slot="header">
              <span>修改密码</span>
            </div>
            <el-form label-width="100px" ref="pass" :model="pass">
              <el-form-item
                required
                prop="password"
                :rules="[{ required: true, message: '请输入新密码'}]"
                label="输入新密码"
              >
                <el-input placeholder="请输入新密码,密码长度在6位及以上" v-model="pass.password" type="password"></el-input>
              </el-form-item>
              <el-form-item
                required
                prop="repassword"
                :rules="[{ required: true, message: '确认新密码'}]"
                label="确认新密码"
              >
                <el-input placeholder="确认新密码" v-model="pass.repassword" type="password"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="danger" @click="changePassword" style="float:right;">修改密码</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-dialog
      title="更换头像"
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
          <img v-if="user.avatar" :src="user.avatar" class="avatar" height="200px" />

          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div v-if="!user.avatar" class="el-upload__text">点我上传本地头像</div>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary">确 定</el-button>
        <el-button @click="avatarDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/usermng.js";
export default {
  data() {
    return {
      user: {
        id: "",
        username: "",
        introduce: "",
        remark: "",
        avatar: ""
      },
      pass: {
        id: "",
        password: "",
        repassword: ""
      },
      //localUpload: api.user.localUpload,
      avatarDialog: false,
      avatarList: [],
      defaultActive: "9",
      mobileStatus: false, //是否是移动端
      sidebarStatus: true, //侧边栏状态，true：打开，false：关闭
      sidebarFlag: " openSidebar " //侧边栏标志
    };
  },
  created() {
    window.onload = function() {
      app.changeDiv();
    };
    window.onresize = function() {
      app.changeDiv();
    };
    this.getUserInfo();
  },
  methods: {
    _notify(message, type) {
      this.$message({
        message: message,
        type: type
      });
    },
    //获取当前用户信息
    getUserInfo() {
      // this.$http.get(api.user.info).then(result => {
      //   this.user = result.body.data;
      //   this.pass.id = result.body.data.id;
      // });
      // this.axios.get("http://localhost:8899/user/getCurrent")
      api.getCurrent().then(response => {
        // this.user = response.data;
        this.user.id = response.data.id;
        this.user.username = response.data.username;
        this.user.introduce = response.data.introduce;
        this.user.remark = response.data.remark;
        this.user.avatar = response.data.avatar;
        console.log(response.data);
        console.log(this.user);
        this.pass.id = response.data.id;
      });
    },

    save() {
      // this.$http
      //   .post(api.user.update, JSON.stringify(this.user))
      //   .then(result => {
      //     if (result.body.code == 200) {
      //       this._notify(result.body.msg, "success");
      //       window.location.href = api.common.logout;
      //     } else {
      //       this._notify(result.body.msg, "error");
      //     }
      //   });
      // this.axios.post("http://localhost:8899/user/update",this.user)
      api.update(this.user).then(response => {
        if (response.code == 200) {
          this._notify(response.msg, "success");
          //window.location.href = "api.common.logout";
          //  this.$store.dispatch("user/logout");
          //  this.$router.push(`/login?redirect=${this.$route.fullPath}`);
          //this.getUserInfo();
          window.location.reload();
        } else {
          this._notify(response.msg, "error");
          //this.$store.dispatch("user/getInfo");
          this.$router.push("/link/index");
        }
      });
    },
    //触发关闭按钮
    handleClose() {
      this.avatarDialog = false;
    },
    handleEditAvatar() {
      // this.$http.get(api.user.avatar).then(response => {
      //   this.avatarList = response.body;
      // });
      this.avatarDialog = true;
    },
    //修改头像
    changeAvatar(url) {
      this.user.avatar = url;
      var data = {
        id: this.user.id,
        avatar: this.user.avatar
      };
      // this.$http.post(api.user.update, JSON.stringify(data)).then(response => {
      //   this.avatarDialog = false;
      //   if (response.body.code == 200) {
      //     this._notify("更换头像成功", "success");
      //     window.location.href = api.common.logout;
      //   } else {
      //     this._notify(response.body.msg, "error");
      //   }
      // });
      api.update(data).then(response => {
        this.avatarDialog = false;
        if (response.code == 200) {
          this._notify("更换头像成功", "success");
          //window.location.href = api.common.logout;
        } else {
          this._notify(response.msg, "error");
        }
      });
    },

    changePassword() {
      if (this.pass.password.length < 6) {
        this._notify("请重新输入密码，密码长度在6位及以上", "warning");
      } else if (this.pass.password != this.pass.repassword) {
        this._notify("两次输入的密码不一致", "warning");
      } else {
        // this.$http
        //   .post(api.user.update, JSON.stringify(this.pass))
        //   .then(result => {
        //     if (result.body.code == 200) {
        //       this._notify(result.body.msg, "success");
        //       //执行/logout请求
        //       window.location.href = "/admin/logout"; //更改了密码，注销当前登录状态，重新登录
        //     } else {
        //       this._notify(result.body.msg, "error");
        //     }
        //     this.clearPass();
        //   });
        // this.axios.post("http://localhost:8899/user/update",this.pass)
        api.update(this.pass).then(response => {
          if (response.code == 200) {
            this._notify(response.msg, "success");
            //执行/logout请求
            //window.location.href = "/admin/logout"; //更改了密码，注销当前登录状态，重新登录
            api.logout().then(response => {
              if (response.code == 200) {
                this.$store.dispatch("user/logout");
                window.location.reload();
              }
            });

            //window.location.reload();
          } else {
            this._notify(response.msg, "error");
          }
          this.clearPass();
        });
      }
    },
    clearPass() {
      this.pass.repassword = "";
      this.pass.password = "";
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
        this.user.avatar = res.data.url;
        this.avatarDialog = false;
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

    /**
     * 监听窗口改变UI样式（区别PC和Phone）
     */
    changeDiv() {
      let isMobile = this.isMobile();
      if (isMobile) {
        //手机访问
        this.sidebarFlag = " hideSidebar mobile ";
        this.sidebarStatus = false;
        this.mobileStatus = true;
      } else {
        this.sidebarFlag = " openSidebar";
        this.sidebarStatus = true;
        this.mobileStatus = false;
      }
    },
    isMobile() {
      let rect = body.getBoundingClientRect();
      return rect.width - RATIO < WIDTH;
    },
    handleSidebar() {
      if (this.sidebarStatus) {
        this.sidebarFlag = " hideSidebar ";
        this.sidebarStatus = false;
      } else {
        this.sidebarFlag = " openSidebar ";
        this.sidebarStatus = true;
      }
      let isMobile = this.isMobile();
      if (isMobile) {
        this.sidebarFlag += " mobile ";
        this.mobileStatus = true;
      }
    },
    //蒙版
    drawerClick() {
      this.sidebarStatus = false;
      this.sidebarFlag = " hideSidebar mobile ";
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
</style>
