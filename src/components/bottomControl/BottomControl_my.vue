<template>
  <div class="bottomControl">
    <div class="left">
      <div class="avatar">
        <img :src="musicDetail.al.picUrl" alt="" v-if="musicDetail.al" />
        <img src="~assets/img/test.jpg" alt="" v-else />
      </div>
      <div class="musicInfo">
        <div class="musicName" v-if="musicDetail && musicDetail.name">{{ musicDetail.name }}</div>
        <div class="singer" v-if="musicDetail && musicDetail.name">{{ musicDetail.ar[0].name }}</div>
      </div>
    </div>
    <div class="center">
      <audio :src="musicUrl" ref="audioPlayer" autoplay @play="changeState(true)" @pause="changeState(false)"
        @ended="changeMusic('next')" @timeupdate="timeupdate" ></audio>
      <div class="buttons">
        <!-- 播放模式 -->
        <span @click="playType = playType == 'order' ? 'random' : 'order'">
          <i class="iconfont icon-shunxubofang" v-if="playType == 'order'"></i>
          <i class="iconfont icon-suijibofang" v-else></i>
        </span>
        <!-- 上一首 -->
        <span @click="musicList.length != 0 ? changeMusic('pre') : ''">
          <i class="iconfont icon-houtiao"></i>
        </span>
        <!-- 播放按钮 -->
        <span @click="musicList.length != 0 ? changePlayState() : ''">
          <i
            class="iconfont icon-zanting"
            v-if="!this.$store.state.isPlay"
          ></i>
          <i class="iconfont icon-zanting1" v-else></i>
        </span>
        <!-- 下一首 -->
        <span @click="musicList.length != 0 ? changeMusic('next') : ''">
          <i class="iconfont icon-kuaijin"></i>
        </span>
      </div>
      <!-- 进度条 -->
      <div class="progressBar">
        <span class="currentTime">{{ currentTime | handleMusicTime }}</span>
        <el-slider
          class="progressSlider"
          v-model="timeProgress"
          :show-tooltip="false"
          @change="changeProgress"
          :disabled="musicList.length == 0"
        ></el-slider>
        <span class="totalTime">{{ duration }}</span>
      </div>
    </div>

    <div class="right">
      <div class="playList" @click="openDrawer">
        <i class="iconfont icon-bofangliebiao"></i>
      </div>
      
    </div>
    <el-drawer :visible.sync="drawer" :with-header="false" width="300" >
        <div class="drawerHeader">总{{ musicList.length }}首</div>
        <el-table
          :data="musicList"
          stripe
          style="width: 100%"
          :show-header="false"
          @row-dblclick="clickRow"
          highlight-current-row
          lazy
        >
          <el-table-column prop="name" width="150px"> </el-table-column>
          <el-table-column prop="ar[0].name" width="80px"> </el-table-column>
          <el-table-column prop="dt" width="70px"> </el-table-column>
        </el-table>
    </el-drawer>
  </div>
