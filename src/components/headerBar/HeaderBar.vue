<template>
  <div class="headerBar">
    <!-- 左边logo -->
    <div class="left">
      <img src="~assets/img/logo.png" alt="" />
    </div>

    <!-- 中间搜索栏 -->
    <div class="center">

      <!-- 左右两个箭头回顾 -->
      <div class="buttons">
        <i class="iconfont icon-arrow-left-bold" @click="$router.go(-1)"></i>
        <i class="iconfont icon-arrow-right-bold" @click="$router.go(1)"></i>
      </div>

      <div class="search">
        <el-input placeholder="请输入内容" prefix-icon="el-icon-search" size="mini" slot="reference" @input="inputSearch"
          @keyup.enter.native="onSubmit" v-popover:isSearchPopShow v-model="searchInput">
        </el-input>
        <!-- 给搜索框绑定一个ref属性 -->
        <el-popover placement="bottom" width="300" ref="isSearchPopShow" popper-class="searchPop" trigger="focus" v-model="isSearchPopShow">
          <!-- 如果没有搜索内容就显示热搜榜 -->
          <div class="hotSearch" v-if="!searchSuggestList.songs">
            <div class="hotSearchTitle">热搜榜</div>
            <div class="hotSearchItem" v-for="(item, index) in hotSearchList" :key="index"
              @click="clickHotSearchItem(item.searchWord)">
              <div class="hotSearchIndex" :class="index < 3 ? 'topThree' : ''">
                {{ index + 1 }}
              </div>
              <div class="hotSearchInfo">
                <div class="hotSearchWord" :class="index < 3 ? 'hotSearchWordTopThree' : ''">
                  {{ item.searchWord }}
                </div>
                <div class="hotSearchContent">{{ item.content }}</div>
              </div>
            </div>
          </div>
          <!-- 如果有搜索内容就显示搜索的项 -->
          <div class="searchSuggest" v-if="searchSuggestList.songs">
            <div class="hotSearchTitle">
              搜索建议
            </div>
            <!-- 单曲 -->
            <div class="searchSuggestItem"
                 v-if="
                searchSuggestList.songs && searchSuggestList.songs.length != 0
              ">
              <div class="searchSuggestItemTitle">
                <i class="iconfont icon-yinle"></i> 单曲
              </div>
              <div class="suggestItemDetail"
                   v-for="(item, index) in searchSuggestList.songs"
                   :key="index"
                   @click="clickSuggestSong(item.id)">
                {{ item.name + " - " + item.artists[0].name }}
              </div>
            </div>
            <!-- 歌手 -->
            <div class="searchSuggestItem"
                 v-if="
                searchSuggestList.artists &&
                searchSuggestList.artists.length != 0
              ">
              <div class="searchSuggestItemTitle">
                <i class="iconfont icon-luyin"></i> 歌手
              </div>
              <div class="suggestItemDetail"
                   v-for="(item, index) in searchSuggestList.artists"
                   :key="index"
                   @click="clickSuggestSinger(item.id)">
                {{ item.name }}
              </div>
            </div>
            <!-- 专辑 -->
            <div class="searchSuggestItem"
                 v-if="
                searchSuggestList.albums && searchSuggestList.albums.length != 0
              ">
              <div class="searchSuggestItemTitle">
                <i class="iconfont icon-zhuanji"></i> 专辑
              </div>
              <div class="suggestItemDetail"
                   v-for="(item, index) in searchSuggestList.albums"
                   :key="index"
                   @click="clickSuggestAlbum(item.id)">
                {{ item.name + " - " + item.artist.name }}
              </div>
            </div>
             <!-- 歌单 -->
             <div class="searchSuggestItem"
                 v-if="
                searchSuggestList.playlists &&
                searchSuggestList.playlists.length != 0
              ">
              <div class="searchSuggestItemTitle">
                <i class="iconfont icon-songlist-01"></i> 歌单
              </div>
              <div class="suggestItemDetail"
                   v-for="(item, index) in searchSuggestList.playlists"
                   :key="index"
                   @click="clickSuggestMusicList(item.id)">
                {{ item.name }}
              </div>
            </div>

          </div>
        </el-popover>

      </div>
    </div>
    <!-- 右边是头像登录 -->
    <div class="right">
      <div class="user">
        <div class="avatar">
          <!-- 登录框 -->
          <el-popover placement="bottom"
                      width="300"
                      trigger="click"
                      v-model="isPopoverShow"
                      v-if="!userInfo.avatarUrl">
            <Login v-if="isPopoverShow"
                   :isRegisteredShow.sync="isRegisteredShow"
                   @getUserInfo="(info) => { userInfo = info; isPopoverShow = false; }" />
            <img src="~assets/img/test.jpg"
                 alt=""
                 slot="reference" />
          </el-popover>
          <img :src="userInfo.avatarUrl"
               alt=""
               slot="reference"
               v-else
               @click="goToPersonal" />
        </div>
        <div class="userName"
             v-if="userInfo.nickname">
          {{ userInfo.nickname }}
        </div>
        <div class="userName"
             v-else>点击头像登录</div>
      </div>
    </div>

  </div>
