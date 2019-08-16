<template>
  <div class="dashboard-container">
    <blockquote>仪表盘</blockquote>
    <div id="cards">
      <el-row :gutter="40">
        <el-col :xs="12" :sm="12" :lg="6" style="padding:20px 20px">
          <el-card role="1">
            <span>
              <h1>
                <i class="icon fa fa-pencil-square-o"></i>
              </h1>
            </span>
            <span>
              <span class="font">发表了</span>
              <span class="num" v-text="article_count"></span>
              <span class="font">篇文章</span>
            </span>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" style="padding:20px 20px">
          <el-card role="2">
            <span>
              <h1>
                <i class="icon fa fa-comment"></i>
              </h1>
            </span>
            <span>
              <span class="font">收到了</span>
              <span class="num" v-text="comments_count"></span>
              <span class="font">条评论</span>
            </span>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" style="padding:20px 20px">
          <el-card role="3">
            <span>
              <h1>
                <i class="icon fa fa-tag"></i>
              </h1>
            </span>
            <span>
              <span class="font">添加了</span>
              <span class="num" v-text="tags_count"></span>
              <span class="font">个标签</span>
            </span>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" style="padding:20px 20px">
          <el-card role="4">
            <span>
              <h1>
                <i class="icon fa fa-link"></i>
              </h1>
            </span>
            <span>
              <span class="font">友链了</span>
              <span class="num" v-text="links_count"></span>
              <span class="font">个好友</span>
            </span>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <blockquote>博客数据</blockquote>
    <div class="lists">
      <el-row :gutter="100">
        <el-col :xs="24" :sm="8" :lg="8" style="padding:20px 60px">
          <h3>最新文章</h3>
          <div class="articles">
            <div v-for="item in article" :key="item.id">
              <a
                v-if="item.title != ''"
                :href="'/article/' + item.id"
                target="_blank"
                v-text="item.title"
              ></a>
            </div>
            <!-- <div>
              <a>哈哈哈</a>
              <a>哈哈哈</a>
              <a>哈哈哈</a>
            </div>-->
          </div>
        </el-col>
        <el-col :xs="24" :sm="8" :lg="8" style="padding:20px 60px">
          <h3>最新评论</h3>
          <div class="comments">
            <div v-for="item in comments" :key="item.id">
              <p>
                <span v-text="item.name"></span>&nbsp;&nbsp;于&nbsp;
                <span v-text="item.time"></span>&nbsp;:
              </p>
              <a
                v-if="item.articleId != 0"
                :href="'/article/' + item.articleId"
                target="_blank"
                v-text="item.content"
              ></a>
              <span v-else v-text="item.content"></span>
            </div>
            <!-- <div>
              <a>哈哈哈</a>
              <a>哈哈哈</a>
              <a>哈哈哈</a>
            </div>-->
          </div>
        </el-col>
        <el-col :xs="24" :sm="8" :lg="8" style="padding:20px 60px">
          <h3>博客信息</h3>
          <el-card>
            <b>作者：</b>
            <a href="https://github.com/niu6364" target="_blank" style="color: #3222d4;">GuXue</a>
            <br />
            <b>简介：</b>GolBlog 一个轻量型博客系统。
            <br />
            <b>项目地址：</b>
            <a
              href="https://github.com/niu6364/vue-goblog-manager"
              target="_blank"
              style="color: #3222d4;"
            >https://github.com/niu6364/vue-goblog-manager</a>
            <br />
            <br />
          
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import api from "@/api/dashboard.js";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name", "roles"])
  },
  data() {
    return {
      article: [
        {
          id: "",
          title: ""
        }
      ],
      comments: [
        {
          id: "",
          name: ""
        }
      ],

      defaultActive: "1",
      article_count: "",
      comments_count: "",
      tags_count: "",
      links_count: ""
    };
  },
  created() {
    console.log("created===============");
    this.init();
  },

  methods: {
    /**
     * 一些初始化参数
     */
    init() {
      //文章数量
      api.getArticleCount().then(response => {
        this.article_count = response.data;
        console.log(this.article_count);
      });
      // //评论数量
      api.getCommentCount().then(response => {
        console.log(response.data);
        this.comments_count = response.data;
      });
      // //标签数量
      api.getTagCount().then(response => {
        this.tags_count = response.data;
      });
      // //友链数量
      api.getLinkCount().then(response => {
        this.links_count = response.data;
      });
      // //最新文章
      api.getArticles().then(response => {
        this.article = response.data;
      });
      // //最新评论
      api.getComments().then(response => {
        this.comments = response.data;
      });
    },

  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
blockquote {
  padding: 11px 15px;
  color: #666;
  border-left: 4px solid #ddd;
  margin: 0;
  height: 42px;
  background-color: #efeef5;
}
.articles {
  border: 1px solid #ebeef5;
}
#cards span {
  display: block;
  color: #fff;
  margin-left: 30px;
}

.icon {
  font-size: 45px;
}

.num {
  font-size: 30px;
}
h2,
h3 {
  color: #443d3d;
}
#cards .el-card__body {
  display: flex;
  justify-content: space-between;
}

#cards [role="1"] {
  background: #1e9fff;
  height: 135px;
}

#cards [role="2"] {
  background: #ff5722;
  height: 135px;
}

#cards [role="3"] {
  background: #009688;
  height: 135px;
}

#cards [role="4"] {
  background: #2f4056;
  height: 135px;
}

.font {
  font-size: 15px !important;
}

.lists .articles > div {
  border-bottom: 1px solid #ebeef5;
  line-height: 2.7;
  text-align: left;
  display: block;

  background: #fff;
  -webkit-appearance: none;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  -webkit-transition: 0.1s;
  transition: 0.1s;
  font-weight: 500;
  padding: 6px 20px;
  font-size: 14px;
  border-radius: 4px;
}

.lists .articles > div > a {
  color: #409eff;
}

.comments {
  border: 1px solid #ebeef5;
}

.lists .comments > div {
  border-bottom: 1px solid #ebeef5;
  text-align: left;
  display: block;
  background: #fff;
  -webkit-appearance: none;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  -webkit-transition: 0.1s;
  transition: 0.1s;
  font-weight: 500;
  padding: 6px 20px;
  font-size: 14px;
  border-radius: 4px;
}
</style>