</template>
<script>
import { handleMusicTime, returnSecond } from "plugins/utils";
let lastSecond = 0
let durationNum = 0;
// 保存当前音量
let volumeSave = 0;
// 当前音乐类型，用于下载
let musicType = "";
export default {
  name: "BottomControlMy",
  data() {
    return {
      musicDetail: {},
      musicUrl: '',
      currentMusicIndex: 0,
      // 播放模式 order顺序播放 random随机播放
      playType: "order",
      musicList: [],
       // 进度条的位置
      timeProgress: 0,
      currentTime:0,
      duration:"00:00",
      drawer: false,
      hasDrawerOpend:false,
      drawerState:false
    }
  },
  methods: {
    async getMusicDetail(id){
      this.$store.commit("updateMusicLoadState", true);
      let result = await this.$request("/song/url", { id });
      if (result.data.data[0].url == null) {
        this.$message.error("该歌曲暂无版权，将为您播放下一首歌曲");
        this.changeMusic("next");
        return;
      }
      this.musicUrl = result.data.data[0].url;
      musicType = result.data.data[0].type.toLowerCase();
      this.$store.commit("updateMusicLoadState", false);
    },
    // audio开始或暂停播放的回调  在vuex中改变状态
    changeState(state) {
      this.$store.commit("changePlayState", state);
    },
    // 当前播放时间位置
    timeupdate() {
      let time = this.$refs.audioPlayer.currentTime;
      this.$store.commit("updateCurrentTime", time);
      time = Math.floor(time);
      if (time !== lastSecond) {
        // console.log(time);
        lastSecond = time;
        this.currentTime = time;
        // 计算进度条的位置
        this.timeProgress = Math.floor((time / durationNum) * 100);
        // console.log(this.timeProgress);
      }
    },
    // 切换歌曲
    changeMusic(type, id) {
      if (type == "click") {
        this.$store.commit("updateMusicId", id)
      } else if (type == "pre") {
        let currentMusicIndex = this.currentMusicIndex;
        let preIndex;
        if (this.playType == "order") {
          preIndex = currentMusicIndex - 1 < 0 ? this.musicList.length - 1 : currentMusicIndex - 1;
        } else if (this.playType == "random") {
          if (this.musicList.length == 1) {
            preIndex = currentMusicIndex
          } else {
            // 获取除了当前歌曲以为的随机index
            preIndex = currentMusicIndex;
            while (preIndex == currentMusicIndex) {
              preIndex = Math.floor(Math.random() * this.musicList.length);
            }
          }
        }
        this.$store.commit("updateMusicId", this.musicList[preIndex].id);
      } else if (type == "next") {
        let currentMusicIndex = this.currentMusicIndex;
        let nextIndex;
        if (this.playType == "order") {
          nextIndex = currentMusicIndex + 1 == this.musicList.length ? 0 : currentMusicIndex + 1;
        } else if (this.playType == "random") {
          if (this.musicList.length == 1) {
            nextIndex = currentMusicIndex
          } else {
            // 获取除了当前歌曲以为的随机index
            nextIndex = currentMusicIndex;
            while (nextIndex == currentMusicIndex) {
              nextIndex = Math.floor(Math.random() * this.musicList.length);
            }
          }
        }
        this.$store.commit("updateMusicId", this.musicList[nextIndex].id);
      }
    },
    // 拖动滚动条
    changeProgress(e){
      this.currentTime = Math.floor((e / 100) * durationNum);
      // 改变audio的实际当前播放时间
      this.$refs.audioPlayer.currentTime = this.currentTime;
    },
    // 点击播放键的回调
    changePlayState() {
      !this.$store.state.isPlay ? this.playMusic() : this.pauseMusic();
    },
    // 暂停音乐的函数
    pauseMusic() {
      this.$refs.audioPlayer.pause();
    },
    playMusic(){
      this.$refs.audioPlayer.play();
    },
    getMusicDetailFromMusicList(){
      let index = this.musicList.findIndex(
        (item) => item.id == this.$store.state.musicId
      );
      if (index != -1) {
        // 记录当前音乐的index
        this.currentMusicIndex = index;
        // 将索引传至vuex
        this.$store.commit("updateCurrentIndex", index);
        this.musicDetail = this.musicList[index];
        // 直接从audio标签中的duration属性拿时长会有请求时差问题，所以直接在musicInfo中拿
        this.duration = this.musicList[index].dt;
      }
    },
    // 点击打开抽屉的回调
    openDrawer() {
      // 关闭也是这个回调，所以直接取反
      this.drawer = !this.drawer;
      this.drawerState = !this.drawerState
      console.log(this.drawer)
      this.hasDrawerOpend = true;
      this.handleDrawerListDOM(this.currentMusicIndex);
    },
    // 操作drawerList中DOM的函数
    handleDrawerListDOM(currentIndex, lastIndex) {
      console.log("open")
      // 目前没什么好思路 直接操作原生DOM
      this.$nextTick(() => {
        let tableRows = document
          .querySelector(".bottomControl")
          .querySelectorAll(".el-table__row");
        console.log(tableRows)
        // // 直接修改dom样式的颜色无效  可能是因为第三方组件 style scoped的原因
        // // 通过引入全局样式解决
        if (tableRows[currentIndex]) {
          tableRows[currentIndex].children[0]
            .querySelector(".cell")
            .classList.add("currentRow");
          tableRows[currentIndex].children[1]
            .querySelector(".cell")
            .classList.add("currentRow");
        }
        if (
          (lastIndex && lastIndex != -1 && tableRows[lastIndex]) ||
          lastIndex == 0
        ) {
          // 将上一首的类名删掉
          tableRows[lastIndex].children[0]
            .querySelector(".cell")
            .classList.remove("currentRow");
          tableRows[lastIndex].children[1]
            .querySelector(".cell")
            .classList.remove("currentRow");
        }
      });
    },
    //  双击抽屉列表中的row的回调
    clickRow(row) {
      // console.log(row.id);
      this.changeMusic("click", row.id);
    },
  },
  watch:{
    "$store.state.musicId"(id){
       // 先暂停当前播放的音乐
       this.pauseMusic();
       this.musicList = this.$store.state.musicList;
       this.getMusicDetailFromMusicList();
       this.getMusicDetail(id);
       durationNum = returnSecond(this.duration);
    },
    // 监听播放状态
    "$store.state.isPlay"(isPlay) {
      if (isPlay) {
        this.playMusic();
      } else {
        this.pauseMusic();
      }
    },
    // 监听currentIndex的变化
    "$store.state.currentIndex"(currentIndex, lastIndex) {
      if (this.hasDrawerOpend) {
        this.handleDrawerListDOM(currentIndex, lastIndex);
      }
    },
  },
  filters:{
    handleMusicTime
  }
}
</script>
<style scoped>
.bottomControl {
  width: 100%;
  height: 70px;
  border-top: 1px solid #ddd;
  position: fixed;
  background-color: #fff;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  z-index: 10000;
}
.left{
  display: flex;
}
.avatar {
  margin: 10px;
  height: 50px;
  width: 50px;
  border-radius: 10px;
  overflow: hidden;
}

.avatar img {
  width: 100%;
}

.musicInfo {
  margin: 10px;
  color: rgb(37, 37, 37);
  font-size: 12px;
  width: 100px;
  margin-top: 20px;
  font-size: 16px;
}

.musicName {
  margin-bottom: 4px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.singer {
  transform: scale(0.9);
  margin-left: -3px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.center {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.buttons {
  display: flex;
  align-items: center;
}

.buttons span {
  display: inline-block;
  width: 50px;
  box-sizing: border-box;
  text-align: center;
}

.buttons i {
  font-size: 20px;
  color: #313131;
  margin: 0;
}

.buttons span:nth-child(3) i {
  font-size: 25px;
}

.progressBar {
  display: flex;
  align-items: center;
}

.progressSlider {
  width: 350px;
}

.currentTime,
.totalTime {
  font-size: 12px;
  transform: scale(0.85);
  color: #aaa;
  margin: 0 5px;
  width: 30px;
  text-align: center;
}

.drawerHeader {
  font-size: 12px;
  transform: scale(0.9);
  color: #aaa;
  padding: 15px 0;
}

.drawer{
  background-color: aqua;
}

.right {
  display: flex;
  align-items: center;
  position: relative;
  margin-right: 10px;
}

.right i{
  font-size: 30px;
}

</style>