</template>

<script>
import { handleMusicTime } from 'plugins/utils';
import Login from 'components/login/Login.vue';

// 节流定时器名称
let timer;

export default {
  name: 'HeaderBar',
  components:{Login},
  data() {
    return {
      // 搜索框的内容
      searchInput: '',
      // searchpop是否显示
      isSearchPopShow: false,
      // 推荐列表
      searchSuggestList: {},
      // 热搜数据列表
      hotSearchList: [],
      // 用户信息
      userInfo: {},
      // 登录的弹窗是否显示
      isPopoverShow:false,
      // 登录窗口
      isRegisteredShow:false
    };
  },
  methods: {
    // 获取热搜的数据
    async getHotSearch() {
      let res = await this.$request('/search/hot/detail');
      this.hotSearchList = res.data.data
    },
    // 点击热搜榜item的回调
    clickHotSearchItem(searchWord) {
      this.searchInput = searchWord;
      this.goSearch();
    },
    goSearch(){
      this.isSearchPopShow = false;
      // 跳转到搜索界面
      this.$router.push({ name: 'search', params: { id: this.searchInput } });

    },

    // 监听搜索框的文字变化，需要节流
    inputSearch(keyword) {
      clearTimeout(timer);
      if(keyword!=''){
        timer = setTimeout(() =>{
          this.getSearchSuggest(keyword)
        },500)
      }else{
        this.searchSuggestList = {}
        return
      }
    },
    // 根据关键词搜索
    async getSearchSuggest(keywords){
      let res = await this.$request('/search/suggest', { keywords });
      this.searchSuggestList = res.data.result;
    },

    // 点击歌曲名字
    async clickSuggestSong(id){
      let row = await this.getMusicInfo(id);
      // todo 直接进入歌曲详情界面并且播放这个歌曲
      // row.id 是歌曲的id
      this.isSearchPopShow = false
      // // 首先获取当前的歌单列表和歌曲索引
      let musicList = this.$store.state.musicList;
      let currentIndex = this.$store.state.currentIndex;
      // // 先判断该歌曲是否已经在歌单中存在，避免重复点击导致歌单出现相同歌曲
      let isExist = musicList.find((item) => item.id == row.id);
      if (isExist) {
        // 如果已经存在 则只提交歌曲id并return出去
        this.$store.commit('updateMusicId', row.id);
        return;
      }
      this.$store.commit('changePlayState', false);
      // // 将请求到的歌曲详情插入到歌单对应位置并提交至vuex
      musicList.splice(currentIndex + 1, 0, row);
      this.$store.commit('updateMusicId', row.id);
      this.$store.commit('updateMusicList', {
        musicList,
        musicListId: this.$store.state.musicListId,
      });
    },

    // 点击歌手的回调
    clickSuggestSinger(id) {
      // todo 跳转到歌手详情
      this.$router.push({ name: 'singerDetail', params: { id } });
      this.isSearchPopShow = false;
    },
    
    // 点击专辑的回调
    clickSuggestAlbum(id){
      // todo 跳转到专辑详情
      // this.$router.push({ name: 'album', params: { id } });
      this.$message.error("还在施工ing");
      this.isSearchPopShow = false;
    },

    // 点击歌单的回调
    clickSuggestMusicList(id){
      // todo 跳转到歌单详情
      // this.$router.push({ name: 'musicListDetail', params: { id } });
      this.isSearchPopShow = false;
    },

    async getMusicInfo(ids){
      let res = await this.$request('/song/detail', { ids });
      res.data.songs[0].dt = handleMusicTime(res.data.songs[0].dt);
      return res.data.songs[0]
    },

    onSubmit(e){
      if(e.keyCode ==13 && this.searchInput != ''){
        this.goSearch()
      }
    },

    // 获取当前用户信息
    async getCurrentUserInfo() {
      var timestamp = Date.parse(new Date());
      let res = await this.$request('/user/account', {
        timestamp,
      });
      // console.log(res);
      if (res.data.profile != null) {
        this.userInfo = res.data.profile;
        // 更新登录状态
        this.$store.commit('updataLoginState', true);
        // 更新当前用户id
        // this.$store.commit("updateCurrentUserId", res.data.profile.userId);
        // 将请求到的用户id存入localstorage
        window.localStorage.setItem('userId', res.data.profile.userId);
      } else {
        // 未登录
        this.$store.commit('updataLoginState', false);
        // 如果localstorage存有userId就清除
        if (window.localStorage.getItem('userId')) {
          window.localStorage.removeItem('userId');
        }
      }
    },

    // 点击用户头像跳转用户主页
    goToPersonal() {
      if (this.$route.path != `/personal/${this.userInfo.userId}`)
        this.$router.push({
          name: 'personal',
          params: { uid: this.userInfo.userId },
        });
    },

  },
  async created() {
    this.getHotSearch();
    this.getCurrentUserInfo();
    if (document.cookie.search('MUSIC_U=') != -1) {
      // 如果本地存有cookie，则先暂时判定为已登录，
      // 以解决登录状态下在视频页等需要登录的页面刷新因为登录状态默认为false，
      // 需要等待获取用户信息请求结束后更新用户状态才有进入视频页的权限，导致被返回到发现音乐页面，体验很差
      // 后面获取用户信息将再次确认用户是否登录
      this.$store.commit('updataLoginState', true);
    }
  },
  watch: {
  },
};
</script>

