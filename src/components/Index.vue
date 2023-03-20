<template>
  <el-container>
    <!-- 顶部 -->
    <el-header>
      <header-bar></header-bar>
    </el-header>
    <!-- 中间部分 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu active-text-color="black" router :default-active="defaultActive">
          <el-menu-item index="/discover">
            <i class="iconfont icon-yinle"></i>
            <span slot="title">发现音乐</span>
          </el-menu-item>
          <el-menu-item index="/recommendmusic">
            <i class="iconfont icon-icon"></i>
            <span slot="title">每日推荐</span>
          </el-menu-item>
          <el-menu-item-group v-if="createdMusicList.length != 0">
            <div slot="title" class="groupTitle">创建的歌单</div>
            <el-menu-item v-for="(item, index) in createdMusicList" :key="index" :index="'/musiclistdetail/' + item.id">
              <i class="iconfont icon-cipianchangpian"></i>{{ item.name }}</el-menu-item>
          </el-menu-item-group>

          <el-menu-item-group v-if="collectedMusicList.length != 0">
            <div slot="title" class="groupTitle">收藏的歌单</div>
            <el-menu-item v-for="(item, index) in collectedMusicList" :key="index" :index="'/musiclistdetail/' + item.id">
              <i class="iconfont icon-zhuanji"></i>{{ item.name }}</el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </el-aside>
      <el-main>
         <!-- 给router-view添加key有可能对性能有一定的损耗，
        但是可以解决push同一个地址不同参数时不会重新渲染router-view的问题 -->
        <router-view class="routerView" :key="$route.fullPath"></router-view>
        <!-- 用于下载的a标签 -->
        <a
          :href="downloadMusicInfo.url"
          :download="downloadMusicInfo.name"
          target="_blank"
          id="downloadCurrentMusic"
        ></a>
      </el-main>
      <!-- 中间的主体 -->
    </el-container>
    <!-- 底部 -->
    <bottom-control-my></bottom-control-my>

  </el-container>
</template>

<script>
import axios from "axios";
import HeaderBar from "components/headerBar/HeaderBar.vue";
import BottomControlMy from "components/bottomControl/BottomControl_my";
export default {
  components: {
    HeaderBar,
    BottomControlMy
  },
  data() {
    return {
      defaultActive: '',
      // 创建的歌单
      createdMusicList: [],
      // 收藏的歌单
      collectedMusicList: [],
      // 下载的音乐信息
      downloadMusicInfo: {
        name: '',
        url: ''
      },
      drawer:false

    };
  },
  created() {
    if (this.$route.path.search("/musiclistdetail") == -1) {
      this.defaultActive = "/" + this.$route.path.split("/")[1];
    } else {
      this.defaultActive = this.$route.path;
    }
  },
  methods: {
    // 请求用户的歌单
    async getUserMusicList() {
      if (!this.$store.state.isLogin) {
        // 说明已经退出登录
        this.$message.error("请先进行登录操作");
        return;
      }
      let timestamp = Date.parse(new Date());
      let res = await this.$request("/user/playlist", {
        uid: window.localStorage.getItem("userId"),
        timestamp,
      });
      res = res.data.playlist;
      let index = res.findIndex((item) => item.subscribed == true);
      this.createdMusicList = res.slice(0, index);
      this.collectedMusicList = res.slice(index);
      this.createdMusicList[0].name = "我喜欢的音乐";
      // 将收藏的歌单上传至vuex
      this.$store.commit("updateCollectMusicList", this.collectedMusicList);
      // 将创建的歌单上传至vuex
      this.$store.commit("updateCreatedMusicList", this.createdMusicList);
    }
  },
  watch: {
    // 监听收藏歌单的变化
    "$store.state.collectMusicList"(current) {
      this.collectedMusicList = current;
    },
    "$route.path"(current) {
      // 取路由中的首地址 用于侧边栏的导航active
      if (current.search("/musiclistdetail") == -1) {
        this.defaultActive = "/" + current.split("/")[1];
      } else {
        this.defaultActive = current;
      }
    },
    // 监听当前下载音乐信息
    "$store.state.downloadMusicInfo"(current) {
      axios
        .get(current.url, { responseType: "blob" })
        .then((res) => {
          let blob = res.data;
          let url = URL.createObjectURL(blob);
          // console.log(url);
          let a = document.querySelector("#downloadCurrentMusic");
          this.downloadMusicInfo.url = url;
          this.downloadMusicInfo.name = current.name;
          this.$nextTick(() => {
            a.click();
            // 用完释放URL对象
            URL.revokeObjectURL(url);
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("下载失败,请稍后重试!");
        });
    },
    // 监听vuex中的登录状态
    "$store.state.isLogin"(current) {
      if (current) {
        this.getUserMusicList();
      } else {
        this.createdMusicList = [];
        this.collectedMusicList = [];
      }
    },
  }
};
</script>

<style lang=less scoped>
@light-color: #007bff;

.is-active {
  background-color: #f6f6f7;
  font-size: 14px;
  font-weight: 600;
}

.iconfont {
  font-size: 14px;
  margin: 5px !important;
}

.routerView {
  padding: 0 15px;
  margin: 0;
  width: 100%;
  height: calc(90vh);
}

.el-header {
  background-color: @light-color;
  height: 50px !important;
  padding: 0;
  margin: 0;
  z-index: 100;
}

.el-aside {
  border-right: 1px solid #ccc;
  height: calc(90vh);
}

.el-menu {
  border: none;
}

.el-menu-item:hover {
  background-color: #f5f5f6 !important;
}

.el-menu-item {
  font-size: 14px;
  padding: 0 0 0 10px !important;
  margin: 5px 0 !important;
  height: 30px;
  line-height: 30px;
}

.el-menu-item-group {
  margin-top: 10px;
}

.el-main {
  padding: 0;
}

</style>