<style scoped>
@import './HeaderBar-element.css';

.headerBar {
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  position: relative;
  z-index: 30000;
}

.left {
  width: 110px;
  margin: 0 50px 0 10px;
}

.left img {
  width: 100%;
}

.center {
  display: flex;
  align-items: center;
}

.buttons {
  color: rgb(235, 235, 235);
  /* display: flex; */
  height: 22px;
}

.buttons i {
  background-color: #e13e3e;
  font-size: 12px;
  transform: scale(0.8);
  padding: 5px;
  height: 22px;
  width: 22px;
  border-radius: 50%;
  margin: 0 3px;
}

.searchPop{
  height: 500px; 
  overflow: auto;
}

.hotSearchTitle {
  font-size: 13px;
  margin: 10px 0 5px 20px;
}

.hotSearchItem {
  display: flex;
  align-items: center;
  padding: 6.5px 15px;
  cursor: pointer;
}

.hotSearchItem:hover {
  background-color: #f2f2f2;
}

.hotSearchIndex {
  margin-right: 15px;
  color: #aaa;
  width:20px
}

.topThree {
  color: #e13e3e;
}

.hotSearchWord {
  font-size: 12px;
  color: rgb(51, 51, 51);
}

.hotSearchWordTopThree {
  font-weight: 600;
  color: black;
}

.hotSearchContent {
  font-size: 12px;
  transform: scale(0.9) translateX(-5%);
}

.searchSuggestItemTitle {
  background-color: #f5f5f7;
  padding: 4px 8px;
}

.searchSuggestItemTitle i {
  font-size: 15px;
}

.searchSuggestItem {
  cursor: pointer;
}

.suggestItemDetail {
  padding: 4px 27px;
  font-size: 12px;
}

.suggestItemDetail:hover {
  background-color: #f2f2f2;
}


.right {
  display: flex;
  position: absolute;
  right: 50px;
  top: 0;
  line-height: 50px;
}

.user {
  display: flex;
  align-items: center;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 7px;
  cursor: pointer;
  line-height: 30px;
}

.avatar img {
  width: 100%;
}

.userName {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  width: 100px;
}
</style>
